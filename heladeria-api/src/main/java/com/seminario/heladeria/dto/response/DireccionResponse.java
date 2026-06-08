package com.seminario.heladeria.dto.response;

import com.seminario.heladeria.entity.Direccion;

public class DireccionResponse {

    private Long idDireccion;
    private String calle;
    private String numero;
    private String ciudad;
    private String referencia;
    private String zona;
    private Long idZona;

    public static DireccionResponse from(Direccion d) {
        DireccionResponse r = new DireccionResponse();
        r.idDireccion = d.getIdDireccion();
        r.calle = d.getCalle();
        r.numero = d.getNumero();
        r.ciudad = d.getCiudad();
        r.referencia = d.getReferencia();
        r.zona = d.getZonaEnvio().getNombreZona();
        r.idZona = d.getZonaEnvio().getIdZona();
        return r;
    }

    public Long getIdDireccion() { return idDireccion; }
    public String getCalle() { return calle; }
    public String getNumero() { return numero; }
    public String getCiudad() { return ciudad; }
    public String getReferencia() { return referencia; }
    public String getZona() { return zona; }
    public Long getIdZona() { return idZona; }
}
