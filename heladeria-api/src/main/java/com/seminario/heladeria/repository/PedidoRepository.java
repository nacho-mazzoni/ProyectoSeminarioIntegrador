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
    List<Pedido> findByFechaGreaterThanEqualAndFechaLessThanOrderByFechaDesc(Instant desde, Instant hasta);

    @Query(value = """
        SELECT p.* FROM pedido p
        JOIN (SELECT DISTINCT ON (id_pedido) id_pedido, estado FROM historial_estado ORDER BY id_pedido, fecha_hora DESC, id_hist DESC) h
          ON h.id_pedido = p.id_pedido
        WHERE p.fecha >= :desde AND p.fecha < :hasta
          AND (:estado IS NULL OR h.estado = :estado)
        ORDER BY p.fecha DESC
        """, nativeQuery = true)
    List<Pedido> findAdminPedidos(@Param("desde") Instant desde, @Param("hasta") Instant hasta, @Param("estado") String estado);
    Page<Pedido> findByFechaBetweenOrderByFechaDesc(Instant desde, Instant hasta, Pageable pageable);

    @Query(value = """
        SELECT p.* FROM pedido p
        JOIN (SELECT DISTINCT ON (id_pedido) id_pedido, estado, fecha_hora
              FROM historial_estado ORDER BY id_pedido, fecha_hora DESC, id_hist DESC) h
          ON h.id_pedido = p.id_pedido
        WHERE h.estado = 'ENTREGADO' AND h.fecha_hora BETWEEN :desde AND :hasta
        ORDER BY p.fecha DESC
        """, countQuery = """
        SELECT COUNT(*) FROM pedido p
        JOIN (SELECT DISTINCT ON (id_pedido) id_pedido, estado, fecha_hora
              FROM historial_estado ORDER BY id_pedido, fecha_hora DESC, id_hist DESC) h
          ON h.id_pedido = p.id_pedido
        WHERE h.estado = 'ENTREGADO' AND h.fecha_hora BETWEEN :desde AND :hasta
        """, nativeQuery = true)
    Page<Pedido> findEntregadosByEntregaBetween(Instant desde, Instant hasta, Pageable pageable);

    @Query(value = """
        SELECT COALESCE(SUM(p.total), 0) FROM pedido p
        WHERE p.id_pedido IN (
          SELECT latest.id_pedido FROM (
            SELECT DISTINCT ON (id_pedido) id_pedido, estado, fecha_hora
            FROM historial_estado
            ORDER BY id_pedido, fecha_hora DESC, id_hist DESC
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
            ORDER BY id_pedido, fecha_hora DESC, id_hist DESC
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
            ORDER BY id_pedido, fecha_hora DESC, id_hist DESC
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
          ORDER BY id_pedido, fecha_hora DESC, id_hist DESC
        ) latest ON latest.id_pedido = p.id_pedido AND latest.estado = 'ENTREGADO'
        WHERE latest.fecha_hora BETWEEN :desde AND :hasta
        GROUP BY to_char(latest.fecha_hora, 'YYYY-MM-DD')
        ORDER BY fecha ASC
        """, nativeQuery = true)
    List<ReporteIngresosResponse.IngresoDiario> sumIngresosAgrupadoPorDia(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    @Query("SELECT new com.seminario.heladeria.dto.response.DashboardResponse$TopProducto(" +
           "pr.nombre, COALESCE(SUM(dp.cantidad), 0)) " +
           "FROM DetallePedido dp JOIN dp.producto pr JOIN dp.pedido pe " +
           "WHERE EXISTS (SELECT h.idHist FROM HistorialEstado h WHERE h.pedido = pe AND h.estado = 'ENTREGADO' AND h.fechaHora = (SELECT MAX(h2.fechaHora) FROM HistorialEstado h2 WHERE h2.pedido = pe)) " +
           "GROUP BY pr.idProducto, pr.nombre ORDER BY SUM(dp.cantidad) DESC")
    List<DashboardResponse.TopProducto> findTopProductos(Pageable pageable);

    @Query("SELECT new com.seminario.heladeria.dto.response.DashboardResponse$TopSabor(" +
           "s.nombre, COUNT(s.idSabor)) FROM DetallePedidoSabor dps JOIN dps.sabor s JOIN dps.detallePedido dp JOIN dp.pedido pe " +
           "WHERE EXISTS (SELECT h.idHist FROM HistorialEstado h WHERE h.pedido = pe AND h.estado = 'ENTREGADO' AND h.fechaHora = (SELECT MAX(h2.fechaHora) FROM HistorialEstado h2 WHERE h2.pedido = pe)) " +
           "GROUP BY s.idSabor, s.nombre ORDER BY COUNT(s.idSabor) DESC")
    List<DashboardResponse.TopSabor> findTopSabores(Pageable pageable);

    boolean existsByDireccionIdDireccion(Long idDireccion);

    List<Pedido> findByDireccionIdDireccion(Long idDireccion);

    @Query(value = """
        SELECT COUNT(*) FROM pedido p
        JOIN (SELECT DISTINCT ON (id_pedido) id_pedido, estado
              FROM historial_estado ORDER BY id_pedido, fecha_hora DESC, id_hist DESC) h
          ON h.id_pedido = p.id_pedido
        WHERE h.estado = 'ENTREGADO'
        """, nativeQuery = true)
    long countPedidosEntregados();

    @Query(value = """
        SELECT COALESCE(SUM(p.total), 0) FROM pedido p
        WHERE p.id_pedido IN (
          SELECT latest.id_pedido FROM (
            SELECT DISTINCT ON (id_pedido) id_pedido, estado, fecha_hora
            FROM historial_estado
            ORDER BY id_pedido, fecha_hora DESC, id_hist DESC
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
            ORDER BY id_pedido, fecha_hora DESC, id_hist DESC
          ) latest ON latest.id_pedido = p.id_pedido AND latest.estado = 'ENTREGADO'
        ) p ON date_trunc('month', p.entrega) = m.mes
        GROUP BY m.mes
        ORDER BY m.mes ASC
        """, nativeQuery = true)
    List<Object[]> sumIngresosPorMes(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    @Query(value = """
        SELECT p.nombre, SUM(dp.cantidad) FROM detalle_pedido dp
        JOIN producto p ON dp.id_producto = p.id_producto
        JOIN (SELECT DISTINCT ON (id_pedido) id_pedido, estado
              FROM historial_estado ORDER BY id_pedido, fecha_hora DESC, id_hist DESC) h
          ON h.id_pedido = dp.id_pedido AND h.estado = 'ENTREGADO'
        GROUP BY p.nombre ORDER BY SUM(dp.cantidad) DESC LIMIT 5
        """, nativeQuery = true)
    List<Object[]> findProductosMasVendidos();
}
