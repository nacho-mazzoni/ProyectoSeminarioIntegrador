package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.DireccionRequest;
import com.seminario.heladeria.entity.Direccion;
import com.seminario.heladeria.repository.DireccionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class DireccionServiceTest {

    @Autowired
    private DireccionService direccionService;

    @Autowired
    private DireccionRepository direccionRepository;

    @Test
    void crear_shouldCreateDireccionSuccessfully() {
        DireccionRequest request = new DireccionRequest();
        request.setCalle("Calle Test");
        request.setNumero("789");
        request.setCiudad("Springfield");
        request.setIdZona(1L);

        Direccion direccion = direccionService.crear(2L, request);

        assertThat(direccion.getIdDireccion()).isNotNull();
        assertThat(direccion.getCalle()).isEqualTo("Calle Test");
        assertThat(direccion.getCliente().getIdUsuario()).isEqualTo(2L);
        assertThat(direccion.getZonaEnvio().getIdZona()).isEqualTo(1L);
    }

    @Test
    void crear_shouldThrowWhenZonaNotFound() {
        DireccionRequest request = new DireccionRequest();
        request.setCalle("Calle Test");
        request.setNumero("789");
        request.setCiudad("Springfield");
        request.setIdZona(999L);

        assertThatThrownBy(() -> direccionService.crear(2L, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Zona");
    }

    @Test
    void crear_shouldThrowWhenClienteNotFound() {
        DireccionRequest request = new DireccionRequest();
        request.setCalle("Calle Test");
        request.setNumero("789");
        request.setCiudad("Springfield");
        request.setIdZona(1L);

        assertThatThrownBy(() -> direccionService.crear(999L, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Cliente no encontrado");
    }

    @Test
    void findById_shouldReturnDireccion() {
        Direccion direccion = direccionService.findById(1L);

        assertThat(direccion).isNotNull();
        assertThat(direccion.getIdDireccion()).isEqualTo(1L);
    }

    @Test
    void findByCliente_shouldReturnDireccionesForCliente() {
        List<Direccion> direcciones = direccionService.findByCliente(2L);

        assertThat(direcciones).hasSize(2);
    }

    @Test
    void eliminar_shouldRemoveDireccion() {
        direccionService.eliminar(1L);

        assertThat(direccionRepository.findById(1L)).isEmpty();
    }
}
