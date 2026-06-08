package com.seminario.heladeria.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public class ProductoRequest {

    @NotBlank
    private String nombre;

    @PositiveOrZero
    private Integer stockEnvases;

    @NotNull @Positive
    private BigDecimal precioBase;

    @PositiveOrZero
    private Integer maxSabores;

    @NotNull
    private Long idCategoria;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Integer getStockEnvases() { return stockEnvases; }
    public void setStockEnvases(Integer stockEnvases) { this.stockEnvases = stockEnvases; }

    public BigDecimal getPrecioBase() { return precioBase; }
    public void setPrecioBase(BigDecimal precioBase) { this.precioBase = precioBase; }

    public Integer getMaxSabores() { return maxSabores; }
    public void setMaxSabores(Integer maxSabores) { this.maxSabores = maxSabores; }

    public Long getIdCategoria() { return idCategoria; }
    public void setIdCategoria(Long idCategoria) { this.idCategoria = idCategoria; }
}
