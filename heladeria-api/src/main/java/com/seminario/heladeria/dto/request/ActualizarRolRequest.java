package com.seminario.heladeria.dto.request;

import jakarta.validation.constraints.NotNull;

public class ActualizarRolRequest {

    @NotNull
    private Long idRol;

    public Long getIdRol() { return idRol; }
    public void setIdRol(Long idRol) { this.idRol = idRol; }
}
