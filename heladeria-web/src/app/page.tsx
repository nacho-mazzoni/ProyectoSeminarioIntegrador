"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Producto, Categoria, Sabor, Adicional } from "@/lib/types"
import Link from "next/link"

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [sabores, setSabores] = useState<Sabor[]>([])
  const [adicionales, setAdicionales] = useState<Adicional[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [catId, setCatId] = useState<number | "">("")
  const [sort, setSort] = useState("")

  useEffect(() => {
    Promise.all([
      api.productos.listar(),
      api.categorias.listar(),
      api.sabores.listar(),
      api.adicionales.listar(),
    ])
      .then(([p, c, s, a]) => {
        setProductos(p)
        setCategorias(c)
        setSabores(s)
        setAdicionales(a)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = productos
    .filter((p) => {
      if (search && !p.nombre.toLowerCase().includes(search.toLowerCase())) return false
      if (catId !== "" && p.categoria.idCategoria !== catId) return false
      return true
    })
    .sort((a, b) => {
      if (sort === "precio-asc") return a.precioBase - b.precioBase
      if (sort === "precio-desc") return b.precioBase - a.precioBase
      if (sort === "nombre") return a.nombre.localeCompare(b.nombre)
      return 0
    })

  if (loading) return <div className="text-center py-16">Cargando...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Helados Artesanales</h1>
        <p className="text-stone-500">
          Hace tu pedido y retiralo en el local o recibilo en casa
        </p>
      </section>

      <section className="mb-8 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-stone-500 block mb-1">Buscar</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre del producto..."
            className="border rounded px-3 py-2 w-full text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-stone-500 block mb-1">Categoria</label>
          <select value={catId} onChange={(e) => setCatC(e.target.value ? Number(e.target.value) : "")} className="border rounded px-3 py-2 text-sm">
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-stone-500 block mb-1">Ordenar</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded px-3 py-2 text-sm">
            <option value="">Default</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>
      </section>

      <section className="mb-10 flex gap-2 flex-wrap">
        {categorias.map((cat) => (
          <button
            key={cat.idCategoria}
            onClick={() => setCatC(catId === cat.idCategoria ? "" : cat.idCategoria)}
            className={`px-4 py-1.5 rounded-full border text-sm ${
              catId === cat.idCategoria ? "bg-amber-500 text-white border-amber-500" : "bg-white border-stone-300 hover:border-amber-400"
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filtered.length === 0 && <p className="text-stone-400 col-span-full text-center py-8">Sin resultados</p>}
        {filtered.map((p) => (
          <div key={p.idProducto} className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold text-lg">{p.nombre}</h3>
            <p className="text-amber-600 text-xl font-bold mt-2">${p.precioBase.toFixed(2)}</p>
            {p.maxSabores > 0 && (
              <p className="text-sm text-stone-400 mt-1">
                Hasta {p.maxSabores} sabor{p.maxSabores > 1 ? "es" : ""}
              </p>
            )}
            <p className="text-sm text-stone-400">Stock: {p.stockEnvases} envases</p>
            <Link
              href="/perfil/pedidos/nuevo"
              className="mt-4 inline-block bg-amber-500 text-white px-4 py-2 rounded text-sm hover:bg-amber-600"
            >
              Pedir
            </Link>
          </div>
        ))}
      </div>

      <section className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-lg font-semibold mb-3">Sabores</h2>
          <div className="flex flex-wrap gap-2">
            {sabores.map((s) => (
              <span key={s.idSabor} className="bg-white border rounded-full px-3 py-1 text-sm">{s.nombre}</span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Adicionales</h2>
          <div className="flex flex-wrap gap-2">
            {adicionales.map((a) => (
              <span key={a.idAdicional} className="bg-white border rounded-full px-3 py-1 text-sm">
                {a.nombre} (+${a.precioExtra.toFixed(2)})
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}