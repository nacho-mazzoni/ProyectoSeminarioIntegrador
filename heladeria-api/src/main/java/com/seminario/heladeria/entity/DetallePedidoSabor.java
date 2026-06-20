package com.seminario.heladeria.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "detalle_pedido_sabor")
public class DetallePedidoSabor {

    @EmbeddedId
    private DetallePedidoSaborId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idDetalle")
    @JoinColumn(name = "id_detalle")
    private DetallePedido detallePedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idSabor")
    @JoinColumn(name = "id_sabor")
    private Sabor sabor;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public DetallePedidoSabor() {}

    @PrePersist
    void prePersist() {
        this.createdAt = Instant.now();
    }

    public DetallePedidoSaborId getId() { return id; }
    public void setId(DetallePedidoSaborId id) { this.id = id; }

    public DetallePedido getDetallePedido() { return detallePedido; }
    public void setDetallePedido(DetallePedido detallePedido) { this.detallePedido = detallePedido; }

    public Sabor getSabor() { return sabor; }
    public void setSabor(Sabor sabor) { this.sabor = sabor; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
