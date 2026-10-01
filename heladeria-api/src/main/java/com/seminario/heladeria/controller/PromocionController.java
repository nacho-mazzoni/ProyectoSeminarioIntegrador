package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.PromocionRequest;
import com.seminario.heladeria.dto.response.PromocionResponse;
import com.seminario.heladeria.service.PromocionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PromocionController {

    private final PromocionService promocionService;

    public PromocionController(PromocionService promocionService) {
        this.promocionService = promocionService;
    }

    @GetMapping("/promociones")
    public ResponseEntity<List<PromocionResponse>> listarActivas() {
        return ResponseEntity.ok(promocionService.findActivas());
    }

    @GetMapping("/promociones/{codigo}")
    public ResponseEntity<PromocionResponse> obtenerPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(promocionService.findByCodigo(codigo));
    }

    @GetMapping("/admin/promociones")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CAJERO')")
    public ResponseEntity<List<PromocionResponse>> listarAdmin() {
        return ResponseEntity.ok(promocionService.findAll());
    }

    @GetMapping("/admin/promociones/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CAJERO')")
    public ResponseEntity<PromocionResponse> obtenerAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(promocionService.findById(id));
    }

    @PostMapping("/admin/promociones")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CAJERO')")
    public ResponseEntity<PromocionResponse> crear(@Valid @RequestBody PromocionRequest request) {
        return ResponseEntity.ok(promocionService.crear(request));
    }

    @PutMapping("/admin/promociones/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CAJERO')")
    public ResponseEntity<PromocionResponse> actualizar(
            @PathVariable Long id, @Valid @RequestBody PromocionRequest request) {
        return ResponseEntity.ok(promocionService.actualizar(id, request));
    }

    @DeleteMapping("/admin/promociones/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CAJERO')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        promocionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
