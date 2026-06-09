package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.ActualizarRolRequest;
import com.seminario.heladeria.dto.response.UsuarioResponse;
import com.seminario.heladeria.service.AdminUsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/usuarios")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class AdminUsuarioController {

    private final AdminUsuarioService adminUsuarioService;

    public AdminUsuarioController(AdminUsuarioService adminUsuarioService) {
        this.adminUsuarioService = adminUsuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listar() {
        return ResponseEntity.ok(adminUsuarioService.listarUsuarios());
    }

    @PutMapping("/{id}/rol")
    public ResponseEntity<UsuarioResponse> actualizarRol(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarRolRequest request) {
        return ResponseEntity.ok(adminUsuarioService.actualizarRol(id, request.getIdRol()));
    }

    @PutMapping("/by-email/{email}/rol")
    public ResponseEntity<UsuarioResponse> actualizarRolPorEmail(
            @PathVariable String email,
            @Valid @RequestBody ActualizarRolRequest request) {
        return ResponseEntity.ok(adminUsuarioService.actualizarRolPorEmail(email, request.getIdRol()));
    }
}
