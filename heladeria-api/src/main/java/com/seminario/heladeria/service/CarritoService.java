package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.CarritoItemRequest;
import com.seminario.heladeria.dto.request.CheckoutRequest;
import com.seminario.heladeria.dto.request.PedidoRequest;
import com.seminario.heladeria.dto.response.CarritoResponse;
import com.seminario.heladeria.dto.response.CheckoutResponse;
import com.seminario.heladeria.dto.response.PedidoResponse;
import com.seminario.heladeria.entity.*;
import com.seminario.heladeria.repository.*;
import com.seminario.heladeria.exception.BusinessRuleException;
import com.seminario.heladeria.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoItemRepository carritoItemRepository;
    private final ClienteService clienteService;
    private final ProductoRepository productoRepository;
    private final SaborRepository saborRepository;
    private final AdicionalRepository adicionalRepository;
    private final PedidoService pedidoService;
    private final PagoService pagoService;
    private final DireccionService direccionService;

    public CarritoService(CarritoRepository carritoRepository,
                          CarritoItemRepository carritoItemRepository,
                          ClienteService clienteService,
                          ProductoRepository productoRepository,
                          SaborRepository saborRepository,
                          AdicionalRepository adicionalRepository,
                          PedidoService pedidoService,
                          PagoService pagoService,
                          DireccionService direccionService) {
        this.carritoRepository = carritoRepository;
        this.carritoItemRepository = carritoItemRepository;
        this.clienteService = clienteService;
        this.productoRepository = productoRepository;
        this.saborRepository = saborRepository;
        this.adicionalRepository = adicionalRepository;
        this.pedidoService = pedidoService;
        this.pagoService = pagoService;
        this.direccionService = direccionService;
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
                .orElseThrow(() -> {
                    log.error("Producto no encontrado al agregar item: {}", request.getIdProducto());
                    return new ResourceNotFoundException("Producto no encontrado");
                });

        if (producto.getCategoria().getRequiereSabores() &&
            (request.getIdsSabor() == null || request.getIdsSabor().isEmpty())) {
            log.error("Producto {} requiere sabores pero no se enviaron", request.getIdProducto());
            throw new BusinessRuleException("Este producto requiere al menos un sabor");
        }
        if (!producto.getCategoria().getRequiereSabores() &&
                request.getIdsSabor() != null && !request.getIdsSabor().isEmpty()) {
            log.error("Producto {} no admite sabores pero se enviaron", request.getIdProducto());
            throw new BusinessRuleException("Este producto no admite sabores");
        }
        if (request.getIdsSabor() != null && request.getIdsSabor().size() > producto.getMaxSabores()) {
            log.error("Producto {} excede maximo de sabores: {} > {}", request.getIdProducto(),
                    request.getIdsSabor().size(), producto.getMaxSabores());
            throw new BusinessRuleException("Máximo " + producto.getMaxSabores() + " sabores permitidos");
        }

        CarritoItem item = new CarritoItem();
        item.setCarrito(carrito);
        item.setProducto(producto);
        item.setCantidad(request.getCantidad());

        if (request.getIdsSabor() != null) {
            for (Long idSabor : request.getIdsSabor()) {
                Sabor sabor = saborRepository.findById(idSabor)
                        .orElseThrow(() -> new ResourceNotFoundException("Sabor no encontrado: " + idSabor));
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
                        .orElseThrow(() -> new ResourceNotFoundException("Adicional no encontrado: " + idAdicional));
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
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"));

        if (!item.getCarrito().getIdCarrito().equals(carrito.getIdCarrito())) {
            throw new BusinessRuleException("El item no pertenece al carrito del usuario");
        }

        Producto producto = productoRepository.findById(request.getIdProducto())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        if (producto.getCategoria().getRequiereSabores() &&
                (request.getIdsSabor() == null || request.getIdsSabor().isEmpty())) {
            throw new BusinessRuleException("Este producto requiere al menos un sabor");
        }
        if (request.getIdsSabor() != null && request.getIdsSabor().size() > producto.getMaxSabores()) {
            throw new BusinessRuleException("Máximo " + producto.getMaxSabores() + " sabores permitidos");
        }

        item.setCantidad(request.getCantidad());
        item.getSabores().clear();
        item.getAdicionales().clear();

        if (request.getIdsSabor() != null) {
            for (Long idSabor : request.getIdsSabor()) {
                Sabor sabor = saborRepository.findById(idSabor)
                        .orElseThrow(() -> new ResourceNotFoundException("Sabor no encontrado: " + idSabor));
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
                        .orElseThrow(() -> new ResourceNotFoundException("Adicional no encontrado: " + idAdicional));
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
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"));

        if (!item.getCarrito().getIdCarrito().equals(carrito.getIdCarrito())) {
            throw new BusinessRuleException("El item no pertenece al carrito del usuario");
        }

        carrito.getItems().remove(item);
        carritoItemRepository.delete(item);
    }

    public CarritoResponse obtenerResponse(Usuario usuario) {
        Carrito carrito = obtenerOCrear(usuario);
        return CarritoResponse.from(carrito);
    }

    @Transactional
    public CheckoutResponse checkout(Usuario usuario, CheckoutRequest request) {
        Carrito carrito = obtenerOCrear(usuario);

        if (carrito.getItems().isEmpty()) {
            throw new BusinessRuleException("El carrito está vacío");
        }

        Cliente cliente = clienteService.findById(usuario.getIdUsuario());

        if (request.getIdDireccion() != null && request.getIdDireccion() > 0) {
            Direccion direccion = direccionService.findById(request.getIdDireccion());
            if (!direccion.getCliente().getIdUsuario().equals(cliente.getIdUsuario())) {
                throw new BusinessRuleException("La dirección no pertenece al usuario");
            }
        }

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
        PedidoResponse pedidoResponse = pedidoService.buildResponse(pedido);

        if ("mercado_pago".equals(request.getMetodoPago())) {
            pagoService.crearPagoConMP(pedido);
            String initPoint = pagoService.crearPreferenciaMP(pedido);
            PedidoResponse finalResponse = pedidoService.buildResponse(pedido);
            carritoRepository.delete(carrito);
            return new CheckoutResponse(finalResponse, initPoint, null);
        } else {
            pagoService.crearPagoEfectivo(pedido);
            PedidoResponse finalResponse = pedidoService.buildResponse(pedido);
            carritoRepository.delete(carrito);
            return new CheckoutResponse(finalResponse, null, null);
        }
    }
}