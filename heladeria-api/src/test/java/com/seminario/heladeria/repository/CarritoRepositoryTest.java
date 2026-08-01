package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Carrito;
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
class CarritoRepositoryTest {

    @Autowired
    private CarritoRepository carritoRepository;

    @Test
    void findById_shouldReturnCarrito() {
        Optional<Carrito> result = carritoRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getCliente().getIdUsuario()).isEqualTo(2L);
    }

    @Test
    void findByClienteIdUsuario_shouldReturnCarrito() {
        Optional<Carrito> result = carritoRepository.findByClienteIdUsuario(2L);

        assertThat(result).isPresent();
        assertThat(result.get().getIdCarrito()).isEqualTo(1L);
    }

    @Test
    void findByClienteIdUsuario_shouldReturnEmptyWhenNoCarrito() {
        Optional<Carrito> result = carritoRepository.findByClienteIdUsuario(999L);

        assertThat(result).isEmpty();
    }
}
