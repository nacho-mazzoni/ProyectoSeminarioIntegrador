package com.seminario.heladeria.repository;

import com.seminario.heladeria.dto.response.DashboardResponse;
import com.seminario.heladeria.dto.response.ReporteIngresosResponse;
import com.seminario.heladeria.entity.Pedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByClienteIdUsuarioOrderByFechaDesc(Long idUsuario);
    List<Pedido> findAllByOrderByFechaDesc();
    Page<Pedido> findByFechaBetweenOrderByFechaDesc(Instant desde, Instant hasta, Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE NOT EXISTS " +
           "(SELECT h FROM HistorialEstado h WHERE h.pedido.idPedido = p.idPedido AND h.estado = 'CANCELADO')")
    BigDecimal sumIngresosSinCancelados();

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.fecha BETWEEN :desde AND :hasta")
    BigDecimal sumIngresosByFechaBetween(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    @Query("SELECT COUNT(p) FROM Pedido p WHERE p.fecha BETWEEN :desde AND :hasta")
    long countByFechaBetween(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    @Query("SELECT new com.seminario.heladeria.dto.response.ReporteIngresosResponse$IngresoDiario(" +
           "CAST(p.fecha AS string), SUM(p.total), COUNT(p)) " +
           "FROM Pedido p WHERE p.fecha BETWEEN :desde AND :hasta GROUP BY CAST(p.fecha AS string)")
    List<ReporteIngresosResponse.IngresoDiario> sumIngresosAgrupadoPorDia(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    @Query("SELECT new com.seminario.heladeria.dto.response.DashboardResponse$TopProducto(" +
           "pr.nombre, COALESCE(SUM(dp.cantidad), 0)) " +
           "FROM DetallePedido dp JOIN dp.producto pr " +
           "GROUP BY pr.idProducto, pr.nombre ORDER BY SUM(dp.cantidad) DESC")
    List<DashboardResponse.TopProducto> findTopProductos(Pageable pageable);

    boolean existsByDireccionIdDireccion(Long idDireccion);

    List<Pedido> findByDireccionIdDireccion(Long idDireccion);

    @Query(value = "SELECT COALESCE(SUM(total), 0) FROM pedido WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)", nativeQuery = true)
    BigDecimal sumIngresosMesActual();

    @Query(value = "SELECT p.nombre, SUM(dp.cantidad) FROM detalle_pedido dp JOIN producto p ON dp.id_producto = p.id_producto GROUP BY p.nombre ORDER BY SUM(dp.cantidad) DESC LIMIT 5", nativeQuery = true)
    List<Object[]> findProductosMasVendidos();
}
