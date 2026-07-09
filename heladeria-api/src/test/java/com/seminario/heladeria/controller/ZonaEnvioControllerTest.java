package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.response.ZonaEnvioResponse;
import com.seminario.heladeria.security.CustomJwtAuthenticationConverter;
import com.seminario.heladeria.service.ZonaEnvioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ZonaEnvioController.class)
class ZonaEnvioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ZonaEnvioService service;

    @MockitoBean
    private CustomJwtAuthenticationConverter jwtConverter;

    @Test
    void listar_shouldReturnZonas() throws Exception {
        var zona = new ZonaEnvioResponse();
        ReflectionTestUtils.setField(zona, "idZona", 1L);
        ReflectionTestUtils.setField(zona, "nombreZona", "Zona 1");
        ReflectionTestUtils.setField(zona, "costoEnvio", BigDecimal.TEN);
        when(service.findAllResponses()).thenReturn(List.of(zona));

        mockMvc.perform(get("/api/zonas-envio").with(user("test@test.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].idZona").value(1))
                .andExpect(jsonPath("$[0].nombreZona").value("Zona 1"));
    }
}
