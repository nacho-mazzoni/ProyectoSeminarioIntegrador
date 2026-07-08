"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const API = process.env.NEXT_PUBLIC_API_URL!

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Error al iniciar sesión" }))
        setError(err.error ?? "Error al iniciar sesión")
        return
      }

      const data = await res.json()
      localStorage.setItem("token", data.token)
      localStorage.setItem("rol", data.usuario?.rol ?? "")
      router.push("/")
      router.refresh()
    } catch {
      setError("Error de conexión")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          className="border rounded px-3 py-2"/>
        <input type="password" placeholder="Contraseña" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          className="border rounded px-3 py-2"/>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit"
          className="bg-amber-500 text-white py-2 rounded hover:bg-amber-600">
          Ingresar
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        ¿No tenés cuenta?{" "}
        <Link href="/registro" className="text-amber-600 underline">Registrate</Link>
      </p>
    </div>
  )
}
