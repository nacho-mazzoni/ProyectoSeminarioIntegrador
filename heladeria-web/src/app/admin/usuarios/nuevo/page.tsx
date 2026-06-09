"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { api } from "@/lib/api"

const ROLES = [
  { id: 1, nombre: "Administrador" },
  { id: 2, nombre: "Cliente" },
]

export default function NuevoUsuarioPage() {
  const router = useRouter()
  const supabase = createClient()
  const [autorizado, setAutorizado] = useState<boolean | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [idRol, setIdRol] = useState("2")
  const [error, setError] = useState("")
  const [ok, setOk] = useState(false)

  useEffect(() => {
    api.auth.me()
      .then((u) => {
        if (u.rol !== "Administrador") {
          setAutorizado(false)
          return
        }
        setAutorizado(true)
      })
      .catch(() => router.push("/login"))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      setError(signUpError.message)
      return
    }

    await new Promise((r) => setTimeout(r, 1500))

    try {
      await api.admin.usuarios.actualizarRolPorEmail(email, Number(idRol))
      setOk(true)
      setTimeout(() => router.push("/admin/usuarios"), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al asignar rol")
    }
  }

  if (autorizado === null)
    return <div className="text-center py-16">Cargando...</div>
  if (!autorizado)
    return <div className="text-center py-16 text-red-600">No autorizado</div>

  if (ok)
    return (
      <div className="max-w-lg mx-auto mt-16 px-4 text-center">
        <p className="text-green-600 font-semibold">Usuario creado correctamente</p>
        <p className="text-sm text-stone-400 mt-2">Redirigiendo...</p>
      </div>
    )

  return (
    <div className="max-w-lg mx-auto mt-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Nuevo Usuario</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Rol</label>
          <select
            value={idRol}
            onChange={(e) => setIdRol(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-amber-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-amber-600"
          >
            Crear Usuario
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/usuarios")}
            className="border px-5 py-2 rounded-lg text-sm hover:bg-stone-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
