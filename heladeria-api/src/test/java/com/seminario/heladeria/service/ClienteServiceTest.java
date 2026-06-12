package com.seminario.heladeria.service;

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
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test-local")
@Transactional
class ClienteServiceTest {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private RolRepository rolRepository;

    @Test
    void crearOCargar_shouldCreateNewCliente() {
        Rol rol = rolRepository.findById(2L).orElseThrow();

        Usuario usuario = new Usuario();
        usuario.setEmail("nuevo@test.com");
        usuario.setClave("test123");
        usuario.setActivo(true);
        usuario.setRol(rol);
        usuario = usuarioRepository.save(usuario);

        Cliente resultado = clienteService.crearOCargar(usuario, "987654321");

        assertThat(resultado).isNotNull();
        assertThat(resultado.getIdUsuario()).isEqualTo(usuario.getIdUsuario());
        assertThat(resultado.getTelefono()).isEqualTo("987654321");
    }

    @Test
    void crearOCargar_shouldReturnExistingClienteWithoutDuplicating() {
        Rol rol = rolRepository.findById(2L).orElseThrow();

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail("otro@test.com");
        nuevoUsuario.setClave("test123");
        nuevoUsuario.setActivo(true);
        nuevoUsuario.setRol(rol);
        nuevoUsuario = usuarioRepository.save(nuevoUsuario);

        Cliente primero = clienteService.crearOCargar(nuevoUsuario, "111111");
        Cliente segundo = clienteService.crearOCargar(nuevoUsuario, "222222");

        assertThat(segundo.getIdUsuario()).isEqualTo(primero.getIdUsuario());
        assertThat(segundo.getTelefono()).isEqualTo("111111");
        assertThat(clienteRepository.count()).isEqualTo(2);
    }

    @Test
    void findById_shouldReturnCliente() {
        Cliente cliente = clienteService.findById(2L);

        assertThat(cliente).isNotNull();
        assertThat(cliente.getIdUsuario()).isEqualTo(2L);
    }

    @Test
    void findById_shouldThrowWhenNotFound() {
        org.junit.jupiter.api.Assertions.assertThrows(
                RuntimeException.class,
                () -> clienteService.findById(999L)
        );
    }
}
