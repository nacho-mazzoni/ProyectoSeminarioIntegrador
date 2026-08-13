package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.CambioPasswordRequest;
import com.seminario.heladeria.dto.request.ClienteRequest;
import com.seminario.heladeria.dto.response.UsuarioResponse;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.service.AuthService;
import com.seminario.heladeria.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/clientes")
@PreAuthorize("hasRole('CLIENTE')")
public class ClienteController {

    private final ClienteService clienteService;
    private final AuthService authService;

    public ClienteController(ClienteService clienteService,
                             AuthService authService) {
        this.clienteService = clienteService;
        this.authService = authService;
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

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> cambiarPassword(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody CambioPasswordRequest request) {
        authService.cambiarPassword(usuario, request.getPasswordActual(), request.getPasswordNueva());
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada"));
    }

    @DeleteMapping("/cuenta")
    public ResponseEntity<Map<String, String>> eliminarCuenta(
            @AuthenticationPrincipal Usuario usuario) {
        authService.eliminarCuenta(usuario);
        return ResponseEntity.ok(Map.of("mensaje", "Cuenta eliminada"));
    }
}
