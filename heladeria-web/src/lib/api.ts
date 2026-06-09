import { createClient } from "./supabase/client"
import type {
  Categoria,
  Producto,
  Sabor,
  Adicional,
  ZonaEnvio,
  Usuario,
  Direccion,
  Pedido,
  ProductoRequest,
} from "./types"

const API = process.env.NEXT_PUBLIC_API_URL!

async function authHeaders(): Promise<Record<string, string>> {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function get<T>(path: string): Promise<T> {
  const headers = await authHeaders()
  const res = await fetch(`${API}${path}`, { headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? "Error de red")
  }
  return res.json()
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const headers = await authHeaders()
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? "Error de red")
  }
  return res.json()
}

async function put<T>(path: string, body: unknown): Promise<T> {
  const headers = await authHeaders()
  const res = await fetch(`${API}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? "Error de red")
  }
  return res.json()
}

async function del(path: string): Promise<void> {
  const headers = await authHeaders()
  const res = await fetch(`${API}${path}`, { method: "DELETE", headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? "Error de red")
  }
}

export const api = {
  admin: {
    productos: {
      crear: (data: ProductoRequest) => post<Producto>("/admin/productos", data),
      actualizar: (id: number, data: ProductoRequest) => put<Producto>(`/admin/productos/${id}`, data),
    },
    usuarios: {
      listar: () => get<Usuario[]>("/admin/usuarios"),
      actualizarRol: (id: number, idRol: number) =>
        put<Usuario>(`/admin/usuarios/${id}/rol`, { idRol }),
      actualizarRolPorEmail: (email: string, idRol: number) =>
        put<Usuario>(`/admin/usuarios/by-email/${encodeURIComponent(email)}/rol`, { idRol }),
    },
  },
  auth: {
    me: () => get<Usuario>("/auth/me"),
  },
  productos: {
    listar: () => get<Producto[]>("/productos"),
    obtener: (id: number) => get<Producto>(`/productos/${id}`),
  },
  categorias: {
    listar: () => get<Categoria[]>("/categorias"),
  },
  sabores: {
    listar: () => get<Sabor[]>("/sabores"),
  },
  adicionales: {
    listar: () => get<Adicional[]>("/adicionales"),
  },
  zonas: {
    listar: () => get<ZonaEnvio[]>("/zonas-envio"),
  },
  clientes: {
    crearOCargar: (data: { email: string; telefono?: string }) =>
      post<Usuario>("/clientes", data),
    actualizar: (data: { email: string; telefono?: string }) =>
      post<Usuario>("/clientes", data),
  },
  direcciones: {
    listar: () => get<Direccion[]>("/direcciones"),
    crear: (data: {
      calle: string
      numero: string
      ciudad: string
      referencia?: string
      idZona: number
    }) => post<Direccion>("/direcciones", data),
    eliminar: (id: number) => del(`/direcciones/${id}`),
  },
  pedidos: {
    listar: () => get<Pedido[]>("/pedidos"),
    obtener: (id: number) => get<Pedido>(`/pedidos/${id}`),
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
    }) => post<Pedido>("/pedidos", data),
  },
}
