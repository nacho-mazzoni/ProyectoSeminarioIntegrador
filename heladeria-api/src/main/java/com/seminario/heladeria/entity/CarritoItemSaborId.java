package com.seminario.heladeria.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CarritoItemSaborId implements Serializable {

    @Column(name = "id_item")
    private Long idItem;

    @Column(name = "id_sabor")
    private Long idSabor;

    public CarritoItemSaborId() {}

    public CarritoItemSaborId(Long idItem, Long idSabor) {
        this.idItem = idItem;
        this.idSabor = idSabor;
    }

    public Long getIdItem() { return idItem; }
    public void setIdItem(Long idItem) { this.idItem = idItem; }

    public Long getIdSabor() { return idSabor; }
    public void setIdSabor(Long idSabor) { this.idSabor = idSabor; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CarritoItemSaborId that)) return false;
        return Objects.equals(idItem, that.idItem) && Objects.equals(idSabor, that.idSabor);
    }

    @Override
    public int hashCode() { return Objects.hash(idItem, idSabor); }
}
