package com.seminario.heladeria.dto.response;

import com.seminario.heladeria.entity.HistorialEstado;
import com.seminario.heladeria.entity.Pedido;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class PedidoResponse {

    private Long idPedido;
    private Instant fecha;
    private String metodoEntrega;
    private BigDecimal total;
    private String cliente;
    private String direccion;
    private String promocion;
    private String metodoPago;
    private String estadoPago;
    private List<DetallePedidoResponse> detalles;
    private List<HistorialResponse> historial;

    public static PedidoResponse from(Pedido p) {
        PedidoResponse r = new PedidoResponse();
        r.idPedido = p.getIdPedido();
        r.fecha = p.getFecha();
        r.metodoEntrega = p.getMetodoEntrega();
        r.total = p.getTotal();
        r.cliente = p.getCliente().getUsuario().getEmail();
        r.direccion = p.getDireccion().getCalle() + " " + p.getDireccion().getNumero();
        if (p.getPromocion() != null) {
            r.promocion = p.getPromocion().getCodigo();
        }
        return r;
    }

    public Long getIdPedido() { return idPedido; }
    public Instant getFecha() { return fecha; }
    public String getMetodoEntrega() { return metodoEntrega; }
    public BigDecimal getTotal() { return total; }
    public String getCliente() { return cliente; }
    public String getDireccion() { return direccion; }
    public String getPromocion() { return promocion; }
    public String getMetodoPago() { return metodoPago; }
    public String getEstadoPago() { return estadoPago; }
    public List<DetallePedidoResponse> getDetalles() { return detalles; }
    public List<HistorialResponse> getHistorial() { return historial; }

    public void setDetalles(List<DetallePedidoResponse> detalles) { this.detalles = detalles; }
    public void setHistorial(List<HistorialResponse> historial) { this.historial = historial; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    public void setEstadoPago(String estadoPago) { this.estadoPago = estadoPago; }

    public static class DetallePedidoResponse {
        private Long idDetalle;
        private Integer cantidad;
        private BigDecimal precioUnitHist;
        private String producto;
        private List<String> sabores;
        private List<String> adicionales;

        public Long getIdDetalle() { return idDetalle; }
        public Integer getCantidad() { return cantidad; }
        public BigDecimal getPrecioUnitHist() { return precioUnitHist; }
        public String getProducto() { return producto; }
        public List<String> getSabores() { return sabores; }
        public List<String> getAdicionales() { return adicionales; }

        public void setIdDetalle(Long idDetalle) { this.idDetalle = idDetalle; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
        public void setPrecioUnitHist(BigDecimal precioUnitHist) { this.precioUnitHist = precioUnitHist; }
        public void setProducto(String producto) { this.producto = producto; }
        public void setSabores(List<String> sabores) { this.sabores = sabores; }
        public void setAdicionales(List<String> adicionales) { this.adicionales = adicionales; }
    }

    public static class HistorialResponse {
        private Long idHist;
        private Instant fechaHora;
        private String estado;
        private String notas;

        public static HistorialResponse from(HistorialEstado h) {
            HistorialResponse r = new HistorialResponse();
            r.idHist = h.getIdHist();
            r.fechaHora = h.getFechaHora();
            r.estado = h.getEstado();
            r.notas = h.getNotas();
            return r;
        }

        public Long getIdHist() { return idHist; }
        public Instant getFechaHora() { return fechaHora; }
        public String getEstado() { return estado; }
        public String getNotas() { return notas; }
    }
}