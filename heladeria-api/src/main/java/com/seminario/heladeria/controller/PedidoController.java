package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.PedidoRequest;
import com.seminario.heladeria.dto.response.PedidoResponse;
import com.seminario.heladeria.entity.Pedido;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.service.ClienteService;
import com.seminario.heladeria.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;
    private final ClienteService clienteService;

    public PedidoController(PedidoService pedidoService,
                            ClienteService clienteService) {
        this.pedidoService = pedidoService;
        this.clienteService = clienteService;
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listar(
            @AuthenticationPrincipal Usuario usuario) {
        var cliente = clienteService.findById(usuario.getIdUsuario());
        var pedidos = pedidoService.findByCliente(cliente.getIdUsuario());
        var responses = pedidos.stream()
                .map(pedidoService::buildResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> obtener(@PathVariable Long id) {
        Pedido pedido = pedidoService.findById(id);
        return ResponseEntity.ok(pedidoService.buildResponse(pedido));
    }

    @PostMapping
    public ResponseEntity<PedidoResponse> crear(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody PedidoRequest request) {
        var cliente = clienteService.findById(usuario.getIdUsuario());
        Pedido pedido = pedidoService.crear(cliente, request);
        return ResponseEntity.ok(pedidoService.buildResponse(pedido));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<PedidoResponse> cancelar(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long id) {
        Pedido pedido = pedidoService.findById(id);
        if (!pedido.getCliente().getIdUsuario().equals(usuario.getIdUsuario())) {
            return ResponseEntity.status(403).build();
        }
        pedido = pedidoService.cancelar(pedido);
        return ResponseEntity.ok(pedidoService.buildResponse(pedido));
    }
}
