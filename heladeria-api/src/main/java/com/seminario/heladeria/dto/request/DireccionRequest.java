package com.seminario.heladeria.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DireccionRequest {

    @NotBlank
    private String calle;

    @NotBlank
    private String numero;

    @NotBlank
    private String ciudad;

    private String referencia;

    @NotNull
    private Long idZona;

    public String getCalle() { return calle; }
    public void setCalle(String calle) { this.calle = calle; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }

    public Long getIdZona() { return idZona; }
    public void setIdZona(Long idZona) { this.idZona = idZona; }
}
