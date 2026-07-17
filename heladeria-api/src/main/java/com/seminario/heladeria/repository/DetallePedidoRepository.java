package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
    List<DetallePedido> findByPedidoIdPedido(Long idPedido);
    void deleteByPedidoIdPedido(Long idPedido);
}
