package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.*;
import com.seminario.heladeria.dto.response.*;
import com.seminario.heladeria.entity.*;
import com.seminario.heladeria.repository.*;
import com.seminario.heladeria.exception.BusinessRuleException;
import com.seminario.heladeria.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class AdminService {

    private final ProductoRepository productoRepository;
    private final PedidoRepository pedidoRepository;
    private final HistorialEstadoRepository historialEstadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final SaborRepository saborRepository;
    private final AdicionalRepository adicionalRepository;
    private final CategoriaRepository categoriaRepository;
    private final ZonaEnvioRepository zonaEnvioRepository;
    private final ClienteRepository clienteRepository;
    private final PedidoService pedidoService;

    public AdminService(ProductoRepository productoRepository,
                        PedidoRepository pedidoRepository,
                        HistorialEstadoRepository historialEstadoRepository,
                        UsuarioRepository usuarioRepository,
                        ClienteRepository clienteRepository,
                        SaborRepository saborRepository,
                        AdicionalRepository adicionalRepository,
                        CategoriaRepository categoriaRepository,
                        ZonaEnvioRepository zonaEnvioRepository,
                        PedidoService pedidoService) {
        this.productoRepository = productoRepository;
        this.pedidoRepository = pedidoRepository;
        this.historialEstadoRepository = historialEstadoRepository;
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.saborRepository = saborRepository;
        this.adicionalRepository = adicionalRepository;
        this.categoriaRepository = categoriaRepository;
        this.zonaEnvioRepository = zonaEnvioRepository;
        this.pedidoService = pedidoService;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        stats.setTotalProductos(productoRepository.count());
        stats.setTotalPedidos(pedidoRepository.countPedidosEntregados());
        stats.setPedidosPendientes(historialEstadoRepository.countByUltimoEstado("PENDIENTE"));
        stats.setTotalUsuarios(usuarioRepository.count());
        stats.setIngresosMes(pedidoRepository.sumIngresosMesActual());

        List<DashboardStatsResponse.EstadoCount> pedidosPorEstado = new ArrayList<>();
        for (Object[] row : historialEstadoRepository.countPedidosByUltimoEstado()) {
            pedidosPorEstado.add(new DashboardStatsResponse.EstadoCount(
                    (String) row[0],
                    ((Number) row[1]).longValue()
            ));
        }
        stats.setPedidosPorEstado(pedidosPorEstado);

        List<DashboardStatsResponse.ProductoVendido> productosMasVendidos = new ArrayList<>();
        for (Object[] row : pedidoRepository.findProductosMasVendidos()) {
            productosMasVendidos.add(new DashboardStatsResponse.ProductoVendido(
                    (String) row[0],
                    ((Number) row[1]).longValue()
            ));
        }
        stats.setProductosMasVendidos(productosMasVendidos);

        return stats;
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPedidos(String estado) {
        LocalDate hoy = LocalDate.now();
        Instant desde = hoy.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant hasta = hoy.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        String filtro = estado == null || estado.isBlank() ? null : EstadoPedido.parse(estado).name();
        return pedidoRepository.findAdminPedidos(desde, hasta, filtro).stream()
                .map(pedidoService::buildResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse obtenerPedido(Long id) {
        Pedido pedido = pedidoService.findById(id);
        return pedidoService.buildResponse(pedido);
    }

    @Transactional
    public PedidoResponse cambiarEstadoPedido(Long id, CambioEstadoRequest request, Usuario operador) {
        Pedido pedido = pedidoService.findById(id);

        String estadoActual = historialEstadoRepository
                .findByPedidoIdPedidoOrderByFechaHoraAsc(id)
                .stream()
                .reduce((first, second) -> second)
                .map(HistorialEstado::getEstado)
                .orElse("PENDIENTE");
        EstadoPedido actual = EstadoPedido.parse(estadoActual);
        EstadoPedido nuevo = EstadoPedido.parse(request.getEstado());
        validarTransicion(pedido, actual, nuevo);

        if (nuevo == EstadoPedido.CANCELADO) {
            if (request.getMotivo() == null || request.getMotivo().isBlank()) {
                throw new BusinessRuleException("El motivo de cancelación es obligatorio");
            }
            pedidoService.cancelar(pedido, request.getMotivo().trim(), operador);
            return pedidoService.buildResponse(pedido);
        }

        HistorialEstado historial = new HistorialEstado();
        historial.setFechaHora(Instant.now());
        historial.setEstado(nuevo.name());
        historial.setNotas(request.getMotivo());
        historial.setPedido(pedido);
        historial.setOperador(operador);
        historialEstadoRepository.save(historial);

        return pedidoService.buildResponse(pedido);
    }

    private void validarTransicion(Pedido pedido, EstadoPedido actual, EstadoPedido nuevo) {
        boolean valida = switch (actual) {
            case PENDIENTE -> nuevo == EstadoPedido.PAGADO || nuevo == EstadoPedido.RECHAZADO
                    || nuevo == EstadoPedido.CANCELADO;
            case PAGADO -> nuevo == EstadoPedido.EN_PREPARACION;
            case EN_PREPARACION -> nuevo == EstadoPedido.CANCELADO
                    || (esRetiro(pedido) ? nuevo == EstadoPedido.LISTO_PARA_RETIRO
                    : esDelivery(pedido) && nuevo == EstadoPedido.EN_CAMINO);
            case LISTO_PARA_RETIRO, EN_CAMINO -> nuevo == EstadoPedido.ENTREGADO;
            case RECHAZADO, ENTREGADO, CANCELADO -> false;
        };
        if (!valida) {
            throw new BusinessRuleException("Transición de estado no permitida: " + actual + " -> " + nuevo);
        }
    }

    private boolean esRetiro(Pedido pedido) {
        return "retiro".equalsIgnoreCase(pedido.getMetodoEntrega());
    }

    private boolean esDelivery(Pedido pedido) {
        return "delivery".equalsIgnoreCase(pedido.getMetodoEntrega());
    }

    @Transactional(readOnly = true)
    public List<IngresoMensualResponse> getIngresosMensuales(int meses) {
        int clamped = Math.max(3, Math.min(12, meses));
        LocalDate to = LocalDate.now();
        LocalDate from = to.minusMonths(clamped - 1).withDayOfMonth(1);
        Instant desde = from.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant hasta = to.withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        List<Object[]> rows = pedidoRepository.sumIngresosPorMes(desde, hasta);
        List<IngresoMensualResponse> result = new ArrayList<>();
        for (Object[] row : rows) {
            result.add(new IngresoMensualResponse(
                    (String) row[0],
                    (BigDecimal) row[1],
                    ((Number) row[2]).longValue()
            ));
        }
        return result;
    }

    // --- SABORES ---

    @Transactional(readOnly = true)
    public List<SaborResponse> listarSabores() {
        return saborRepository.findAll().stream().map(SaborResponse::from).toList();
    }

    @Transactional
    public SaborResponse crearSabor(SaborRequest request) {
        Sabor sabor = new Sabor();
        sabor.setNombre(request.getNombre());
        sabor.setStockBaldes(request.getStockBaldes());
        sabor.setDisponible(request.getDisponible());
        sabor.setCapBalde(request.getCapBalde());
        return SaborResponse.from(saborRepository.save(sabor));
    }

    @Transactional
    public SaborResponse actualizarSabor(Long id, SaborRequest request) {
        Sabor sabor = saborRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sabor no encontrado"));
        sabor.setNombre(request.getNombre());
        sabor.setStockBaldes(request.getStockBaldes());
        sabor.setDisponible(request.getDisponible());
        sabor.setCapBalde(request.getCapBalde());
        return SaborResponse.from(saborRepository.save(sabor));
    }

    @Transactional
    public void eliminarSabor(Long id) {
        Sabor sabor = saborRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sabor no encontrado"));
        sabor.setDisponible(false);
        saborRepository.save(sabor);
    }

    // --- ADICIONALES ---

    @Transactional(readOnly = true)
    public List<AdicionalResponse> listarAdicionales() {
        return adicionalRepository.findAll().stream().map(AdicionalResponse::from).toList();
    }

    @Transactional
    public AdicionalResponse crearAdicional(AdicionalRequest request) {
        Adicional adicional = new Adicional();
        adicional.setNombre(request.getNombre());
        adicional.setPrecioExtra(request.getPrecioExtra());
        adicional.setDisponible(request.getDisponible());
        return AdicionalResponse.from(adicionalRepository.save(adicional));
    }

    @Transactional
    public AdicionalResponse actualizarAdicional(Long id, AdicionalRequest request) {
        Adicional adicional = adicionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adicional no encontrado"));
        adicional.setNombre(request.getNombre());
        adicional.setPrecioExtra(request.getPrecioExtra());
        adicional.setDisponible(request.getDisponible());
        return AdicionalResponse.from(adicionalRepository.save(adicional));
    }

    @Transactional
    public void eliminarAdicional(Long id) {
        Adicional adicional = adicionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adicional no encontrado"));
        adicional.setDisponible(false);
        adicionalRepository.save(adicional);
    }

    // --- CATEGORIAS ---

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarCategorias() {
        return categoriaRepository.findAll().stream().map(CategoriaResponse::from).toList();
    }

    @Transactional
    public CategoriaResponse crearCategoria(CategoriaRequest request) {
        Categoria categoria = new Categoria();
        categoria.setNombre(request.getNombre());
        categoria.setRequiereSabores(request.getRequiereSabores());
        return CategoriaResponse.from(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaResponse actualizarCategoria(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
        categoria.setNombre(request.getNombre());
        categoria.setRequiereSabores(request.getRequiereSabores());
        return CategoriaResponse.from(categoriaRepository.save(categoria));
    }

    @Transactional
    public void eliminarCategoria(Long id) {
        categoriaRepository.deleteById(id);
    }

    // --- ZONAS DE ENVIO ---

    @Transactional(readOnly = true)
    public List<ZonaEnvioResponse> listarZonas() {
        return zonaEnvioRepository.findAll().stream().map(ZonaEnvioResponse::from).toList();
    }

    @Transactional
    public ZonaEnvioResponse crearZona(ZonaRequest request) {
        ZonaEnvio zona = new ZonaEnvio();
        zona.setNombreZona(request.getNombreZona());
        zona.setCostoEnvio(request.getCostoEnvio());
        return ZonaEnvioResponse.from(zonaEnvioRepository.save(zona));
    }

    @Transactional
    public ZonaEnvioResponse actualizarZona(Long id, ZonaRequest request) {
        ZonaEnvio zona = zonaEnvioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zona no encontrada"));
        zona.setNombreZona(request.getNombreZona());
        zona.setCostoEnvio(request.getCostoEnvio());
        return ZonaEnvioResponse.from(zonaEnvioRepository.save(zona));
    }

    @Transactional
    public void eliminarZona(Long id) {
        zonaEnvioRepository.deleteById(id);
    }

    // --- USUARIOS ---

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream().map(u -> {
            Optional<Cliente> optCliente = clienteRepository.findByIdUsuario(u.getIdUsuario());
            return optCliente.map(UsuarioResponse::fromCliente)
                    .orElseGet(() -> UsuarioResponse.from(u));
        }).collect(java.util.stream.Collectors.toList());
    }
}
