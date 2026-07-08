import type {
  Categoria, Producto, Sabor, Adicional, ZonaEnvio,
  Usuario, Direccion, Pedido, Carrito, Rol,
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

async function getAuth<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: authHeaders() })
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
    listar: () => getPublic<Producto[]>("/productos"),
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
    actualizarItem: (idItem: number, data: {
      idProducto: number
      cantidad: number
      idsSabor?: number[]
      idsAdicional?: number[]
    }) => putAuth<Carrito>(`/carrito/items/${idItem}`, data),
    eliminarItem: (idItem: number) => delAuth(`/carrito/items/${idItem}`),
    checkout: (data: {
      metodoEntrega: string
      idDireccion: number
      codigoPromocion?: string
    }) => postAuth<Pedido>("/carrito/checkout", data),
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
      crear: (data: {
        nombre: string
        stockBaldes: number
        disponible: boolean
        capBalde?: string
      }) => postAuth<Sabor>("/admin/sabores", data),
      actualizar: (id: number, data: {
        nombre: string
        stockBaldes: number
        disponible: boolean
        capBalde?: string
      }) => putAuth<Sabor>(`/admin/sabores/${id}`, data),
      eliminar: (id: number) => delAuth(`/admin/sabores/${id}`),
    },
    adicionales: {
      listar: () => getAuth<Adicional[]>("/admin/adicionales"),
      crear: (data: {
        nombre: string
        precioExtra: number
        disponible: boolean
      }) => postAuth<Adicional>("/admin/adicionales", data),
      actualizar: (id: number, data: {
        nombre: string
        precioExtra: number
        disponible: boolean
      }) => putAuth<Adicional>(`/admin/adicionales/${id}`, data),
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
  },
}
