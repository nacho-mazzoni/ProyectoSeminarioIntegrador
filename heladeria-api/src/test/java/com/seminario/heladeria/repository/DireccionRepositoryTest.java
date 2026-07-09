package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Direccion;
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
class DireccionRepositoryTest {

    @Autowired
    private DireccionRepository direccionRepository;

    @Test
    void findById_shouldReturnDireccion() {
        Optional<Direccion> result = direccionRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getCalle()).isEqualTo("Av. Siempre Viva");
    }

    @Test
    void findById_shouldReturnEmptyWhenNotFound() {
        Optional<Direccion> result = direccionRepository.findById(999L);

        assertThat(result).isEmpty();
    }

    @Test
    void findByClienteIdUsuario_shouldReturnDirecciones() {
        List<Direccion> result = direccionRepository.findByClienteIdUsuario(2L);

        assertThat(result).hasSize(2);
    }

    @Test
    void findByClienteIdUsuario_shouldReturnEmptyWhenNoDirecciones() {
        List<Direccion> result = direccionRepository.findByClienteIdUsuario(999L);

        assertThat(result).isEmpty();
    }
}
