package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findByClienteIdUsuario(Long idUsuario);
}
