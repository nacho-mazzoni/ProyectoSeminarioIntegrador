"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Pedido } from "@/lib/types"

const ESTADOS = ["PENDIENTE", "CONFIRMADO", "EN_PREPARACION", "EN_CAMINO", "ENTREGADO", "CANCELADO"]

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])

  const cargar = () => api.admin.pedidos.listar().then(setPedidos)
  useEffect(() => { cargar() }, [])

  const cambiarEstado = async (id: number, estado: string) => {
    await api.admin.pedidos.actualizarEstado(id, { estado })
    cargar()
  }

  const estadoActual = (p: Pedido) => p.historial?.[p.historial.length - 1]?.estado ?? "PENDIENTE"

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>
      <div className="flex flex-col gap-4">
        {pedidos.map((p) => {
          const actual = estadoActual(p)
          return (
            <div key={p.idPedido} className="bg-white border rounded-xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-stone-400">
                    {new Date(p.fecha).toLocaleDateString("es-AR", {
                      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                  <p className="font-semibold mt-1">${p.total.toFixed(2)} — {p.cliente}</p>
                  <p className="text-sm text-stone-500">{p.metodoEntrega} — {p.direccion}</p>
                </div>
                <div className="text-right">
                  <select
                    value={actual}
                    onChange={(e) => cambiarEstado(p.idPedido, e.target.value)}
                    className={`border rounded px-2 py-1 text-sm font-medium ${
                      actual === "CANCELADO" ? "text-red-600" : ""
                    }`}
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
              </div>
              <details>
                <summary className="text-sm text-amber-600 cursor-pointer">Ver detalle</summary>
                <div className="mt-2 text-sm space-y-2">
                  {p.detalles?.map((d) => (
                    <div key={d.idDetalle} className="border-t pt-2">
                      <p><strong>{d.cantidad}x</strong> {d.producto} — ${(d.precioUnitHist * d.cantidad).toFixed(2)}</p>
                      {d.sabores?.length > 0 && <p className="text-stone-400 ml-4">Sabores: {d.sabores.join(", ")}</p>}
                      {d.adicionales?.length > 0 && <p className="text-stone-400 ml-4">Adicionales: {d.adicionales.join(", ")}</p>}
                    </div>
                  ))}
                  {p.historial && (
                    <div className="border-t pt-2 mt-2">
                      <p className="font-medium text-xs uppercase tracking-wide text-stone-400 mb-1">Historial</p>
                      {p.historial.map((h) => (
                        <p key={h.idHist} className="text-xs text-stone-500">
                          {new Date(h.fechaHora).toLocaleString("es-AR")} — <span className="font-medium">{h.estado}</span>
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
    </div>
  )
}
