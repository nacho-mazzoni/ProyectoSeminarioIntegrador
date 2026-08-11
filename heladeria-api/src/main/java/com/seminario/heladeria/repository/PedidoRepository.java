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

    @Query(value = """
        SELECT COALESCE(SUM(p.total), 0) FROM pedido p
        WHERE p.id_pedido IN (
          SELECT latest.id_pedido FROM (
            SELECT DISTINCT ON (id_pedido) id_pedido, estado, fecha_hora
            FROM historial_estado
            ORDER BY id_pedido, fecha_hora DESC
          ) latest
          WHERE latest.estado = 'ENTREGADO'
        )
        """, nativeQuery = true)
    BigDecimal sumIngresosSinCancelados();

    @Query(value = """
        SELECT COALESCE(SUM(p.total), 0) FROM pedido p
        WHERE p.id_pedido IN (
          SELECT latest.id_pedido FROM (
            SELECT DISTINCT ON (id_pedido) id_pedido, estado, fecha_hora
            FROM historial_estado
            ORDER BY id_pedido, fecha_hora DESC
          ) latest
          WHERE latest.estado = 'ENTREGADO'
            AND latest.fecha_hora BETWEEN :desde AND :hasta
        )
        """, nativeQuery = true)
    BigDecimal sumIngresosByFechaBetween(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    @Query(value = """
        SELECT COUNT(*) FROM (
          SELECT latest.id_pedido FROM (
            SELECT DISTINCT ON (id_pedido) id_pedido, estado, fecha_hora
            FROM historial_estado
            ORDER BY id_pedido, fecha_hora DESC
          ) latest
          WHERE latest.estado = 'ENTREGADO'
            AND latest.fecha_hora BETWEEN :desde AND :hasta
        ) sub
        """, nativeQuery = true)
    long countByFechaBetween(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    @Query(value = """
        SELECT to_char(latest.fecha_hora, 'YYYY-MM-DD') AS fecha,
               COALESCE(SUM(p.total), 0) AS total,
               COUNT(p.id_pedido) AS cantidad
        FROM pedido p
        JOIN (
          SELECT DISTINCT ON (id_pedido) id_pedido, estado, fecha_hora
          FROM historial_estado
          ORDER BY id_pedido, fecha_hora DESC
        ) latest ON latest.id_pedido = p.id_pedido AND latest.estado = 'ENTREGADO'
        WHERE latest.fecha_hora BETWEEN :desde AND :hasta
        GROUP BY to_char(latest.fecha_hora, 'YYYY-MM-DD')
        ORDER BY fecha ASC
        """, nativeQuery = true)
    List<ReporteIngresosResponse.IngresoDiario> sumIngresosAgrupadoPorDia(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    @Query("SELECT new com.seminario.heladeria.dto.response.DashboardResponse$TopProducto(" +
           "pr.nombre, COALESCE(SUM(dp.cantidad), 0)) " +
           "FROM DetallePedido dp JOIN dp.producto pr " +
           "GROUP BY pr.idProducto, pr.nombre ORDER BY SUM(dp.cantidad) DESC")
    List<DashboardResponse.TopProducto> findTopProductos(Pageable pageable);

    boolean existsByDireccionIdDireccion(Long idDireccion);

    List<Pedido> findByDireccionIdDireccion(Long idDireccion);

    @Query(value = """
        SELECT COALESCE(SUM(p.total), 0) FROM pedido p
        WHERE p.id_pedido IN (
          SELECT latest.id_pedido FROM (
            SELECT DISTINCT ON (id_pedido) id_pedido, estado, fecha_hora
            FROM historial_estado
            ORDER BY id_pedido, fecha_hora DESC
          ) latest
          WHERE latest.estado = 'ENTREGADO'
            AND date_trunc('month', latest.fecha_hora) = date_trunc('month', CURRENT_DATE)
        )
        """, nativeQuery = true)
    BigDecimal sumIngresosMesActual();

    @Query(value = """
        WITH meses AS (
          SELECT generate_series(
            date_trunc('month', CAST(:desde AS timestamptz)),
            date_trunc('month', CAST(:hasta AS timestamptz)),
            interval '1 month'
          ) AS mes
        )
        SELECT to_char(m.mes, 'YYYY-MM') AS mes,
               COALESCE(SUM(p.total), 0) AS total,
               COUNT(p.id_pedido) AS cantidad
        FROM meses m
        LEFT JOIN (
          SELECT p.id_pedido, p.total, latest.fecha_hora AS entrega
          FROM pedido p
          JOIN (
            SELECT DISTINCT ON (id_pedido) id_pedido, estado, fecha_hora
            FROM historial_estado
            ORDER BY id_pedido, fecha_hora DESC
          ) latest ON latest.id_pedido = p.id_pedido AND latest.estado = 'ENTREGADO'
        ) p ON date_trunc('month', p.entrega) = m.mes
        GROUP BY m.mes
        ORDER BY m.mes ASC
        """, nativeQuery = true)
    List<Object[]> sumIngresosPorMes(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    @Query(value = "SELECT p.nombre, SUM(dp.cantidad) FROM detalle_pedido dp JOIN producto p ON dp.id_producto = p.id_producto GROUP BY p.nombre ORDER BY SUM(dp.cantidad) DESC LIMIT 5", nativeQuery = true)
    List<Object[]> findProductosMasVendidos();
}
