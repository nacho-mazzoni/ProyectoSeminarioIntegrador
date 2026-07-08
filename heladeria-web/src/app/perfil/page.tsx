"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { Usuario } from "@/lib/types"

export default function PerfilPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [telefono, setTelefono] = useState("")
  const [msg, setMsg] = useState("")

  const [passActual, setPassActual] = useState("")
  const [passNueva, setPassNueva] = useState("")
  const [passMsg, setPassMsg] = useState("")

  useEffect(() => {
    api.auth.me().then((u) => {
      setUsuario(u)
      setTelefono(u.telefono ?? "")
    })
  }, [])

  const handleTelefono = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuario) return
    try {
      const updated = await api.clientes.actualizar({ email: usuario.email, telefono: telefono || undefined })
      setUsuario(updated)
      setMsg("Datos actualizados")
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Error")
    }
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassMsg("")
    try {
      await api.clientes.cambiarPassword({ passwordActual: passActual, passwordNueva: passNueva })
      setPassMsg("Contraseña actualizada")
      setPassActual("")
      setPassNueva("")
    } catch (err: unknown) {
      setPassMsg(err instanceof Error ? err.message : "Error")
    }
  }

  const handleEliminar = async () => {
    if (!confirm("¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.")) return
    try {
      await api.clientes.eliminarCuenta()
      localStorage.removeItem("token")
      localStorage.removeItem("rol")
      router.push("/")
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Error")
    }
  }

  if (!usuario) return <div className="text-center py-16">Cargando...</div>

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
        <form onSubmit={handleTelefono} className="flex flex-col gap-4 max-w-md">
          <input value={usuario.email} disabled className="border rounded px-3 py-2 bg-stone-100" />
          <input type="tel" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="border rounded px-3 py-2" />
          {msg && <p className={`text-sm ${msg === "Datos actualizados" ? "text-green-600" : "text-red-600"}`}>{msg}</p>}
          <button className="bg-amber-500 text-white py-2 rounded hover:bg-amber-600">Guardar</button>
        </form>
      </section>

      <section className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">Cambiar Contraseña</h2>
        <form onSubmit={handlePassword} className="flex flex-col gap-4 max-w-md">
          <input type="password" placeholder="Contraseña actual" value={passActual} onChange={(e) => setPassActual(e.target.value)} required className="border rounded px-3 py-2" />
          <input type="password" placeholder="Nueva contraseña" value={passNueva} onChange={(e) => setPassNueva(e.target.value)} required minLength={6} className="border rounded px-3 py-2" />
          {passMsg && <p className={`text-sm ${passMsg === "Contraseña actualizada" ? "text-green-600" : "text-red-600"}`}>{passMsg}</p>}
          <button className="bg-amber-500 text-white py-2 rounded hover:bg-amber-600">Actualizar Contraseña</button>
        </form>
      </section>

      <section className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4 text-red-600">Zona de Peligro</h2>
        <button onClick={handleEliminar} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
          Eliminar mi cuenta
        </button>
      </section>
    </div>
  )
}
