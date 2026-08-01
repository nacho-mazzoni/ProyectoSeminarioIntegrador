package com.seminario.heladeria.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CheckoutRequest {

    @NotBlank(message = "Seleccioná un método de entrega")
    private String metodoEntrega;

    @NotNull(message = "Seleccioná una dirección")
    private Long idDireccion;

    private String codigoPromocion;

    @NotBlank(message = "Seleccioná un método de pago")
    private String metodoPago;

    public String getMetodoEntrega() { return metodoEntrega; }
    public void setMetodoEntrega(String metodoEntrega) { this.metodoEntrega = metodoEntrega; }

    public Long getIdDireccion() { return idDireccion; }
    public void setIdDireccion(Long idDireccion) { this.idDireccion = idDireccion; }

    public String getCodigoPromocion() { return codigoPromocion; }
    public void setCodigoPromocion(String codigoPromocion) { this.codigoPromocion = codigoPromocion; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
}