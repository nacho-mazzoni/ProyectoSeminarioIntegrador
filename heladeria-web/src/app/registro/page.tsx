"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const API = process.env.NEXT_PUBLIC_API_URL!

export default function RegistroPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [telefono, setTelefono] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, telefono: telefono || undefined }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Error al registrarse" }))
        setError(err.error ?? "Error al registrarse")
        return
      }

      const data = await res.json()
      localStorage.setItem("token", data.token)
      router.push("/")
      router.refresh()
    } catch {
      setError("Error de conexión")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-6">Crear Cuenta</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          className="border rounded px-3 py-2"/>
        <input type="password" placeholder="Contraseña" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          className="border rounded px-3 py-2"/>
        <input type="tel" placeholder="Teléfono (opcional)" value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="border rounded px-3 py-2"/>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit"
          className="bg-amber-500 text-white py-2 rounded hover:bg-amber-600">
          Registrarse
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="text-amber-600 underline">Iniciá sesión</Link>
      </p>
    </div>
  )
}
