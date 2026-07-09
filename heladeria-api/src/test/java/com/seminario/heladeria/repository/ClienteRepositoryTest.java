package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Cliente;
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
class ClienteRepositoryTest {

    @Autowired
    private ClienteRepository clienteRepository;

    @Test
    void findById_shouldReturnCliente() {
        Optional<Cliente> result = clienteRepository.findById(2L);

        assertThat(result).isPresent();
        assertThat(result.get().getTelefono()).isEqualTo("123456789");
    }

    @Test
    void findById_shouldReturnEmptyWhenNotFound() {
        Optional<Cliente> result = clienteRepository.findById(999L);

        assertThat(result).isEmpty();
    }

    @Test
    void findByIdUsuario_shouldReturnCliente() {
        Optional<Cliente> result = clienteRepository.findByIdUsuario(2L);

        assertThat(result).isPresent();
        assertThat(result.get().getIdUsuario()).isEqualTo(2L);
    }
}
