"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/lib/api"
import type { Producto, Sabor, Adicional } from "@/lib/types"

export default function EditarPedidoPage() {
  const router = useRouter()
  const params = useParams()
  const idPedido = Number(params.id)
  const [productos, setProductos] = useState<Producto[]>([])
  const [sabores, setSabores] = useState<Sabor[]>([])
  const [adicionales, setAdicionales] = useState<Adicional[]>([])
  const [detalles, setDetalles] = useState<{
    idProducto: number
    nombre: string
    cantidad: number
    precioBase: number
    idsSabor: number[]
    idsAdicional: number[]
  }[]>([])
  const [codigoPromocion, setCodigoPromocion] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      api.productos.listar(),
      api.sabores.listar(),
      api.adicionales.listar(),
      api.pedidos.obtener(idPedido),
    ]).then(([prods, sabs, adics, pedido]) => {
      setProductos(prods)
      setSabores(sabs)
      setAdicionales(adics)
      const saborMap: Record<string, number> = {}
      sabs.forEach((s) => { saborMap[s.nombre] = s.idSabor })
      const adicMap: Record<string, number> = {}
      adics.forEach((a) => { adicMap[a.nombre] = a.idAdicional })
      const prodsMap: Record<string, number> = {}
      prods.forEach((p) => { prodsMap[p.nombre] = p.idProducto })
      const prodsPrecio: Record<string, number> = {}
      prods.forEach((p) => { prodsPrecio[p.nombre] = p.precioBase })

      setDetalles(pedido.detalles.map((d) => ({
        idProducto: prodsMap[d.producto] || 0,
        nombre: d.producto,
        cantidad: d.cantidad,
        precioBase: prodsPrecio[d.producto] || d.precioUnitHist,
        idsSabor: d.sabores.map((s) => saborMap[s]).filter(Boolean),
        idsAdicional: d.adicionales.map((a) => adicMap[a]).filter(Boolean),
      })))
      if (pedido.promocion) setCodigoPromocion(pedido.promocion)
      setLoading(false)
    })
  }, [idPedido])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      await api.pedidos.editar(idPedido, {
        codigoPromocion: codigoPromocion || undefined,
        detalles: detalles.map((d) => ({
          idProducto: d.idProducto,
          cantidad: d.cantidad,
          idsSabor: d.idsSabor,
          idsAdicional: d.idsAdicional,
        })),
      })
      router.push("/perfil/pedidos")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al editar pedido")
    } finally {
      setSaving(false)
    }
  }

  const toggleSabor = (idx: number, idSabor: number) => {
    setDetalles((prev) => prev.map((d, i) =>
      i === idx ? { ...d, idsSabor: d.idsSabor.includes(idSabor) ? d.idsSabor.filter((s) => s !== idSabor) : [...d.idsSabor, idSabor] } : d
    ))
  }

  const toggleAdicional = (idx: number, idAdicional: number) => {
    setDetalles((prev) => prev.map((d, i) =>
      i === idx ? { ...d, idsAdicional: d.idsAdicional.includes(idAdicional) ? d.idsAdicional.filter((a) => a !== idAdicional) : [...d.idsAdicional, idAdicional] } : d
    ))
  }

  if (loading) return <div className="text-center py-16">Cargando...</div>

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Editar Pedido #{idPedido}</h1>

      <div className="space-y-4 mb-8">
        {detalles.map((item, idx) => (
          <div key={idx} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{item.nombre}</p>
                <p className="text-amber-600 text-sm">${item.precioBase.toFixed(2)} c/u</p>
              </div>
              <div className="flex items-center gap-3">
                <select value={item.cantidad} onChange={(e) =>
                  setDetalles((prev) => prev.map((d, i) => i === idx ? { ...d, cantidad: Number(e.target.value) } : d))
                } className="border rounded px-2 py-1 text-sm">
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <button type="button" onClick={() => setDetalles((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-red-500 text-sm hover:underline">Quitar</button>
              </div>
            </div>

            {sabores.filter((s) => s.disponible).length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-stone-500 mb-1">Sabores:</p>
                <div className="flex flex-wrap gap-1">
                  {sabores.filter((s) => s.disponible).map((s) => (
                    <button key={s.idSabor} type="button" onClick={() => toggleSabor(idx, s.idSabor)}
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        item.idsSabor.includes(s.idSabor) ? "bg-amber-500 text-white border-amber-500" : "bg-white border-stone-300"
                      }`}>{s.nombre}</button>
                  ))}
                </div>
              </div>
            )}

            {adicionales.filter((a) => a.disponible).length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-stone-500 mb-1">Adicionales:</p>
                <div className="flex flex-wrap gap-1">
                  {adicionales.filter((a) => a.disponible).map((a) => (
                    <button key={a.idAdicional} type="button" onClick={() => toggleAdicional(idx, a.idAdicional)}
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        item.idsAdicional.includes(a.idAdicional) ? "bg-amber-500 text-white border-amber-500" : "bg-white border-stone-300"
                      }`}>{a.nombre} (+${a.precioExtra.toFixed(2)})</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="max-w-xs mb-6">
        <p className="text-sm text-stone-500 mb-1">Codigo promocional</p>
        <input value={codigoPromocion} onChange={(e) => setCodigoPromocion(e.target.value)}
          placeholder="Opcional" className="border rounded px-3 py-2 w-full text-sm" />
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="flex gap-3">
        <button onClick={() => router.push("/perfil/pedidos")}
          className="px-6 py-2 border rounded text-sm">Cancelar</button>
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-2 bg-amber-500 text-white rounded text-sm hover:bg-amber-600 disabled:opacity-50">
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  )
}