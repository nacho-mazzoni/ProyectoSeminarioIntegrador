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

async function del(path: string): Promise<void> {
  const headers = await authHeaders()
  const res = await fetch(`${API}${path}`, { method: "DELETE", headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? "Error de red")
  }
}

export const api = {
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
