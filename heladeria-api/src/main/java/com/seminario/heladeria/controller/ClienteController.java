package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.ClienteRequest;
import com.seminario.heladeria.dto.response.UsuarioResponse;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> registrar(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody ClienteRequest request) {
        var cliente = clienteService.crearOCargar(usuario, request.getTelefono());
        return ResponseEntity.ok(UsuarioResponse.fromCliente(cliente));
    }

    @PutMapping
    public ResponseEntity<UsuarioResponse> actualizar(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody ClienteRequest request) {
        var cliente = clienteService.actualizar(usuario.getIdUsuario(), request.getTelefono());
        return ResponseEntity.ok(UsuarioResponse.fromCliente(cliente));
    }
}
