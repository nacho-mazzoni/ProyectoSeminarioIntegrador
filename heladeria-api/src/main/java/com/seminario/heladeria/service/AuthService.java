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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getClave())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        if (!usuario.getActivo()) {
            throw new RuntimeException("Usuario desactivado");
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
            throw new RuntimeException("El email ya está registrado");
        }

        Rol rol = rolRepository.findById(2L)
                .orElseThrow(() -> new RuntimeException("Rol Cliente no encontrado"));

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
            throw new RuntimeException("La contraseña actual no es correcta");
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
