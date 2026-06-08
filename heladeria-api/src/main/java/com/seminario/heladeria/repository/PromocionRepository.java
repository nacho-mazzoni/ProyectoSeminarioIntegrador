package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromocionRepository extends JpaRepository<Promocion, Long> {
    Optional<Promocion> findByCodigoAndActivaTrue(String codigo);
}
