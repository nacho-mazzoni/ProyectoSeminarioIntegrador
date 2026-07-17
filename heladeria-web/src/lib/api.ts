import type {
  Categoria, Producto, Sabor, Adicional, ZonaEnvio,
  Usuario, Direccion, Pedido, Carrito, Rol, CheckoutResponse,
  Promocion, DashboardResponse, ReporteIngresosResponse, ReportePedidosResponse,
} from "./types"

const API = process.env.NEXT_PUBLIC_API_URL!

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleError(res: Response): Promise<never> {
  if (res.status === 401) {
    localStorage.removeItem("token")
  }
  const err = await res.json().catch(() => ({ error: res.statusText }))
  throw new Error(err.error ?? "Error de red")
}

async function getPublic<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) await handleError(res)
  return res.json()
}

async function getAuth<T>(path: string, params?: string): Promise<T> {
  const url = params ? `${API}${path}?${params}` : `${API}${path}`
  const res = await fetch(url, { headers: authHeaders() })
  if (!res.ok) await handleError(res)
  return res.json()
}

async function postAuth<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) await handleError(res)
  return res.json()
}

async function putAuth<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) await handleError(res)
  return res.json()
}

async function patchAuth<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "PATCH",
    headers: authHeaders(),
  })
  if (!res.ok) await handleError(res)
  return res.json()
}

async function delAuth(path: string): Promise<void> {
  const res = await fetch(`${API}${path}`, { method: "DELETE", headers: authHeaders() })
  if (!res.ok) await handleError(res)
}

export const api = {
  auth: {
    me: () => getAuth<Usuario>("/auth/me"),
  },
  productos: {
    listar: (params?: { nombre?: string; categoria?: number; precioMin?: number; precioMax?: number }) => {
      const q = new URLSearchParams()
      if (params?.nombre) q.set("nombre", params.nombre)
      if (params?.categoria) q.set("categoria", String(params.categoria))
      if (params?.precioMin) q.set("precioMin", String(params.precioMin))
      if (params?.precioMax) q.set("precioMax", String(params.precioMax))
      const qs = q.toString()
      return getPublic<Producto[]>(`/productos${qs ? "?" + qs : ""}`)
    },
    obtener: (id: number) => getPublic<Producto>(`/productos/${id}`),
  },
  categorias: {
    listar: () => getPublic<Categoria[]>("/categorias"),
  },
  sabores: {
    listar: () => getPublic<Sabor[]>("/sabores"),
  },
  adicionales: {
    listar: () => getPublic<Adicional[]>("/adicionales"),
  },
  promociones: {
    listar: () => getPublic<Promocion[]>("/promociones"),
    validar: (codigo: string) => getPublic<Promocion>(`/promociones/${codigo}`),
  },
  zonas: {
    listar: () => getPublic<ZonaEnvio[]>("/zonas-envio"),
  },
  clientes: {
    crearOCargar: (data: { email: string; telefono?: string }) =>
      postAuth<Usuario>("/clientes", data),
    actualizar: (data: { email: string; telefono?: string }) =>
      putAuth<Usuario>("/clientes", data),
    cambiarPassword: (data: { passwordActual: string; passwordNueva: string }) =>
      putAuth<{ mensaje: string }>("/clientes/password", data),
    eliminarCuenta: () => delAuth("/clientes/cuenta"),
  },
  direcciones: {
    listar: () => getAuth<Direccion[]>("/direcciones"),
    crear: (data: {
      calle: string
      numero: string
      ciudad: string
      referencia?: string
      idZona: number
    }) => postAuth<Direccion>("/direcciones", data),
    eliminar: (id: number) => delAuth(`/direcciones/${id}`),
  },
  carrito: {
    obtener: () => getAuth<Carrito>("/carrito"),
    agregarItem: (data: {
      idProducto: number
      cantidad: number
      idsSabor?: number[]
      idsAdicional?: number[]
    }) => postAuth<Carrito>("/carrito/items", data),
    actualizarItem: (id: number, data: {
      idProducto: number
      cantidad: number
      idsSabor?: number[]
      idsAdicional?: number[]
    }) => putAuth<Carrito>(`/carrito/items/${id}`, data),
    eliminarItem: (id: number) => delAuth(`/carrito/items/${id}`),
    checkout: (data: {
      metodoEntrega: string
      idDireccion: number
      codigoPromocion?: string
      metodoPago: string
    }) => postAuth<CheckoutResponse>("/carrito/checkout", data),
  },
  pedidos: {
    listar: () => getAuth<Pedido[]>("/pedidos"),
    obtener: (id: number) => getAuth<Pedido>(`/pedidos/${id}`),
    crear: (data: {
      metodoEntrega: string
      idDireccion: number
      codigoPromocion?: string
      detalles: {
        idProducto: number
        cantidad: number
        idsSabor?: number[]
        idsAdicional?: number[]
      }[]
    }) => postAuth<Pedido>("/pedidos", data),
    editar: (id: number, data: {
      idDireccion?: number
      codigoPromocion?: string
      detalles: {
        idProducto: number
        cantidad: number
        idsSabor?: number[]
        idsAdicional?: number[]
      }[]
    }) => putAuth<Pedido>(`/pedidos/${id}`, data),
    cancelar: (id: number) => patchAuth<Pedido>(`/pedidos/${id}/cancelar`),
  },
  admin: {
    usuarios: {
      listar: () => getAuth<Usuario[]>("/admin/usuarios"),
      actualizarRol: (id: number, idRol: number) =>
        putAuth<Usuario>(`/admin/usuarios/${id}/rol`, { idRol }),
      toggleActivo: (id: number) =>
        putAuth<Usuario>(`/admin/usuarios/${id}/activo`, {}),
    },
    productos: {
      listar: () => getAuth<Producto[]>("/admin/productos"),
      crear: (data: {
        nombre: string
        stockEnvases: number
        precioBase: number
        maxSabores: number
        idCategoria: number
      }) => postAuth<Producto>("/admin/productos", data),
      actualizar: (id: number, data: {
        nombre: string
        stockEnvases: number
        precioBase: number
        maxSabores: number
        idCategoria: number
      }) => putAuth<Producto>(`/admin/productos/${id}`, data),
      eliminar: (id: number) => delAuth(`/admin/productos/${id}`),
    },
    categorias: {
      listar: () => getAuth<Categoria[]>("/admin/categorias"),
      crear: (data: { nombre: string; requiereSabores: boolean }) =>
        postAuth<Categoria>("/admin/categorias", data),
      actualizar: (id: number, data: { nombre: string; requiereSabores: boolean }) =>
        putAuth<Categoria>(`/admin/categorias/${id}`, data),
      eliminar: (id: number) => delAuth(`/admin/categorias/${id}`),
    },
    sabores: {
      listar: () => getAuth<Sabor[]>("/admin/sabores"),
      crear: (data: { nombre: string; stockBaldes: number; disponible: boolean; capBalde?: string }) =>
        postAuth<Sabor>("/admin/sabores", data),
      actualizar: (id: number, data: { nombre: string; stockBaldes: number; disponible: boolean; capBalde?: string }) =>
        putAuth<Sabor>(`/admin/sabores/${id}`, data),
      eliminar: (id: number) => delAuth(`/admin/sabores/${id}`),
    },
    adicionales: {
      listar: () => getAuth<Adicional[]>("/admin/adicionales"),
      crear: (data: { nombre: string; precioExtra: number; disponible: boolean }) =>
        postAuth<Adicional>("/admin/adicionales", data),
      actualizar: (id: number, data: { nombre: string; precioExtra: number; disponible: boolean }) =>
        putAuth<Adicional>(`/admin/adicionales/${id}`, data),
      eliminar: (id: number) => delAuth(`/admin/adicionales/${id}`),
    },
    pedidos: {
      listar: () => getAuth<Pedido[]>("/admin/pedidos"),
      actualizarEstado: (id: number, data: { estado: string; notas?: string }) =>
        putAuth<Pedido>(`/admin/pedidos/${id}/estado`, data),
    },
    roles: {
      listar: () => getAuth<Rol[]>("/admin/roles"),
    },
    promociones: {
      listar: () => getAuth<Promocion[]>("/admin/promociones"),
      obtener: (id: number) => getAuth<Promocion>(`/admin/promociones/${id}`),
      crear: (data: {
        codigo: string
        descripcion?: string
        porcDesc: number
        activa?: boolean
        fechaInicio?: string
        fechaFin?: string
      }) => postAuth<Promocion>("/admin/promociones", data),
      actualizar: (id: number, data: {
        codigo: string
        descripcion?: string
        porcDesc: number
        activa?: boolean
        fechaInicio?: string
        fechaFin?: string
      }) => putAuth<Promocion>(`/admin/promociones/${id}`, data),
      eliminar: (id: number) => delAuth(`/admin/promociones/${id}`),
    },
    reportes: {
      dashboard: () => getAuth<DashboardResponse>("/admin/reportes/dashboard"),
      pedidos: (params?: { desde?: string; hasta?: string; page?: number; size?: number }) => {
        const q = new URLSearchParams()
        if (params?.desde) q.set("desde", params.desde)
        if (params?.hasta) q.set("hasta", params.hasta)
        if (params?.page !== undefined) q.set("page", String(params.page))
        if (params?.size !== undefined) q.set("size", String(params.size))
        return getAuth<ReportePedidosResponse>(`/admin/reportes/pedidos${q.toString() ? "?" + q.toString() : ""}`)
      },
      ingresos: (params?: { desde?: string; hasta?: string }) => {
        const q = new URLSearchParams()
        if (params?.desde) q.set("desde", params.desde)
        if (params?.hasta) q.set("hasta", params.hasta)
        return getAuth<ReporteIngresosResponse>(`/admin/reportes/ingresos${q.toString() ? "?" + q.toString() : ""}`)
      },
    },
  },
}