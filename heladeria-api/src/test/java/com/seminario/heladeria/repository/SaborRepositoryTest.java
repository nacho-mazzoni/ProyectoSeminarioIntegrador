package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Sabor;
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
class SaborRepositoryTest {

    @Autowired
    private SaborRepository saborRepository;

    @Test
    void findById_shouldReturnSabor() {
        Optional<Sabor> result = saborRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getNombre()).isEqualTo("Chocolate");
    }

    @Test
    void findById_shouldReturnEmptyWhenNotFound() {
        Optional<Sabor> result = saborRepository.findById(999L);

        assertThat(result).isEmpty();
    }

    @Test
    void findByDisponibleTrue_shouldReturnOnlyAvailable() {
        List<Sabor> result = saborRepository.findByDisponibleTrue();

        assertThat(result).isNotEmpty();
        assertThat(result).allMatch(Sabor::getDisponible);
    }

    @Test
    void findByDisponibleTrue_shouldExcludeNoDisponible() {
        List<Sabor> result = saborRepository.findByDisponibleTrue();

        assertThat(result).noneMatch(s -> s.getNombre().equals("No Disponible"));
    }
}
