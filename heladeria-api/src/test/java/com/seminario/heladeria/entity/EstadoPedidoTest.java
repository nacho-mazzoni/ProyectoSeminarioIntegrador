package com.seminario.heladeria.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class EstadoPedidoTest {
    @Test
    void soloIncluyeEstadosOficiales() {
        assertEquals(8, EstadoPedido.values().length);
        assertThrows(IllegalArgumentException.class, () -> EstadoPedido.parse("MODIFICADO"));
        assertEquals(EstadoPedido.EN_PREPARACION, EstadoPedido.parse(" en_preparacion "));
    }
}
