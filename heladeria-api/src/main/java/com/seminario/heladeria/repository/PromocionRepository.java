package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface PromocionRepository extends JpaRepository<Promocion, Long> {
    Optional<Promocion> findByCodigoAndActivaTrue(String codigo);
    List<Promocion> findAllByOrderByCreatedAtDesc();
    List<Promocion> findAllByActivaTrueAndFechaInicioBeforeAndFechaFinAfter(Instant now, Instant now2);
    List<Promocion> findAllByActivaTrueAndFechaInicioIsNullAndFechaFinIsNull();
    boolean existsByCodigo(String codigo);
}