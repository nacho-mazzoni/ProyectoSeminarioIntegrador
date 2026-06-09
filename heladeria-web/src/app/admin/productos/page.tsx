"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Producto } from "@/lib/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminProductosPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [autorizado, setAutorizado] = useState<boolean | null>(null)

  useEffect(() => {
    api.auth.me()
      .then((u) => {
        if (u.rol !== "Administrador") {
          setAutorizado(false)
          return
        }
        setAutorizado(true)
        api.productos.listar().then(setProductos).finally(() => setLoading(false))
      })
      .catch(() => router.push("/login"))
  }, [router])

  if (autorizado === null || loading)
    return <div className="text-center py-16">Cargando...</div>
  if (!autorizado)
    return <div className="text-center py-16 text-red-600">No autorizado</div>

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-600 flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Max. Sabores</th>
              <th className="px-4 py-3 font-medium text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {productos.map((p) => (
              <tr key={p.idProducto} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-medium">{p.nombre}</td>
                <td className="px-4 py-3 text-stone-500">{p.categoria.nombre}</td>
                <td className="px-4 py-3">${p.precioBase.toFixed(2)}</td>
                <td className="px-4 py-3">{p.stockEnvases}</td>
                <td className="px-4 py-3">{p.maxSabores > 0 ? p.maxSabores : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/productos/${p.idProducto}`}
                    className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-stone-400">
                  No hay productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
