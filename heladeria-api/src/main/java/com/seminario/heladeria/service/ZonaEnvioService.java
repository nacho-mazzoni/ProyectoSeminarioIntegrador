package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.response.ZonaEnvioResponse;
import com.seminario.heladeria.repository.ZonaEnvioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ZonaEnvioService {

    private final ZonaEnvioRepository repository;

    public ZonaEnvioService(ZonaEnvioRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<ZonaEnvioResponse> findAllResponses() {
        return repository.findAll().stream()
                .map(ZonaEnvioResponse::from)
                .toList();
    }
}
