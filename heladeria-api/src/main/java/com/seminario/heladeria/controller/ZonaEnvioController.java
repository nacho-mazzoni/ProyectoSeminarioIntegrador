package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.response.ZonaEnvioResponse;
import com.seminario.heladeria.service.ZonaEnvioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/zonas-envio")
public class ZonaEnvioController {

    private final ZonaEnvioService service;

    public ZonaEnvioController(ZonaEnvioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ZonaEnvioResponse>> listar() {
        return ResponseEntity.ok(service.findAllResponses());
    }
}
