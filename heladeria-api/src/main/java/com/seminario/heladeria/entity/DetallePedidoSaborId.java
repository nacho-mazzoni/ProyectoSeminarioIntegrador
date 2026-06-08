package com.seminario.heladeria.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class DetallePedidoSaborId implements Serializable {

    private Long idDetalle;
    private Long idSabor;

    public DetallePedidoSaborId() {}

    public DetallePedidoSaborId(Long idDetalle, Long idSabor) {
        this.idDetalle = idDetalle;
        this.idSabor = idSabor;
    }

    public Long getIdDetalle() { return idDetalle; }
    public void setIdDetalle(Long idDetalle) { this.idDetalle = idDetalle; }

    public Long getIdSabor() { return idSabor; }
    public void setIdSabor(Long idSabor) { this.idSabor = idSabor; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DetallePedidoSaborId that)) return false;
        return Objects.equals(idDetalle, that.idDetalle) && Objects.equals(idSabor, that.idSabor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idDetalle, idSabor);
    }
}
