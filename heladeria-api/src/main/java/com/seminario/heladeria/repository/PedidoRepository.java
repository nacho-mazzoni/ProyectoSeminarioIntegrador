package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByIdClienteOrderByFechaDesc(Long idCliente);
}
