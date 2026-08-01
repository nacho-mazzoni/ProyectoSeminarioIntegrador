package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.CarritoItemRequest;
import com.seminario.heladeria.dto.request.CheckoutRequest;
import com.seminario.heladeria.entity.Cliente;
import com.seminario.heladeria.entity.Rol;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.repository.ClienteRepository;
import com.seminario.heladeria.repository.RolRepository;
import com.seminario.heladeria.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@Sql("/test-seed.sql")
class CarritoServiceTest {

    @Autowired
    private CarritoService carritoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private RolRepository rolRepository;

    @Test
    void obtenerOCrear_shouldReturnExistingCarrito() {
        Usuario usuario = usuarioRepository.findById(2L).orElseThrow();

        var carrito = carritoService.obtenerOCrear(usuario);

        assertThat(carrito).isNotNull();
        assertThat(carrito.getIdCarrito()).isEqualTo(1L);
    }

    @Test
    void obtenerOCrear_shouldCreateNewCarritoWhenNoneExists() {
        Rol rol = rolRepository.findById(2L).orElseThrow();
        Usuario usuario = new Usuario();
        usuario.setEmail("nuevocliente@test.com");
        usuario.setClave("pass");
        usuario.setActivo(true);
        usuario.setRol(rol);
        final Usuario saved = usuarioRepository.save(usuario);

        Cliente cliente = new Cliente();
        cliente.setUsuario(saved);
        clienteRepository.save(cliente);

        var carrito = carritoService.obtenerOCrear(saved);

        assertThat(carrito).isNotNull();
        assertThat(carrito.getIdCarrito()).isNotNull();
        assertThat(carrito.getCliente().getIdUsuario()).isEqualTo(saved.getIdUsuario());
    }

    @Test
    void agregarItem_shouldAddItemToCarrito() {
        Usuario usuario = usuarioRepository.findById(2L).orElseThrow();

        CarritoItemRequest request = new CarritoItemRequest();
        request.setIdProducto(3L);
        request.setCantidad(3);

        var item = carritoService.agregarItem(usuario, request);

        assertThat(item.getIdItem()).isNotNull();
        assertThat(item.getProducto().getIdProducto()).isEqualTo(3L);
        assertThat(item.getCantidad()).isEqualTo(3);
    }

    @Test
    void agregarItem_shouldAddItemWithSabores() {
        Usuario usuario = usuarioRepository.findById(2L).orElseThrow();

        CarritoItemRequest request = new CarritoItemRequest();
        request.setIdProducto(1L);
        request.setCantidad(1);
        request.setIdsSabor(List.of(1L, 2L));

        var item = carritoService.agregarItem(usuario, request);

        assertThat(item.getSabores()).hasSize(2);
    }

    @Test
    void agregarItem_shouldThrowWhenProductNotFound() {
        Usuario usuario = usuarioRepository.findById(2L).orElseThrow();

        CarritoItemRequest request = new CarritoItemRequest();
        request.setIdProducto(999L);
        request.setCantidad(1);

        assertThatThrownBy(() -> carritoService.agregarItem(usuario, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Producto no encontrado");
    }

    @Test
    void checkout_shouldThrowWhenCarritoEmpty() {
        Rol rol = rolRepository.findById(2L).orElseThrow();
        Usuario usuario = new Usuario();
        usuario.setEmail("emptycart@test.com");
        usuario.setClave("pass");
        usuario.setActivo(true);
        usuario.setRol(rol);
        final Usuario saved = usuarioRepository.save(usuario);

        Cliente cliente = new Cliente();
        cliente.setUsuario(saved);
        clienteRepository.save(cliente);

        CheckoutRequest request = new CheckoutRequest();
        request.setMetodoEntrega("retiro");
        request.setIdDireccion(1L);

        assertThatThrownBy(() -> carritoService.checkout(saved, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("vac");
    }
}
