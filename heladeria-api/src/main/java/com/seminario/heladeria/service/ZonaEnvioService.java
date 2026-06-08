package com.seminario.heladeria.service;

import com.seminario.heladeria.entity.ZonaEnvio;
import com.seminario.heladeria.repository.ZonaEnvioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZonaEnvioService {

    private final ZonaEnvioRepository repository;

    public ZonaEnvioService(ZonaEnvioRepository repository) {
        this.repository = repository;
    }

    public List<ZonaEnvio> findAll() {
        return repository.findAll();
    }
}
