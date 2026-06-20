"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Usuario } from "@/lib/types"

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [telefono, setTelefono] = useState("")
  const [msg, setMsg] = useState("")

  useEffect(() => {
    api.auth.me().then((u) => {
      setUsuario(u)
      setTelefono(u.telefono ?? "")
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuario) return
    try {
      const updated = await api.clientes.actualizar({
        email: usuario.email,
        telefono: telefono || undefined,
      })
      setUsuario(updated)
      setMsg("Datos actualizados")
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Error")
    }
  }

  if (!usuario) return <div className="text-center py-16">Cargando...</div>

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          value={usuario.email}
          disabled
          className="border rounded px-3 py-2 bg-stone-100"
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="border rounded px-3 py-2"
        />
        {msg && (
          <p
            className={`text-sm ${msg === "Datos actualizados" ? "text-green-600" : "text-red-600"}`}
          >
            {msg}
          </p>
        )}
        <button className="bg-amber-500 text-white py-2 rounded hover:bg-amber-600">
          Guardar
        </button>
      </form>
    </>
  )
}
