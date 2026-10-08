package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.ActualizarRolRequest;
import com.seminario.heladeria.dto.request.CrearUsuarioRequest;
import com.seminario.heladeria.dto.response.UsuarioResponse;
import com.seminario.heladeria.entity.Cliente;
import com.seminario.heladeria.entity.Rol;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.exception.BusinessRuleException;
import com.seminario.heladeria.exception.ResourceNotFoundException;
import com.seminario.heladeria.repository.ClienteRepository;
import com.seminario.heladeria.repository.RolRepository;
import com.seminario.heladeria.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class AdminUsuariosController {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUsuariosController(UsuarioRepository usuarioRepository,
                                   RolRepository rolRepository,
                                   ClienteRepository clienteRepository,
                                   PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/usuarios")
    @Transactional
    public ResponseEntity<UsuarioResponse> crearUsuario(
            @Valid @RequestBody CrearUsuarioRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BusinessRuleException("El email ya está registrado");
        }
        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));
        if ("Administrador".equalsIgnoreCase(rol.getNombreRol())) {
            throw new BusinessRuleException("No se puede crear un usuario con rol Administrador");
        }
        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setClave(passwordEncoder.encode(request.getPassword()));
        usuario.setActivo(true);
        usuario.setRol(rol);
        usuario = usuarioRepository.save(usuario);

        Cliente cliente = new Cliente();
        cliente.setUsuario(usuario);
        cliente.setTelefono(request.getTelefono());
        cliente = clienteRepository.save(cliente);

        return ResponseEntity.ok(UsuarioResponse.fromCliente(cliente));
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
