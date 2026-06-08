package com.seminario.heladeria.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "promocion")
public class Promocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_promocion")
    private Long idPromocion;

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @Column(name = "porc_desc", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcDesc;

    @Column(nullable = false)
    private Boolean activa = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Promocion() {}

    public Long getIdPromocion() { return idPromocion; }
    public void setIdPromocion(Long idPromocion) { this.idPromocion = idPromocion; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public BigDecimal getPorcDesc() { return porcDesc; }
    public void setPorcDesc(BigDecimal porcDesc) { this.porcDesc = porcDesc; }

    public Boolean getActiva() { return activa; }
    public void setActiva(Boolean activa) { this.activa = activa; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
