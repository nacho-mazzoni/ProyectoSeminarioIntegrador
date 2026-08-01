package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.CambioPasswordRequest;
import com.seminario.heladeria.dto.request.ClienteRequest;
import com.seminario.heladeria.entity.Cliente;
import com.seminario.heladeria.entity.Rol;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.security.CustomJwtAuthenticationConverter;
import com.seminario.heladeria.service.AuthService;
import com.seminario.heladeria.service.ClienteService;
import org.junit.jupiter.api.Disabled;
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
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClienteController.class)
class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ClienteService clienteService;

    @MockitoBean
    private AuthService authService;

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
    void registrar_shouldReturnUsuarioResponse() throws Exception {
        var cliente = new Cliente();
        cliente.setIdUsuario(1L);
        var u = (Usuario) auth().getPrincipal();
        cliente.setUsuario(u);
        when(clienteService.crearOCargar(any(), eq("123456789"))).thenReturn(cliente);

        mockMvc.perform(post("/api/clientes").with(authentication(auth()))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@test.com\",\"telefono\":\"123456789\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idUsuario").value(1));
    }

    @Disabled("@AuthenticationPrincipal not resolvable in @WebMvcTest")
    @Test
    void actualizar_shouldReturnUsuarioResponse() throws Exception {
        var cliente = new Cliente();
        cliente.setIdUsuario(1L);
        when(clienteService.actualizar(eq(1L), eq("987654321"))).thenReturn(cliente);

        mockMvc.perform(put("/api/clientes").with(authentication(auth()))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@test.com\",\"telefono\":\"987654321\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idUsuario").value(1));
    }

    @Test
    void cambiarPassword_shouldReturnMensaje() throws Exception {
        doNothing().when(authService).cambiarPassword(any(), eq("old"), eq("new"));

        mockMvc.perform(put("/api/clientes/password").with(authentication(auth()))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"passwordActual\":\"old\",\"passwordNueva\":\"newpass\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensaje").value("Contraseña actualizada"));
    }

    @Test
    void eliminarCuenta_shouldReturnMensaje() throws Exception {
        doNothing().when(authService).eliminarCuenta(any());

        mockMvc.perform(delete("/api/clientes/cuenta").with(authentication(auth()))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensaje").value("Cuenta eliminada"));
    }
}
