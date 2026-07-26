package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.*;
import com.seminario.heladeria.dto.response.*;
import com.seminario.heladeria.entity.*;
import com.seminario.heladeria.repository.*;
import com.seminario.heladeria.service.PedidoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        stats.setTotalPedidos(pedidoRepository.count());
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
    public List<PedidoResponse> listarPedidos() {
        return pedidoRepository.findAllByOrderByFechaDesc().stream()
                .map(pedidoService::buildResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse obtenerPedido(Long id) {
        Pedido pedido = pedidoService.findById(id);
        return pedidoService.buildResponse(pedido);
    }

    @Transactional
    public PedidoResponse cambiarEstadoPedido(Long id, CambioEstadoRequest request) {
        Pedido pedido = pedidoService.findById(id);

        HistorialEstado historial = new HistorialEstado();
        historial.setFechaHora(Instant.now());
        historial.setEstado(request.getEstado());
        historial.setPedido(pedido);
        historialEstadoRepository.save(historial);

        return pedidoService.buildResponse(pedido);
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
                .orElseThrow(() -> new RuntimeException("Sabor no encontrado"));
        sabor.setNombre(request.getNombre());
        sabor.setStockBaldes(request.getStockBaldes());
        sabor.setDisponible(request.getDisponible());
        sabor.setCapBalde(request.getCapBalde());
        return SaborResponse.from(saborRepository.save(sabor));
    }

    @Transactional
    public void eliminarSabor(Long id) {
        saborRepository.deleteById(id);
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
                .orElseThrow(() -> new RuntimeException("Adicional no encontrado"));
        adicional.setNombre(request.getNombre());
        adicional.setPrecioExtra(request.getPrecioExtra());
        adicional.setDisponible(request.getDisponible());
        return AdicionalResponse.from(adicionalRepository.save(adicional));
    }

    @Transactional
    public void eliminarAdicional(Long id) {
        adicionalRepository.deleteById(id);
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
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));
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
                .orElseThrow(() -> new RuntimeException("Zona no encontrada"));
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
