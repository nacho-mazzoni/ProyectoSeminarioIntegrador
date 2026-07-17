package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.CarritoItemRequest;
import com.seminario.heladeria.dto.request.CheckoutRequest;
import com.seminario.heladeria.dto.response.CarritoResponse;
import com.seminario.heladeria.dto.response.CheckoutResponse;
import com.seminario.heladeria.dto.response.PedidoResponse;
import com.seminario.heladeria.entity.Rol;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.security.CustomJwtAuthenticationConverter;
import com.seminario.heladeria.service.CarritoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CarritoController.class)
class CarritoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CarritoService carritoService;

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
    void obtener_shouldReturnCarrito() throws Exception {
        var response = new CarritoResponse();
        ReflectionTestUtils.setField(response, "idCarrito", 1L);
        when(carritoService.obtenerResponse(any())).thenReturn(response);

        mockMvc.perform(get("/api/carrito").with(authentication(auth())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idCarrito").value(1));
    }

    @Test
    void agregarItem_shouldReturnCarrito() throws Exception {
        var response = new CarritoResponse();
        ReflectionTestUtils.setField(response, "idCarrito", 1L);
        when(carritoService.obtenerResponse(any())).thenReturn(response);

        mockMvc.perform(post("/api/carrito/items").with(authentication(auth()))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"idProducto\":1,\"cantidad\":2}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idCarrito").value(1));
    }

    @Test
    void agregarItem_withInvalidBody_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(post("/api/carrito/items").with(authentication(auth()))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"cantidad\":2}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void checkout_shouldReturnPedidoResponse() throws Exception {
        var response = new CheckoutResponse(new PedidoResponse(), null, null);
        when(carritoService.checkout(any(), any(CheckoutRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/carrito/checkout").with(authentication(auth()))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"metodoEntrega\":\"delivery\",\"idDireccion\":1}"))
                .andExpect(status().isOk());
    }
}
