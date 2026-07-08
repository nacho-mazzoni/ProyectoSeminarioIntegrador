"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Usuario, Rol } from "@/lib/types"

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [roles, setRoles] = useState<Rol[]>([])

  const cargar = () => {
    api.admin.usuarios.listar().then(setUsuarios)
    api.admin.roles.listar().then(setRoles)
  }

  useEffect(() => { cargar() }, [])

  const toggleActivo = async (id: number) => {
    await api.admin.usuarios.toggleActivo(id)
    cargar()
  }

  const cambiarRol = async (id: number, idRol: number) => {
    await api.admin.usuarios.actualizarRol(id, idRol)
    cargar()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Usuarios</h1>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Rol</th>
              <th className="text-left px-4 py-3 font-medium">Estado</th>
              <th className="text-left px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.idUsuario} className="border-b last:border-0 hover:bg-stone-50">
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.rol}
                    onChange={(e) => cambiarRol(u.idUsuario, Number(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {roles.map((r) => (
                      <option key={r.idRol} value={r.idRol}>{r.nombreRol}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                    u.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {u.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActivo(u.idUsuario)}
                    className={`text-sm underline ${
                      u.activo ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {u.activo ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
