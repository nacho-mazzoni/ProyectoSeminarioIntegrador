const NETWORK_ERROR_PATTERNS = [
  "Failed to fetch",
  "NetworkError",
  "Network request failed",
  "Load failed",
  "fetch failed",
];

const STATUS_TEXT_MAP: Record<string, string> = {
  "Bad Request": "Solicitud inválida. Revisá los datos ingresados.",
  Unauthorized: "Tu sesión expiró. Volvé a iniciar sesión.",
  Forbidden: "No tenés permiso para realizar esta acción.",
  "Not Found": "No se encontró lo que buscabas.",
  Conflict: "Ya existe un registro con esos datos.",
  "Internal Server Error": "Error interno del servidor. Intentá de nuevo más tarde.",
  "Method Not Allowed": "Operación no permitida.",
  "Payload Too Large": "El archivo supera el tamaño máximo permitido.",
  "Validation Error": "Revisá los datos ingresados.",
};

const MESSAGE_CORRECTIONS: { pattern: RegExp; message: string }[] = [
  { pattern: /credenciales\s+invalida(s|s\b)/i, message: "Credenciales inválidas" },
  { pattern: /usuario\s+desactivado/i, message: "Tu cuenta está desactivada" },
  { pattern: /email\s+ya\s+registrado/i, message: "El email ya está registrado" },
  { pattern: /datos\s+de\s+perfil/i, message: "Completá tus datos de perfil antes de realizar un pedido" },
  { pattern: /carrito\s+esta\s+vacio/i, message: "El carrito está vacío" },
  { pattern: /no\s+tenes\s+permiso/i, message: "No tenés permiso para realizar esta acción" },
  { pattern: /token\s+invalido/i, message: "Tu sesión expiró. Volvé a iniciar sesión" },
];

function normalizeMessage(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  for (const pattern of NETWORK_ERROR_PATTERNS) {
    if (trimmed.toLowerCase().includes(pattern.toLowerCase())) {
      return "No se pudo conectar con el servidor. Verificá tu conexión e intentá de nuevo.";
    }
  }

  const statusMessage = STATUS_TEXT_MAP[trimmed];
  if (statusMessage) return statusMessage;

  for (const { pattern, message } of MESSAGE_CORRECTIONS) {
    if (pattern.test(trimmed)) return message;
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function getErrorMessage(
  error: unknown,
  fallback = "Algo salió mal. Intentá de nuevo.",
): string {
  if (typeof error === "string") return normalizeMessage(error) || fallback;
  if (error instanceof Error) return normalizeMessage(error.message) || fallback;
  return fallback;
}

export function getUserMessage(
  error: unknown,
  fallback = "Algo salió mal. Intentá de nuevo.",
): string {
  return getErrorMessage(error, fallback);
}
