package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.PedidoRequest;
import com.seminario.heladeria.dto.response.PedidoResponse;
import com.seminario.heladeria.entity.*;
import com.seminario.heladeria.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final ProductoRepository productoRepository;
    private final SaborRepository saborRepository;
    private final AdicionalRepository adicionalRepository;
    private final PromocionRepository promocionRepository;
    private final DireccionService direccionService;
    private final HistorialEstadoRepository historialEstadoRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                         DetallePedidoRepository detallePedidoRepository,
                         ProductoRepository productoRepository,
                         SaborRepository saborRepository,
                         AdicionalRepository adicionalRepository,
                         PromocionRepository promocionRepository,
                         DireccionService direccionService,
                         HistorialEstadoRepository historialEstadoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.detallePedidoRepository = detallePedidoRepository;
        this.productoRepository = productoRepository;
        this.saborRepository = saborRepository;
        this.adicionalRepository = adicionalRepository;
        this.promocionRepository = promocionRepository;
        this.direccionService = direccionService;
        this.historialEstadoRepository = historialEstadoRepository;
    }

    public List<Pedido> findByCliente(Long idCliente) {
        return pedidoRepository.findByClienteIdUsuarioOrderByFechaDesc(idCliente);
    }

    public Pedido findById(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }

    @Transactional
    public Pedido crear(Cliente cliente, PedidoRequest request) {
        Pedido pedido = new Pedido();
        pedido.setFecha(Instant.now());
        pedido.setMetodoEntrega(request.getMetodoEntrega());
        pedido.setCliente(cliente);

        Direccion direccion = direccionService.findById(request.getIdDireccion());
        pedido.setDireccion(direccion);

        Promocion promocion = null;
        if (request.getCodigoPromocion() != null && !request.getCodigoPromocion().isBlank()) {
            promocion = promocionRepository.findByCodigoAndActivaTrue(request.getCodigoPromocion())
                    .orElseThrow(() -> new RuntimeException("Promocion invalida o inactiva"));
            pedido.setPromocion(promocion);
        }

        pedido.setTotal(BigDecimal.ZERO);
        pedido = pedidoRepository.save(pedido);

        BigDecimal total = BigDecimal.ZERO;

        for (PedidoRequest.DetalleRequest detReq : request.getDetalles()) {
            Producto producto = productoRepository.findById(detReq.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + detReq.getIdProducto()));

            if (producto.getStockEnvases() < detReq.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
            }

            DetallePedido detalle = new DetallePedido();
            detalle.setCantidad(detReq.getCantidad());
            detalle.setPrecioUnitHist(producto.getPrecioBase());
            detalle.setPedido(pedido);
            detalle.setProducto(producto);

            Set<DetallePedidoSabor> sabores = new HashSet<>();
            if (detReq.getIdsSabor() != null) {
                for (Long idSabor : detReq.getIdsSabor()) {
                    Sabor sabor = saborRepository.findById(idSabor)
                            .orElseThrow(() -> new RuntimeException("Sabor no encontrado: " + idSabor));
                    DetallePedidoSabor dps = new DetallePedidoSabor();
                    dps.setId(new DetallePedidoSaborId(null, idSabor));
                    dps.setDetallePedido(detalle);
                    dps.setSabor(sabor);
                    sabores.add(dps);
                }
            }
            detalle.setSabores(sabores);

            Set<DetallePedidoAdicional> adicionales = new HashSet<>();
            if (detReq.getIdsAdicional() != null) {
                for (Long idAdicional : detReq.getIdsAdicional()) {
                    Adicional adic = adicionalRepository.findById(idAdicional)
                            .orElseThrow(() -> new RuntimeException("Adicional no encontrado: " + idAdicional));
                    DetallePedidoAdicional dpa = new DetallePedidoAdicional();
                    dpa.setId(new DetallePedidoAdicionalId(null, idAdicional));
                    dpa.setDetallePedido(detalle);
                    dpa.setAdicional(adic);
                    adicionales.add(dpa);
                }
            }
            detalle.setAdicionales(adicionales);

            detallePedidoRepository.save(detalle);

            BigDecimal subtotal = producto.getPrecioBase()
                    .multiply(BigDecimal.valueOf(detReq.getCantidad()));
            total = total.add(subtotal);

            producto.setStockEnvases(producto.getStockEnvases() - detReq.getCantidad());
            productoRepository.save(producto);
        }

        if (promocion != null) {
            BigDecimal descuento = total.multiply(promocion.getPorcDesc())
                    .divide(BigDecimal.valueOf(100));
            total = total.subtract(descuento);
        }

        if ("delivery".equalsIgnoreCase(request.getMetodoEntrega())) {
            total = total.add(direccion.getZonaEnvio().getCostoEnvio());
        }

        pedido.setTotal(total);
        pedido = pedidoRepository.save(pedido);

        HistorialEstado historial = new HistorialEstado();
        historial.setFechaHora(Instant.now());
        historial.setEstado("PENDIENTE");
        historial.setPedido(pedido);
        historialEstadoRepository.save(historial);

        return pedido;
    }

    public PedidoResponse buildResponse(Pedido pedido) {
        PedidoResponse response = PedidoResponse.from(pedido);

        List<DetallePedido> detalles = detallePedidoRepository.findByPedidoIdPedido(pedido.getIdPedido());
        List<PedidoResponse.DetallePedidoResponse> detalleResponses = new ArrayList<>();
        for (DetallePedido d : detalles) {
            PedidoResponse.DetallePedidoResponse dr = new PedidoResponse.DetallePedidoResponse();
            dr.setIdDetalle(d.getIdDetalle());
            dr.setCantidad(d.getCantidad());
            dr.setPrecioUnitHist(d.getPrecioUnitHist());
            dr.setProducto(d.getProducto().getNombre());
            dr.setSabores(d.getSabores().stream()
                    .map(s -> s.getSabor().getNombre())
                    .toList());
            dr.setAdicionales(d.getAdicionales().stream()
                    .map(a -> a.getAdicional().getNombre())
                    .toList());
            detalleResponses.add(dr);
        }
        response.setDetalles(detalleResponses);

        List<HistorialEstado> historial = historialEstadoRepository
                .findByPedidoIdPedidoOrderByFechaHoraAsc(pedido.getIdPedido());
        response.setHistorial(historial.stream()
                .map(PedidoResponse.HistorialResponse::from)
                .toList());

        return response;
    }
}
