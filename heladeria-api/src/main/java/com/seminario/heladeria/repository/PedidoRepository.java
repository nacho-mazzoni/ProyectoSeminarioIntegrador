package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByClienteIdUsuarioOrderByFechaDesc(Long idUsuario);
    List<Pedido> findAllByOrderByFechaDesc();

    @Query(value = "SELECT COALESCE(SUM(total), 0) FROM pedido WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)", nativeQuery = true)
    BigDecimal sumIngresosMesActual();

    @Query(value = "SELECT p.nombre, SUM(dp.cantidad) FROM detalle_pedido dp JOIN producto p ON dp.id_producto = p.id_producto GROUP BY p.nombre ORDER BY SUM(dp.cantidad) DESC LIMIT 5", nativeQuery = true)
    List<Object[]> findProductosMasVendidos();
}
