"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Pedido } from "@/lib/types"
import Link from "next/link"

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  const cargar = () => {
    api.pedidos.listar().then((p) => {
      setPedidos(p)
      setLoading(false)
    })
  }

  useEffect(() => { cargar() }, [])

  const handleCancelar = async (id: number) => {
    if (!confirm("¿Estás seguro de cancelar este pedido?")) return
    try {
      await api.pedidos.cancelar(id)
      cargar()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al cancelar")
    }
  }

  if (loading) return <div className="text-center py-16">Cargando...</div>

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Pedidos</h1>
        <Link
          href="/perfil/pedidos/nuevo"
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 text-sm"
        >
          Nuevo Pedido
        </Link>
      </div>

      {pedidos.length === 0 && (
        <p className="text-stone-400 text-center py-12">No tenés pedidos todavía</p>
      )}

      <div className="flex flex-col gap-4">
        {pedidos.map((p) => {
          const ultimoEstado = p.historial?.[p.historial.length - 1]
          const esCancelable = ultimoEstado?.estado === "PENDIENTE"
          return (
            <div
              key={p.idPedido}
              className="bg-white rounded-xl shadow-sm border p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-stone-400">
                    {new Date(p.fecha).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-lg font-semibold mt-1">
                    Total: ${p.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-stone-500">
                    Entrega: {p.metodoEntrega} — {p.direccion}
                  </p>
                </div>
                <div className="text-right flex flex-col gap-2 items-end">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                    ultimoEstado?.estado === "CANCELADO"
                      ? "bg-red-100 text-red-800"
                      : ultimoEstado?.estado === "ENTREGADO"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {ultimoEstado?.estado ?? "PENDIENTE"}
                  </span>
                  {esCancelable && (
                    <button
                      onClick={() => handleCancelar(p.idPedido)}
                      className="text-xs text-red-600 underline hover:text-red-800"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>

              <details className="mt-3">
                <summary className="text-sm text-amber-600 cursor-pointer">
                  Ver detalle
                </summary>
                <div className="mt-2 text-sm space-y-2">
                  {p.detalles?.map((d) => (
                    <div key={d.idDetalle} className="border-t pt-2">
                      <p>
                        <strong>{d.cantidad}x</strong> {d.producto} — $
                        {(d.precioUnitHist * d.cantidad).toFixed(2)}
                      </p>
                      {d.sabores?.length > 0 && (
                        <p className="text-stone-400 ml-4">
                          Sabores: {d.sabores.join(", ")}
                        </p>
                      )}
                      {d.adicionales?.length > 0 && (
                        <p className="text-stone-400 ml-4">
                          Adicionales: {d.adicionales.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                  {p.historial && (
                    <div className="border-t pt-2 mt-2">
                      <p className="font-medium text-xs uppercase tracking-wide text-stone-400 mb-1">
                        Historial de estado
                      </p>
                      {p.historial.map((h) => (
                        <p key={h.idHist} className="text-xs text-stone-500">
                          {new Date(h.fechaHora).toLocaleString("es-AR")} —{" "}
                          <span className="font-medium">{h.estado}</span>
                          {h.notas && ` — ${h.notas}`}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            </div>
          )
        })}
      </div>
    </>
  )
}
