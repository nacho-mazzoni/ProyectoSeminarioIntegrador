package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.CarritoItemRequest;
import com.seminario.heladeria.dto.request.CheckoutRequest;
import com.seminario.heladeria.dto.request.PedidoRequest;
import com.seminario.heladeria.dto.response.CarritoResponse;
import com.seminario.heladeria.dto.response.PedidoResponse;
import com.seminario.heladeria.entity.*;
import com.seminario.heladeria.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoItemRepository carritoItemRepository;
    private final ClienteService clienteService;
    private final ProductoRepository productoRepository;
    private final SaborRepository saborRepository;
    private final AdicionalRepository adicionalRepository;
    private final PedidoService pedidoService;

    public CarritoService(CarritoRepository carritoRepository,
                          CarritoItemRepository carritoItemRepository,
                          ClienteService clienteService,
                          ProductoRepository productoRepository,
                          SaborRepository saborRepository,
                          AdicionalRepository adicionalRepository,
                          PedidoService pedidoService) {
        this.carritoRepository = carritoRepository;
        this.carritoItemRepository = carritoItemRepository;
        this.clienteService = clienteService;
        this.productoRepository = productoRepository;
        this.saborRepository = saborRepository;
        this.adicionalRepository = adicionalRepository;
        this.pedidoService = pedidoService;
    }

    @Transactional
    public Carrito obtenerOCrear(Usuario usuario) {
        Cliente cliente = clienteService.findById(usuario.getIdUsuario());
        return carritoRepository.findByClienteIdUsuario(cliente.getIdUsuario())
                .orElseGet(() -> {
                    Carrito carrito = new Carrito();
                    carrito.setCliente(cliente);
                    return carritoRepository.save(carrito);
                });
    }

    @Transactional
    public CarritoItem agregarItem(Usuario usuario, CarritoItemRequest request) {
        Carrito carrito = obtenerOCrear(usuario);
        Producto producto = productoRepository.findById(request.getIdProducto())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        CarritoItem item = new CarritoItem();
        item.setCarrito(carrito);
        item.setProducto(producto);
        item.setCantidad(request.getCantidad());

        if (request.getIdsSabor() != null) {
            for (Long idSabor : request.getIdsSabor()) {
                Sabor sabor = saborRepository.findById(idSabor)
                        .orElseThrow(() -> new RuntimeException("Sabor no encontrado: " + idSabor));
                CarritoItemSabor cis = new CarritoItemSabor();
                cis.setId(new CarritoItemSaborId(null, idSabor));
                cis.setCarritoItem(item);
                cis.setSabor(sabor);
                item.getSabores().add(cis);
            }
        }

        if (request.getIdsAdicional() != null) {
            for (Long idAdicional : request.getIdsAdicional()) {
                Adicional adicional = adicionalRepository.findById(idAdicional)
                        .orElseThrow(() -> new RuntimeException("Adicional no encontrado: " + idAdicional));
                CarritoItemAdicional cia = new CarritoItemAdicional();
                cia.setId(new CarritoItemAdicionalId(null, idAdicional));
                cia.setCarritoItem(item);
                cia.setAdicional(adicional);
                item.getAdicionales().add(cia);
            }
        }

        carrito.getItems().add(item);
        carritoItemRepository.save(item);
        return item;
    }

    @Transactional
    public CarritoItem actualizarItem(Usuario usuario, Long idItem, CarritoItemRequest request) {
        Carrito carrito = obtenerOCrear(usuario);
        CarritoItem item = carritoItemRepository.findById(idItem)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));

        if (!item.getCarrito().getIdCarrito().equals(carrito.getIdCarrito())) {
            throw new RuntimeException("El item no pertenece al carrito del usuario");
        }

        item.setCantidad(request.getCantidad());
        item.getSabores().clear();
        item.getAdicionales().clear();

        if (request.getIdsSabor() != null) {
            for (Long idSabor : request.getIdsSabor()) {
                Sabor sabor = saborRepository.findById(idSabor)
                        .orElseThrow(() -> new RuntimeException("Sabor no encontrado: " + idSabor));
                CarritoItemSabor cis = new CarritoItemSabor();
                cis.setId(new CarritoItemSaborId(idItem, idSabor));
                cis.setCarritoItem(item);
                cis.setSabor(sabor);
                item.getSabores().add(cis);
            }
        }

        if (request.getIdsAdicional() != null) {
            for (Long idAdicional : request.getIdsAdicional()) {
                Adicional adicional = adicionalRepository.findById(idAdicional)
                        .orElseThrow(() -> new RuntimeException("Adicional no encontrado: " + idAdicional));
                CarritoItemAdicional cia = new CarritoItemAdicional();
                cia.setId(new CarritoItemAdicionalId(idItem, idAdicional));
                cia.setCarritoItem(item);
                cia.setAdicional(adicional);
                item.getAdicionales().add(cia);
            }
        }

        return carritoItemRepository.save(item);
    }

    @Transactional
    public void eliminarItem(Usuario usuario, Long idItem) {
        Carrito carrito = obtenerOCrear(usuario);
        CarritoItem item = carritoItemRepository.findById(idItem)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));

        if (!item.getCarrito().getIdCarrito().equals(carrito.getIdCarrito())) {
            throw new RuntimeException("El item no pertenece al carrito del usuario");
        }

        carrito.getItems().remove(item);
        carritoItemRepository.delete(item);
    }

    public CarritoResponse obtenerResponse(Usuario usuario) {
        Carrito carrito = obtenerOCrear(usuario);
        return CarritoResponse.from(carrito);
    }

    @Transactional
    public PedidoResponse checkout(Usuario usuario, CheckoutRequest request) {
        Carrito carrito = obtenerOCrear(usuario);

        if (carrito.getItems().isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        Cliente cliente = clienteService.findById(usuario.getIdUsuario());

        PedidoRequest pedidoRequest = new PedidoRequest();
        pedidoRequest.setMetodoEntrega(request.getMetodoEntrega());
        pedidoRequest.setIdDireccion(request.getIdDireccion());
        pedidoRequest.setCodigoPromocion(request.getCodigoPromocion());

        List<PedidoRequest.DetalleRequest> detalles = new ArrayList<>();
        for (CarritoItem item : carrito.getItems()) {
            PedidoRequest.DetalleRequest dr = new PedidoRequest.DetalleRequest();
            dr.setIdProducto(item.getProducto().getIdProducto());
            dr.setCantidad(item.getCantidad());
            dr.setIdsSabor(item.getSabores().stream()
                    .map(s -> s.getSabor().getIdSabor())
                    .toList());
            dr.setIdsAdicional(item.getAdicionales().stream()
                    .map(a -> a.getAdicional().getIdAdicional())
                    .toList());
            detalles.add(dr);
        }
        pedidoRequest.setDetalles(detalles);

        Pedido pedido = pedidoService.crear(cliente, pedidoRequest);

        carritoRepository.delete(carrito);

        return pedidoService.buildResponse(pedido);
    }
}
