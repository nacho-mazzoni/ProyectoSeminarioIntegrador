package com.seminario.heladeria.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SaborRequest {

    @NotBlank
    private String nombre;

    @NotNull
    private Integer stockBaldes;

    @NotNull
    private Boolean disponible;

    private String capBalde;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Integer getStockBaldes() { return stockBaldes; }
    public void setStockBaldes(Integer stockBaldes) { this.stockBaldes = stockBaldes; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public String getCapBalde() { return capBalde; }
    public void setCapBalde(String capBalde) { this.capBalde = capBalde; }
}
