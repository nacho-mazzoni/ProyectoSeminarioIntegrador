package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.PromocionRequest;
import com.seminario.heladeria.dto.response.PromocionResponse;
import com.seminario.heladeria.entity.Promocion;
import com.seminario.heladeria.repository.PromocionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class PromocionService {

    private final PromocionRepository promocionRepository;

    public PromocionService(PromocionRepository promocionRepository) {
        this.promocionRepository = promocionRepository;
    }

    public List<PromocionResponse> findAll() {
        return promocionRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(PromocionResponse::from).toList();
    }

    public PromocionResponse findById(Long id) {
        Promocion p = promocionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promocion no encontrada"));
        return PromocionResponse.from(p);
    }

    public List<PromocionResponse> findActivas() {
        List<Promocion> activas = new ArrayList<>();
        activas.addAll(promocionRepository.findAllByActivaTrueAndFechaInicioIsNullAndFechaFinIsNull());
        activas.addAll(promocionRepository.findAllByActivaTrueAndFechaInicioBeforeAndFechaFinAfter(
                Instant.now(), Instant.now()));
        return activas.stream().map(PromocionResponse::from).toList();
    }

    public PromocionResponse findByCodigo(String codigo) {
        Promocion p = promocionRepository.findByCodigoAndActivaTrue(codigo)
                .orElseThrow(() -> new RuntimeException("Promocion invalida o inactiva"));
        return PromocionResponse.from(p);
    }

    @Transactional
    public PromocionResponse crear(PromocionRequest request) {
        if (promocionRepository.existsByCodigo(request.getCodigo())) {
            throw new RuntimeException("Ya existe una promocion con ese codigo");
        }
        Promocion p = new Promocion();
        p.setCodigo(request.getCodigo());
        p.setDescripcion(request.getDescripcion());
        p.setPorcDesc(request.getPorcDesc());
        p.setActiva(request.getActiva() != null ? request.getActiva() : true);
        p.setFechaInicio(request.getFechaInicio());
        p.setFechaFin(request.getFechaFin());
        return PromocionResponse.from(promocionRepository.save(p));
    }

    @Transactional
    public PromocionResponse actualizar(Long id, PromocionRequest request) {
        Promocion p = promocionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promocion no encontrada"));
        if (!p.getCodigo().equals(request.getCodigo()) && promocionRepository.existsByCodigo(request.getCodigo())) {
            throw new RuntimeException("Ya existe otra promocion con ese codigo");
        }
        p.setCodigo(request.getCodigo());
        p.setDescripcion(request.getDescripcion());
        p.setPorcDesc(request.getPorcDesc());
        p.setActiva(request.getActiva() != null ? request.getActiva() : true);
        p.setFechaInicio(request.getFechaInicio());
        p.setFechaFin(request.getFechaFin());
        return PromocionResponse.from(promocionRepository.save(p));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!promocionRepository.existsById(id)) {
            throw new RuntimeException("Promocion no encontrada");
        }
        promocionRepository.deleteById(id);
    }
}