package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.ActualizarRolRequest;
import com.seminario.heladeria.dto.response.UsuarioResponse;
import com.seminario.heladeria.entity.Rol;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.exception.ResourceNotFoundException;
import com.seminario.heladeria.repository.RolRepository;
import com.seminario.heladeria.repository.UsuarioRepository;
import com.seminario.heladeria.repository.ClienteRepository;
import com.seminario.heladeria.entity.Cliente;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.seminario.heladeria.dto.request.UsuarioRequest;
import com.seminario.heladeria.dto.response.RolResponse;
import com.seminario.heladeria.exception.BusinessRuleException;
import java.util.Locale;
import java.util.Set;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class AdminUsuariosController {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final ClienteRepository clienteRepository;

    public AdminUsuariosController(UsuarioRepository usuarioRepository,
                                   RolRepository rolRepository, PasswordEncoder passwordEncoder,
                                   ClienteRepository clienteRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.clienteRepository = clienteRepository;
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioResponse> crear(@Valid @RequestBody UsuarioRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (usuarioRepository.findByEmail(email).isPresent()) {
            throw new BusinessRuleException("El email ya está registrado");
        }
        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));
        validarRolPermitido(rol);
        Usuario usuario = new Usuario();
        usuario.setEmail(email);
        usuario.setClave(passwordEncoder.encode(request.getPassword()));
        usuario.setActivo(true);
        usuario.setRol(rol);
        usuario = usuarioRepository.save(usuario);
        if (rol.getNombreRol().equalsIgnoreCase("cliente")) {
            Cliente cliente = new Cliente();
            cliente.setUsuario(usuario);
            clienteRepository.save(cliente);
        }
        return ResponseEntity.ok(UsuarioResponse.from(usuario));
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioResponse> actualizar(@PathVariable Long id,
                                                       @Valid @RequestBody UsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        usuarioRepository.findByEmail(email).ifPresent(otro -> {
            if (!otro.getIdUsuario().equals(id)) {
                throw new BusinessRuleException("El email ya está registrado");
            }
        });
        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));
        validarRolPermitido(rol);
        usuario.setEmail(email);
        usuario.setClave(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);
        return ResponseEntity.ok(UsuarioResponse.from(usuarioRepository.save(usuario)));
    }

    @PutMapping("/usuarios/{id}/rol")
    public ResponseEntity<UsuarioResponse> actualizarRol(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarRolRequest request,
            @AuthenticationPrincipal Usuario actual) {
        if (actual != null && id.equals(actual.getIdUsuario()) && !request.getIdRol().equals(actual.getRol().getIdRol())) {
            throw new BusinessRuleException("No podés quitarte tus propios permisos");
        }
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));
        validarRolPermitido(rol);
        usuario.setRol(rol);
        usuario = usuarioRepository.save(usuario);
        return ResponseEntity.ok(UsuarioResponse.from(usuario));
    }

    @PutMapping("/usuarios/{id}/activo")
    public ResponseEntity<UsuarioResponse> toggleActivo(@PathVariable Long id,
                                                        @AuthenticationPrincipal Usuario actual) {
        if (actual != null && id.equals(actual.getIdUsuario())) {
            throw new BusinessRuleException("No podés desactivar tu propio usuario");
        }
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        usuario.setActivo(!usuario.getActivo());
        usuario = usuarioRepository.save(usuario);
        return ResponseEntity.ok(UsuarioResponse.from(usuario));
    }

    @GetMapping("/roles")
    public ResponseEntity<List<RolResponse>> listarRoles() {
        return ResponseEntity.ok(rolRepository.findAll().stream()
                .filter(rol -> Set.of("CLIENTE", "CAJERO", "ADMINISTRADOR")
                        .contains(rol.getNombreRol().trim().toUpperCase(Locale.ROOT)))
                .map(RolResponse::from).toList());
    }

    private void validarRolPermitido(Rol rol) {
        String nombre = rol.getNombreRol().trim().toUpperCase(Locale.ROOT);
        if (!Set.of("CLIENTE", "CAJERO", "ADMINISTRADOR").contains(nombre)) {
            throw new BusinessRuleException("Rol no permitido");
        }
    }
}
