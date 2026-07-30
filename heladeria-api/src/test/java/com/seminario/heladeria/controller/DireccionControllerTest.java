package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.response.DireccionResponse;
import com.seminario.heladeria.entity.Cliente;
import com.seminario.heladeria.entity.Direccion;
import com.seminario.heladeria.entity.Rol;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.entity.ZonaEnvio;
import com.seminario.heladeria.security.CustomJwtAuthenticationConverter;
import com.seminario.heladeria.service.ClienteService;
import com.seminario.heladeria.service.DireccionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DireccionController.class)
class DireccionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DireccionService direccionService;

    @MockitoBean
    private ClienteService clienteService;

    @MockitoBean
    private CustomJwtAuthenticationConverter jwtConverter;

    private UsernamePasswordAuthenticationToken auth() {
        var rol = new Rol();
        rol.setNombreRol("CLIENTE");
        var usuario = new Usuario();
        usuario.setIdUsuario(1L);
        usuario.setEmail("test@test.com");
        usuario.setActivo(true);
        usuario.setRol(rol);
        return new UsernamePasswordAuthenticationToken(usuario, null,
                List.of(new SimpleGrantedAuthority("ROLE_CLIENTE")));
    }

    @Test
    void misDirecciones_shouldReturnList() throws Exception {
        var cliente = new Cliente();
        cliente.setIdUsuario(1L);
        when(clienteService.findById(eq(1L))).thenReturn(cliente);
        when(direccionService.findByCliente(eq(1L))).thenReturn(List.of());

        mockMvc.perform(get("/api/direcciones").with(authentication(auth())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(0));
    }

    @Test
    void crear_shouldReturnDireccion() throws Exception {
        var cliente = new Cliente();
        cliente.setIdUsuario(1L);
        var zona = new ZonaEnvio();
        zona.setIdZona(1L);
        zona.setNombreZona("Zona 1");
        var direccion = new Direccion();
        direccion.setIdDireccion(1L);
        direccion.setCalle("Calle 123");
        direccion.setZonaEnvio(zona);
        when(clienteService.findById(eq(1L))).thenReturn(cliente);
        when(direccionService.crear(eq(1L), any())).thenReturn(direccion);

        mockMvc.perform(post("/api/direcciones").with(authentication(auth()))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"calle\":\"Calle 123\",\"numero\":\"456\",\"ciudad\":\"Ciudad\",\"idZona\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idDireccion").value(1));
    }

    @Test
    void eliminar_shouldReturnNoContent() throws Exception {
        var cliente = new Cliente();
        cliente.setIdUsuario(1L);
        when(clienteService.findById(eq(1L))).thenReturn(cliente);

        mockMvc.perform(delete("/api/direcciones/1").with(authentication(auth()))
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }
}
