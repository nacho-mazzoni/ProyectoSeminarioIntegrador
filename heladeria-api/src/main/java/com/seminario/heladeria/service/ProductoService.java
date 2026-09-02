package com.seminario.heladeria.service;

import com.seminario.heladeria.dto.request.*;
import com.seminario.heladeria.dto.response.*;
import com.seminario.heladeria.entity.*;
import com.seminario.heladeria.repository.*;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import com.seminario.heladeria.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Slf4j
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
    public List<ProductoResponse> findAllProductoResponses(String nombre, Long idCategoria,
                                                           BigDecimal precioMin, BigDecimal precioMax) {
        Specification<Producto> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (nombre != null && !nombre.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("nombre")), "%" + nombre.toLowerCase() + "%"));
            }
            if (idCategoria != null) {
                predicates.add(cb.equal(root.get("categoria").get("idCategoria"), idCategoria));
            }
            if (precioMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("precioBase"), precioMin));
            }
            if (precioMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("precioBase"), precioMax));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return productoRepository.findAll(spec).stream()
                .map(ProductoResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse findProductoResponseById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        return ProductoResponse.from(producto);
    }

    @Transactional
    public ProductoResponse crearProducto(ProductoRequest request) {
        Categoria categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setStockEnvases(request.getStockEnvases());
        producto.setPrecioBase(request.getPrecioBase());
        producto.setMaxSabores(request.getMaxSabores());
        producto.setCategoria(categoria);

        if (request.getIdsSabor() != null && !request.getIdsSabor().isEmpty()) {
            List<Sabor> sabores = saborRepository.findAllById(request.getIdsSabor());
            producto.setSabores(new HashSet<>(sabores));
        }

        return ProductoResponse.from(productoRepository.save(producto));
    }

    @Transactional
    public ProductoResponse actualizarProducto(Long id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        Categoria categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        producto.setNombre(request.getNombre());
        producto.setStockEnvases(request.getStockEnvases());
        producto.setPrecioBase(request.getPrecioBase());
        producto.setMaxSabores(request.getMaxSabores());
        producto.setCategoria(categoria);

        if (request.getIdsSabor() != null) {
            List<Sabor> sabores = saborRepository.findAllById(request.getIdsSabor());
            producto.setSabores(new HashSet<>(sabores));
        }

        return ProductoResponse.from(productoRepository.save(producto));
    }

    @Transactional
    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> findAllCategoriaResponses() {
        return categoriaRepository.findAll().stream()
                .map(CategoriaResponse::from)
                .toList();
    }

    @Transactional
    public CategoriaResponse crearCategoria(CategoriaRequest request) {
        Categoria categoria = new Categoria();
        categoria.setNombre(request.getNombre());
        categoria.setRequiereSabores(request.getRequiereSabores());
        return CategoriaResponse.from(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaResponse actualizarCategoria(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
        categoria.setNombre(request.getNombre());
        categoria.setRequiereSabores(request.getRequiereSabores());
        return CategoriaResponse.from(categoriaRepository.save(categoria));
    }

    @Transactional
    public void eliminarCategoria(Long id) {
        categoriaRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<SaborResponse> findSaborResponsesDisponibles() {
        return saborRepository.findByDisponibleTrue().stream()
                .map(SaborResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SaborResponse> findAllSaborResponses() {
        return saborRepository.findAll().stream()
                .map(SaborResponse::from)
                .toList();
    }

    @Transactional
    public SaborResponse crearSabor(SaborRequest request) {
        Sabor sabor = new Sabor();
        sabor.setNombre(request.getNombre());
        sabor.setStockBaldes(request.getStockBaldes());
        sabor.setDisponible(request.getDisponible());
        sabor.setCapBalde(request.getCapBalde());
        return SaborResponse.from(saborRepository.save(sabor));
    }

    @Transactional
    public SaborResponse actualizarSabor(Long id, SaborRequest request) {
        Sabor sabor = saborRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sabor no encontrado"));
        sabor.setNombre(request.getNombre());
        sabor.setStockBaldes(request.getStockBaldes());
        sabor.setDisponible(request.getDisponible());
        sabor.setCapBalde(request.getCapBalde());
        return SaborResponse.from(saborRepository.save(sabor));
    }

    @Transactional
    public void eliminarSabor(Long id) {
        saborRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<AdicionalResponse> findAdicionalResponsesDisponibles() {
        return adicionalRepository.findByDisponibleTrue().stream()
                .map(AdicionalResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdicionalResponse> findAllAdicionalResponses() {
        return adicionalRepository.findAll().stream()
                .map(AdicionalResponse::from)
                .toList();
    }

    @Transactional
    public AdicionalResponse crearAdicional(AdicionalRequest request) {
        Adicional adicional = new Adicional();
        adicional.setNombre(request.getNombre());
        adicional.setPrecioExtra(request.getPrecioExtra());
        adicional.setDisponible(request.getDisponible());
        return AdicionalResponse.from(adicionalRepository.save(adicional));
    }

    @Transactional
    public AdicionalResponse actualizarAdicional(Long id, AdicionalRequest request) {
        Adicional adicional = adicionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adicional no encontrado"));
        adicional.setNombre(request.getNombre());
        adicional.setPrecioExtra(request.getPrecioExtra());
        adicional.setDisponible(request.getDisponible());
        return AdicionalResponse.from(adicionalRepository.save(adicional));
    }

    @Transactional
    public void eliminarAdicional(Long id) {
        adicionalRepository.deleteById(id);
    }
}
