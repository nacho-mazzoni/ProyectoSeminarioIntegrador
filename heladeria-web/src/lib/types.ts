export interface Usuario {
  idUsuario: number
  email: string
  activo: boolean
  rol: string
  telefono?: string
}

export interface Direccion {
  idDireccion: number
  calle: string
  numero: string
  ciudad: string
  referencia?: string
  zona: string
  idZona: number
}

export interface Categoria {
  idCategoria: number
  nombre: string
  requiereSabores: boolean
}

export interface Producto {
  idProducto: number
  nombre: string
  stockEnvases: number
  precioBase: number
  maxSabores: number
  categoria: Categoria
}

export interface Sabor {
  idSabor: number
  nombre: string
  stockBaldes: number
  disponible: boolean
  capBalde?: string
}

export interface Adicional {
  idAdicional: number
  nombre: string
  precioExtra: number
  disponible: boolean
}

export interface ZonaEnvio {
  idZona: number
  nombreZona: string
  costoEnvio: number
}

export interface HistorialEstado {
  idHist: number
  fechaHora: string
  estado: string
  notas?: string
}

export interface DetallePedido {
  idDetalle: number
  cantidad: number
  precioUnitHist: number
  producto: string
  sabores: string[]
  adicionales: string[]
}

export interface Pedido {
  idPedido: number
  fecha: string
  metodoEntrega: string
  total: number
  cliente: string
  direccion: string
  promocion?: string
  metodoPago?: string
  estadoPago?: string
  detalles: DetallePedido[]
  historial: HistorialEstado[]
}

export interface CarritoItem {
  idItem: number
  idProducto: number
  nombre: string
  cantidad: number
  precioBase: number
  sabores: string[]
  adicionales: string[]
}

export interface Carrito {
  idCarrito: number
  items: CarritoItem[]
  subtotal: number
}

export interface Rol {
  idRol: number
  nombreRol: string
}

export interface CheckoutResponse {
  pedido: Pedido
  initPoint?: string
  pagoId?: number
}

export interface Promocion {
  idPromocion: number
  codigo: string
  descripcion?: string
  porcDesc: number
  activa: boolean
  createdAt: string
}

export interface DashboardResponse {
  totalUsuarios: number
  totalProductos: number
  totalPedidos: number
  ingresosTotales: number
  topProductos: { nombre: string; cantidadVendida: number }[]
}

export interface ReporteIngresosResponse {
  totalIngresos: number
  cantidadPedidos: number
  promedio: number
  porDia: { fecha: string; total: number; cantidad: number }[]
}

export interface ReportePedidosResponse {
  pedidos: Pedido[]
  totalPages: number
  totalElements: number
}