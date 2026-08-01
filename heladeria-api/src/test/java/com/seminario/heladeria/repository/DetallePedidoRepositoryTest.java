package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.DetallePedido;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Sql("/test-seed.sql")
class DetallePedidoRepositoryTest {

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Test
    void findById_shouldReturnDetalle() {
        Optional<DetallePedido> result = detallePedidoRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getCantidad()).isEqualTo(2);
        assertThat(result.get().getProducto().getIdProducto()).isEqualTo(1L);
    }

    @Test
    void findByPedidoIdPedido_shouldReturnDetalles() {
        List<DetallePedido> result = detallePedidoRepository.findByPedidoIdPedido(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getSabores()).hasSize(2);
    }

    @Test
    void findByPedidoIdPedido_shouldReturnEmptyWhenNoDetalles() {
        List<DetallePedido> result = detallePedidoRepository.findByPedidoIdPedido(999L);

        assertThat(result).isEmpty();
    }
}
