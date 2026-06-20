import type { Categoria, Producto, Sabor, Adicional, ZonaEnvio, Usuario, Direccion, Pedido } from "./types"

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
      postAuth<Usuario>("/clientes", data),
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
  },
}
