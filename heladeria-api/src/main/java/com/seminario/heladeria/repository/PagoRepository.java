package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PagoRepository extends JpaRepository<Pago, Long> {
    Optional<Pago> findByPedidoIdPedido(Long idPedido);
}
