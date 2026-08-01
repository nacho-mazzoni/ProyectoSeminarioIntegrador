package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.ActualizarRolRequest;
import com.seminario.heladeria.dto.response.UsuarioResponse;
import com.seminario.heladeria.entity.Rol;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.repository.RolRepository;
import com.seminario.heladeria.repository.UsuarioRepository;
import com.seminario.heladeria.security.CustomJwtAuthenticationConverter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminUsuariosController.class)
class AdminUsuariosControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    @MockitoBean
    private RolRepository rolRepository;

    @MockitoBean
    private CustomJwtAuthenticationConverter jwtConverter;

    @Test
    void actualizarRol_shouldReturnUsuario() throws Exception {
        var usuario = new Usuario();
        usuario.setIdUsuario(1L);
        var rol = new Rol();
        rol.setIdRol(2L);
        rol.setNombreRol("CLIENTE");
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(rolRepository.findById(2L)).thenReturn(Optional.of(rol));
        when(usuarioRepository.save(any())).thenReturn(usuario);

        mockMvc.perform(put("/api/admin/usuarios/1/rol").with(user("admin@test.com"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"idRol\":2}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idUsuario").value(1));
    }

    @Test
    void toggleActivo_shouldReturnUsuario() throws Exception {
        var usuario = new Usuario();
        usuario.setIdUsuario(1L);
        usuario.setActivo(true);
        var rol = new Rol();
        rol.setNombreRol("CLIENTE");
        usuario.setRol(rol);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any())).thenReturn(usuario);

        mockMvc.perform(put("/api/admin/usuarios/1/activo").with(user("admin@test.com"))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idUsuario").value(1));
    }

    @Test
    void listarRoles_shouldReturnList() throws Exception {
        when(rolRepository.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/admin/roles").with(user("admin@test.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(0));
    }
}
