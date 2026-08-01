package com.seminario.heladeria.service;

import com.seminario.heladeria.entity.Cliente;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.repository.ClienteRepository;
import com.seminario.heladeria.repository.UsuarioRepository;
import com.seminario.heladeria.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    public ClienteService(ClienteRepository clienteRepository,
                          UsuarioRepository usuarioRepository) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Cliente findById(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
    }

    @Transactional
    public Cliente crearOCargar(Usuario usuario, String telefono) {
        return clienteRepository.findByIdUsuario(usuario.getIdUsuario())
                .orElseGet(() -> {
                    Cliente cliente = new Cliente();
                    cliente.setUsuario(usuario);
                    cliente.setTelefono(telefono);
                    return clienteRepository.save(cliente);
                });
    }

    @Transactional
    public Cliente actualizar(Long idUsuario, String telefono) {
        Cliente cliente = clienteRepository.findByIdUsuario(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
        cliente.setTelefono(telefono);
        return clienteRepository.save(cliente);
    }
}
