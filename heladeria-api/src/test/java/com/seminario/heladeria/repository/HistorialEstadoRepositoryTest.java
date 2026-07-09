package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.HistorialEstado;
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
@Sql("/test-seed.sql")
class HistorialEstadoRepositoryTest {

    @Autowired
    private HistorialEstadoRepository historialEstadoRepository;

    @Test
    void findByPedidoIdPedidoOrderByFechaHoraAsc_shouldReturnHistorialOrdered() {
        List<HistorialEstado> result = historialEstadoRepository
                .findByPedidoIdPedidoOrderByFechaHoraAsc(2L);

        assertThat(result).hasSize(3);
        assertThat(result.get(0).getEstado()).isEqualTo("PENDIENTE");
        assertThat(result.get(result.size() - 1).getEstado()).isEqualTo("ENTREGADO");
    }

    @Test
    void findByPedidoIdPedidoOrderByFechaHoraAsc_shouldReturnEmptyWhenNoHistorial() {
        List<HistorialEstado> result = historialEstadoRepository
                .findByPedidoIdPedidoOrderByFechaHoraAsc(999L);

        assertThat(result).isEmpty();
    }
}
