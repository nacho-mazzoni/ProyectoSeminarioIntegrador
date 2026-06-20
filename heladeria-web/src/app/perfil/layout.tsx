"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const links = [
    { href: "/perfil", label: "Información" },
    { href: "/perfil/pedidos", label: "Mis Pedidos" },
    { href: "/perfil/direcciones", label: "Direcciones" },
  ]

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 flex gap-8">
      <nav className="w-56 shrink-0">
        <div className="flex flex-col gap-1">
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
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded text-sm text-left text-red-600 hover:bg-red-50"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
