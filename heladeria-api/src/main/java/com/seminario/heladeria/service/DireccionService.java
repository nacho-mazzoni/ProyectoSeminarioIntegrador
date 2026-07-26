package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.DireccionRequest;
import com.seminario.heladeria.entity.Cliente;
import com.seminario.heladeria.entity.Direccion;
import com.seminario.heladeria.entity.HistorialEstado;
import com.seminario.heladeria.entity.Pedido;
import com.seminario.heladeria.entity.ZonaEnvio;
import com.seminario.heladeria.repository.DireccionRepository;
import com.seminario.heladeria.repository.HistorialEstadoRepository;
import com.seminario.heladeria.repository.PedidoRepository;
import com.seminario.heladeria.repository.ZonaEnvioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DireccionService {

    private final DireccionRepository direccionRepository;
    private final PedidoRepository pedidoRepository;
    private final HistorialEstadoRepository historialEstadoRepository;
    private final ZonaEnvioRepository zonaEnvioRepository;
    private final ClienteService clienteService;

    public DireccionService(DireccionRepository direccionRepository,
                            PedidoRepository pedidoRepository,
                            HistorialEstadoRepository historialEstadoRepository,
                            ZonaEnvioRepository zonaEnvioRepository,
                            ClienteService clienteService) {
        this.direccionRepository = direccionRepository;
        this.pedidoRepository = pedidoRepository;
        this.historialEstadoRepository = historialEstadoRepository;
        this.zonaEnvioRepository = zonaEnvioRepository;
        this.clienteService = clienteService;
    }

    public List<Direccion> findByCliente(Long idCliente) {
        return direccionRepository.findByClienteIdUsuario(idCliente);
    }

    public Direccion findById(Long id) {
        return direccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Direccion no encontrada"));
    }

    @Transactional
    public Direccion crear(Long idCliente, DireccionRequest request) {
        Cliente cliente = clienteService.findById(idCliente);
        ZonaEnvio zona = zonaEnvioRepository.findById(request.getIdZona())
                .orElseThrow(() -> new RuntimeException("Zona de envio no encontrada"));

        Direccion direccion = new Direccion();
        direccion.setCalle(request.getCalle());
        direccion.setNumero(request.getNumero());
        direccion.setCiudad(request.getCiudad());
        direccion.setReferencia(request.getReferencia());
        direccion.setCliente(cliente);
        direccion.setZonaEnvio(zona);

        return direccionRepository.save(direccion);
    }

    @Transactional
    public void eliminar(Long id, Long idCliente) {
        Direccion direccion = findById(id);
        if (!direccion.getCliente().getIdUsuario().equals(idCliente)) {
            throw new RuntimeException("No tienes permiso para eliminar esta direccion");
        }
        List<Pedido> pedidos = pedidoRepository.findByDireccionIdDireccion(id);
        for (Pedido pedido : pedidos) {
            String ultimoEstado = getUltimoEstado(pedido.getIdPedido());
            if (!"CANCELADO".equals(ultimoEstado) && !"ENTREGADO".equals(ultimoEstado)) {
                throw new RuntimeException("No se puede eliminar la direccion porque tiene pedidos activos asociados");
            }
        }
        for (Pedido pedido : pedidos) {
            pedido.setDireccion(null);
            pedidoRepository.save(pedido);
        }
        direccionRepository.delete(direccion);
    }

    private String getUltimoEstado(Long idPedido) {
        return historialEstadoRepository
                .findByPedidoIdPedidoOrderByFechaHoraAsc(idPedido)
                .stream()
                .reduce((first, second) -> second)
                .map(HistorialEstado::getEstado)
                .orElse("PENDIENTE");
    }
}
