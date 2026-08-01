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
        r.setTotalPedidos(pedidoRepository.count());
        BigDecimal ingresos = pedidoRepository.sumIngresosSinCancelados();
        r.setIngresosTotales(ingresos != null ? ingresos : BigDecimal.ZERO);
        r.setTopProductos(pedidoRepository.findTopProductos(PageRequest.of(0, 5)));
        return r;
    }

    public ReportePedidosResponse getPedidos(Instant desde, Instant hasta, int page, int size) {
        Page<Pedido> pedidosPage = pedidoRepository.findByFechaBetweenOrderByFechaDesc(desde, hasta, PageRequest.of(page, size));
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
}