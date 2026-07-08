package com.seminario.heladeria.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "carrito_item_sabor")
public class CarritoItemSabor {

    @EmbeddedId
    private CarritoItemSaborId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idItem")
    @JoinColumn(name = "id_item")
    private CarritoItem carritoItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idSabor")
    @JoinColumn(name = "id_sabor")
    private Sabor sabor;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public CarritoItemSabor() {}

    @PrePersist
    void prePersist() {
        this.createdAt = Instant.now();
    }

    public CarritoItemSaborId getId() { return id; }
    public void setId(CarritoItemSaborId id) { this.id = id; }

    public CarritoItem getCarritoItem() { return carritoItem; }
    public void setCarritoItem(CarritoItem carritoItem) { this.carritoItem = carritoItem; }

    public Sabor getSabor() { return sabor; }
    public void setSabor(Sabor sabor) { this.sabor = sabor; }

    public Instant getCreatedAt() { return createdAt; }
}
