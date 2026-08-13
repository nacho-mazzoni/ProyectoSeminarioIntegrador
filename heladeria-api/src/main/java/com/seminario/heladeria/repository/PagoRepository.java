package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;

import java.util.Optional;

public interface PagoRepository extends JpaRepository<Pago, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Pago> findByPedidoIdPedido(Long idPedido);
}
