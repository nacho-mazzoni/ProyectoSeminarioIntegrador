package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Producto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test-local")
@Sql(scripts = {
    "file:./tests/init/01-schema.sql",
    "file:./tests/init/02-test-seed.sql"
}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
class ProductoRepositoryTest {

    @Autowired
    private ProductoRepository productoRepository;

    @Test
    void findByIdCategoria_shouldReturnProductsForCategory() {
        List<Producto> productos = productoRepository.findByIdCategoria(1L);

        assertThat(productos).isNotEmpty();
        assertThat(productos).allMatch(p -> p.getCategoria().getIdCategoria() == 1L);
    }

    @Test
    void findByIdCategoria_shouldReturnOnlyProductsOfThatCategory() {
        List<Producto> productosHeladoPote = productoRepository.findByIdCategoria(1L);
        List<Producto> productosHeladoPalito = productoRepository.findByIdCategoria(2L);

        assertThat(productosHeladoPote).hasSize(2);
        assertThat(productosHeladoPalito).hasSize(2);
    }

    @Test
    void findByIdCategoria_shouldReturnEmptyWhenCategoryHasNoProducts() {
        List<Producto> productos = productoRepository.findByIdCategoria(999L);

        assertThat(productos).isEmpty();
    }
}
