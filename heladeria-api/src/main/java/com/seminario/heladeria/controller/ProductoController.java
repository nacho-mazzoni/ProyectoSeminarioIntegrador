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
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<ProductoResponse>> listarProductosAdmin() {
        return ResponseEntity.ok(productoService.findAllProductoResponses(null, null, null, null));
    }

    @PostMapping("/admin/productos")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ProductoResponse> crearProducto(@Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.crearProducto(request));
    }

    @PutMapping("/admin/productos/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ProductoResponse> actualizarProducto(
            @PathVariable Long id, @Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, request));
    }

    @DeleteMapping("/admin/productos/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    // ── Admin: Categorías ──

    @GetMapping("/admin/categorias")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<CategoriaResponse>> listarCategoriasAdmin() {
        return ResponseEntity.ok(productoService.findAllCategoriaResponses());
    }

    @PostMapping("/admin/categorias")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<CategoriaResponse> crearCategoria(@Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(productoService.crearCategoria(request));
    }

    @PutMapping("/admin/categorias/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<CategoriaResponse> actualizarCategoria(
            @PathVariable Long id, @Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(productoService.actualizarCategoria(id, request));
    }

    @DeleteMapping("/admin/categorias/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Long id) {
        productoService.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }

    // ── Admin: Sabores ──

    @GetMapping("/admin/sabores")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<SaborResponse>> listarSaboresAdmin() {
        return ResponseEntity.ok(productoService.findAllSaborResponses());
    }

    @PostMapping("/admin/sabores")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<SaborResponse> crearSabor(@Valid @RequestBody SaborRequest request) {
        return ResponseEntity.ok(productoService.crearSabor(request));
    }

    @PutMapping("/admin/sabores/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<SaborResponse> actualizarSabor(
            @PathVariable Long id, @Valid @RequestBody SaborRequest request) {
        return ResponseEntity.ok(productoService.actualizarSabor(id, request));
    }

    @DeleteMapping("/admin/sabores/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarSabor(@PathVariable Long id) {
        productoService.eliminarSabor(id);
        return ResponseEntity.noContent().build();
    }

    // ── Admin: Adicionales ──

    @GetMapping("/admin/adicionales")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<AdicionalResponse>> listarAdicionalesAdmin() {
        return ResponseEntity.ok(productoService.findAllAdicionalResponses());
    }

    @PostMapping("/admin/adicionales")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<AdicionalResponse> crearAdicional(@Valid @RequestBody AdicionalRequest request) {
        return ResponseEntity.ok(productoService.crearAdicional(request));
    }

    @PutMapping("/admin/adicionales/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<AdicionalResponse> actualizarAdicional(
            @PathVariable Long id, @Valid @RequestBody AdicionalRequest request) {
        return ResponseEntity.ok(productoService.actualizarAdicional(id, request));
    }

    @DeleteMapping("/admin/adicionales/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarAdicional(@PathVariable Long id) {
        productoService.eliminarAdicional(id);
        return ResponseEntity.noContent().build();
    }
}
