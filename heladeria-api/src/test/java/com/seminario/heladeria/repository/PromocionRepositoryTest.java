package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Promocion;
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
class PromocionRepositoryTest {

    @Autowired
    private PromocionRepository promocionRepository;

    @Test
    void findByCodigoAndActivaTrue_shouldReturnActivePromo() {
        Optional<Promocion> result = promocionRepository.findByCodigoAndActivaTrue("PROMO10");

        assertThat(result).isPresent();
        assertThat(result.get().getCodigo()).isEqualTo("PROMO10");
        assertThat(result.get().getActiva()).isTrue();
    }

    @Test
    void findByCodigoAndActivaTrue_shouldReturnEmptyForInactivePromo() {
        Optional<Promocion> result = promocionRepository.findByCodigoAndActivaTrue("EXPIRADA");

        assertThat(result).isEmpty();
    }

    @Test
    void findByCodigoAndActivaTrue_shouldReturnEmptyForNonExistentPromo() {
        Optional<Promocion> result = promocionRepository.findByCodigoAndActivaTrue("INEXISTENTE");

        assertThat(result).isEmpty();
    }
}
