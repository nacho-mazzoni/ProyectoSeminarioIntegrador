package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.PedidoRequest;
import com.seminario.heladeria.dto.response.PedidoResponse;
import com.seminario.heladeria.entity.*;
import com.seminario.heladeria.repository.*;
import com.seminario.heladeria.exception.BusinessRuleException;
import com.seminario.heladeria.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Locale;
import java.util.UUID;

@Slf4j
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
                .orElseThrow(() -> {
                    log.error("Pedido no encontrado: {}", id);
                    return new ResourceNotFoundException("Pedido no encontrado");
                });
    }

    public List<Pedido> findAll() {
        return pedidoRepository.findAllByOrderByFechaDesc();
    }

    @Transactional
    public Pedido cancelar(Pedido pedido) {
        return cancelar(pedido, "Cancelado por el cliente");
    }

    @Transactional
    public Pedido cancelar(Pedido pedido, String motivo) {
        return cancelar(pedido, motivo, null);
    }

    @Transactional
    public Pedido cancelar(Pedido pedido, String motivo, Usuario operador) {
        EstadoPedido estadoActual = EstadoPedido.parse(getUltimoEstado(pedido.getIdPedido()));

        if (estadoActual != EstadoPedido.PENDIENTE && estadoActual != EstadoPedido.EN_PREPARACION) {
            log.error("Intento de cancelar pedido {} con estado {}", pedido.getIdPedido(), estadoActual);
            throw new BusinessRuleException("Solo se pueden cancelar pedidos pendientes o en preparación");
        }

        restaurarStock(pedido.getIdPedido());

        HistorialEstado historial = new HistorialEstado();
        historial.setFechaHora(Instant.now());
        historial.setEstado(EstadoPedido.CANCELADO.name());
        historial.setNotas(motivo);
        historial.setPedido(pedido);
        historial.setOperador(operador);
        historialEstadoRepository.save(historial);

        return pedido;
    }

    @Transactional
    public Pedido crear(Cliente cliente, PedidoRequest request) {
        String metodoEntrega = normalizar(request.getMetodoEntrega());
        String metodoPago = normalizar(request.getMetodoPago());
        if (!"retiro".equals(metodoEntrega) && !"delivery".equals(metodoEntrega)) {
            throw new BusinessRuleException("Método de entrega inválido");
        }
        if (!"efectivo".equals(metodoPago) && !"mercado_pago".equals(metodoPago)) {
            throw new BusinessRuleException("Método de pago inválido");
        }
        if (request.getDetalles() == null || request.getDetalles().isEmpty()) {
            throw new BusinessRuleException("El pedido debe tener al menos un producto");
        }

        Pedido pedido = new Pedido();
        pedido.setFecha(Instant.now());
        pedido.setNumeroSeguimiento("RH-" + UUID.randomUUID().toString().replace("-", "").substring(0, 20).toUpperCase(Locale.ROOT));
        pedido.setMetodoEntrega(metodoEntrega);
        pedido.setCliente(cliente);

        if ("delivery".equals(metodoEntrega)
                && request.getIdDireccion() != null && request.getIdDireccion() > 0) {
            Direccion direccion = direccionService.findById(request.getIdDireccion());
            if (!direccion.getCliente().getIdUsuario().equals(cliente.getIdUsuario())) {
                throw new BusinessRuleException("La dirección no pertenece al usuario");
            }
            pedido.setDireccion(direccion);
        } else if ("delivery".equals(metodoEntrega)) {
            throw new BusinessRuleException("La entrega a domicilio requiere una dirección");
        } else if (request.getIdDireccion() != null) {
            throw new BusinessRuleException("El retiro en local no admite dirección");
        }

        Promocion promocion = null;
        if (request.getCodigoPromocion() != null && !request.getCodigoPromocion().isBlank()) {
            promocion = promocionRepository.findVigenteByCodigo(request.getCodigoPromocion().trim().toUpperCase(Locale.ROOT), Instant.now())
                    .orElseThrow(() -> new BusinessRuleException("Promoción inválida, inactiva o fuera de vigencia"));
            pedido.setPromocion(promocion);
        }

        pedido.setTotal(BigDecimal.ZERO);
        pedido = pedidoRepository.save(pedido);

        BigDecimal total = BigDecimal.ZERO;

        for (PedidoRequest.DetalleRequest detReq : request.getDetalles()) {
            Producto producto = productoRepository.findById(detReq.getIdProducto())
                    .orElseThrow(() -> {
                        log.error("Producto no encontrado al crear/editar pedido: {}", detReq.getIdProducto());
                        return new ResourceNotFoundException("Producto no encontrado: " + detReq.getIdProducto());
                    });

            if (!Boolean.TRUE.equals(producto.getActivo())) {
                throw new BusinessRuleException("El producto no está disponible: " + producto.getNombre());
            }
            if (detReq.getCantidad() == null || detReq.getCantidad() <= 0) {
                throw new BusinessRuleException("La cantidad debe ser positiva");
            }
            if (producto.getStockEnvases() < detReq.getCantidad()) {
                log.error("Stock insuficiente para {}: disponible {}, solicitado {}",
                        producto.getNombre(), producto.getStockEnvases(), detReq.getCantidad());
                throw new BusinessRuleException("Stock insuficiente para: " + producto.getNombre());
            }

            Set<Long> idsSabores = detReq.getIdsSabor() == null ? Set.of() : new HashSet<>(detReq.getIdsSabor());
            int requestedFlavorIds = detReq.getIdsSabor() == null ? 0 : detReq.getIdsSabor().size();
            if (requestedFlavorIds != idsSabores.size()) {
                throw new BusinessRuleException("No se permiten sabores repetidos");
            }
            if (!producto.getCategoria().getRequiereSabores() && !idsSabores.isEmpty()) {
                throw new BusinessRuleException("El producto no admite sabores");
            }
            if (producto.getCategoria().getRequiereSabores() &&
                    idsSabores.isEmpty()) {
                log.error("Producto {} requiere sabores pero no se enviaron", producto.getNombre());
                throw new BusinessRuleException("El producto " + producto.getNombre() + " requiere al menos un sabor");
            }
            if (idsSabores.size() > producto.getMaxSabores()) {
                log.error("Producto {} excede maximo de sabores: {} > {}", producto.getNombre(),
                    idsSabores.size(), producto.getMaxSabores());
                throw new BusinessRuleException("Máximo " + producto.getMaxSabores() + " sabores para " + producto.getNombre());
            }

            DetallePedido detalle = new DetallePedido();
            detalle.setCantidad(detReq.getCantidad());
            detalle.setPrecioUnitHist(producto.getPrecioBase());
            detalle.setPedido(pedido);
            detalle.setProducto(producto);

            Set<DetallePedidoSabor> sabores = new HashSet<>();
            if (!idsSabores.isEmpty()) {
                for (Long idSabor : idsSabores) {
                    Sabor sabor = saborRepository.findById(idSabor)
                            .orElseThrow(() -> new ResourceNotFoundException("Sabor no encontrado: " + idSabor));
                     if (!Boolean.TRUE.equals(sabor.getDisponible()) || sabor.getStockBaldes() <= 0) {
                        throw new BusinessRuleException("El sabor no está disponible: " + sabor.getNombre());
                    }
                    if (sabor.getStockBaldes() < detReq.getCantidad()) {
                        throw new BusinessRuleException("Stock insuficiente para el sabor: " + sabor.getNombre());
                    }
                    sabor.setStockBaldes(sabor.getStockBaldes() - detReq.getCantidad());
                    saborRepository.save(sabor);
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
                            .orElseThrow(() -> new ResourceNotFoundException("Adicional no encontrado: " + idAdicional));
                    if (!Boolean.TRUE.equals(adic.getDisponible())) {
                        throw new BusinessRuleException("El adicional no está disponible: " + adic.getNombre());
                    }
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
            for (Long idAdicional : detReq.getIdsAdicional() == null ? List.<Long>of() : detReq.getIdsAdicional()) {
                Adicional adicional = adicionalRepository.findById(idAdicional)
                        .orElseThrow(() -> new ResourceNotFoundException("Adicional no encontrado: " + idAdicional));
                subtotal = subtotal.add(adicional.getPrecioExtra().multiply(BigDecimal.valueOf(detReq.getCantidad())));
            }
            total = total.add(subtotal);

            producto.setStockEnvases(producto.getStockEnvases() - detReq.getCantidad());
            productoRepository.save(producto);
        }

        if (promocion != null) {
            BigDecimal descuento = total.multiply(promocion.getPorcDesc())
                    .divide(BigDecimal.valueOf(100));
            total = total.subtract(descuento);
        }

        if ("delivery".equals(metodoEntrega) && pedido.getDireccion() != null) {
            total = total.add(pedido.getDireccion().getZonaEnvio().getCostoEnvio());
        }

        pedido.setTotal(total);
        pedido = pedidoRepository.save(pedido);

        HistorialEstado historial = new HistorialEstado();
        historial.setFechaHora(Instant.now());
        historial.setEstado(EstadoPedido.PENDIENTE.name());
        historial.setPedido(pedido);
        historialEstadoRepository.save(historial);

        if ("mercado_pago".equals(metodoPago)) {
            pagoService.crearPagoConMP(pedido);
        } else {
            pagoService.crearPagoEfectivo(pedido);
        }

        return pedido;
    }

    public PedidoResponse buildResponse(Pedido pedido) {
        PedidoResponse response = PedidoResponse.from(pedido);

        String metodoPago = pagoService.getMetodoPago(pedido.getIdPedido());
        String estadoPago = pagoService.getEstadoPago(pedido.getIdPedido());
        response.setMetodoPago(metodoPago);
        response.setEstadoPago(estadoPago);
        response.setInitPoint(pagoService.getInitPoint(pedido.getIdPedido()));

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
            detalle.getSabores().forEach(dps -> {
                Sabor sabor = dps.getSabor();
                sabor.setStockBaldes(Math.max(0, sabor.getStockBaldes()) + detalle.getCantidad());
                saborRepository.save(sabor);
            });
        }
    }

    private String normalizar(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}
