"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { DashboardResponse } from "@/lib/types"
import Link from "next/link"

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null)

  useEffect(() => {
    api.admin.reportes.dashboard().then(setData)
  }, [])

  if (!data) return <div className="text-center py-16">Cargando...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/pedidos" className="bg-white border rounded-xl p-5 hover:shadow-md transition">
          <p className="text-3xl font-bold text-amber-600">{data.totalPedidos}</p>
          <p className="text-stone-500 text-sm mt-1">Pedidos</p>
        </Link>
        <Link href="/admin/productos" className="bg-white border rounded-xl p-5 hover:shadow-md transition">
          <p className="text-3xl font-bold text-amber-600">{data.totalProductos}</p>
          <p className="text-stone-500 text-sm mt-1">Productos</p>
        </Link>
        <Link href="/admin/usuarios" className="bg-white border rounded-xl p-5 hover:shadow-md transition">
          <p className="text-3xl font-bold text-amber-600">{data.totalUsuarios}</p>
          <p className="text-stone-500 text-sm mt-1">Usuarios</p>
        </Link>
        <div className="bg-white border rounded-xl p-5">
          <p className="text-3xl font-bold text-green-600">${data.ingresosTotales.toFixed(2)}</p>
          <p className="text-stone-500 text-sm mt-1">Ingresos</p>
        </div>
      </div>

      {data.topProductos.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">Productos mas vendidos</h2>
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50">
                <tr>
                  <th className="text-left px-4 py-3">Producto</th>
                  <th className="text-left px-4 py-3">Vendidos</th>
                </tr>
              </thead>
              <tbody>
                {data.topProductos.map((p, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3">{p.nombre}</td>
                    <td className="px-4 py-3 font-medium">{p.cantidadVendida}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}