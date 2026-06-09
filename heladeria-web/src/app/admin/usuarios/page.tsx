"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { Usuario } from "@/lib/types"
import Link from "next/link"

const ROLES = [
  { id: 1, nombre: "Administrador" },
  { id: 2, nombre: "Cliente" },
]

export default function AdminUsuariosPage() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [autorizado, setAutorizado] = useState<boolean | null>(null)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [nuevoRol, setNuevoRol] = useState("")
  const [error, setError] = useState("")

  const cargar = () => {
    api.admin.usuarios.listar().then(setUsuarios).finally(() => setLoading(false))
  }

  useEffect(() => {
    api.auth.me()
      .then((u) => {
        if (u.rol !== "Administrador") {
          setAutorizado(false)
          return
        }
        setAutorizado(true)
        cargar()
      })
      .catch(() => router.push("/login"))
  }, [router])

  const handleCambiarRol = async (id: number) => {
    setError("")
    try {
      await api.admin.usuarios.actualizarRol(id, Number(nuevoRol))
      setEditandoId(null)
      cargar()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cambiar rol")
    }
  }

  if (autorizado === null || loading)
    return <div className="text-center py-16">Cargando...</div>
  if (!autorizado)
    return <div className="text-center py-16 text-red-600">No autorizado</div>

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Link
          href="/admin/usuarios/nuevo"
          className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-600 flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Usuario
        </Link>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Activo</th>
              <th className="px-4 py-3 font-medium text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {usuarios.map((u) => (
              <tr key={u.idUsuario} className="hover:bg-stone-50">
                <td className="px-4 py-3 text-stone-500">{u.idUsuario}</td>
                <td className="px-4 py-3 font-medium">{u.email}</td>
                <td className="px-4 py-3">
                  {editandoId === u.idUsuario ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={nuevoRol}
                        onChange={(e) => setNuevoRol(e.target.value)}
                        className="border rounded-lg px-2 py-1 text-sm bg-white"
                      >
                        {ROLES.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nombre}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleCambiarRol(u.idUsuario)}
                        className="text-green-600 hover:text-green-800 text-xs font-medium"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditandoId(null)}
                        className="text-stone-400 hover:text-stone-600 text-xs"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                        u.rol === "Administrador"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {u.rol}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                      u.activo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {editandoId !== u.idUsuario && (
                    <button
                      onClick={() => {
                        setEditandoId(u.idUsuario)
                        setNuevoRol(String(ROLES.find((r) => r.nombre === u.rol)?.id ?? 2))
                      }}
                      className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                    >
                      Cambiar Rol
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-stone-400">
                  No hay usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
