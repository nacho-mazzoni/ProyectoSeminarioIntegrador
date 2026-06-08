package com.seminario.heladeria.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "sabor")
public class Sabor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sabor")
    private Long idSabor;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(name = "stock_baldes", nullable = false)
    private Integer stockBaldes = 0;

    @Column(nullable = false)
    private Boolean disponible = true;

    @Column(name = "cap_balde", length = 50)
    private String capBalde;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Sabor() {}

    public Long getIdSabor() { return idSabor; }
    public void setIdSabor(Long idSabor) { this.idSabor = idSabor; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Integer getStockBaldes() { return stockBaldes; }
    public void setStockBaldes(Integer stockBaldes) { this.stockBaldes = stockBaldes; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public String getCapBalde() { return capBalde; }
    public void setCapBalde(String capBalde) { this.capBalde = capBalde; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
