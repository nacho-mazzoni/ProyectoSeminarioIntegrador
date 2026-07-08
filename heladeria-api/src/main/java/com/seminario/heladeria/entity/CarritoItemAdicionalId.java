package com.seminario.heladeria.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CarritoItemAdicionalId implements Serializable {

    @Column(name = "id_item")
    private Long idItem;

    @Column(name = "id_adicional")
    private Long idAdicional;

    public CarritoItemAdicionalId() {}

    public CarritoItemAdicionalId(Long idItem, Long idAdicional) {
        this.idItem = idItem;
        this.idAdicional = idAdicional;
    }

    public Long getIdItem() { return idItem; }
    public void setIdItem(Long idItem) { this.idItem = idItem; }

    public Long getIdAdicional() { return idAdicional; }
    public void setIdAdicional(Long idAdicional) { this.idAdicional = idAdicional; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CarritoItemAdicionalId that)) return false;
        return Objects.equals(idItem, that.idItem) && Objects.equals(idAdicional, that.idAdicional);
    }

    @Override
    public int hashCode() { return Objects.hash(idItem, idAdicional); }
}
