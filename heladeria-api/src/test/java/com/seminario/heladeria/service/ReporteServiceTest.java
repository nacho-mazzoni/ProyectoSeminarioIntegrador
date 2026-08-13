package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.response.DashboardResponse;
import com.seminario.heladeria.dto.response.ReporteIngresosResponse;
import com.seminario.heladeria.repository.PedidoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class ReporteServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private PedidoService pedidoService;

    @InjectMocks
    private ReporteService reporteService;

    @Test
    void dashboardReturnsZeroAndEmptyRankingsWithoutSales() {
        when(pedidoRepository.sumIngresosSinCancelados()).thenReturn(BigDecimal.ZERO);
        when(pedidoRepository.findTopProductos(any())).thenReturn(List.of());
        when(pedidoRepository.findTopSabores(any())).thenReturn(List.of());

        DashboardResponse response = reporteService.getDashboard();

        assertThat(response.getIngresosTotales()).isZero();
        assertThat(response.getTopProductos()).isEmpty();
        assertThat(response.getTopSabores()).isEmpty();
    }

    @Test
    void ingresosReturnsZeroAverageWhenThereAreNoDeliveredOrders() {
        Instant now = Instant.now();
        when(pedidoRepository.sumIngresosByFechaBetween(now, now)).thenReturn(BigDecimal.ZERO);
        when(pedidoRepository.countByFechaBetween(now, now)).thenReturn(0L);
        when(pedidoRepository.sumIngresosAgrupadoPorDia(now, now)).thenReturn(List.of());

        ReporteIngresosResponse response = reporteService.getIngresos(now, now);

        assertThat(response.getTotalIngresos()).isZero();
        assertThat(response.getCantidadPedidos()).isZero();
        assertThat(response.getPromedio()).isZero();
        assertThat(response.getPorDia()).isEmpty();
    }
}
