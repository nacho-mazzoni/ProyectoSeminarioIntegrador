package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.*;
import com.seminario.heladeria.dto.response.*;
import com.seminario.heladeria.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/dashboard/ingresos-mensuales")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<IngresoMensualResponse>> getIngresosMensuales(
            @RequestParam(defaultValue = "6") int meses) {
        return ResponseEntity.ok(adminService.getIngresosMensuales(meses));
    }

    @GetMapping("/pedidos")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<PedidoResponse>> listarPedidos() {
        return ResponseEntity.ok(adminService.listarPedidos());
    }

    @GetMapping("/pedidos/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<PedidoResponse> obtenerPedido(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.obtenerPedido(id));
    }

    @PutMapping("/pedidos/{id}/estado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<PedidoResponse> cambiarEstado(
            @PathVariable Long id,
            @Valid @RequestBody CambioEstadoRequest request) {
        return ResponseEntity.ok(adminService.cambiarEstadoPedido(id, request));
    }

    // --- SABORES ---

    @GetMapping("/sabores")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<SaborResponse>> listarSabores() {
        return ResponseEntity.ok(adminService.listarSabores());
    }

    @PostMapping("/sabores")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<SaborResponse> crearSabor(@Valid @RequestBody SaborRequest request) {
        return ResponseEntity.ok(adminService.crearSabor(request));
    }

    @PutMapping("/sabores/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<SaborResponse> actualizarSabor(
            @PathVariable Long id, @Valid @RequestBody SaborRequest request) {
        return ResponseEntity.ok(adminService.actualizarSabor(id, request));
    }

    @DeleteMapping("/sabores/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarSabor(@PathVariable Long id) {
        adminService.eliminarSabor(id);
        return ResponseEntity.noContent().build();
    }

    // --- ADICIONALES ---

    @GetMapping("/adicionales")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<AdicionalResponse>> listarAdicionales() {
        return ResponseEntity.ok(adminService.listarAdicionales());
    }

    @PostMapping("/adicionales")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<AdicionalResponse> crearAdicional(@Valid @RequestBody AdicionalRequest request) {
        return ResponseEntity.ok(adminService.crearAdicional(request));
    }

    @PutMapping("/adicionales/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<AdicionalResponse> actualizarAdicional(
            @PathVariable Long id, @Valid @RequestBody AdicionalRequest request) {
        return ResponseEntity.ok(adminService.actualizarAdicional(id, request));
    }

    @DeleteMapping("/adicionales/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarAdicional(@PathVariable Long id) {
        adminService.eliminarAdicional(id);
        return ResponseEntity.noContent().build();
    }

    // --- CATEGORIAS ---

    @GetMapping("/categorias")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<CategoriaResponse>> listarCategorias() {
        return ResponseEntity.ok(adminService.listarCategorias());
    }

    @PostMapping("/categorias")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<CategoriaResponse> crearCategoria(@Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(adminService.crearCategoria(request));
    }

    @PutMapping("/categorias/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<CategoriaResponse> actualizarCategoria(
            @PathVariable Long id, @Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(adminService.actualizarCategoria(id, request));
    }

    @DeleteMapping("/categorias/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Long id) {
        adminService.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }

    // --- ZONAS DE ENVIO ---

    @GetMapping("/zonas-envio")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<ZonaEnvioResponse>> listarZonas() {
        return ResponseEntity.ok(adminService.listarZonas());
    }

    @PostMapping("/zonas-envio")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ZonaEnvioResponse> crearZona(@Valid @RequestBody ZonaRequest request) {
        return ResponseEntity.ok(adminService.crearZona(request));
    }

    @PutMapping("/zonas-envio/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ZonaEnvioResponse> actualizarZona(
            @PathVariable Long id, @Valid @RequestBody ZonaRequest request) {
        return ResponseEntity.ok(adminService.actualizarZona(id, request));
    }

    @DeleteMapping("/zonas-envio/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarZona(@PathVariable Long id) {
        adminService.eliminarZona(id);
        return ResponseEntity.noContent().build();
    }

    // --- USUARIOS ---

    @GetMapping("/usuarios")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios() {
        return ResponseEntity.ok(adminService.listarUsuarios());
    }
}
