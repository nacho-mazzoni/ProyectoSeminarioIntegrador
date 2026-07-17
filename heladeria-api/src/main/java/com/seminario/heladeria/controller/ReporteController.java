package com.seminario.heladeria.controller;

import com.seminario.heladeria.dto.response.DashboardResponse;
import com.seminario.heladeria.dto.response.ReporteIngresosResponse;
import com.seminario.heladeria.dto.response.ReportePedidosResponse;
import com.seminario.heladeria.service.ReporteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/admin/reportes")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> dashboard() {
        return ResponseEntity.ok(reporteService.getDashboard());
    }

    @GetMapping("/pedidos")
    public ResponseEntity<ReportePedidosResponse> pedidos(
            @RequestParam(defaultValue = "#{T(java.time.Instant).now().minus(30, T(java.time.temporal.ChronoUnit).DAYS)}") Instant desde,
            @RequestParam(defaultValue = "#{T(java.time.Instant).now()}") Instant hasta,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(reporteService.getPedidos(desde, hasta, page, size));
    }

    @GetMapping("/ingresos")
    public ResponseEntity<ReporteIngresosResponse> ingresos(
            @RequestParam(required = false) Instant desde,
            @RequestParam(required = false) Instant hasta) {
        if (desde == null) desde = Instant.now().minus(java.time.Duration.ofDays(30));
        if (hasta == null) hasta = Instant.now();
        return ResponseEntity.ok(reporteService.getIngresos(desde, hasta));
    }
}