package com.seminario.heladeria.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class DashboardStatsResponse {

    private Long totalProductos;
    private Long totalPedidos;
    private Long pedidosPendientes;
    private Long totalUsuarios;
    private BigDecimal ingresosMes;
    private List<EstadoCount> pedidosPorEstado;
    private List<ProductoVendido> productosMasVendidos;

    public Long getTotalProductos() { return totalProductos; }
    public void setTotalProductos(Long totalProductos) { this.totalProductos = totalProductos; }

    public Long getTotalPedidos() { return totalPedidos; }
    public void setTotalPedidos(Long totalPedidos) { this.totalPedidos = totalPedidos; }

    public Long getPedidosPendientes() { return pedidosPendientes; }
    public void setPedidosPendientes(Long pedidosPendientes) { this.pedidosPendientes = pedidosPendientes; }

    public Long getTotalUsuarios() { return totalUsuarios; }
    public void setTotalUsuarios(Long totalUsuarios) { this.totalUsuarios = totalUsuarios; }

    public BigDecimal getIngresosMes() { return ingresosMes; }
    public void setIngresosMes(BigDecimal ingresosMes) { this.ingresosMes = ingresosMes; }

    public List<EstadoCount> getPedidosPorEstado() { return pedidosPorEstado; }
    public void setPedidosPorEstado(List<EstadoCount> pedidosPorEstado) { this.pedidosPorEstado = pedidosPorEstado; }

    public List<ProductoVendido> getProductosMasVendidos() { return productosMasVendidos; }
    public void setProductosMasVendidos(List<ProductoVendido> productosMasVendidos) { this.productosMasVendidos = productosMasVendidos; }

    public static class EstadoCount {
        private String estado;
        private Long cantidad;

        public EstadoCount(String estado, Long cantidad) {
            this.estado = estado;
            this.cantidad = cantidad;
        }

        public String getEstado() { return estado; }
        public Long getCantidad() { return cantidad; }
    }

    public static class ProductoVendido {
        private String producto;
        private Long cantidad;

        public ProductoVendido(String producto, Long cantidad) {
            this.producto = producto;
            this.cantidad = cantidad;
        }

        public String getProducto() { return producto; }
        public Long getCantidad() { return cantidad; }
    }
}
