package com.seminario.heladeria.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import java.math.BigDecimal;
import java.time.Instant;

public class PromocionRequest {

    @NotBlank(message = "El código es obligatorio")
    private String codigo;

    private String descripcion;

    @NotNull(message = "El porcentaje de descuento es obligatorio")
    @DecimalMin(value = "0.01", message = "El porcentaje debe ser mayor que cero")
    @DecimalMax(value = "100", message = "El porcentaje no puede superar 100")
    private BigDecimal porcDesc;

    private Boolean activa = true;

    private Instant fechaInicio;

    private Instant fechaFin;

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public BigDecimal getPorcDesc() { return porcDesc; }
    public void setPorcDesc(BigDecimal porcDesc) { this.porcDesc = porcDesc; }

    public Boolean getActiva() { return activa; }
    public void setActiva(Boolean activa) { this.activa = activa; }

    public Instant getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(Instant fechaInicio) { this.fechaInicio = fechaInicio; }

    public Instant getFechaFin() { return fechaFin; }
    public void setFechaFin(Instant fechaFin) { this.fechaFin = fechaFin; }
}
