package com.seminario.heladeria.service;

import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.seminario.heladeria.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import com.mercadopago.resources.payment.Payment;
import com.seminario.heladeria.entity.Pago;
import com.seminario.heladeria.entity.Pedido;
import com.seminario.heladeria.repository.PagoRepository;
import com.seminario.heladeria.repository.HistorialEstadoRepository;
import com.seminario.heladeria.repository.DetallePedidoRepository;
import com.seminario.heladeria.repository.ProductoRepository;
import com.seminario.heladeria.repository.SaborRepository;
import com.seminario.heladeria.entity.EstadoPedido;
import com.seminario.heladeria.entity.HistorialEstado;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Slf4j
@Service
public class PagoService {

    private final PagoRepository pagoRepository;
    private final String notificationUrl;
    private final String accessToken;
    private final HistorialEstadoRepository historialEstadoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final ProductoRepository productoRepository;
    private final SaborRepository saborRepository;

    public PagoService(PagoRepository pagoRepository,
                       @Value("${mercadopago.notification-url:}") String notificationUrl,
                       @Value("${mercadopago.access-token:}") String accessToken,
                       HistorialEstadoRepository historialEstadoRepository,
                       DetallePedidoRepository detallePedidoRepository,
                       ProductoRepository productoRepository,
                       SaborRepository saborRepository) {
        this.pagoRepository = pagoRepository;
        this.notificationUrl = notificationUrl;
        this.accessToken = accessToken;
        this.historialEstadoRepository = historialEstadoRepository;
        this.detallePedidoRepository = detallePedidoRepository;
        this.productoRepository = productoRepository;
        this.saborRepository = saborRepository;
    }

    @Transactional
    public Pago crearPagoEfectivo(Pedido pedido) {
        var existente = pagoRepository.findByPedidoIdPedido(pedido.getIdPedido());
        if (existente.isPresent()) return existente.get();
        Pago pago = new Pago();
        pago.setMonto(pedido.getTotal());
        pago.setFechaPago(Instant.now());
        pago.setMetodoPago("efectivo");
        pago.setEstadoPago("pendiente");
        pago.setPedido(pedido);
        return pagoRepository.save(pago);
    }

    @Transactional
    public Pago crearPagoConMP(Pedido pedido) {
        var existente = pagoRepository.findByPedidoIdPedido(pedido.getIdPedido());
        if (existente.isPresent()) return existente.get();
        if (accessToken == null || accessToken.isBlank()) {
            throw new IllegalStateException("Mercado Pago no está configurado");
        }
        Pago pago = new Pago();
        pago.setMonto(pedido.getTotal());
        pago.setFechaPago(Instant.now());
        pago.setMetodoPago("mercado_pago");
        pago.setEstadoPago("pendiente");
        pago.setPedido(pedido);
        pago = pagoRepository.saveAndFlush(pago);
        try {
            pago.setInitPoint(crearPreferenciaMP(pedido));
            return pagoRepository.save(pago);
        } catch (RuntimeException e) {
            pagoRepository.delete(pago);
            throw e;
        }
    }

    public String crearPreferenciaMP(Pedido pedido) {
        try {
            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .title("Pedido #" + pedido.getIdPedido())
                    .quantity(1)
                    .unitPrice(pedido.getTotal())
                    .currencyId("ARS")
                    .build();

            var builder = PreferenceRequest.builder()
                    .items(List.of(item))
                    .externalReference(pedido.getIdPedido().toString());
            if (!notificationUrl.isBlank()) {
                builder.notificationUrl(notificationUrl);
            }
            PreferenceRequest preferenceRequest = builder.build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);
            return preference.getInitPoint();
        } catch (MPException | MPApiException e) {
            log.error("Error al crear preferencia de pago en Mercado Pago", e);
            throw new RuntimeException("Error al crear preferencia de pago en Mercado Pago: " + e.getMessage());
        }
    }

    public String getInitPoint(Long idPedido) {
        return pagoRepository.findByPedidoIdPedido(idPedido).map(Pago::getInitPoint).orElse(null);
    }

    public Payment consultarPagoMP(Long idPago) throws MPException, MPApiException {
        return new PaymentClient().get(idPago);
    }

    @Transactional
    public void procesarWebhook(String externalReference, String estadoMP) {
        final Long idPedido;
        try {
            idPedido = Long.parseLong(externalReference);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Referencia externa inválida");
        }
        if (!"approved".equals(estadoMP) && !"rejected".equals(estadoMP)) {
            throw new IllegalArgumentException("Estado de pago no terminal");
        }
        Pago pago = pagoRepository.findByPedidoIdPedido(idPedido)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado para pedido " + idPedido));
        if (!"mercado_pago".equals(pago.getMetodoPago())) {
            throw new IllegalArgumentException("El pago no corresponde a Mercado Pago");
        }
        List<HistorialEstado> historial = historialEstadoRepository
                .findByPedidoIdPedidoOrderByFechaHoraAsc(idPedido);
        String actual = historial.isEmpty() ? null : historial.get(historial.size() - 1).getEstado();
        if (!EstadoPedido.PENDIENTE.name().equals(actual) || !"pendiente".equals(pago.getEstadoPago())) {
            return;
        }
         pago.setEstadoPago("approved".equals(estadoMP) ? "aprobado" : "rechazado");
        pagoRepository.save(pago);
        if ("rejected".equals(estadoMP)) {
            liberarStockPorPagoRechazado(idPedido);
         }
        HistorialEstado nuevo = new HistorialEstado();
        nuevo.setFechaHora(Instant.now());
        nuevo.setEstado("approved".equals(estadoMP) ? EstadoPedido.PAGADO.name() : EstadoPedido.RECHAZADO.name());
        nuevo.setNotas("approved".equals(estadoMP) ? "Pago aprobado via Mercado Pago" : "Pago rechazado via Mercado Pago");
        nuevo.setPedido(pago.getPedido());
        historialEstadoRepository.save(nuevo);
    }

    public String getEstadoPago(Long idPedido) {
        return pagoRepository.findByPedidoIdPedido(idPedido)
                .map(Pago::getEstadoPago)
                .orElse(null);
    }

    public String getMetodoPago(Long idPedido) {
        return pagoRepository.findByPedidoIdPedido(idPedido)
                .map(Pago::getMetodoPago)
                .orElse(null);
    }

    private void liberarStockPorPagoRechazado(Long idPedido) {
        detallePedidoRepository.findByPedidoIdPedido(idPedido).forEach(detalle -> {
            var producto = detalle.getProducto();
            producto.setStockEnvases(producto.getStockEnvases() + detalle.getCantidad());
            productoRepository.save(producto);
            detalle.getSabores().forEach(detalleSabor -> {
                var sabor = detalleSabor.getSabor();
                sabor.setStockBaldes(sabor.getStockBaldes() + detalle.getCantidad());
                saborRepository.save(sabor);
            });
        });
    }
}
