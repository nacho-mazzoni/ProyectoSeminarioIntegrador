package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.CarritoItem;
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
class CarritoItemRepositoryTest {

    @Autowired
    private CarritoItemRepository carritoItemRepository;

    @Test
    void findById_shouldReturnItem() {
        Optional<CarritoItem> result = carritoItemRepository.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getCantidad()).isEqualTo(2);
        assertThat(result.get().getProducto().getIdProducto()).isEqualTo(1L);
        assertThat(result.get().getSabores()).hasSize(2);
        assertThat(result.get().getAdicionales()).hasSize(1);
    }

    @Test
    void findById_shouldReturnEmptyWhenNotFound() {
        Optional<CarritoItem> result = carritoItemRepository.findById(999L);

        assertThat(result).isEmpty();
    }
}
