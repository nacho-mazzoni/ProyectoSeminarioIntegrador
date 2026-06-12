package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Pedido;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test-local")
@Sql(scripts = {
    "file:./tests/init/01-schema.sql",
    "file:./tests/init/02-test-seed.sql"
}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
class PedidoRepositoryTest {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Test
    void findByIdClienteOrderByFechaDesc_shouldReturnOrdersForClient() {
        List<Pedido> pedidos = pedidoRepository.findByIdClienteOrderByFechaDesc(2L);

        assertThat(pedidos).isNotEmpty();
        assertThat(pedidos).allMatch(p -> p.getCliente().getIdUsuario() == 2L);
    }

    @Test
    void findByIdClienteOrderByFechaDesc_shouldReturnOrdersOrderedByFechaDesc() {
        List<Pedido> pedidos = pedidoRepository.findByIdClienteOrderByFechaDesc(2L);

        for (int i = 0; i < pedidos.size() - 1; i++) {
            assertThat(pedidos.get(i).getFecha())
                    .isAfterOrEqualTo(pedidos.get(i + 1).getFecha());
        }
    }

    @Test
    void findByIdClienteOrderByFechaDesc_shouldReturnEmptyWhenNoOrders() {
        List<Pedido> pedidos = pedidoRepository.findByIdClienteOrderByFechaDesc(999L);

        assertThat(pedidos).isEmpty();
    }
}
