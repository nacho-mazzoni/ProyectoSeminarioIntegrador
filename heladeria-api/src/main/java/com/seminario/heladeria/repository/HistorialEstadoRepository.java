package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.HistorialEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HistorialEstadoRepository extends JpaRepository<HistorialEstado, Long> {
    List<HistorialEstado> findByPedidoIdPedidoOrderByFechaHoraAsc(Long idPedido);

    @Query(value = """
        SELECT estado, COUNT(*) as cantidad FROM (
            SELECT DISTINCT ON (id_pedido) id_pedido, estado
            FROM historial_estado
            ORDER BY id_pedido, fecha_hora DESC, id_hist DESC
        ) latest GROUP BY estado
    """, nativeQuery = true)
    List<Object[]> countPedidosByUltimoEstado();

    @Query(value = """
        SELECT COUNT(*) FROM (
            SELECT DISTINCT ON (id_pedido) id_pedido, estado
            FROM historial_estado
            ORDER BY id_pedido, fecha_hora DESC, id_hist DESC
        ) latest WHERE estado = ?1
    """, nativeQuery = true)
    Long countByUltimoEstado(String estado);
}
