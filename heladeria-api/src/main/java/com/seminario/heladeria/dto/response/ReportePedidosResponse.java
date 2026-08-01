package com.seminario.heladeria.dto.response;

import java.util.List;

public class ReportePedidosResponse {

    private List<PedidoResponse> pedidos;
    private int totalPages;
    private long totalElements;

    public ReportePedidosResponse(List<PedidoResponse> pedidos, int totalPages, long totalElements) {
        this.pedidos = pedidos;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
    }

    public List<PedidoResponse> getPedidos() { return pedidos; }
    public int getTotalPages() { return totalPages; }
    public long getTotalElements() { return totalElements; }
}