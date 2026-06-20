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

  const scrollTo = (id: number | null) => {
    if (id === null) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    const el = document.getElementById(`cat-${id}`)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  if (loading) return <div className="text-center py-16">Cargando...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Helados Artesanales</h1>
        <p className="text-stone-500">
          Hacé tu pedido y retiralo en el local o recibilo en casa
        </p>
      </section>

      <section className="mb-10 sticky top-0 z-10 bg-stone-50 py-3 -mx-4 px-4 border-b">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => scrollTo(null)}
            className="px-4 py-1.5 rounded-full border text-sm bg-amber-500 text-white border-amber-500"
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.idCategoria}
              onClick={() => scrollTo(cat.idCategoria)}
              className="px-4 py-1.5 rounded-full border text-sm bg-white border-stone-300 hover:border-amber-400"
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </section>

      {categorias.map((cat) => {
        const prods = productos.filter((p) => p.categoria.idCategoria === cat.idCategoria)
        if (prods.length === 0) return null
        return (
          <section key={cat.idCategoria} id={`cat-${cat.idCategoria}`} className="mb-12 scroll-mt-24">
            <h2 className="text-xl font-bold mb-4 text-amber-700 border-b pb-2">
              {cat.nombre}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {prods.map((p) => (
                <div
                  key={p.idProducto}
                  className="bg-white rounded-xl shadow-sm border p-5"
                >
                  <h3 className="font-semibold text-lg">{p.nombre}</h3>
                  <p className="text-amber-600 text-xl font-bold mt-2">
                    ${p.precioBase.toFixed(2)}
                  </p>
                  {p.maxSabores > 0 && (
                    <p className="text-sm text-stone-400 mt-1">
                      Hasta {p.maxSabores} sabor{p.maxSabores > 1 ? "es" : ""}
                    </p>
                  )}
                  <p className="text-sm text-stone-400">
                    Stock: {p.stockEnvases} envases
                  </p>
                  <Link
                    href="/perfil/pedidos/nuevo"
                    className="mt-4 inline-block bg-amber-500 text-white px-4 py-2 rounded text-sm hover:bg-amber-600"
                  >
                    Pedir
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )
      })}

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
