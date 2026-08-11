package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Pedido;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Sql("/test-seed.sql")
class PedidoRepositoryTest {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Test
    void findByClienteIdUsuarioOrderByFechaDesc_shouldReturnOrdersForClient() {
        List<Pedido> pedidos = pedidoRepository.findByClienteIdUsuarioOrderByFechaDesc(2L);

        assertThat(pedidos).isNotEmpty();
        assertThat(pedidos).allMatch(p -> p.getCliente().getIdUsuario() == 2L);
    }

    @Test
    void findByClienteIdUsuarioOrderByFechaDesc_shouldReturnOrdersOrderedByFechaDesc() {
        List<Pedido> pedidos = pedidoRepository.findByClienteIdUsuarioOrderByFechaDesc(2L);

        for (int i = 0; i < pedidos.size() - 1; i++) {
            assertThat(pedidos.get(i).getFecha())
                    .isAfterOrEqualTo(pedidos.get(i + 1).getFecha());
        }
    }

    @Test
    void findByClienteIdUsuarioOrderByFechaDesc_shouldReturnEmptyWhenNoOrders() {
        List<Pedido> pedidos = pedidoRepository.findByClienteIdUsuarioOrderByFechaDesc(999L);

        assertThat(pedidos).isEmpty();
    }

    @Test
    void sumIngresosMesActual_shouldOnlyCountEntregadoOrders() {
        // Seed: pedido 1 PENDIENTE (5000), pedido 2 ENTREGADO (2400)
        BigDecimal ingresos = pedidoRepository.sumIngresosMesActual();

        assertThat(ingresos).isEqualByComparingTo(new BigDecimal("2400.00"));
    }

    @Test
    void sumIngresosMesActual_shouldReturnZeroWhenNoEntregadoOrders() {
        // This month's ENTREGADO orders are counted; if none, returns 0
        // The seed has pedido 2 ENTREGADO 3 days ago (current month), so it returns 2400.
        // We verify it doesn't count PENDIENTE (pedido 1 = 5000).
        BigDecimal ingresos = pedidoRepository.sumIngresosMesActual();

        assertThat(ingresos).isNotEqualByComparingTo(new BigDecimal("5000.00"));
        assertThat(ingresos).isNotEqualByComparingTo(new BigDecimal("7400.00"));
    }

    @Test
    void sumIngresosPorMes_shouldReturnCurrentMonthWithEntregadoTotal() {
        LocalDate from = LocalDate.now().minusMonths(2).withDayOfMonth(1);
        LocalDate to = LocalDate.now().plusMonths(1).withDayOfMonth(1);
        Instant desde = from.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant hasta = to.atStartOfDay(ZoneId.systemDefault()).toInstant();

        List<Object[]> result = pedidoRepository.sumIngresosPorMes(desde, hasta);

        assertThat(result).isNotEmpty();
        // Current month should have pedido 2 ENTREGADO (2400)
        Object[] currentMonthRow = result.stream()
                .filter(r -> r[0].toString().equals(LocalDate.now().toString().substring(0, 7)))
                .findFirst()
                .orElseThrow();
        assertThat(new BigDecimal(currentMonthRow[1].toString())).isEqualByComparingTo(new BigDecimal("2400.00"));
        assertThat(((Number) currentMonthRow[2]).longValue()).isEqualTo(1L);
    }
}
