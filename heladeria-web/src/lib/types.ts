export interface UsuarioResponse {
  idUsuario: number
  email: string
  activo: boolean
  rol: string
  telefono?: string
}

export interface AuthResponse {
  token: string
  usuario: UsuarioResponse
}

export interface CategoriaResponse {
  idCategoria: number
  nombre: string
  requiereSabores: boolean
}

export interface ProductoResponse {
  idProducto: number
  nombre: string
  stockEnvases: number
  precioBase: number
  maxSabores: number
  categoria: CategoriaResponse
}

export interface SaborResponse {
  idSabor: number
  nombre: string
  stockBaldes: number
  disponible: boolean
  capBalde?: string
}

export interface AdicionalResponse {
  idAdicional: number
  nombre: string
  precioExtra: number
  disponible: boolean
}

export interface ZonaEnvioResponse {
  idZona: number
  nombreZona: string
  costoEnvio: number
}

export interface DireccionResponse {
  idDireccion: number
  calle: string
  numero: string
  ciudad: string
  referencia?: string
  zona: string
  idZona: number
}

export interface DetallePedidoResponse {
  idDetalle: number
  cantidad: number
  precioUnitHist: number
  producto: string
  sabores: string[]
  adicionales: string[]
}

export interface HistorialResponse {
  idHist: number
  fechaHora: string
  estado: string
  notas?: string
}

export interface PedidoResponse {
  idPedido: number
  fecha: string
  metodoEntrega: string
  total: number
  cliente: string
  direccion: string
  promocion?: string
  detalles: DetallePedidoResponse[]
  historial: HistorialResponse[]
}

export interface CartItem {
  id: string
  product: ProductoResponse
  quantity: number
  sabores: SaborResponse[]
  adicionales: AdicionalResponse[]
  unitPrice: number
}
