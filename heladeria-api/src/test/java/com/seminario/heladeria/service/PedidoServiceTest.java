package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.PedidoRequest;
import com.seminario.heladeria.entity.*;
import com.seminario.heladeria.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@Sql("/test-seed.sql")
class PedidoServiceTest {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private HistorialEstadoRepository historialEstadoRepository;

    private Cliente cliente;
    private PedidoRequest.DetalleRequest detalleRequest;

    @BeforeEach
    void setUp() {
        cliente = clienteRepository.findById(2L)
                .orElseThrow(() -> new RuntimeException("Cliente test no encontrado"));

        detalleRequest = new PedidoRequest.DetalleRequest();
        detalleRequest.setIdProducto(1L);
        detalleRequest.setCantidad(2);
        detalleRequest.setIdsSabor(List.of(1L, 2L));
    }

    @Test
    void crear_shouldCreatePedidoWithDeliveryAndPromo() {
        PedidoRequest request = new PedidoRequest();
        request.setMetodoEntrega("delivery");
        request.setIdDireccion(1L);
        request.setCodigoPromocion("PROMO10");
        request.setDetalles(List.of(detalleRequest));

        Pedido pedido = pedidoService.crear(cliente, request);

        assertThat(pedido.getIdPedido()).isNotNull();
        assertThat(pedido.getTotal()).isEqualByComparingTo(new BigDecimal("5000.00"));
        assertThat(pedido.getMetodoEntrega()).isEqualTo("delivery");
        assertThat(pedido.getCliente().getIdUsuario()).isEqualTo(2L);

        Producto producto = productoRepository.findById(1L).orElseThrow();
        assertThat(producto.getStockEnvases()).isEqualTo(8);
    }

    @Test
    void crear_shouldApplyPromoDiscount() {
        PedidoRequest request = new PedidoRequest();
        request.setMetodoEntrega("retiro");
        request.setIdDireccion(1L);
        request.setCodigoPromocion("PROMO20");
        request.setDetalles(List.of(detalleRequest));

        Pedido pedido = pedidoService.crear(cliente, request);

        BigDecimal subtotal = new BigDecimal("5000.00");
        BigDecimal descuento = subtotal.multiply(new BigDecimal("0.20"));
        BigDecimal expectedTotal = subtotal.subtract(descuento);
        assertThat(pedido.getTotal()).isEqualByComparingTo(expectedTotal);
    }

    @Test
    void crear_shouldAddDeliveryCost() {
        PedidoRequest request = new PedidoRequest();
        request.setMetodoEntrega("delivery");
        request.setIdDireccion(1L);
        request.setDetalles(List.of(detalleRequest));

        Pedido pedido = pedidoService.crear(cliente, request);

        BigDecimal subtotal = new BigDecimal("5000.00");
        BigDecimal expectedTotal = subtotal.add(new BigDecimal("500.00"));
        assertThat(pedido.getTotal()).isEqualByComparingTo(expectedTotal);
    }

    @Test
    void crear_shouldNotAddDeliveryCostForRetiro() {
        PedidoRequest request = new PedidoRequest();
        request.setMetodoEntrega("retiro");
        request.setIdDireccion(1L);
        request.setDetalles(List.of(detalleRequest));

        Pedido pedido = pedidoService.crear(cliente, request);

        BigDecimal expectedTotal = new BigDecimal("5000.00");
        assertThat(pedido.getTotal()).isEqualByComparingTo(expectedTotal);
    }

    @Test
    void crear_shouldCreateHistorialEstado() {
        PedidoRequest request = new PedidoRequest();
        request.setMetodoEntrega("retiro");
        request.setIdDireccion(1L);
        request.setDetalles(List.of(detalleRequest));

        Pedido pedido = pedidoService.crear(cliente, request);

        List<HistorialEstado> historial = historialEstadoRepository
                .findByPedidoIdPedidoOrderByFechaHoraAsc(pedido.getIdPedido());
        assertThat(historial).hasSize(1);
        assertThat(historial.get(0).getEstado()).isEqualTo("PENDIENTE");
    }

    @Test
    void crear_shouldThrowWhenStockInsufficient() {
        PedidoRequest.DetalleRequest det = new PedidoRequest.DetalleRequest();
        det.setIdProducto(2L);
        det.setCantidad(100);

        PedidoRequest request = new PedidoRequest();
        request.setMetodoEntrega("retiro");
        request.setIdDireccion(1L);
        request.setDetalles(List.of(det));

        assertThatThrownBy(() -> pedidoService.crear(cliente, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Stock insuficiente");
    }

    @Test
    void crear_shouldThrowWhenPromoInvalid() {
        PedidoRequest request = new PedidoRequest();
        request.setMetodoEntrega("retiro");
        request.setIdDireccion(1L);
        request.setCodigoPromocion("CODIGO_INVALIDO");
        request.setDetalles(List.of(detalleRequest));

        assertThatThrownBy(() -> pedidoService.crear(cliente, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Promocion");
    }

    @Test
    void crear_shouldThrowWhenPromoExpired() {
        PedidoRequest request = new PedidoRequest();
        request.setMetodoEntrega("retiro");
        request.setIdDireccion(1L);
        request.setCodigoPromocion("EXPIRADA");
        request.setDetalles(List.of(detalleRequest));

        assertThatThrownBy(() -> pedidoService.crear(cliente, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Promocion");
    }

    @Test
    void crear_shouldThrowWhenDireccionNotFound() {
        PedidoRequest request = new PedidoRequest();
        request.setMetodoEntrega("retiro");
        request.setIdDireccion(999L);
        request.setDetalles(List.of(detalleRequest));

        assertThatThrownBy(() -> pedidoService.crear(cliente, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Direccion");
    }

    @Test
    void crear_shouldWorkWithoutPromo() {
        PedidoRequest request = new PedidoRequest();
        request.setMetodoEntrega("retiro");
        request.setIdDireccion(1L);
        request.setDetalles(List.of(detalleRequest));

        Pedido pedido = pedidoService.crear(cliente, request);

        assertThat(pedido.getIdPedido()).isNotNull();
        assertThat(pedido.getPromocion()).isNull();
    }

    @Test
    void findById_shouldReturnPedido() {
        Pedido pedido = pedidoService.findById(1L);

        assertThat(pedido).isNotNull();
        assertThat(pedido.getIdPedido()).isEqualTo(1L);
    }

    @Test
    void findById_shouldThrowWhenNotFound() {
        assertThatThrownBy(() -> pedidoService.findById(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Pedido no encontrado");
    }

    @Test
    void findByCliente_shouldReturnOrdersOrderedByDateDesc() {
        List<Pedido> pedidos = pedidoService.findByCliente(2L);

        assertThat(pedidos).isNotEmpty();
        for (int i = 0; i < pedidos.size() - 1; i++) {
            assertThat(pedidos.get(i).getFecha())
                    .isAfterOrEqualTo(pedidos.get(i + 1).getFecha());
        }
    }

    @Test
    void cancelar_shouldCancelPendingPedidoAndRestoreStock() {
        Pedido pedido = pedidoService.findById(1L);
        Producto productoAntes = productoRepository.findById(1L).orElseThrow();
        int stockAntes = productoAntes.getStockEnvases();

        pedidoService.cancelar(pedido);

        List<HistorialEstado> historial = historialEstadoRepository
                .findByPedidoIdPedidoOrderByFechaHoraAsc(1L);
        assertThat(historial.get(historial.size() - 1).getEstado()).isEqualTo("CANCELADO");

        Producto productoDespues = productoRepository.findById(1L).orElseThrow();
        assertThat(productoDespues.getStockEnvases()).isEqualTo(stockAntes + 2);
    }

    @Test
    void cancelar_shouldCancelEnPreparacionPedido() {
        Pedido pedido = pedidoService.findById(1L);
        HistorialEstado prep = new HistorialEstado();
        prep.setFechaHora(java.time.Instant.now());
        prep.setEstado("EN_PREPARACION");
        prep.setPedido(pedido);
        historialEstadoRepository.save(prep);

        pedidoService.cancelar(pedido, "Cancelado durante preparación");

        List<HistorialEstado> historial = historialEstadoRepository
                .findByPedidoIdPedidoOrderByFechaHoraAsc(1L);
        HistorialEstado ultimo = historial.get(historial.size() - 1);
        assertThat(ultimo.getEstado()).isEqualTo("CANCELADO");
        assertThat(ultimo.getNotas()).isEqualTo("Cancelado durante preparación");
    }

    @Test
    void cancelar_shouldThrowWhenPedidoEntregado() {
        Pedido pedido = pedidoService.findById(2L); // pedido 2 has ENTREGADO in test-seed.sql

        assertThatThrownBy(() -> pedidoService.cancelar(pedido))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Solo se pueden cancelar pedidos");
    }
}
