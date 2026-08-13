package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.response.DashboardResponse;
import com.seminario.heladeria.dto.response.PedidoResponse;
import com.seminario.heladeria.dto.response.ReporteIngresosResponse;
import com.seminario.heladeria.dto.response.ReportePedidosResponse;
import com.seminario.heladeria.entity.Pedido;
import com.seminario.heladeria.repository.PedidoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReporteService {

    private final PedidoRepository pedidoRepository;
    private final PedidoService pedidoService;

    public ReporteService(PedidoRepository pedidoRepository, PedidoService pedidoService) {
        this.pedidoRepository = pedidoRepository;
        this.pedidoService = pedidoService;
    }

    public DashboardResponse getDashboard() {
        DashboardResponse r = new DashboardResponse();
        r.setTotalPedidos(pedidoRepository.countPedidosEntregados());
        BigDecimal ingresos = pedidoRepository.sumIngresosSinCancelados();
        r.setIngresosTotales(ingresos != null ? ingresos : BigDecimal.ZERO);
        r.setTopProductos(pedidoRepository.findTopProductos(PageRequest.of(0, 5)));
        r.setTopSabores(pedidoRepository.findTopSabores(PageRequest.of(0, 5)));
        return r;
    }

    public ReportePedidosResponse getPedidos(Instant desde, Instant hasta, int page, int size) {
        Page<Pedido> pedidosPage = pedidoRepository.findEntregadosByEntregaBetween(desde, hasta, PageRequest.of(page, size));
        List<PedidoResponse> responses = pedidosPage.getContent().stream()
                .map(pedidoService::buildResponse).toList();
        return new ReportePedidosResponse(responses, pedidosPage.getTotalPages(), pedidosPage.getTotalElements());
    }

    public ReporteIngresosResponse getIngresos(Instant desde, Instant hasta) {
        BigDecimal total = pedidoRepository.sumIngresosByFechaBetween(desde, hasta);
        if (total == null) total = BigDecimal.ZERO;
        long cantidad = pedidoRepository.countByFechaBetween(desde, hasta);
        BigDecimal promedio = cantidad > 0 ? total.divide(BigDecimal.valueOf(cantidad), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        List<ReporteIngresosResponse.IngresoDiario> porDia = pedidoRepository.sumIngresosAgrupadoPorDia(desde, hasta);
        return new ReporteIngresosResponse(total, cantidad, promedio, porDia);
    }

    public Rango rango(String periodo, Instant desde, Instant hasta) {
        Instant ahora = Instant.now();
        if (periodo == null || periodo.isBlank()) {
            return new Rango(desde != null ? desde : ahora.minus(30, ChronoUnit.DAYS), hasta != null ? hasta : ahora);
        }
        return switch (periodo.trim().toLowerCase()) {
            case "dia", "día" -> new Rango(ahora.truncatedTo(ChronoUnit.DAYS), ahora);
            case "semana" -> new Rango(ahora.minus(7, ChronoUnit.DAYS), ahora);
            case "mes" -> new Rango(ahora.minus(30, ChronoUnit.DAYS), ahora);
            case "rango" -> new Rango(desde != null ? desde : ahora.minus(30, ChronoUnit.DAYS), hasta != null ? hasta : ahora);
            default -> throw new IllegalArgumentException("Período inválido");
        };
    }

    public record Rango(Instant desde, Instant hasta) {}
}
