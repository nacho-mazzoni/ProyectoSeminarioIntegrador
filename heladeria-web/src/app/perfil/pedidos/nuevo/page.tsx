"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { Producto, Sabor, Adicional, Direccion } from "@/lib/types"

interface ItemPedido {
  idProducto: number
  nombre: string
  cantidad: number
  precioBase: number
  idsSabor: number[]
  idsAdicional: number[]
}

export default function NuevoPedidoPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [sabores, setSabores] = useState<Sabor[]>([])
  const [adicionales, setAdicionales] = useState<Adicional[]>([])
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [items, setItems] = useState<ItemPedido[]>([])
  const [metodoEntrega, setMetodoEntrega] = useState("retiro")
  const [idDireccion, setIdDireccion] = useState<number | "">("")
  const [codigoPromocion, setCodigoPromocion] = useState("")
  const [error, setError] = useState("")
  const [ok, setOk] = useState(false)

  useEffect(() => {
    Promise.all([
      api.productos.listar(),
      api.sabores.listar(),
      api.adicionales.listar(),
      api.direcciones.listar(),
    ]).then(([p, s, a, d]) => {
      setProductos(p)
      setSabores(s)
      setAdicionales(a)
      setDirecciones(d)
    })
  }, [])

  const agregarProducto = (p: Producto) => {
    setItems((prev) => [
      ...prev,
      {
        idProducto: p.idProducto,
        nombre: p.nombre,
        cantidad: 1,
        precioBase: p.precioBase,
        idsSabor: [],
        idsAdicional: [],
      },
    ])
  }

  const actualizarItem = (idx: number, campo: keyof ItemPedido, valor: unknown) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [campo]: valor } : item))
    )
  }

  const toggleSabor = (idx: number, idSabor: number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item
        const tiene = item.idsSabor.includes(idSabor)
        return {
          ...item,
          idsSabor: tiene
            ? item.idsSabor.filter((s) => s !== idSabor)
            : [...item.idsSabor, idSabor],
        }
      })
    )
  }

  const toggleAdicional = (idx: number, idAdicional: number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item
        const tiene = item.idsAdicional.includes(idAdicional)
        return {
          ...item,
          idsAdicional: tiene
            ? item.idsAdicional.filter((a) => a !== idAdicional)
            : [...item.idsAdicional, idAdicional],
        }
      })
    )
  }

  const quitarItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.precioBase * item.cantidad,
    0
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (items.length === 0) {
      setError("Agregá al menos un producto")
      return
    }

    if (metodoEntrega === "delivery" && !idDireccion) {
      setError("Seleccioná una dirección de entrega")
      return
    }

    try {
      await api.pedidos.crear({
        metodoEntrega,
        idDireccion: metodoEntrega === "delivery" ? Number(idDireccion) : 0,
        codigoPromocion: codigoPromocion || undefined,
        detalles: items.map((item) => ({
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          idsSabor: item.idsSabor.length > 0 ? item.idsSabor : undefined,
          idsAdicional: item.idsAdicional.length > 0 ? item.idsAdicional : undefined,
        })),
      })

      setOk(true)
      setTimeout(() => router.push("/perfil/pedidos"), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear pedido")
    }
  }

  if (ok) {
    return (
      <div className="text-center py-24">
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          ¡Pedido creado con éxito!
        </h1>
        <p className="text-stone-500">Redirigiendo a Mis Pedidos...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Nuevo Pedido</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="font-semibold mb-3">Productos</h2>
            <div className="grid grid-cols-2 gap-3">
              {productos.map((p) => (
                <button
                  key={p.idProducto}
                  type="button"
                  onClick={() => agregarProducto(p)}
                  className="bg-white border rounded-lg p-3 text-left hover:border-amber-400 transition text-sm"
                >
                  <p className="font-medium">{p.nombre}</p>
                  <p className="text-amber-600">${p.precioBase.toFixed(2)}</p>
                  <p className="text-stone-400 text-xs">
                    Stock: {p.stockEnvases}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {items.length > 0 && (
            <section>
              <h2 className="font-semibold mb-3">Carrito</h2>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.nombre}</p>
                        <p className="text-amber-600 text-sm">
                          ${item.precioBase.toFixed(2)} c/u
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={item.cantidad}
                          onChange={(e) =>
                            actualizarItem(idx, "cantidad", Number(e.target.value))
                          }
                          className="border rounded px-2 py-1 text-sm"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => quitarItem(idx)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>

                    {sabores.filter((s) => s.disponible).length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-stone-500 mb-1">Sabores:</p>
                        <div className="flex flex-wrap gap-1">
                          {sabores
                            .filter((s) => s.disponible)
                            .map((s) => (
                              <button
                                key={s.idSabor}
                                type="button"
                                onClick={() => toggleSabor(idx, s.idSabor)}
                                className={`text-xs px-2 py-0.5 rounded-full border ${
                                  item.idsSabor.includes(s.idSabor)
                                    ? "bg-amber-500 text-white border-amber-500"
                                    : "bg-white border-stone-300"
                                }`}
                              >
                                {s.nombre}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {adicionales.filter((a) => a.disponible).length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-stone-500 mb-1">
                          Adicionales:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {adicionales
                            .filter((a) => a.disponible)
                            .map((a) => (
                              <button
                                key={a.idAdicional}
                                type="button"
                                onClick={() => toggleAdicional(idx, a.idAdicional)}
                                className={`text-xs px-2 py-0.5 rounded-full border ${
                                  item.idsAdicional.includes(a.idAdicional)
                                    ? "bg-amber-500 text-white border-amber-500"
                                    : "bg-white border-stone-300"
                                }`}
                              >
                                {a.nombre} (+${a.precioExtra.toFixed(2)})
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div>
          <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-5 space-y-4 sticky top-8">
            <h2 className="font-semibold">Resumen</h2>

            <div>
              <p className="text-sm text-stone-500">Método de entrega</p>
              <select
                value={metodoEntrega}
                onChange={(e) => setMetodoEntrega(e.target.value)}
                className="border rounded px-3 py-2 w-full mt-1 text-sm"
              >
                <option value="retiro">Retiro en local</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            {metodoEntrega === "delivery" && (
              <div>
                <p className="text-sm text-stone-500">Dirección</p>
                <select
                  value={idDireccion}
                  onChange={(e) =>
                    setIdDireccion(e.target.value ? Number(e.target.value) : "")
                  }
                  className="border rounded px-3 py-2 w-full mt-1 text-sm"
                >
                  <option value="">Seleccionar</option>
                  {direcciones.map((d) => (
                    <option key={d.idDireccion} value={d.idDireccion}>
                      {d.calle} {d.numero} — {d.zona}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <p className="text-sm text-stone-500">Código promocional</p>
              <input
                value={codigoPromocion}
                onChange={(e) => setCodigoPromocion(e.target.value)}
                placeholder="Opcional"
                className="border rounded px-3 py-2 w-full mt-1 text-sm"
              />
            </div>

            <div className="border-t pt-3">
              <p className="text-lg font-bold">
                Total: ${subtotal.toFixed(2)}
              </p>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-amber-500 text-white py-2.5 rounded-lg hover:bg-amber-600 font-medium"
            >
              Confirmar Pedido
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
