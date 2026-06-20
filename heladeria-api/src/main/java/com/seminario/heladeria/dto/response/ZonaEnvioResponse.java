package com.seminario.heladeria.dto.response;

import com.seminario.heladeria.entity.ZonaEnvio;

import java.math.BigDecimal;

public class ZonaEnvioResponse {

    private Long idZona;
    private String nombreZona;
    private BigDecimal costoEnvio;

    public ZonaEnvioResponse() {}

    public static ZonaEnvioResponse from(ZonaEnvio z) {
        ZonaEnvioResponse r = new ZonaEnvioResponse();
        r.idZona = z.getIdZona();
        r.nombreZona = z.getNombreZona();
        r.costoEnvio = z.getCostoEnvio();
        return r;
    }

    public Long getIdZona() { return idZona; }
    public String getNombreZona() { return nombreZona; }
    public BigDecimal getCostoEnvio() { return costoEnvio; }
}
