package com.seminario.heladeria.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CategoriaRequest {

    @NotBlank
    private String nombre;

    @NotNull
    private Boolean requiereSabores;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Boolean getRequiereSabores() { return requiereSabores; }
    public void setRequiereSabores(Boolean requiereSabores) { this.requiereSabores = requiereSabores; }
}
