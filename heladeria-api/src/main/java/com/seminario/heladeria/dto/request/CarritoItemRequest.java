package com.seminario.heladeria.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CarritoItemRequest {

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
