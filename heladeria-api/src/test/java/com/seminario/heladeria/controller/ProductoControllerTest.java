package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.*;
import com.seminario.heladeria.dto.response.*;
import com.seminario.heladeria.security.CustomJwtAuthenticationConverter;
import com.seminario.heladeria.service.ProductoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductoController.class)
class ProductoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductoService productoService;

    @MockitoBean
    private CustomJwtAuthenticationConverter jwtConverter;

    @Test
    void listarCategorias_shouldReturnList() throws Exception {
        var cat = new CategoriaResponse();
        ReflectionTestUtils.setField(cat, "idCategoria", 1L);
        ReflectionTestUtils.setField(cat, "nombre", "Cat 1");
        when(productoService.findAllCategoriaResponses()).thenReturn(List.of(cat));

        mockMvc.perform(get("/api/categorias").with(user("test@test.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1));
    }

    @Test
    void listarProductos_shouldReturnList() throws Exception {
        var prod = new ProductoResponse();
        ReflectionTestUtils.setField(prod, "idProducto", 1L);
        ReflectionTestUtils.setField(prod, "nombre", "Prod 1");
        when(productoService.findAllProductoResponses(null, null, null, null)).thenReturn(List.of(prod));

        mockMvc.perform(get("/api/productos").with(user("test@test.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1));
    }

    @Test
    void obtenerProducto_shouldReturnProducto() throws Exception {
        var prod = new ProductoResponse();
        ReflectionTestUtils.setField(prod, "idProducto", 1L);
        when(productoService.findProductoResponseById(1L)).thenReturn(prod);

        mockMvc.perform(get("/api/productos/1").with(user("test@test.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idProducto").value(1));
    }

    @Test
    void listarSabores_shouldReturnList() throws Exception {
        when(productoService.findSaborResponsesDisponibles()).thenReturn(List.of());

        mockMvc.perform(get("/api/sabores").with(user("test@test.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(0));
    }

    @Test
    void listarAdicionales_shouldReturnList() throws Exception {
        when(productoService.findAdicionalResponsesDisponibles()).thenReturn(List.of());

        mockMvc.perform(get("/api/adicionales").with(user("test@test.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(0));
    }

    @Test
    void crearProducto_shouldReturnProducto() throws Exception {
        var prod = new ProductoResponse();
        ReflectionTestUtils.setField(prod, "idProducto", 1L);
        when(productoService.crearProducto(any(ProductoRequest.class))).thenReturn(prod);

        mockMvc.perform(post("/api/admin/productos").with(user("admin@test.com"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Prod\",\"precioBase\":10.0,\"stockEnvases\":10,\"maxSabores\":1,\"idCategoria\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idProducto").value(1));
    }

    @Test
    void eliminarProducto_shouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/admin/productos/1").with(user("admin@test.com"))
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }


}
