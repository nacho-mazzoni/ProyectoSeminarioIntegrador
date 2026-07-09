package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.ActualizarEstadoRequest;
import com.seminario.heladeria.dto.response.PedidoResponse;
import com.seminario.heladeria.entity.Pedido;
import com.seminario.heladeria.repository.HistorialEstadoRepository;
import com.seminario.heladeria.security.CustomJwtAuthenticationConverter;
import com.seminario.heladeria.service.PedidoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminPedidosController.class)
class AdminPedidosControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PedidoService pedidoService;

    @MockitoBean
    private HistorialEstadoRepository historialEstadoRepository;

    @MockitoBean
    private CustomJwtAuthenticationConverter jwtConverter;

    @Test
    void listar_shouldReturnPedidos() throws Exception {
        when(pedidoService.findAll()).thenReturn(List.of());
        when(pedidoService.buildResponse(any())).thenReturn(new PedidoResponse());

        mockMvc.perform(get("/api/admin/pedidos").with(user("admin@test.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(0));
    }

    @Test
    void actualizarEstado_shouldReturnPedido() throws Exception {
        var pedido = new Pedido();
        when(pedidoService.findById(1L)).thenReturn(pedido);
        when(pedidoService.buildResponse(pedido)).thenReturn(new PedidoResponse());

        mockMvc.perform(put("/api/admin/pedidos/1/estado").with(user("admin@test.com"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"estado\":\"EN_PREPARACION\",\"notas\":\"Listo\"}"))
                .andExpect(status().isOk());
    }
}
