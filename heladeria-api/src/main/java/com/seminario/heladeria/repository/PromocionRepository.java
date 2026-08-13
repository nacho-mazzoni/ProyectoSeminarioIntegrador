package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.query.Param;

public interface PromocionRepository extends JpaRepository<Promocion, Long> {
    Optional<Promocion> findByCodigoAndActivaTrue(String codigo);
    @Query("select p from Promocion p where p.codigo = :codigo and p.activa = true and (p.fechaInicio is null or p.fechaInicio <= :ahora) and (p.fechaFin is null or p.fechaFin >= :ahora)")
    Optional<Promocion> findVigenteByCodigo(@Param("codigo") String codigo, @Param("ahora") Instant ahora);
    List<Promocion> findAllByOrderByCreatedAtDesc();
    List<Promocion> findAllByActivaTrueAndFechaInicioBeforeAndFechaFinAfter(Instant now, Instant now2);
    List<Promocion> findAllByActivaTrueAndFechaInicioIsNullAndFechaFinIsNull();
    List<Promocion> findAllByActivaTrueAndFechaInicioIsNullAndFechaFinAfter(Instant now);
    List<Promocion> findAllByActivaTrueAndFechaInicioBeforeAndFechaFinIsNull(Instant now);
    boolean existsByCodigo(String codigo);
}
