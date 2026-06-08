"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { api } from "@/lib/api"
import Link from "next/link"

export default function RegistroPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [telefono, setTelefono] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    // Esperar que el trigger cree el usuario en la BD pública
    await new Promise((r) => setTimeout(r, 1500))

    // Forzar login para obtener el JWT
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
      return
    }

    // Crear perfil cliente
    try {
      await api.clientes.crearOCargar({ email, telefono: telefono || undefined })
    } catch {
      // si falla, no es crítico — el usuario lo puede hacer después
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-6">Crear Cuenta</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="tel"
          placeholder="Teléfono (opcional)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="border rounded px-3 py-2"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-amber-500 text-white py-2 rounded hover:bg-amber-600"
        >
          Registrarse
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="text-amber-600 underline">
          Iniciá sesión
        </Link>
      </p>
    </div>
  )
}
