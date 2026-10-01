package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.*;
import com.seminario.heladeria.dto.response.*;
import com.seminario.heladeria.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // ── Públicos ──

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaResponse>> listarCategorias() {
        return ResponseEntity.ok(productoService.findAllCategoriaResponses());
    }

    @GetMapping("/productos")
    public ResponseEntity<List<ProductoResponse>> listarProductos(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Long categoria,
            @RequestParam(required = false) BigDecimal precioMin,
            @RequestParam(required = false) BigDecimal precioMax) {
        return ResponseEntity.ok(productoService.findAllProductoResponses(nombre, categoria, precioMin, precioMax));
    }

    @GetMapping("/productos/{id}")
    public ResponseEntity<ProductoResponse> obtenerProducto(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findProductoResponseById(id));
    }

    @GetMapping("/sabores")
    public ResponseEntity<List<SaborResponse>> listarSabores() {
        return ResponseEntity.ok(productoService.findSaborResponsesDisponibles());
    }

    @GetMapping("/adicionales")
    public ResponseEntity<List<AdicionalResponse>> listarAdicionales() {
        return ResponseEntity.ok(productoService.findAdicionalResponsesDisponibles());
    }

    // ── Admin: Productos ──

    @GetMapping("/admin/productos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CAJERO')")
    public ResponseEntity<List<ProductoResponse>> listarProductosAdmin() {
        return ResponseEntity.ok(productoService.findAllProductoAdminResponses());
    }

    @PostMapping("/admin/productos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CAJERO')")
    public ResponseEntity<ProductoResponse> crearProducto(@Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.crearProducto(request));
    }

    @PutMapping("/admin/productos/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CAJERO')")
    public ResponseEntity<ProductoResponse> actualizarProducto(
            @PathVariable Long id, @Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, request));
    }

    @DeleteMapping("/admin/productos/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CAJERO')")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/admin/productos/{id}/disponibilidad")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CAJERO')")
    public ResponseEntity<ProductoResponse> cambiarDisponibilidad(
            @PathVariable Long id, @RequestParam boolean activo) {
        return ResponseEntity.ok(productoService.cambiarDisponibilidad(id, activo));
    }


}
