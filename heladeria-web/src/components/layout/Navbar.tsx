"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"

export default function Navbar() {
  const router = useRouter()
  const supabase = createClient()
  const [session, setSession] = useState<boolean | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(true)
        api.auth.me().then((u) => setIsAdmin(u.rol === "Administrador")).catch(() => {})
      } else {
        setSession(false)
      }
    })
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(false)
    router.push("/login")
  }

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-amber-600">
          Heladería
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              {isAdmin && (
                <Link href="/admin/productos" className="text-amber-600 font-semibold hover:text-amber-700">
                  Admin
                </Link>
              )}
              <Link href="/perfil/pedidos" className="hover:text-amber-600">
                Mis Pedidos
              </Link>
              <Link href="/perfil/direcciones" className="hover:text-amber-600">
                Direcciones
              </Link>
              <button
                onClick={handleLogout}
                className="bg-amber-500 text-white px-4 py-1.5 rounded hover:bg-amber-600"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-amber-600">
                Ingresar
              </Link>
              <Link
                href="/registro"
                className="bg-amber-500 text-white px-4 py-1.5 rounded hover:bg-amber-600"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
