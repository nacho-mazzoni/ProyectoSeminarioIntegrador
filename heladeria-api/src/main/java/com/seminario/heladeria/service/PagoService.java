package com.seminario.heladeria.service;

import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.seminario.heladeria.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import com.seminario.heladeria.entity.Pago;
import com.seminario.heladeria.entity.Pedido;
import com.seminario.heladeria.repository.PagoRepository;
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

    public PagoService(PagoRepository pagoRepository,
                       @Value("${mercadopago.notification-url:}") String notificationUrl) {
        this.pagoRepository = pagoRepository;
        this.notificationUrl = notificationUrl;
    }

    @Transactional
    public Pago crearPagoEfectivo(Pedido pedido) {
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
        Pago pago = new Pago();
        pago.setMonto(pedido.getTotal());
        pago.setFechaPago(Instant.now());
        pago.setMetodoPago("mercado_pago");
        pago.setEstadoPago("pendiente");
        pago.setPedido(pedido);
        return pagoRepository.save(pago);
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

    @Transactional
    public void actualizarEstadoPago(String externalReference, String estadoMP) {
        Long idPedido = Long.parseLong(externalReference);
        Pago pago = pagoRepository.findByPedidoIdPedido(idPedido)
                .orElseThrow(() -> {
                    log.error("Pago no encontrado para pedido {}", idPedido);
                    return new ResourceNotFoundException("Pago no encontrado para pedido " + idPedido);
                });

        switch (estadoMP) {
            case "approved" -> pago.setEstadoPago("aprobado");
            case "rejected" -> pago.setEstadoPago("rechazado");
            case "in_process" -> pago.setEstadoPago("en_proceso");
            default -> pago.setEstadoPago("pendiente");
        }
        pagoRepository.save(pago);
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
}