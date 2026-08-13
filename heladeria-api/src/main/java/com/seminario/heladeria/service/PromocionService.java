package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.PromocionRequest;
import com.seminario.heladeria.dto.response.PromocionResponse;
import com.seminario.heladeria.entity.Promocion;
import com.seminario.heladeria.repository.PromocionRepository;
import com.seminario.heladeria.exception.BusinessRuleException;
import com.seminario.heladeria.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Slf4j
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
                .orElseThrow(() -> new ResourceNotFoundException("Promocion no encontrada"));
        return PromocionResponse.from(p);
    }

    public List<PromocionResponse> findActivas() {
        List<Promocion> activas = new ArrayList<>();
        activas.addAll(promocionRepository.findAllByActivaTrueAndFechaInicioIsNullAndFechaFinIsNull());
        Instant now = Instant.now();
        activas.addAll(promocionRepository.findAllByActivaTrueAndFechaInicioBeforeAndFechaFinAfter(now, now));
        activas.addAll(promocionRepository.findAllByActivaTrueAndFechaInicioIsNullAndFechaFinAfter(now));
        activas.addAll(promocionRepository.findAllByActivaTrueAndFechaInicioBeforeAndFechaFinIsNull(now));
        return activas.stream().map(PromocionResponse::from).toList();
    }

    public PromocionResponse findByCodigo(String codigo) {
        Promocion p = promocionRepository.findVigenteByCodigo(codigo.trim().toUpperCase(), Instant.now())
                .orElseThrow(() -> new BusinessRuleException("Promoción inválida o inactiva"));
        return PromocionResponse.from(p);
    }

    @Transactional
    public PromocionResponse crear(PromocionRequest request) {
        validarFechas(request);
        if (promocionRepository.existsByCodigo(request.getCodigo())) {
            throw new BusinessRuleException("Ya existe una promocion con ese codigo");
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
        validarFechas(request);
        Promocion p = promocionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promocion no encontrada"));
        if (!p.getCodigo().equals(request.getCodigo()) && promocionRepository.existsByCodigo(request.getCodigo())) {
            throw new BusinessRuleException("Ya existe otra promocion con ese codigo");
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
            throw new ResourceNotFoundException("Promocion no encontrada");
        }
        Promocion p = promocionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promocion no encontrada"));
        p.setActiva(false);
        promocionRepository.save(p);
    }

    private void validarFechas(PromocionRequest request) {
        if (request.getFechaInicio() != null && request.getFechaFin() != null
                && !request.getFechaFin().isAfter(request.getFechaInicio())) {
            throw new BusinessRuleException("La fecha de fin debe ser posterior a la fecha de inicio");
        }
    }
}
