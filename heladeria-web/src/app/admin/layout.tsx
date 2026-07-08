"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const rol = localStorage.getItem("rol")
    if (rol !== "Administrador") {
      router.push("/")
    } else {
      setIsAdmin(true)
    }
  }, [router])

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/usuarios", label: "Usuarios" },
    { href: "/admin/productos", label: "Productos" },
    { href: "/admin/pedidos", label: "Pedidos" },
  ]

  if (!isAdmin) return null

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 flex gap-8">
      <nav className="w-56 shrink-0">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wide text-stone-400 mb-2 px-4">Administración</p>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded text-sm ${
                pathname === link.href
                  ? "bg-amber-500 text-white"
                  : "hover:bg-stone-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
