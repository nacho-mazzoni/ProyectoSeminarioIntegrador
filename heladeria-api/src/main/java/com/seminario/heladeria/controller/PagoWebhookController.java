package com.seminario.heladeria.controller;

import com.seminario.heladeria.entity.HistorialEstado;
import com.seminario.heladeria.entity.Pedido;
import com.seminario.heladeria.repository.HistorialEstadoRepository;
import com.seminario.heladeria.service.PagoService;
import com.seminario.heladeria.service.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
public class PagoWebhookController {

    private final PagoService pagoService;
    private final PedidoService pedidoService;
    private final HistorialEstadoRepository historialEstadoRepository;

    public PagoWebhookController(PagoService pagoService,
                                  PedidoService pedidoService,
                                  HistorialEstadoRepository historialEstadoRepository) {
        this.pagoService = pagoService;
        this.pedidoService = pedidoService;
        this.historialEstadoRepository = historialEstadoRepository;
    }

    @PostMapping("/notificacion")
    public ResponseEntity<String> recibirNotificacion(@RequestBody Map<String, Object> body) {
        String action = (String) body.get("action");
        if (action == null || !action.contains(".updated")) {
            return ResponseEntity.ok("OK");
        }

        String topic = (String) body.get("topic");
        String id = String.valueOf(body.get("id"));

        if ("payment".equals(topic) || "merchant_order".equals(topic)) {
            try {
                String externalRef = (String) body.get("external_reference");
                String status = (String) body.get("status");

                if (externalRef != null && status != null) {
                    pagoService.actualizarEstadoPago(externalRef, status);

                    if ("approved".equals(status)) {
                        Pedido pedido = pedidoService.findById(Long.parseLong(externalRef));
                        HistorialEstado historial = new HistorialEstado();
                        historial.setFechaHora(Instant.now());
                        historial.setEstado("PAGADO");
                        historial.setNotas("Pago aprobado via Mercado Pago");
                        historial.setPedido(pedido);
                        historialEstadoRepository.save(historial);
                    } else if ("rejected".equals(status)) {
                        Pedido pedido = pedidoService.findById(Long.parseLong(externalRef));
                        HistorialEstado historial = new HistorialEstado();
                        historial.setFechaHora(Instant.now());
                        historial.setEstado("RECHAZADO");
                        historial.setNotas("Pago rechazado");
                        historial.setPedido(pedido);
                        historialEstadoRepository.save(historial);
                    }
                }
            } catch (Exception e) {
                return ResponseEntity.ok("OK");
            }
        }

        return ResponseEntity.ok("OK");
    }
}