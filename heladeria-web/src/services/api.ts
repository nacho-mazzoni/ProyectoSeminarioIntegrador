import type {
  AuthResponse,
  UsuarioResponse,
  ProductoResponse,
  CategoriaResponse,
  SaborResponse,
  AdicionalResponse,
  ZonaEnvioResponse,
  DireccionResponse,
  PedidoResponse,
} from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL!;

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleError(res: Response): Promise<never> {
  if (res.status === 401) {
    localStorage.removeItem("token");
  }
  const err = await res.json().catch(() => ({ error: res.statusText }));
  throw new Error(err.error ?? "Network error");
}

async function getPublic<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) await handleError(res);
  return res.json();
}

async function getAuth<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: authHeaders() });
  if (!res.ok) await handleError(res);
  return res.json();
}

async function postAuth<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) await handleError(res);
  return res.json();
}

async function delAuth(path: string): Promise<void> {
  const res = await fetch(`${API}${path}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) await handleError(res);
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      postAuth<AuthResponse>("/auth/login", { email, password }),
    register: (data: { email: string; password: string; telefono?: string }) =>
      postAuth<AuthResponse>("/auth/register", data),
    me: () => getAuth<UsuarioResponse>("/auth/me"),
  },
  productos: {
    listar: () => getPublic<ProductoResponse[]>("/productos"),
    obtener: (id: number) => getPublic<ProductoResponse>(`/productos/${id}`),
  },
  categorias: {
    listar: () => getPublic<CategoriaResponse[]>("/categorias"),
  },
  sabores: {
    listar: () => getPublic<SaborResponse[]>("/sabores"),
  },
  adicionales: {
    listar: () => getPublic<AdicionalResponse[]>("/adicionales"),
  },
  zonas: {
    listar: () => getPublic<ZonaEnvioResponse[]>("/zonas-envio"),
  },
  clientes: {
    actualizar: (data: { email: string; telefono?: string }) =>
      postAuth<UsuarioResponse>("/clientes", data),
  },
  direcciones: {
    listar: () => getAuth<DireccionResponse[]>("/direcciones"),
    crear: (data: {
      calle: string
      numero: string
      ciudad: string
      referencia?: string
      idZona: number
    }) => postAuth<DireccionResponse>("/direcciones", data),
    eliminar: (id: number) => delAuth(`/direcciones/${id}`),
  },
  pedidos: {
    listar: () => getAuth<PedidoResponse[]>("/pedidos"),
    crear: (data: {
      metodoEntrega: string
      idDireccion?: number
      codigoPromocion?: string
      metodoPago?: string
      detalles: {
        idProducto: number
        cantidad: number
        idsSabor?: number[]
        idsAdicional?: number[]
      }[]
    }) => postAuth<PedidoResponse & { initPoint?: string }>("/pedidos", data),
  },
};
