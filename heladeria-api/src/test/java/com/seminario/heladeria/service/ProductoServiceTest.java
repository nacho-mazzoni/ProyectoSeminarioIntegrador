package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.AdicionalRequest;
import com.seminario.heladeria.dto.request.CategoriaRequest;
import com.seminario.heladeria.dto.request.ProductoRequest;
import com.seminario.heladeria.dto.request.SaborRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@Sql("/test-seed.sql")
class ProductoServiceTest {

    @Autowired
    private ProductoService productoService;

    @Test
    void findAllProductoResponses_shouldReturnAllProducts() {
        var result = productoService.findAllProductoResponses(null, null, null, null);

        assertThat(result).hasSize(5);
    }

    @Test
    void findProductoResponseById_shouldReturnProduct() {
        var result = productoService.findProductoResponseById(1L);

        assertThat(result.getNombre()).isEqualTo("Pote 1/2 Kg");
        assertThat(result.getCategoria().getNombre()).isEqualTo("Helado Pote");
    }

    @Test
    void findProductoResponseById_shouldThrowWhenNotFound() {
        assertThatThrownBy(() -> productoService.findProductoResponseById(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Producto no encontrado");
    }

    @Test
    void crearProducto_shouldCreateProduct() {
        ProductoRequest request = new ProductoRequest();
        request.setNombre("Nuevo Producto");
        request.setStockEnvases(10);
        request.setPrecioBase(new BigDecimal("3000.00"));
        request.setMaxSabores(2);
        request.setIdCategoria(1L);

        var result = productoService.crearProducto(request);

        assertThat(result.getIdProducto()).isNotNull();
        assertThat(result.getNombre()).isEqualTo("Nuevo Producto");
    }

    @Test
    void actualizarProducto_shouldUpdateProduct() {
        ProductoRequest request = new ProductoRequest();
        request.setNombre("Producto Actualizado");
        request.setStockEnvases(20);
        request.setPrecioBase(new BigDecimal("5000.00"));
        request.setMaxSabores(0);
        request.setIdCategoria(2L);

        var result = productoService.actualizarProducto(1L, request);

        assertThat(result.getNombre()).isEqualTo("Producto Actualizado");
        assertThat(result.getStockEnvases()).isEqualTo(20);
        assertThat(result.getCategoria().getNombre()).isEqualTo("Helado Palito");
    }

    @Test
    void eliminarProducto_shouldDeleteProduct() {
        productoService.eliminarProducto(5L);

        assertThatThrownBy(() -> productoService.findProductoResponseById(5L))
                .isInstanceOf(RuntimeException.class)
                 .hasMessageContaining("Producto no disponible");
    }

    @Test
    void findAllCategoriaResponses_shouldReturnAll() {
        var result = productoService.findAllCategoriaResponses();

        assertThat(result).hasSize(3);
    }

    @Test
    void crearCategoria_shouldCreate() {
        CategoriaRequest request = new CategoriaRequest();
        request.setNombre("Nueva Cat");
        request.setRequiereSabores(false);

        var result = productoService.crearCategoria(request);

        assertThat(result.getIdCategoria()).isNotNull();
        assertThat(result.getNombre()).isEqualTo("Nueva Cat");
    }

    @Test
    void findSaborResponsesDisponibles_shouldReturnOnlyAvailable() {
        var result = productoService.findSaborResponsesDisponibles();

        assertThat(result).isNotEmpty();
        assertThat(result).allMatch(s -> s.getDisponible() != null && s.getDisponible());
    }

    @Test
    void crearSabor_shouldCreate() {
        SaborRequest request = new SaborRequest();
        request.setNombre("Nuevo Sabor");
        request.setStockBaldes(5);
        request.setDisponible(true);
        request.setCapBalde("3L");

        var result = productoService.crearSabor(request);

        assertThat(result.getIdSabor()).isNotNull();
        assertThat(result.getNombre()).isEqualTo("Nuevo Sabor");
    }

    @Test
    void findAdicionalResponsesDisponibles_shouldReturnOnlyAvailable() {
        var result = productoService.findAdicionalResponsesDisponibles();

        assertThat(result).isNotEmpty();
        assertThat(result).allMatch(a -> a.getDisponible() != null && a.getDisponible());
    }

    @Test
    void crearAdicional_shouldCreate() {
        AdicionalRequest request = new AdicionalRequest();
        request.setNombre("Nuevo Adicional");
        request.setPrecioExtra(new BigDecimal("300.00"));
        request.setDisponible(true);

        var result = productoService.crearAdicional(request);

        assertThat(result.getIdAdicional()).isNotNull();
        assertThat(result.getNombre()).isEqualTo("Nuevo Adicional");
    }
}
