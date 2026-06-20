package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.ProductoRequest;
import com.seminario.heladeria.dto.response.*;
import com.seminario.heladeria.entity.*;
import com.seminario.heladeria.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final SaborRepository saborRepository;
    private final AdicionalRepository adicionalRepository;

    public ProductoService(ProductoRepository productoRepository,
                           CategoriaRepository categoriaRepository,
                           SaborRepository saborRepository,
                           AdicionalRepository adicionalRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.saborRepository = saborRepository;
        this.adicionalRepository = adicionalRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> findAllProductoResponses() {
        return productoRepository.findAll().stream()
                .map(ProductoResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse findProductoResponseById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return ProductoResponse.from(producto);
    }

    @Transactional
    public ProductoResponse crearProducto(ProductoRequest request) {
        Categoria categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setStockEnvases(request.getStockEnvases());
        producto.setPrecioBase(request.getPrecioBase());
        producto.setMaxSabores(request.getMaxSabores());
        producto.setCategoria(categoria);

        return ProductoResponse.from(productoRepository.save(producto));
    }

    @Transactional
    public ProductoResponse actualizarProducto(Long id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        Categoria categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));

        producto.setNombre(request.getNombre());
        producto.setStockEnvases(request.getStockEnvases());
        producto.setPrecioBase(request.getPrecioBase());
        producto.setMaxSabores(request.getMaxSabores());
        producto.setCategoria(categoria);

        return ProductoResponse.from(productoRepository.save(producto));
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> findAllCategoriaResponses() {
        return categoriaRepository.findAll().stream()
                .map(CategoriaResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SaborResponse> findSaborResponsesDisponibles() {
        return saborRepository.findByDisponibleTrue().stream()
                .map(SaborResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdicionalResponse> findAdicionalResponsesDisponibles() {
        return adicionalRepository.findByDisponibleTrue().stream()
                .map(AdicionalResponse::from)
                .toList();
    }
}
