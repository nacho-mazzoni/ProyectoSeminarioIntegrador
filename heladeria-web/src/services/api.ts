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
  DashboardStatsResponse,
  IngresoMensual,
  ProductoRequest,
  SaborRequest,
  AdicionalRequest,
  CategoriaRequest,
  ZonaRequest,
  CambioEstadoRequest,
  Promocion,
  RolResponse,
  UsuarioRequest,
  CheckoutResponse,
  ReporteDashboardResponse,
  ReporteIngresosResponse,
} from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL!;

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export class ApiError extends Error {
  fieldErrors: Record<string, string>

  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = "ApiError"
    this.fieldErrors = fieldErrors
  }
}

async function handleError(res: Response): Promise<never> {
  if (res.status === 401) {
    localStorage.removeItem("token");
  }
  const err = await res.json().catch(() => ({}));
  const fieldErrors = err.errors && !Array.isArray(err.errors) && typeof err.errors === "object" ? err.errors : {};
  const message = err.error ?? err.message ?? (Array.isArray(err.errors) ? err.errors.join(", ") : null) ?? res.statusText;
  throw new ApiError(message || "Error de red", fieldErrors);
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

async function putAuth<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "PUT",
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

async function patchAuth<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, { method: "PATCH", headers: authHeaders(), ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  if (!res.ok) await handleError(res);
  return res.status === 204 ? (undefined as T) : res.json();
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
  promociones: {
    listar: () => getPublic<Promocion[]>("/promociones"),
    validar: (codigo: string) => getPublic<Promocion>(`/promociones/${codigo}`),
  },
  clientes: {
    actualizar: (data: { email: string; telefono?: string }) =>
      putAuth<UsuarioResponse>("/clientes", data),
    cambiarPassword: (data: { passwordActual: string; passwordNueva: string }) =>
      putAuth<void>("/clientes/password", data),
    eliminarCuenta: () => delAuth("/clientes/cuenta"),
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
    }) => postAuth<CheckoutResponse>("/pedidos", data),
      cancelar: (id: number) => patchAuth<PedidoResponse>(`/pedidos/${id}/cancelar`),
  },
  admin: {
    productos: {
      listar: () => getAuth<ProductoResponse[]>("/admin/productos"),
      crear: (data: ProductoRequest) => postAuth<ProductoResponse>("/admin/productos", data),
      actualizar: (id: number, data: ProductoRequest) =>
        putAuth<ProductoResponse>(`/admin/productos/${id}`, data),
      eliminar: (id: number) => delAuth(`/admin/productos/${id}`),
      cambiarDisponibilidad: (id: number, activo: boolean) =>
        patchAuth<ProductoResponse>(`/admin/productos/${id}/disponibilidad?activo=${activo}`),
    },
    pedidos: {
      listar: (estado?: string) =>
        getAuth<PedidoResponse[]>(`/admin/pedidos${estado ? `?estado=${estado}` : ""}`),
      obtener: (id: number) => getAuth<PedidoResponse>(`/admin/pedidos/${id}`),
      cambiarEstado: (id: number, data: CambioEstadoRequest) =>
        putAuth<PedidoResponse>(`/admin/pedidos/${id}/estado`, data),
    },
    sabores: {
      listar: () => getAuth<SaborResponse[]>("/admin/sabores"),
      crear: (data: SaborRequest) => postAuth<SaborResponse>("/admin/sabores", data),
      actualizar: (id: number, data: SaborRequest) =>
        putAuth<SaborResponse>(`/admin/sabores/${id}`, data),
      eliminar: (id: number) => delAuth(`/admin/sabores/${id}`),
    },
    adicionales: {
      listar: () => getAuth<AdicionalResponse[]>("/admin/adicionales"),
      crear: (data: AdicionalRequest) => postAuth<AdicionalResponse>("/admin/adicionales", data),
      actualizar: (id: number, data: AdicionalRequest) =>
        putAuth<AdicionalResponse>(`/admin/adicionales/${id}`, data),
      eliminar: (id: number) => delAuth(`/admin/adicionales/${id}`),
    },
    categorias: {
      listar: () => getAuth<CategoriaResponse[]>("/admin/categorias"),
      crear: (data: CategoriaRequest) => postAuth<CategoriaResponse>("/admin/categorias", data),
      actualizar: (id: number, data: CategoriaRequest) =>
        putAuth<CategoriaResponse>(`/admin/categorias/${id}`, data),
      eliminar: (id: number) => delAuth(`/admin/categorias/${id}`),
    },
    zonas: {
      listar: () => getAuth<ZonaEnvioResponse[]>("/admin/zonas-envio"),
      crear: (data: ZonaRequest) => postAuth<ZonaEnvioResponse>("/admin/zonas-envio", data),
      actualizar: (id: number, data: ZonaRequest) =>
        putAuth<ZonaEnvioResponse>(`/admin/zonas-envio/${id}`, data),
      eliminar: (id: number) => delAuth(`/admin/zonas-envio/${id}`),
    },
    usuarios: {
      listar: () => getAuth<UsuarioResponse[]>("/admin/usuarios"),
      roles: () => getAuth<RolResponse[]>("/admin/roles"),
      crear: (data: UsuarioRequest) => postAuth<UsuarioResponse>("/admin/usuarios", data),
      actualizar: (id: number, data: UsuarioRequest) => putAuth<UsuarioResponse>(`/admin/usuarios/${id}`, data),
      actualizarRol: (id: number, idRol: number) =>
        putAuth<UsuarioResponse>(`/admin/usuarios/${id}/rol`, { idRol }),
      toggleActivo: (id: number) =>
        putAuth<UsuarioResponse>(`/admin/usuarios/${id}/activo`, {}),
    },
    promociones: {
      listar: () => getAuth<Promocion[]>("/admin/promociones"),
      crear: (data: {
        codigo: string; descripcion?: string; porcDesc: number;
        activa?: boolean; fechaInicio?: string; fechaFin?: string;
      }) => postAuth<Promocion>("/admin/promociones", data),
      actualizar: (id: number, data: {
        codigo: string; descripcion?: string; porcDesc: number;
        activa?: boolean; fechaInicio?: string; fechaFin?: string;
      }) => putAuth<Promocion>(`/admin/promociones/${id}`, data),
      eliminar: (id: number) => delAuth(`/admin/promociones/${id}`),
    },
    dashboard: {
      stats: () => getAuth<DashboardStatsResponse>("/admin/dashboard/stats"),
      ingresosMensuales: (meses = 6) =>
        getAuth<IngresoMensual[]>(`/admin/dashboard/ingresos-mensuales?meses=${meses}`),
    },
  },
  reportes: {
    dashboard: () => getAuth<ReporteDashboardResponse>("/admin/reportes/dashboard"),
    ingresos: (desde?: string, hasta?: string) => {
      const params = new URLSearchParams();
      if (desde) params.set("desde", desde);
      if (hasta) params.set("hasta", hasta);
      return getAuth<ReporteIngresosResponse>(`/admin/reportes/ingresos${params.toString() ? `?${params}` : ""}`);
    },
  },
};
