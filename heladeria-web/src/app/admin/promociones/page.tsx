"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Promocion } from "@/lib/types"

export default function AdminPromocionesPage() {
  const [promociones, setPromociones] = useState<Promocion[]>([])
  const [form, setForm] = useState({ codigo: "", descripcion: "", porcDesc: 0, activa: true, fechaInicio: "", fechaFin: "" })
  const [editing, setEditing] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)

  const load = () => api.admin.promociones.listar().then(setPromociones)

  useEffect(() => { load() }, [])

  const openNew = () => {
    setForm({ codigo: "", descripcion: "", porcDesc: 0, activa: true, fechaInicio: "", fechaFin: "" })
    setEditing(null)
    setShowModal(true)
  }

  const openEdit = (p: Promocion) => {
    setForm({
      codigo: p.codigo,
      descripcion: p.descripcion || "",
      porcDesc: p.porcDesc,
      activa: p.activa,
      fechaInicio: p.createdAt,
      fechaFin: "",
    })
    setEditing(p.idPromocion)
    setShowModal(true)
  }

  const save = async () => {
    const data = {
      codigo: form.codigo,
      descripcion: form.descripcion,
      porcDesc: form.porcDesc,
      activa: form.activa,
      fechaInicio: form.fechaInicio ? new Date(form.fechaInicio).toISOString() : undefined,
      fechaFin: form.fechaFin ? new Date(form.fechaFin).toISOString() : undefined,
    }
    if (editing !== null) {
      await api.admin.promociones.actualizar(editing, data)
    } else {
      await api.admin.promociones.crear(data as any)
    }
    setShowModal(false)
    await load()
  }

  const eliminar = async (id: number) => {
    if (confirm("Eliminar promocion?")) {
      await api.admin.promociones.eliminar(id)
      await load()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promociones</h1>
        <button onClick={openNew} className="bg-amber-500 text-white px-4 py-2 rounded text-sm hover:bg-amber-600">
          Nueva Promocion
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="text-left px-4 py-3">Codigo</th>
              <th className="text-left px-4 py-3">Descripcion</th>
              <th className="text-left px-4 py-3">% Desc</th>
              <th className="text-left px-4 py-3">Activa</th>
              <th className="text-left px-4 py-3">Creada</th>
              <th className="text-left px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {promociones.map((p) => (
              <tr key={p.idPromocion} className="border-t">
                <td className="px-4 py-3 font-medium">{p.codigo}</td>
                <td className="px-4 py-3 text-stone-500">{p.descripcion || "-"}</td>
                <td className="px-4 py-3">{p.porcDesc}%</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${p.activa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.activa ? "Si" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => openEdit(p)} className="text-amber-600 hover:underline text-xs">Editar</button>
                  <button onClick={() => eliminar(p.idPromocion)} className="text-red-500 hover:underline text-xs">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="font-bold text-lg">{editing !== null ? "Editar" : "Nueva"} Promocion</h2>
            <div>
              <label className="text-sm text-stone-500">Codigo</label>
              <input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} className="border rounded px-3 py-2 w-full text-sm" />
            </div>
            <div>
              <label className="text-sm text-stone-500">Descripcion</label>
              <input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="border rounded px-3 py-2 w-full text-sm" />
            </div>
            <div>
              <label className="text-sm text-stone-500">% Descuento</label>
              <input type="number" value={form.porcDesc} onChange={(e) => setForm({ ...form, porcDesc: Number(e.target.value) })} className="border rounded px-3 py-2 w-full text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.activa} onChange={(e) => setForm({ ...form, activa: e.target.checked })} />
              <label className="text-sm">Activa</label>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-sm">Cancelar</button>
              <button onClick={save} className="px-4 py-2 bg-amber-500 text-white rounded text-sm hover:bg-amber-600">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}