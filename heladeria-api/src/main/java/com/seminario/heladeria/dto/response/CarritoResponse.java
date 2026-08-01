package com.seminario.heladeria.dto.response;

import com.seminario.heladeria.entity.Carrito;
import com.seminario.heladeria.entity.CarritoItem;

import java.math.BigDecimal;
import java.util.List;

public class CarritoResponse {

    private Long idCarrito;
    private List<ItemResponse> items;
    private BigDecimal subtotal;

    public static CarritoResponse from(Carrito carrito) {
        CarritoResponse r = new CarritoResponse();
        r.idCarrito = carrito.getIdCarrito();
        r.items = carrito.getItems().stream()
                .map(ItemResponse::from)
                .toList();
        r.subtotal = r.items.stream()
                .map(i -> i.precioBase.multiply(BigDecimal.valueOf(i.cantidad)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return r;
    }

    public Long getIdCarrito() { return idCarrito; }
    public List<ItemResponse> getItems() { return items; }
    public BigDecimal getSubtotal() { return subtotal; }

    public static class ItemResponse {
        private Long idItem;
        private Long idProducto;
        private String nombre;
        private Integer cantidad;
        private BigDecimal precioBase;
        private List<String> sabores;
        private List<String> adicionales;

        public static ItemResponse from(CarritoItem item) {
            ItemResponse r = new ItemResponse();
            r.idItem = item.getIdItem();
            r.idProducto = item.getProducto().getIdProducto();
            r.nombre = item.getProducto().getNombre();
            r.cantidad = item.getCantidad();
            r.precioBase = item.getProducto().getPrecioBase();
            r.sabores = item.getSabores().stream()
                    .map(s -> s.getSabor().getNombre())
                    .toList();
            r.adicionales = item.getAdicionales().stream()
                    .map(a -> a.getAdicional().getNombre())
                    .toList();
            return r;
        }

        public Long getIdItem() { return idItem; }
        public Long getIdProducto() { return idProducto; }
        public String getNombre() { return nombre; }
        public Integer getCantidad() { return cantidad; }
        public BigDecimal getPrecioBase() { return precioBase; }
        public List<String> getSabores() { return sabores; }
        public List<String> getAdicionales() { return adicionales; }
    }
}
