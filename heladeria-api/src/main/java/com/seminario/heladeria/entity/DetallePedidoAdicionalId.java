package com.seminario.heladeria.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class DetallePedidoAdicionalId implements Serializable {

    private Long idDetalle;
    private Long idAdicional;

    public DetallePedidoAdicionalId() {}

    public DetallePedidoAdicionalId(Long idDetalle, Long idAdicional) {
        this.idDetalle = idDetalle;
        this.idAdicional = idAdicional;
    }

    public Long getIdDetalle() { return idDetalle; }
    public void setIdDetalle(Long idDetalle) { this.idDetalle = idDetalle; }

    public Long getIdAdicional() { return idAdicional; }
    public void setIdAdicional(Long idAdicional) { this.idAdicional = idAdicional; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DetallePedidoAdicionalId that)) return false;
        return Objects.equals(idDetalle, that.idDetalle) && Objects.equals(idAdicional, that.idAdicional);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idDetalle, idAdicional);
    }
}
