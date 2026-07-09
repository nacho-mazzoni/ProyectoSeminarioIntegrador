package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.CambioPasswordRequest;
import com.seminario.heladeria.dto.request.LoginRequest;
import com.seminario.heladeria.dto.request.RegisterRequest;
import com.seminario.heladeria.entity.Rol;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.repository.RolRepository;
import com.seminario.heladeria.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@Sql("/test-seed.sql")
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void register_shouldCreateUserAndCliente() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("nuevo@test.com");
        request.setPassword("password123");
        request.setTelefono("111222333");

        var response = authService.register(request);

        assertThat(response.getToken()).isNotBlank();
        assertThat(response.getUsuario().getEmail()).isEqualTo("nuevo@test.com");
        assertThat(response.getUsuario().getTelefono()).isEqualTo("111222333");

        Usuario saved = usuarioRepository.findByEmail("nuevo@test.com").orElseThrow();
        assertThat(saved.getActivo()).isTrue();
        assertThat(passwordEncoder.matches("password123", saved.getClave())).isTrue();
    }

    @Test
    void register_shouldThrowWhenEmailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("cliente@test.com");
        request.setPassword("password123");

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("email ya est");
    }

    @Test
    void login_shouldSucceedWithValidCredentials() {
        String email = "loginuser@test.com";
        String password = "testpass123";

        Rol rol = rolRepository.findById(2L).orElseThrow();
        Usuario usuario = new Usuario();
        usuario.setEmail(email);
        usuario.setClave(passwordEncoder.encode(password));
        usuario.setActivo(true);
        usuario.setRol(rol);
        usuarioRepository.save(usuario);

        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setPassword(password);

        var response = authService.login(request);

        assertThat(response.getToken()).isNotBlank();
        assertThat(response.getUsuario().getEmail()).isEqualTo(email);
    }

    @Test
    void login_shouldThrowWithWrongPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("cliente@test.com");
        request.setPassword("wrongpassword");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Credenciales");
    }

    @Test
    void login_shouldThrowWhenUserInactive() {
        Rol rol = rolRepository.findById(2L).orElseThrow();
        Usuario usuario = new Usuario();
        usuario.setEmail("inactive@test.com");
        usuario.setClave(passwordEncoder.encode("pass123"));
        usuario.setActivo(false);
        usuario.setRol(rol);
        usuarioRepository.save(usuario);

        LoginRequest request = new LoginRequest();
        request.setEmail("inactive@test.com");
        request.setPassword("pass123");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("desactivado");
    }

    @Test
    void cambiarPassword_shouldUpdatePassword() {
        String email = "changepass@test.com";
        String oldPassword = "oldpass123";
        String newPassword = "newpass456";

        Rol rol = rolRepository.findById(2L).orElseThrow();
        Usuario usuario = new Usuario();
        usuario.setEmail(email);
        usuario.setClave(passwordEncoder.encode(oldPassword));
        usuario.setActivo(true);
        usuario.setRol(rol);
        usuario = usuarioRepository.save(usuario);

        authService.cambiarPassword(usuario, oldPassword, newPassword);

        Usuario updated = usuarioRepository.findByEmail(email).orElseThrow();
        assertThat(passwordEncoder.matches(newPassword, updated.getClave())).isTrue();
    }

    @Test
    void cambiarPassword_shouldThrowWhenCurrentPasswordWrong() {
        Rol rol = rolRepository.findById(2L).orElseThrow();
        Usuario usuario = new Usuario();
        usuario.setEmail("wrongpass@test.com");
        usuario.setClave(passwordEncoder.encode("realpass"));
        usuario.setActivo(true);
        usuario.setRol(rol);
        final Usuario saved = usuarioRepository.save(usuario);

        assertThatThrownBy(() -> authService.cambiarPassword(saved, "wrong", "newpass"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("contrase");
    }

    @Test
    void eliminarCuenta_shouldDeactivateUser() {
        Rol rol = rolRepository.findById(2L).orElseThrow();
        Usuario usuario = new Usuario();
        usuario.setEmail("delete@test.com");
        usuario.setClave("pass");
        usuario.setActivo(true);
        usuario.setRol(rol);
        usuario = usuarioRepository.save(usuario);

        authService.eliminarCuenta(usuario);

        Usuario updated = usuarioRepository.findByEmail("delete@test.com").orElseThrow();
        assertThat(updated.getActivo()).isFalse();
    }
}
