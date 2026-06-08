package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.response.UsuarioResponse;
import com.seminario.heladeria.entity.Cliente;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.repository.ClienteRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final ClienteRepository clienteRepository;

    public AuthService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public UsuarioResponse getCurrentUser(Usuario usuario) {
        return clienteRepository.findByIdUsuario(usuario.getIdUsuario())
                .map(UsuarioResponse::fromCliente)
                .orElseGet(() -> UsuarioResponse.from(usuario));
    }
}
