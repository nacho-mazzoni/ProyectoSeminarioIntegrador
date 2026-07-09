package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Categoria;
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
class CategoriaRepositoryTest {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Test
    void findById_shouldReturnCategoria() {
        Optional<Categoria> result = categoriaRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getNombre()).isEqualTo("Helado Pote");
        assertThat(result.get().getRequiereSabores()).isTrue();
    }

    @Test
    void findById_shouldReturnEmptyWhenNotFound() {
        Optional<Categoria> result = categoriaRepository.findById(999L);

        assertThat(result).isEmpty();
    }

    @Test
    void findAll_shouldReturnAllCategorias() {
        var result = categoriaRepository.findAll();

        assertThat(result).hasSize(3);
    }
}
