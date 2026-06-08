package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Adicional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdicionalRepository extends JpaRepository<Adicional, Long> {
    List<Adicional> findByDisponibleTrue();
}
