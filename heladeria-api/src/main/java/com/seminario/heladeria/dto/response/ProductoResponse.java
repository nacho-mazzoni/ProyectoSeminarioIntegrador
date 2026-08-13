package com.seminario.heladeria.dto.response;

import com.seminario.heladeria.entity.Producto;

import java.math.BigDecimal;

public class ProductoResponse {

    private Long idProducto;
    private String nombre;
    private Integer stockEnvases;
    private BigDecimal precioBase;
    private Integer maxSabores;
    private Boolean activo;
    private CategoriaResponse categoria;

    public ProductoResponse() {}

    public static ProductoResponse from(Producto p) {
        ProductoResponse r = new ProductoResponse();
        r.idProducto = p.getIdProducto();
        r.nombre = p.getNombre();
        r.stockEnvases = p.getStockEnvases();
        r.precioBase = p.getPrecioBase();
        r.maxSabores = p.getMaxSabores();
        r.activo = p.getActivo();
        r.categoria = CategoriaResponse.from(p.getCategoria());
        return r;
    }

    public Long getIdProducto() { return idProducto; }
    public String getNombre() { return nombre; }
    public Integer getStockEnvases() { return stockEnvases; }
    public BigDecimal getPrecioBase() { return precioBase; }
    public Integer getMaxSabores() { return maxSabores; }
    public Boolean getActivo() { return activo; }
    public CategoriaResponse getCategoria() { return categoria; }
}
