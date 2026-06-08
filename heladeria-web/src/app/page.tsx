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
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.productos.listar(),
      api.categorias.listar(),
      api.sabores.listar(),
      api.adicionales.listar(),
    ]).then(([p, c, s, a]) => {
      setProductos(p)
      setCategorias(c)
      setSabores(s)
      setAdicionales(a)
      setLoading(false)
    })
  }, [])

  const filtrados = categoriaFiltro
    ? productos.filter((p) => p.categoria.idCategoria === categoriaFiltro)
    : productos

  if (loading) return <div className="text-center py-16">Cargando...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Helados Artesanales</h1>
        <p className="text-stone-500">
          Hacé tu pedido y retiralo en el local o recibilo en casa
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Categorías</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoriaFiltro(null)}
            className={`px-4 py-1.5 rounded-full border text-sm ${
              categoriaFiltro === null
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white border-stone-300 hover:border-amber-400"
            }`}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.idCategoria}
              onClick={() => setCategoriaFiltro(cat.idCategoria)}
              className={`px-4 py-1.5 rounded-full border text-sm ${
                categoriaFiltro === cat.idCategoria
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white border-stone-300 hover:border-amber-400"
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filtrados.map((p) => (
          <div
            key={p.idProducto}
            className="bg-white rounded-xl shadow-sm border p-5"
          >
            <h3 className="font-semibold text-lg">{p.nombre}</h3>
            <p className="text-amber-600 text-xl font-bold mt-2">
              ${p.precioBase.toFixed(2)}
            </p>
            <p className="text-sm text-stone-400 mt-1">
              Stock: {p.stockEnvases} envases
            </p>
            {p.maxSabores > 0 && (
              <p className="text-sm text-stone-400">
                Hasta {p.maxSabores} sabores
              </p>
            )}
            <Link
              href={`/perfil/pedidos/nuevo`}
              className="mt-4 inline-block bg-amber-500 text-white px-4 py-2 rounded text-sm hover:bg-amber-600"
            >
              Pedir
            </Link>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-lg font-semibold mb-3">Sabores</h2>
          <div className="flex flex-wrap gap-2">
            {sabores.map((s) => (
              <span
                key={s.idSabor}
                className="bg-white border rounded-full px-3 py-1 text-sm"
              >
                {s.nombre}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Adicionales</h2>
          <div className="flex flex-wrap gap-2">
            {adicionales.map((a) => (
              <span
                key={a.idAdicional}
                className="bg-white border rounded-full px-3 py-1 text-sm"
              >
                {a.nombre} (+${a.precioExtra.toFixed(2)})
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
