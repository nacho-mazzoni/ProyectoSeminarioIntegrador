package com.seminario.heladeria.dto.response;

import com.seminario.heladeria.entity.Rol;

public record RolResponse(Long idRol, String nombreRol) {
    public static RolResponse from(Rol rol) {
        return new RolResponse(rol.getIdRol(), rol.getNombreRol());
    }
}
