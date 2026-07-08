package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.CarritoItemRequest;
import com.seminario.heladeria.dto.request.CheckoutRequest;
import com.seminario.heladeria.dto.response.CarritoResponse;
import com.seminario.heladeria.dto.response.PedidoResponse;
import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.service.CarritoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    @GetMapping
    public ResponseEntity<CarritoResponse> obtener(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(carritoService.obtenerResponse(usuario));
    }

    @PostMapping("/items")
    public ResponseEntity<CarritoResponse> agregarItem(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody CarritoItemRequest request) {
        carritoService.agregarItem(usuario, request);
        return ResponseEntity.ok(carritoService.obtenerResponse(usuario));
    }

    @PutMapping("/items/{idItem}")
    public ResponseEntity<CarritoResponse> actualizarItem(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long idItem,
            @Valid @RequestBody CarritoItemRequest request) {
        carritoService.actualizarItem(usuario, idItem, request);
        return ResponseEntity.ok(carritoService.obtenerResponse(usuario));
    }

    @DeleteMapping("/items/{idItem}")
    public ResponseEntity<CarritoResponse> eliminarItem(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long idItem) {
        carritoService.eliminarItem(usuario, idItem);
        return ResponseEntity.ok(carritoService.obtenerResponse(usuario));
    }

    @PostMapping("/checkout")
    public ResponseEntity<PedidoResponse> checkout(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(carritoService.checkout(usuario, request));
    }
}
