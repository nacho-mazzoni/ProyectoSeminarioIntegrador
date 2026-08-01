package com.seminario.heladeria.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class ReporteIngresosResponse {

    private BigDecimal totalIngresos;
    private long cantidadPedidos;
    private BigDecimal promedio;
    private List<IngresoDiario> porDia;

    public ReporteIngresosResponse(BigDecimal totalIngresos, long cantidadPedidos,
                                    BigDecimal promedio, List<IngresoDiario> porDia) {
        this.totalIngresos = totalIngresos;
        this.cantidadPedidos = cantidadPedidos;
        this.promedio = promedio;
        this.porDia = porDia;
    }

    public BigDecimal getTotalIngresos() { return totalIngresos; }
    public long getCantidadPedidos() { return cantidadPedidos; }
    public BigDecimal getPromedio() { return promedio; }
    public List<IngresoDiario> getPorDia() { return porDia; }

    public static class IngresoDiario {
        private String fecha;
        private BigDecimal total;
        private long cantidad;

        public IngresoDiario(String fecha, BigDecimal total, long cantidad) {
            this.fecha = fecha;
            this.total = total;
            this.cantidad = cantidad;
        }

        public String getFecha() { return fecha; }
        public BigDecimal getTotal() { return total; }
        public long getCantidad() { return cantidad; }
    }
}