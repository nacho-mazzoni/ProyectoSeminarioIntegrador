"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Navbar() {
  const router = useRouter()
  const [session, setSession] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setSession(!!localStorage.getItem("token"))
    setIsAdmin(localStorage.getItem("rol") === "Administrador")
  })

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-amber-600">Heladería</Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-amber-600">Productos</Link>
          {session ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="hover:text-amber-600">Admin</Link>
              )}
              <Link href="/perfil"
                className="bg-amber-500 text-white px-4 py-1.5 rounded hover:bg-amber-600">
                Mi Perfil
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-amber-600">Ingresar</Link>
              <Link href="/registro"
                className="bg-amber-500 text-white px-4 py-1.5 rounded hover:bg-amber-600">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
