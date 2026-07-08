package com.seminario.heladeria.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "carrito_item")
public class CarritoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private Long idItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_carrito", nullable = false)
    private Carrito carrito;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad = 1;

    @OneToMany(mappedBy = "carritoItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CarritoItemSabor> sabores = new HashSet<>();

    @OneToMany(mappedBy = "carritoItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CarritoItemAdicional> adicionales = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public CarritoItem() {}

    @PrePersist
    void prePersist() {
        this.createdAt = Instant.now();
    }

    public Long getIdItem() { return idItem; }
    public void setIdItem(Long idItem) { this.idItem = idItem; }

    public Carrito getCarrito() { return carrito; }
    public void setCarrito(Carrito carrito) { this.carrito = carrito; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Set<CarritoItemSabor> getSabores() { return sabores; }
    public void setSabores(Set<CarritoItemSabor> sabores) { this.sabores = sabores; }

    public Set<CarritoItemAdicional> getAdicionales() { return adicionales; }
    public void setAdicionales(Set<CarritoItemAdicional> adicionales) { this.adicionales = adicionales; }

    public Instant getCreatedAt() { return createdAt; }
}
