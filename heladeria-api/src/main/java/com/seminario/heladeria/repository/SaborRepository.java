package com.seminario.heladeria.repository;

import com.seminario.heladeria.entity.Sabor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaborRepository extends JpaRepository<Sabor, Long> {
    List<Sabor> findByDisponibleTrue();
}
