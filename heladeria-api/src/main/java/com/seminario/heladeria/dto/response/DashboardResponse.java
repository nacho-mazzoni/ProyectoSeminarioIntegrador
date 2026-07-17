package com.seminario.heladeria.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardResponse {

    private long totalUsuarios;
    private long totalProductos;
    private long totalPedidos;
    private BigDecimal ingresosTotales;
    private List<TopProducto> topProductos;

    public long getTotalUsuarios() { return totalUsuarios; }
    public void setTotalUsuarios(long totalUsuarios) { this.totalUsuarios = totalUsuarios; }

    public long getTotalProductos() { return totalProductos; }
    public void setTotalProductos(long totalProductos) { this.totalProductos = totalProductos; }

    public long getTotalPedidos() { return totalPedidos; }
    public void setTotalPedidos(long totalPedidos) { this.totalPedidos = totalPedidos; }

    public BigDecimal getIngresosTotales() { return ingresosTotales; }
    public void setIngresosTotales(BigDecimal ingresosTotales) { this.ingresosTotales = ingresosTotales; }

    public List<TopProducto> getTopProductos() { return topProductos; }
    public void setTopProductos(List<TopProducto> topProductos) { this.topProductos = topProductos; }

    public static class TopProducto {
        private String nombre;
        private long cantidadVendida;

        public TopProducto(String nombre, long cantidadVendida) {
            this.nombre = nombre;
            this.cantidadVendida = cantidadVendida;
        }

        public String getNombre() { return nombre; }
        public long getCantidadVendida() { return cantidadVendida; }
    }
}