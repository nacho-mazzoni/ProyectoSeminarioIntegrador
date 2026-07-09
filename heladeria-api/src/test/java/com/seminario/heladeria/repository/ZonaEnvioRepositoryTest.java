package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.ZonaEnvio;
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
class ZonaEnvioRepositoryTest {

    @Autowired
    private ZonaEnvioRepository zonaEnvioRepository;

    @Test
    void findById_shouldReturnZona() {
        Optional<ZonaEnvio> result = zonaEnvioRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getNombreZona()).isEqualTo("Zona Norte");
    }

    @Test
    void findById_shouldReturnEmptyWhenNotFound() {
        Optional<ZonaEnvio> result = zonaEnvioRepository.findById(999L);

        assertThat(result).isEmpty();
    }

    @Test
    void findAll_shouldReturnAllZonas() {
        var result = zonaEnvioRepository.findAll();

        assertThat(result).hasSize(2);
    }
}
