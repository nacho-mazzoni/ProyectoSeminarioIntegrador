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

export interface ProductoRequest {
  nombre: string
  stockEnvases: number
  precioBase: number
  maxSabores: number
  idCategoria: number
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
  detalles: DetallePedido[]
  historial: HistorialEstado[]
}
