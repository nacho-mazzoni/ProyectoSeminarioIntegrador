package com.seminario.heladeria.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "detalle_pedido_adicional")
public class DetallePedidoAdicional {

    @EmbeddedId
    private DetallePedidoAdicionalId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idDetalle")
    @JoinColumn(name = "id_detalle")
    private DetallePedido detallePedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idAdicional")
    @JoinColumn(name = "id_adicional")
    private Adicional adicional;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public DetallePedidoAdicional() {}

    @PrePersist
    void prePersist() {
        this.createdAt = Instant.now();
    }

    public DetallePedidoAdicionalId getId() { return id; }
    public void setId(DetallePedidoAdicionalId id) { this.id = id; }

    public DetallePedido getDetallePedido() { return detallePedido; }
    public void setDetallePedido(DetallePedido detallePedido) { this.detallePedido = detallePedido; }

    public Adicional getAdicional() { return adicional; }
    public void setAdicional(Adicional adicional) { this.adicional = adicional; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
