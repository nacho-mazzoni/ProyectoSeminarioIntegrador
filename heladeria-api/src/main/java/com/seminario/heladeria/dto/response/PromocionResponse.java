package com.seminario.heladeria.dto.response;

import com.seminario.heladeria.entity.Promocion;
import java.math.BigDecimal;
import java.time.Instant;

public class PromocionResponse {

    private Long idPromocion;
    private String codigo;
    private String descripcion;
    private BigDecimal porcDesc;
    private Boolean activa;
    private Instant createdAt;

    public static PromocionResponse from(Promocion p) {
        PromocionResponse r = new PromocionResponse();
        r.idPromocion = p.getIdPromocion();
        r.codigo = p.getCodigo();
        r.descripcion = p.getDescripcion();
        r.porcDesc = p.getPorcDesc();
        r.activa = p.getActiva();
        r.createdAt = p.getCreatedAt();
        return r;
    }

    public Long getIdPromocion() { return idPromocion; }
    public String getCodigo() { return codigo; }
    public String getDescripcion() { return descripcion; }
    public BigDecimal getPorcDesc() { return porcDesc; }
    public Boolean getActiva() { return activa; }
    public Instant getCreatedAt() { return createdAt; }
}