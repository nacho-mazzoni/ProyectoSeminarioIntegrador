package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.ProductoRequest;
import com.seminario.heladeria.dto.response.*;
import com.seminario.heladeria.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaResponse>> listarCategorias() {
        return ResponseEntity.ok(productoService.findAllCategoriaResponses());
    }

    @GetMapping("/productos")
    public ResponseEntity<List<ProductoResponse>> listarProductos() {
        return ResponseEntity.ok(productoService.findAllProductoResponses());
    }

    @GetMapping("/productos/{id}")
    public ResponseEntity<ProductoResponse> obtenerProducto(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findProductoResponseById(id));
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

    @GetMapping("/sabores")
    public ResponseEntity<List<SaborResponse>> listarSabores() {
        return ResponseEntity.ok(productoService.findSaborResponsesDisponibles());
    }

    @GetMapping("/adicionales")
    public ResponseEntity<List<AdicionalResponse>> listarAdicionales() {
        return ResponseEntity.ok(productoService.findAdicionalResponsesDisponibles());
    }
}
