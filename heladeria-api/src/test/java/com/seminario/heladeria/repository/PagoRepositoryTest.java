package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Pago;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Sql("/test-seed.sql")
class PagoRepositoryTest {

    @Autowired
    private PagoRepository pagoRepository;

    @Test
    void findByPedidoIdPedido_shouldReturnEmptyWhenNoPago() {
        Optional<Pago> result = pagoRepository.findByPedidoIdPedido(1L);

        assertThat(result).isEmpty();
    }
}
