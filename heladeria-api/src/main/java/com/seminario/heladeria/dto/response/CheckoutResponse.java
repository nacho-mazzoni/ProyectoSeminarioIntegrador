package com.seminario.heladeria.dto.response;

public class CheckoutResponse {

    private PedidoResponse pedido;
    private String initPoint;
    private Long pagoId;

    public CheckoutResponse(PedidoResponse pedido, String initPoint, Long pagoId) {
        this.pedido = pedido;
        this.initPoint = initPoint;
        this.pagoId = pagoId;
    }

    public PedidoResponse getPedido() { return pedido; }
    public String getInitPoint() { return initPoint; }
    public Long getPagoId() { return pagoId; }
}