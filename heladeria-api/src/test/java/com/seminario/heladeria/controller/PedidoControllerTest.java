package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.PedidoRequest;
import com.seminario.heladeria.dto.response.PedidoResponse;
import com.seminario.heladeria.entity.Cliente;
import com.seminario.heladeria.entity.Pedido;
import com.seminario.heladeria.entity.Rol;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.security.CustomJwtAuthenticationConverter;
import com.seminario.heladeria.service.ClienteService;
import com.seminario.heladeria.service.PagoService;
import com.seminario.heladeria.service.PedidoService;
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

@WebMvcTest(PedidoController.class)
class PedidoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PedidoService pedidoService;

    @MockitoBean
    private ClienteService clienteService;

    @MockitoBean
    private PagoService pagoService;

    @MockitoBean
    private CustomJwtAuthenticationConverter jwtConverter;

    private UsernamePasswordAuthenticationToken auth(Long id) {
        var rol = new Rol();
        rol.setNombreRol("CLIENTE");
        var usuario = new Usuario();
        usuario.setIdUsuario(id);
        usuario.setEmail("test@test.com");
        usuario.setActivo(true);
        usuario.setRol(rol);
        return new UsernamePasswordAuthenticationToken(usuario, null,
                List.of(new SimpleGrantedAuthority("ROLE_CLIENTE")));
    }

    @Test
    void listar_shouldReturnPedidos() throws Exception {
        var cliente = new Cliente();
        cliente.setIdUsuario(1L);
        when(clienteService.findById(eq(1L))).thenReturn(cliente);
        when(pedidoService.findByCliente(eq(1L))).thenReturn(List.of());
        when(pedidoService.buildResponse(any())).thenReturn(new PedidoResponse());

        mockMvc.perform(get("/api/pedidos").with(authentication(auth(1L))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(0));
    }

    @Test
    void obtener_shouldReturnPedido() throws Exception {
        var usuario = (Usuario) auth(1L).getPrincipal();
        var cliente = new Cliente();
        cliente.setIdUsuario(1L);
        cliente.setUsuario(usuario);
        var pedido = new Pedido();
        pedido.setCliente(cliente);
        var response = new PedidoResponse();
        when(pedidoService.findById(eq(1L))).thenReturn(pedido);
        when(pedidoService.buildResponse(pedido)).thenReturn(response);

        mockMvc.perform(get("/api/pedidos/1").with(authentication(auth(1L))))
                .andExpect(status().isOk());
    }

    @Test
    void crear_shouldReturnPedido() throws Exception {
        var cliente = new Cliente();
        cliente.setIdUsuario(1L);
        var pedido = new Pedido();
        var response = new PedidoResponse();
        when(clienteService.findById(eq(1L))).thenReturn(cliente);
        when(pedidoService.crear(eq(cliente), any(PedidoRequest.class))).thenReturn(pedido);
        when(pedidoService.buildResponse(pedido)).thenReturn(response);

        mockMvc.perform(post("/api/pedidos").with(authentication(auth(1L)))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"idDireccion\":1,\"idZona\":1,\"metodoEntrega\":\"delivery\",\"detalles\":[{\"idProducto\":1,\"cantidad\":2}]}"))
                .andExpect(status().isOk());
    }

    @Test
    void cancelar_shouldReturnPedido() throws Exception {
        var usuario = (Usuario) auth(1L).getPrincipal();
        var pedido = new Pedido();
        var pedidoCliente = new Cliente();
        pedidoCliente.setIdUsuario(1L);
        pedidoCliente.setUsuario(usuario);
        pedido.setCliente(pedidoCliente);
        var response = new PedidoResponse();
        when(pedidoService.findById(eq(1L))).thenReturn(pedido);
        when(pedidoService.cancelar(pedido)).thenReturn(pedido);
        when(pedidoService.buildResponse(pedido)).thenReturn(response);

        mockMvc.perform(patch("/api/pedidos/1/cancelar").with(authentication(auth(1L)))
                        .with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    void cancelar_whenNotOwner_shouldReturn403() throws Exception {
        var otroRol = new Rol();
        otroRol.setNombreRol("CLIENTE");
        var otroUsuario = new Usuario();
        otroUsuario.setIdUsuario(2L);
        otroUsuario.setEmail("otro@test.com");
        otroUsuario.setActivo(true);
        otroUsuario.setRol(otroRol);
        var pedido = new Pedido();
        var pedidoCliente = new Cliente();
        pedidoCliente.setIdUsuario(2L);
        pedidoCliente.setUsuario(otroUsuario);
        pedido.setCliente(pedidoCliente);
        when(pedidoService.findById(eq(1L))).thenReturn(pedido);

        mockMvc.perform(patch("/api/pedidos/1/cancelar").with(authentication(auth(1L)))
                        .with(csrf()))
                .andExpect(status().isForbidden());
    }
}
