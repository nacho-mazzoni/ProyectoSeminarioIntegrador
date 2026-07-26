package com.seminario.heladeria.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class PedidoRequest {

    @NotBlank
    private String metodoEntrega;

    private Long idDireccion;

    private String codigoPromocion;

    private String metodoPago;

    @NotEmpty @Valid
    private List<DetalleRequest> detalles;

    public String getMetodoEntrega() { return metodoEntrega; }
    public void setMetodoEntrega(String metodoEntrega) { this.metodoEntrega = metodoEntrega; }

    public Long getIdDireccion() { return idDireccion; }
    public void setIdDireccion(Long idDireccion) { this.idDireccion = idDireccion; }

    public String getCodigoPromocion() { return codigoPromocion; }
    public void setCodigoPromocion(String codigoPromocion) { this.codigoPromocion = codigoPromocion; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public List<DetalleRequest> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleRequest> detalles) { this.detalles = detalles; }

    public static class DetalleRequest {

        @NotNull
        private Long idProducto;

        @NotNull
        private Integer cantidad;

        private List<Long> idsSabor;
        private List<Long> idsAdicional;

        public Long getIdProducto() { return idProducto; }
        public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }

        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

        public List<Long> getIdsSabor() { return idsSabor; }
        public void setIdsSabor(List<Long> idsSabor) { this.idsSabor = idsSabor; }

        public List<Long> getIdsAdicional() { return idsAdicional; }
        public void setIdsAdicional(List<Long> idsAdicional) { this.idsAdicional = idsAdicional; }
    }
}
