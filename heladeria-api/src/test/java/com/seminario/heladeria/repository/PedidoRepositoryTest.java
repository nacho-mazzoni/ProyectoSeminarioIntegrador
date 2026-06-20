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
@ActiveProfiles("test")
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
}
