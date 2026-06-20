package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void findByEmail_shouldReturnUserWhenExists() {
        Optional<Usuario> result = usuarioRepository.findByEmail("cliente@test.com");

        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("cliente@test.com");
        assertThat(result.get().getActivo()).isTrue();
    }

    @Test
    void findByEmail_shouldReturnEmptyWhenEmailNotExists() {
        Optional<Usuario> result = usuarioRepository.findByEmail("noexiste@test.com");

        assertThat(result).isEmpty();
    }

    @Test
    void findByEmail_shouldReturnAdminUser() {
        Optional<Usuario> result = usuarioRepository.findByEmail("admin@heladeria.com");

        assertThat(result).isPresent();
        assertThat(result.get().getRol().getNombreRol()).isEqualTo("Administrador");
    }
}
