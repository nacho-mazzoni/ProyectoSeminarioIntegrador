package com.seminario.heladeria.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@Sql("/test-seed.sql")
class ZonaEnvioServiceTest {

    @Autowired
    private ZonaEnvioService zonaEnvioService;

    @Test
    void findAllResponses_shouldReturnAllZonas() {
        var result = zonaEnvioService.findAllResponses();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getNombreZona()).isEqualTo("Zona Norte");
        assertThat(result.get(0).getCostoEnvio()).isEqualByComparingTo(java.math.BigDecimal.valueOf(500.00));
    }
}
