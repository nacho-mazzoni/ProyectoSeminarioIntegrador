package com.seminario.heladeria.entity;

public enum EstadoPedido {
    PENDIENTE,
    PAGADO,
    RECHAZADO,
    EN_PREPARACION,
    LISTO_PARA_RETIRO,
    EN_CAMINO,
    ENTREGADO,
    CANCELADO;

    public static EstadoPedido parse(String estado) {
        try {
            return valueOf(estado == null ? "" : estado.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Estado de pedido desconocido: " + estado);
        }
    }
}
