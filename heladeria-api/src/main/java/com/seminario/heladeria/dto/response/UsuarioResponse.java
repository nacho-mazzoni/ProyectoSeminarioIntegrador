package com.seminario.heladeria.dto.response;

import com.seminario.heladeria.entity.Cliente;
import com.seminario.heladeria.entity.Usuario;

public class UsuarioResponse {

    private Long idUsuario;
    private String email;
    private Boolean activo;
    private String rol;
    private String telefono;

    public static UsuarioResponse from(Usuario usuario) {
        UsuarioResponse r = new UsuarioResponse();
        r.idUsuario = usuario.getIdUsuario();
        r.email = usuario.getEmail();
        r.activo = usuario.getActivo();
        r.rol = usuario.getRol().getNombreRol();
        return r;
    }

    public static UsuarioResponse fromCliente(Cliente cliente) {
        UsuarioResponse r = from(cliente.getUsuario());
        r.telefono = cliente.getTelefono();
        return r;
    }

    public Long getIdUsuario() { return idUsuario; }
    public String getEmail() { return email; }
    public Boolean getActivo() { return activo; }
    public String getRol() { return rol; }
    public String getTelefono() { return telefono; }
}
