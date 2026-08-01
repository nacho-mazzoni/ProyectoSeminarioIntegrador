package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Rol;
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
@Sql("/test-seed.sql")
class RolRepositoryTest {

    @Autowired
    private RolRepository rolRepository;

    @Test
    void findById_shouldReturnAdminRole() {
        Optional<Rol> result = rolRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getNombreRol()).isEqualTo("Administrador");
    }

    @Test
    void findById_shouldReturnClienteRole() {
        Optional<Rol> result = rolRepository.findById(2L);

        assertThat(result).isPresent();
        assertThat(result.get().getNombreRol()).isEqualTo("Cliente");
    }

    @Test
    void findById_shouldReturnEmptyWhenNotFound() {
        Optional<Rol> result = rolRepository.findById(999L);

        assertThat(result).isEmpty();
    }

    @Test
    void findAll_shouldReturnBothRoles() {
        var result = rolRepository.findAll();

        assertThat(result).hasSize(2);
    }
}
