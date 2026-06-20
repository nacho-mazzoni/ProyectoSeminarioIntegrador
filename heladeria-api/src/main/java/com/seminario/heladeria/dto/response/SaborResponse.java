package com.seminario.heladeria.dto.response;

import com.seminario.heladeria.entity.Sabor;

public class SaborResponse {

    private Long idSabor;
    private String nombre;
    private Integer stockBaldes;
    private Boolean disponible;
    private String capBalde;

    public SaborResponse() {}

    public static SaborResponse from(Sabor s) {
        SaborResponse r = new SaborResponse();
        r.idSabor = s.getIdSabor();
        r.nombre = s.getNombre();
        r.stockBaldes = s.getStockBaldes();
        r.disponible = s.getDisponible();
        r.capBalde = s.getCapBalde();
        return r;
    }

    public Long getIdSabor() { return idSabor; }
    public String getNombre() { return nombre; }
    public Integer getStockBaldes() { return stockBaldes; }
    public Boolean getDisponible() { return disponible; }
    public String getCapBalde() { return capBalde; }
}
