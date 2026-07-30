package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.LoginRequest;
import com.seminario.heladeria.dto.request.RegisterRequest;
import com.seminario.heladeria.dto.response.AuthResponse;
import com.seminario.heladeria.dto.response.UsuarioResponse;
import com.seminario.heladeria.entity.Cliente;
import com.seminario.heladeria.entity.Rol;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.repository.ClienteRepository;
import com.seminario.heladeria.repository.RolRepository;
import com.seminario.heladeria.repository.UsuarioRepository;
import com.seminario.heladeria.security.JwtTokenProvider;
import com.seminario.heladeria.exception.BusinessRuleException;
import com.seminario.heladeria.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final RolRepository rolRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository,
                       ClienteRepository clienteRepository,
                       RolRepository rolRepository,
                       JwtTokenProvider tokenProvider,
                       PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.rolRepository = rolRepository;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.error("Intento de login con email no registrado: {}", request.getEmail());
                    return new BusinessRuleException("Credenciales inválidas");
                });

        if (!passwordEncoder.matches(request.getPassword(), usuario.getClave())) {
            log.error("Contraseña incorrecta para: {}", request.getEmail());
            throw new BusinessRuleException("Credenciales inválidas");
        }

        if (!usuario.getActivo()) {
            log.error("Usuario desactivado: {}", request.getEmail());
            throw new BusinessRuleException("Usuario desactivado");
        }

        String token = tokenProvider.generateToken(usuario);
        UsuarioResponse userResponse = clienteRepository.findByIdUsuario(usuario.getIdUsuario())
                .map(UsuarioResponse::fromCliente)
                .orElseGet(() -> UsuarioResponse.from(usuario));

        return new AuthResponse(token, userResponse);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            log.error("Registro con email ya existente: {}", request.getEmail());
            throw new BusinessRuleException("El email ya está registrado");
        }

        Rol rol = rolRepository.findById(2L)
                .orElseThrow(() -> {
                    log.error("Rol Cliente (id=2) no encontrado en la base de datos");
                    return new ResourceNotFoundException("Rol Cliente no encontrado");
                });

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setClave(passwordEncoder.encode(request.getPassword()));
        usuario.setActivo(true);
        usuario.setRol(rol);
        usuario = usuarioRepository.save(usuario);

        Cliente cliente = new Cliente();
        cliente.setUsuario(usuario);
        cliente.setTelefono(request.getTelefono());
        clienteRepository.save(cliente);

        String token = tokenProvider.generateToken(usuario);

        return new AuthResponse(token, UsuarioResponse.fromCliente(cliente));
    }

    public UsuarioResponse getCurrentUser(Usuario usuario) {
        return clienteRepository.findByIdUsuario(usuario.getIdUsuario())
                .map(UsuarioResponse::fromCliente)
                .orElseGet(() -> UsuarioResponse.from(usuario));
    }

    @Transactional
    public void cambiarPassword(Usuario usuario, String passwordActual, String passwordNueva) {
        if (!passwordEncoder.matches(passwordActual, usuario.getClave())) {
            log.error("Cambio de contraseña fallido para usuario: {}", usuario.getEmail());
            throw new BusinessRuleException("La contraseña actual no es correcta");
        }
        usuario.setClave(passwordEncoder.encode(passwordNueva));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void eliminarCuenta(Usuario usuario) {
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }
}
