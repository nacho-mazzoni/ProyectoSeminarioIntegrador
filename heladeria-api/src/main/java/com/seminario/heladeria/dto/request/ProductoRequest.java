package com.seminario.heladeria.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.util.Set;

public class ProductoRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @PositiveOrZero(message = "No puede ser negativo")
    private Integer stockEnvases;

    @NotNull(message = "El precio es obligatorio") @Positive(message = "Debe ser un valor positivo")
    private BigDecimal precioBase;

    @PositiveOrZero(message = "No puede ser negativo")
    private Integer maxSabores;

    @NotNull(message = "Seleccioná una categoría")
    private Long idCategoria;

    private Set<Long> idsSabor;

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

    public Set<Long> getIdsSabor() { return idsSabor; }
    public void setIdsSabor(Set<Long> idsSabor) { this.idsSabor = idsSabor; }
}
