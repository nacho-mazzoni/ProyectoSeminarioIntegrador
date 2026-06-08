package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.DireccionRequest;
import com.seminario.heladeria.entity.Cliente;
import com.seminario.heladeria.entity.Direccion;
import com.seminario.heladeria.entity.ZonaEnvio;
import com.seminario.heladeria.repository.DireccionRepository;
import com.seminario.heladeria.repository.ZonaEnvioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DireccionService {

    private final DireccionRepository direccionRepository;
    private final ZonaEnvioRepository zonaEnvioRepository;
    private final ClienteService clienteService;

    public DireccionService(DireccionRepository direccionRepository,
                            ZonaEnvioRepository zonaEnvioRepository,
                            ClienteService clienteService) {
        this.direccionRepository = direccionRepository;
        this.zonaEnvioRepository = zonaEnvioRepository;
        this.clienteService = clienteService;
    }

    public List<Direccion> findByCliente(Long idCliente) {
        return direccionRepository.findByIdUsuario(idCliente);
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
    public void eliminar(Long id) {
        Direccion direccion = findById(id);
        direccionRepository.delete(direccion);
    }
}
