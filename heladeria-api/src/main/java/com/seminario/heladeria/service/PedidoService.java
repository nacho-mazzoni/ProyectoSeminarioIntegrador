package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.EditarPedidoRequest;
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
    private final PagoService pagoService;

    public PedidoService(PedidoRepository pedidoRepository,
                         DetallePedidoRepository detallePedidoRepository,
                         ProductoRepository productoRepository,
                         SaborRepository saborRepository,
                         AdicionalRepository adicionalRepository,
                         PromocionRepository promocionRepository,
                         DireccionService direccionService,
                         HistorialEstadoRepository historialEstadoRepository,
                         PagoService pagoService) {
        this.pedidoRepository = pedidoRepository;
        this.detallePedidoRepository = detallePedidoRepository;
        this.productoRepository = productoRepository;
        this.saborRepository = saborRepository;
        this.adicionalRepository = adicionalRepository;
        this.promocionRepository = promocionRepository;
        this.direccionService = direccionService;
        this.historialEstadoRepository = historialEstadoRepository;
        this.pagoService = pagoService;
    }

    public List<Pedido> findByCliente(Long idCliente) {
        return pedidoRepository.findByClienteIdUsuarioOrderByFechaDesc(idCliente);
    }

    public Pedido findById(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }

    public List<Pedido> findAll() {
        return pedidoRepository.findAllByOrderByFechaDesc();
    }

    @Transactional
    public Pedido cancelar(Pedido pedido) {
        String estadoActual = getUltimoEstado(pedido.getIdPedido());

        if (!"PENDIENTE".equals(estadoActual)) {
            throw new RuntimeException("Solo se pueden cancelar pedidos pendientes");
        }

        restaurarStock(pedido.getIdPedido());

        HistorialEstado historial = new HistorialEstado();
        historial.setFechaHora(Instant.now());
        historial.setEstado("CANCELADO");
        historial.setNotas("Cancelado por el cliente");
        historial.setPedido(pedido);
        historialEstadoRepository.save(historial);

        return pedido;
    }

    @Transactional
    public Pedido editar(Pedido pedido, EditarPedidoRequest request) {
        String estadoActual = getUltimoEstado(pedido.getIdPedido());
        if (!"PENDIENTE".equals(estadoActual)) {
            throw new RuntimeException("Solo se pueden editar pedidos pendientes");
        }

        restaurarStock(pedido.getIdPedido());

        detallePedidoRepository.deleteByPedidoIdPedido(pedido.getIdPedido());

        if (request.getIdDireccion() != null) {
            Direccion direccion = direccionService.findById(request.getIdDireccion());
            pedido.setDireccion(direccion);
        }

        Promocion promocion = null;
        if (request.getCodigoPromocion() != null && !request.getCodigoPromocion().isBlank()) {
            promocion = promocionRepository.findByCodigoAndActivaTrue(request.getCodigoPromocion())
                    .orElseThrow(() -> new RuntimeException("Promocion invalida o inactiva"));
            pedido.setPromocion(promocion);
        } else {
            pedido.setPromocion(null);
        }

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

        if ("delivery".equalsIgnoreCase(pedido.getMetodoEntrega())) {
            total = total.add(pedido.getDireccion().getZonaEnvio().getCostoEnvio());
        }

        pedido.setTotal(total);
        pedido = pedidoRepository.save(pedido);

        HistorialEstado historial = new HistorialEstado();
        historial.setFechaHora(Instant.now());
        historial.setEstado("MODIFICADO");
        historial.setNotas("Pedido modificado por el cliente");
        historial.setPedido(pedido);
        historialEstadoRepository.save(historial);

        return pedido;
    }

    @Transactional
    public Pedido crear(Cliente cliente, PedidoRequest request) {
        Pedido pedido = new Pedido();
        pedido.setFecha(Instant.now());
        pedido.setMetodoEntrega(request.getMetodoEntrega());
        pedido.setCliente(cliente);

        if (request.getIdDireccion() != null && request.getIdDireccion() > 0) {
            Direccion direccion = direccionService.findById(request.getIdDireccion());
            pedido.setDireccion(direccion);
        }

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

            if (producto.getCategoria().getRequiereSabores() &&
                    (detReq.getIdsSabor() == null || detReq.getIdsSabor().isEmpty())) {
                throw new RuntimeException("El producto " + producto.getNombre() + " requiere al menos un sabor");
            }
            if (detReq.getIdsSabor() != null && detReq.getIdsSabor().size() > producto.getMaxSabores()) {
                throw new RuntimeException("Maximo " + producto.getMaxSabores() + " sabores para " + producto.getNombre());
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

        if ("delivery".equalsIgnoreCase(request.getMetodoEntrega()) && pedido.getDireccion() != null) {
            total = total.add(pedido.getDireccion().getZonaEnvio().getCostoEnvio());
        }

        pedido.setTotal(total);
        pedido = pedidoRepository.save(pedido);

        if ("mercado_pago".equals(request.getMetodoPago())) {
            pagoService.crearPagoConMP(pedido);
        } else {
            pagoService.crearPagoEfectivo(pedido);
        }

        HistorialEstado historial = new HistorialEstado();
        historial.setFechaHora(Instant.now());
        historial.setEstado("PENDIENTE");
        historial.setPedido(pedido);
        historialEstadoRepository.save(historial);

        return pedido;
    }

    public PedidoResponse buildResponse(Pedido pedido) {
        PedidoResponse response = PedidoResponse.from(pedido);

        String metodoPago = pagoService.getMetodoPago(pedido.getIdPedido());
        String estadoPago = pagoService.getEstadoPago(pedido.getIdPedido());
        response.setMetodoPago(metodoPago);
        response.setEstadoPago(estadoPago);

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

    private String getUltimoEstado(Long idPedido) {
        return historialEstadoRepository
                .findByPedidoIdPedidoOrderByFechaHoraAsc(idPedido)
                .stream()
                .reduce((first, second) -> second)
                .map(HistorialEstado::getEstado)
                .orElse("PENDIENTE");
    }

    private void restaurarStock(Long idPedido) {
        List<DetallePedido> detalles = detallePedidoRepository.findByPedidoIdPedido(idPedido);
        for (DetallePedido detalle : detalles) {
            Producto producto = detalle.getProducto();
            producto.setStockEnvases(producto.getStockEnvases() + detalle.getCantidad());
            productoRepository.save(producto);
        }
    }
}