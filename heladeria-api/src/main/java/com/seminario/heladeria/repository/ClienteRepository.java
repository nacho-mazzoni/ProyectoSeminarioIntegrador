package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByIdUsuario(Long idUsuario);
}
