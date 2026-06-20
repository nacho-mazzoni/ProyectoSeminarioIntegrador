package com.seminario.heladeria.dto.response;

import com.seminario.heladeria.entity.Categoria;

public class CategoriaResponse {

    private Long idCategoria;
    private String nombre;
    private Boolean requiereSabores;

    public CategoriaResponse() {}

    public static CategoriaResponse from(Categoria c) {
        CategoriaResponse r = new CategoriaResponse();
        r.idCategoria = c.getIdCategoria();
        r.nombre = c.getNombre();
        r.requiereSabores = c.getRequiereSabores();
        return r;
    }

    public Long getIdCategoria() { return idCategoria; }
    public String getNombre() { return nombre; }
    public Boolean getRequiereSabores() { return requiereSabores; }
}
