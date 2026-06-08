package com.seminario.heladeria.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "detalle_pedido")
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Long idDetalle;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unit_hist", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitHist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @OneToMany(mappedBy = "detallePedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DetallePedidoSabor> sabores = new HashSet<>();

    @OneToMany(mappedBy = "detallePedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DetallePedidoAdicional> adicionales = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public DetallePedido() {}

    public Long getIdDetalle() { return idDetalle; }
    public void setIdDetalle(Long idDetalle) { this.idDetalle = idDetalle; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitHist() { return precioUnitHist; }
    public void setPrecioUnitHist(BigDecimal precioUnitHist) { this.precioUnitHist = precioUnitHist; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public Set<DetallePedidoSabor> getSabores() { return sabores; }
    public void setSabores(Set<DetallePedidoSabor> sabores) { this.sabores = sabores; }

    public Set<DetallePedidoAdicional> getAdicionales() { return adicionales; }
    public void setAdicionales(Set<DetallePedidoAdicional> adicionales) { this.adicionales = adicionales; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
