"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import Link from "next/link"

export default function AdminDashboard() {
  const [stats, setStats] = useState({ usuarios: 0, productos: 0, pedidos: 0 })

  useEffect(() => {
    Promise.all([
      api.admin.usuarios.listar(),
      api.admin.productos.listar(),
      api.admin.pedidos.listar(),
    ]).then(([u, p, ped]) => {
      setStats({ usuarios: u.length, productos: p.length, pedidos: ped.length })
    })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <Link href="/admin/usuarios" className="bg-white border rounded-xl p-6 hover:shadow-md transition">
          <p className="text-4xl font-bold text-amber-600">{stats.usuarios}</p>
          <p className="text-stone-500 mt-1">Usuarios</p>
        </Link>
        <Link href="/admin/productos" className="bg-white border rounded-xl p-6 hover:shadow-md transition">
          <p className="text-4xl font-bold text-amber-600">{stats.productos}</p>
          <p className="text-stone-500 mt-1">Productos</p>
        </Link>
        <Link href="/admin/pedidos" className="bg-white border rounded-xl p-6 hover:shadow-md transition">
          <p className="text-4xl font-bold text-amber-600">{stats.pedidos}</p>
          <p className="text-stone-500 mt-1">Pedidos</p>
        </Link>
      </div>
    </div>
  )
}
