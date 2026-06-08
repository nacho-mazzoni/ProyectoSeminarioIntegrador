package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.ProductoRequest;
import com.seminario.heladeria.entity.*;
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
    public ResponseEntity<List<Categoria>> listarCategorias() {
        return ResponseEntity.ok(productoService.findAllCategorias());
    }

    @GetMapping("/productos")
    public ResponseEntity<List<Producto>> listarProductos() {
        return ResponseEntity.ok(productoService.findAllProductos());
    }

    @GetMapping("/productos/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findProductoById(id));
    }

    @PostMapping("/admin/productos")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Producto> crearProducto(@Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.crearProducto(request));
    }

    @PutMapping("/admin/productos/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Producto> actualizarProducto(
            @PathVariable Long id, @Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, request));
    }

    @GetMapping("/sabores")
    public ResponseEntity<List<Sabor>> listarSabores() {
        return ResponseEntity.ok(productoService.findSaboresDisponibles());
    }

    @GetMapping("/adicionales")
    public ResponseEntity<List<Adicional>> listarAdicionales() {
        return ResponseEntity.ok(productoService.findAdicionalesDisponibles());
    }
}
