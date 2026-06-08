package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.ProductoRequest;
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

    public List<Producto> findAllProductos() {
        return productoRepository.findAll();
    }

    public Producto findProductoById(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @Transactional
    public Producto crearProducto(ProductoRequest request) {
        Categoria categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setStockEnvases(request.getStockEnvases());
        producto.setPrecioBase(request.getPrecioBase());
        producto.setMaxSabores(request.getMaxSabores());
        producto.setCategoria(categoria);

        return productoRepository.save(producto);
    }

    @Transactional
    public Producto actualizarProducto(Long id, ProductoRequest request) {
        Producto producto = findProductoById(id);
        Categoria categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));

        producto.setNombre(request.getNombre());
        producto.setStockEnvases(request.getStockEnvases());
        producto.setPrecioBase(request.getPrecioBase());
        producto.setMaxSabores(request.getMaxSabores());
        producto.setCategoria(categoria);

        return productoRepository.save(producto);
    }

    public List<Categoria> findAllCategorias() {
        return categoriaRepository.findAll();
    }

    public List<Sabor> findAllSabores() {
        return saborRepository.findAll();
    }

    public List<Sabor> findSaboresDisponibles() {
        return saborRepository.findByDisponibleTrue();
    }

    public List<Adicional> findAllAdicionales() {
        return adicionalRepository.findAll();
    }

    public List<Adicional> findAdicionalesDisponibles() {
        return adicionalRepository.findByDisponibleTrue();
    }
}
