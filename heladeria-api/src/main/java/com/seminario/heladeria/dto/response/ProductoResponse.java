package com.seminario.heladeria.dto.response;

import com.seminario.heladeria.entity.Producto;

import java.math.BigDecimal;
import java.util.List;

public class ProductoResponse {

    private Long idProducto;
    private String nombre;
    private Integer stockEnvases;
    private BigDecimal precioBase;
    private Integer maxSabores;
    private CategoriaResponse categoria;
    private List<SaborResponse> sabores;

    public ProductoResponse() {}

    public static ProductoResponse from(Producto p) {
        ProductoResponse r = new ProductoResponse();
        r.idProducto = p.getIdProducto();
        r.nombre = p.getNombre();
        r.stockEnvases = p.getStockEnvases();
        r.precioBase = p.getPrecioBase();
        r.maxSabores = p.getMaxSabores();
        r.categoria = CategoriaResponse.from(p.getCategoria());
        if (p.getSabores() != null) {
            r.sabores = p.getSabores().stream().map(SaborResponse::from).toList();
        } else {
            r.sabores = List.of();
        }
        return r;
    }

    public Long getIdProducto() { return idProducto; }
    public String getNombre() { return nombre; }
    public Integer getStockEnvases() { return stockEnvases; }
    public BigDecimal getPrecioBase() { return precioBase; }
    public Integer getMaxSabores() { return maxSabores; }
    public CategoriaResponse getCategoria() { return categoria; }
    public List<SaborResponse> getSabores() { return sabores; }
}
