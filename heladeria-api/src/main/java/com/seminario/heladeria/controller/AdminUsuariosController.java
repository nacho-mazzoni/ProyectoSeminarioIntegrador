package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.ActualizarRolRequest;
import com.seminario.heladeria.dto.response.UsuarioResponse;
import com.seminario.heladeria.entity.Rol;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.exception.ResourceNotFoundException;
import com.seminario.heladeria.repository.RolRepository;
import com.seminario.heladeria.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class AdminUsuariosController {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    public AdminUsuariosController(UsuarioRepository usuarioRepository,
                                   RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
    }

    @PutMapping("/usuarios/{id}/rol")
    public ResponseEntity<UsuarioResponse> actualizarRol(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarRolRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));
        usuario.setRol(rol);
        usuario = usuarioRepository.save(usuario);
        return ResponseEntity.ok(UsuarioResponse.from(usuario));
    }

    @PutMapping("/usuarios/{id}/activo")
    public ResponseEntity<UsuarioResponse> toggleActivo(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        usuario.setActivo(!usuario.getActivo());
        usuario = usuarioRepository.save(usuario);
        return ResponseEntity.ok(UsuarioResponse.from(usuario));
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Rol>> listarRoles() {
        return ResponseEntity.ok(rolRepository.findAll());
    }
}
