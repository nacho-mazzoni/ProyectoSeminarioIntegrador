package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.request.ActualizarEstadoRequest;
import com.seminario.heladeria.dto.response.PedidoResponse;
import com.seminario.heladeria.entity.HistorialEstado;
import com.seminario.heladeria.entity.Pedido;
import com.seminario.heladeria.repository.HistorialEstadoRepository;
import com.seminario.heladeria.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/admin/pedidos")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class AdminPedidosController {

    private final PedidoService pedidoService;
    private final HistorialEstadoRepository historialEstadoRepository;

    public AdminPedidosController(PedidoService pedidoService,
                                  HistorialEstadoRepository historialEstadoRepository) {
        this.pedidoService = pedidoService;
        this.historialEstadoRepository = historialEstadoRepository;
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listar() {
        var pedidos = pedidoService.findAll();
        var responses = pedidos.stream()
                .map(pedidoService::buildResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<PedidoResponse> actualizarEstado(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarEstadoRequest request) {
        Pedido pedido = pedidoService.findById(id);

        HistorialEstado historial = new HistorialEstado();
        historial.setFechaHora(Instant.now());
        historial.setEstado(request.getEstado());
        historial.setNotas(request.getNotas());
        historial.setPedido(pedido);
        historialEstadoRepository.save(historial);

        return ResponseEntity.ok(pedidoService.buildResponse(pedido));
    }
}
