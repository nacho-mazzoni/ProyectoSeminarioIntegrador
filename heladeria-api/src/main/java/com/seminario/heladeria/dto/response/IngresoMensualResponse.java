package com.seminario.heladeria.dto.response;

import java.math.BigDecimal;

public class IngresoMensualResponse {

    private String mes;
    private BigDecimal total;
    private long cantidad;

    public IngresoMensualResponse(String mes, BigDecimal total, long cantidad) {
        this.mes = mes;
        this.total = total;
        this.cantidad = cantidad;
    }

    public String getMes() { return mes; }
    public void setMes(String mes) { this.mes = mes; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public long getCantidad() { return cantidad; }
    public void setCantidad(long cantidad) { this.cantidad = cantidad; }
}
