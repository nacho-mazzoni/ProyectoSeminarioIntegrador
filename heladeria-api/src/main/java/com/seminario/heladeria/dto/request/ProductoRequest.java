package com.seminario.heladeria.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public class ProductoRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotNull(message = "El stock es obligatorio") @PositiveOrZero(message = "No puede ser negativo")
    private Integer stockEnvases;

    @NotNull(message = "El precio es obligatorio") @Positive(message = "Debe ser un valor positivo")
    private BigDecimal precioBase;

    @NotNull(message = "El límite de sabores es obligatorio") @PositiveOrZero(message = "No puede ser negativo")
    private Integer maxSabores;

    @NotNull(message = "Seleccioná una categoría")
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
