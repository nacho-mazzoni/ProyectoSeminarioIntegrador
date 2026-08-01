package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.LoginRequest;
import com.seminario.heladeria.dto.request.RegisterRequest;
import com.seminario.heladeria.dto.response.AuthResponse;
import com.seminario.heladeria.dto.response.UsuarioResponse;
import com.seminario.heladeria.entity.Rol;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.security.CustomJwtAuthenticationConverter;
import com.seminario.heladeria.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private CustomJwtAuthenticationConverter jwtConverter;

    @Test
    void login_shouldReturnAuthResponse() throws Exception {
        var response = new AuthResponse("token", new UsuarioResponse());
        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .with(user("test@test.com"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@test.com\",\"password\":\"pass\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token"));
    }

    @Test
    void login_withInvalidBody_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .with(user("test@test.com"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"bad\",\"password\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_shouldReturnAuthResponse() throws Exception {
        var response = new AuthResponse("token", new UsuarioResponse());
        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .with(user("test@test.com"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"new@test.com\",\"password\":\"pass123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token"));
    }

    @Test
    void me_shouldReturnUsuarioResponse() throws Exception {
        var response = new UsuarioResponse();
        when(authService.getCurrentUser(any())).thenReturn(response);

        var usuario = new Usuario();
        usuario.setIdUsuario(1L);
        usuario.setEmail("test@test.com");
        usuario.setActivo(true);
        var rol = new Rol();
        rol.setNombreRol("CLIENTE");
        usuario.setRol(rol);
        var auth = new UsernamePasswordAuthenticationToken(usuario, null,
                List.of(new SimpleGrantedAuthority("ROLE_CLIENTE")));

        mockMvc.perform(get("/api/auth/me").with(authentication(auth)))
                .andExpect(status().isOk());
    }
}
