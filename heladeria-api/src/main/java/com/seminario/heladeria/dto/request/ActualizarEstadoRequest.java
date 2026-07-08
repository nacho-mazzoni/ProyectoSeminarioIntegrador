package com.seminario.heladeria.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ActualizarEstadoRequest {

    @NotBlank
    private String estado;

    private String notas;

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
}
