package com.seminario.heladeria.dto.response;

import com.seminario.heladeria.entity.Adicional;

import java.math.BigDecimal;

public class AdicionalResponse {

    private Long idAdicional;
    private String nombre;
    private BigDecimal precioExtra;
    private Boolean disponible;

    public AdicionalResponse() {}

    public static AdicionalResponse from(Adicional a) {
        AdicionalResponse r = new AdicionalResponse();
        r.idAdicional = a.getIdAdicional();
        r.nombre = a.getNombre();
        r.precioExtra = a.getPrecioExtra();
        r.disponible = a.getDisponible();
        return r;
    }

    public Long getIdAdicional() { return idAdicional; }
    public String getNombre() { return nombre; }
    public BigDecimal getPrecioExtra() { return precioExtra; }
    public Boolean getDisponible() { return disponible; }
}
