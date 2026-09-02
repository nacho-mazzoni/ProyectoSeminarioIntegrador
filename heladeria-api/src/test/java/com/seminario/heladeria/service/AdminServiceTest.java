package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.CambioEstadoRequest;
import com.seminario.heladeria.dto.response.PedidoResponse;
import com.seminario.heladeria.entity.HistorialEstado;
import com.seminario.heladeria.entity.Pedido;
import com.seminario.heladeria.exception.BusinessRuleException;
import com.seminario.heladeria.repository.HistorialEstadoRepository;
import com.seminario.heladeria.repository.PedidoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@Sql("/test-seed.sql")
class AdminServiceTest {

    @Autowired
    private AdminService adminService;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private HistorialEstadoRepository historialEstadoRepository;

    @Test
    void cambiarEstado_flujoDeliveryCompleto() {
        // Pedido 1 en test-seed es 'delivery' y tiene estado 'PENDIENTE'
        CambioEstadoRequest reqPrep = new CambioEstadoRequest();
        reqPrep.setEstado("EN_PREPARACION");
        PedidoResponse r1 = adminService.cambiarEstadoPedido(1L, reqPrep);
        assertThat(r1.getHistorial().get(r1.getHistorial().size() - 1).getEstado()).isEqualTo("EN_PREPARACION");

        // No puede pasar directamente a ENTREGADO o a LISTO_PARA_RETIRAR
        CambioEstadoRequest reqInvalido = new CambioEstadoRequest();
        reqInvalido.setEstado("LISTO_PARA_RETIRAR");
        assertThatThrownBy(() -> adminService.cambiarEstadoPedido(1L, reqInvalido))
                .isInstanceOf(BusinessRuleException.class);

        // Pasa a LISTO_PARA_ENVIO
        CambioEstadoRequest reqListo = new CambioEstadoRequest();
        reqListo.setEstado("LISTO_PARA_ENVIO");
        PedidoResponse r2 = adminService.cambiarEstadoPedido(1L, reqListo);
        assertThat(r2.getHistorial().get(r2.getHistorial().size() - 1).getEstado()).isEqualTo("LISTO_PARA_ENVIO");

        // En LISTO_PARA_ENVIO no puede cancelarse
        CambioEstadoRequest reqCancel = new CambioEstadoRequest();
        reqCancel.setEstado("CANCELADO");
        assertThatThrownBy(() -> adminService.cambiarEstadoPedido(1L, reqCancel))
                .isInstanceOf(BusinessRuleException.class);

        // Pasa a EN_CAMINO
        CambioEstadoRequest reqCamino = new CambioEstadoRequest();
        reqCamino.setEstado("EN_CAMINO");
        PedidoResponse r3 = adminService.cambiarEstadoPedido(1L, reqCamino);
        assertThat(r3.getHistorial().get(r3.getHistorial().size() - 1).getEstado()).isEqualTo("EN_CAMINO");

        // Pasa a ENTREGADO
        CambioEstadoRequest reqEntregado = new CambioEstadoRequest();
        reqEntregado.setEstado("ENTREGADO");
        PedidoResponse r4 = adminService.cambiarEstadoPedido(1L, reqEntregado);
        assertThat(r4.getHistorial().get(r4.getHistorial().size() - 1).getEstado()).isEqualTo("ENTREGADO");

        // ENTREGADO es terminal, no puede volver a cambiar
        assertThatThrownBy(() -> adminService.cambiarEstadoPedido(1L, reqCamino))
                .isInstanceOf(BusinessRuleException.class);
    }

    @Test
    void cambiarEstado_flujoRetiroCompleto() {
        // Creamos un pedido con retiro en PENDIENTE modificando pedido 1 a retiro
        Pedido p = pedidoRepository.findById(1L).orElseThrow();
        p.setMetodoEntrega("retiro");
        pedidoRepository.save(p);

        // PENDIENTE -> EN_PREPARACION
        CambioEstadoRequest reqPrep = new CambioEstadoRequest();
        reqPrep.setEstado("EN_PREPARACION");
        adminService.cambiarEstadoPedido(1L, reqPrep);

        // EN_PREPARACION no puede ir a LISTO_PARA_ENVIO porque es retiro
        CambioEstadoRequest reqEnvio = new CambioEstadoRequest();
        reqEnvio.setEstado("LISTO_PARA_ENVIO");
        assertThatThrownBy(() -> adminService.cambiarEstadoPedido(1L, reqEnvio))
                .isInstanceOf(BusinessRuleException.class);

        // EN_PREPARACION -> LISTO_PARA_RETIRAR
        CambioEstadoRequest reqListo = new CambioEstadoRequest();
        reqListo.setEstado("LISTO_PARA_RETIRAR");
        PedidoResponse r1 = adminService.cambiarEstadoPedido(1L, reqListo);
        assertThat(r1.getHistorial().get(r1.getHistorial().size() - 1).getEstado()).isEqualTo("LISTO_PARA_RETIRAR");

        // LISTO_PARA_RETIRAR no puede cancelarse
        CambioEstadoRequest reqCancel = new CambioEstadoRequest();
        reqCancel.setEstado("CANCELADO");
        assertThatThrownBy(() -> adminService.cambiarEstadoPedido(1L, reqCancel))
                .isInstanceOf(BusinessRuleException.class);

        // LISTO_PARA_RETIRAR -> FINALIZADO
        CambioEstadoRequest reqFin = new CambioEstadoRequest();
        reqFin.setEstado("FINALIZADO");
        PedidoResponse r2 = adminService.cambiarEstadoPedido(1L, reqFin);
        assertThat(r2.getHistorial().get(r2.getHistorial().size() - 1).getEstado()).isEqualTo("FINALIZADO");

        // FINALIZADO es terminal
        assertThatThrownBy(() -> adminService.cambiarEstadoPedido(1L, reqListo))
                .isInstanceOf(BusinessRuleException.class);
    }

    @Test
    void cambiarEstado_cancelarDesdeEnPreparacion() {
        CambioEstadoRequest reqPrep = new CambioEstadoRequest();
        reqPrep.setEstado("EN_PREPARACION");
        adminService.cambiarEstadoPedido(1L, reqPrep);

        CambioEstadoRequest reqCancel = new CambioEstadoRequest();
        reqCancel.setEstado("CANCELADO");
        PedidoResponse response = adminService.cambiarEstadoPedido(1L, reqCancel);

        var ultimo = response.getHistorial().get(response.getHistorial().size() - 1);
        assertThat(ultimo.getEstado()).isEqualTo("CANCELADO");
        assertThat(ultimo.getNotas()).isEqualTo("Cancelado por el administrador");
    }
}
