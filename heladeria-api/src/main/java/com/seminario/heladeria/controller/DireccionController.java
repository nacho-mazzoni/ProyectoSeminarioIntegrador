package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.DireccionRequest;
import com.seminario.heladeria.dto.response.DireccionResponse;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.service.ClienteService;
import com.seminario.heladeria.service.DireccionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/direcciones")
@PreAuthorize("hasRole('CLIENTE')")
public class DireccionController {

    private final DireccionService direccionService;
    private final ClienteService clienteService;

    public DireccionController(DireccionService direccionService,
                               ClienteService clienteService) {
        this.direccionService = direccionService;
        this.clienteService = clienteService;
    }

    @GetMapping
    public ResponseEntity<List<DireccionResponse>> misDirecciones(
            @AuthenticationPrincipal Usuario usuario) {
        var cliente = clienteService.findById(usuario.getIdUsuario());
        var direcciones = direccionService.findByCliente(cliente.getIdUsuario())
                .stream().map(DireccionResponse::from).toList();
        return ResponseEntity.ok(direcciones);
    }

    @PostMapping
    public ResponseEntity<DireccionResponse> crear(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody DireccionRequest request) {
        var cliente = clienteService.findById(usuario.getIdUsuario());
        var direccion = direccionService.crear(cliente.getIdUsuario(), request);
        return ResponseEntity.ok(DireccionResponse.from(direccion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@AuthenticationPrincipal Usuario usuario,
                                         @PathVariable Long id) {
        var cliente = clienteService.findById(usuario.getIdUsuario());
        if (cliente == null) {
            return ResponseEntity.badRequest().build();
        }
        direccionService.eliminar(id, cliente.getIdUsuario());
        return ResponseEntity.noContent().build();
    }
}
