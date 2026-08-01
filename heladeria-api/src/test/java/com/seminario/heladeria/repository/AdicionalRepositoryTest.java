package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Adicional;
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
class AdicionalRepositoryTest {

    @Autowired
    private AdicionalRepository adicionalRepository;

    @Test
    void findById_shouldReturnAdicional() {
        Optional<Adicional> result = adicionalRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getNombre()).isEqualTo("Cremora");
    }

    @Test
    void findById_shouldReturnEmptyWhenNotFound() {
        Optional<Adicional> result = adicionalRepository.findById(999L);

        assertThat(result).isEmpty();
    }

    @Test
    void findByDisponibleTrue_shouldReturnOnlyAvailable() {
        List<Adicional> result = adicionalRepository.findByDisponibleTrue();

        assertThat(result).isNotEmpty();
        assertThat(result).allMatch(Adicional::getDisponible);
    }

    @Test
    void findByDisponibleTrue_shouldExcludeNoDisponible() {
        List<Adicional> result = adicionalRepository.findByDisponibleTrue();

        assertThat(result).noneMatch(a -> a.getNombre().equals("No Disponible"));
    }
}
