package com.seminario.heladeria.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "carrito_item_adicional")
public class CarritoItemAdicional {

    @EmbeddedId
    private CarritoItemAdicionalId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idItem")
    @JoinColumn(name = "id_item")
    private CarritoItem carritoItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idAdicional")
    @JoinColumn(name = "id_adicional")
    private Adicional adicional;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public CarritoItemAdicional() {}

    @PrePersist
    void prePersist() {
        this.createdAt = Instant.now();
    }

    public CarritoItemAdicionalId getId() { return id; }
    public void setId(CarritoItemAdicionalId id) { this.id = id; }

    public CarritoItem getCarritoItem() { return carritoItem; }
    public void setCarritoItem(CarritoItem carritoItem) { this.carritoItem = carritoItem; }

    public Adicional getAdicional() { return adicional; }
    public void setAdicional(Adicional adicional) { this.adicional = adicional; }

    public Instant getCreatedAt() { return createdAt; }
}
