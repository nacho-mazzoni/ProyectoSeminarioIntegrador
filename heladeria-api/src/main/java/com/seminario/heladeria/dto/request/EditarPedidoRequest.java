package com.seminario.heladeria.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class EditarPedidoRequest {

    private Long idDireccion;

    private String codigoPromocion;

    @NotEmpty @Valid
    private List<PedidoRequest.DetalleRequest> detalles;

    public Long getIdDireccion() { return idDireccion; }
    public void setIdDireccion(Long idDireccion) { this.idDireccion = idDireccion; }

    public String getCodigoPromocion() { return codigoPromocion; }
    public void setCodigoPromocion(String codigoPromocion) { this.codigoPromocion = codigoPromocion; }

    public List<PedidoRequest.DetalleRequest> getDetalles() { return detalles; }
    public void setDetalles(List<PedidoRequest.DetalleRequest> detalles) { this.detalles = detalles; }
}