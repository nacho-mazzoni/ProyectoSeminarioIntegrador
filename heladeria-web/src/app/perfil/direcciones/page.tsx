"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Direccion, ZonaEnvio } from "@/lib/types"

export default function DireccionesPage() {
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [zonas, setZonas] = useState<ZonaEnvio[]>([])
  const [calle, setCalle] = useState("")
  const [numero, setNumero] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [referencia, setReferencia] = useState("")
  const [idZona, setIdZona] = useState<number | "">("")
  const [error, setError] = useState("")

  const cargar = () => {
    api.direcciones.listar().then(setDirecciones)
    api.zonas.listar().then(setZonas)
  }

  useEffect(() => { cargar() }, [])

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!idZona) { setError("Seleccioná una zona de envío"); return }

    try {
      await api.direcciones.crear({
        calle,
        numero,
        ciudad,
        referencia: referencia || undefined,
        idZona: Number(idZona),
      })
      setCalle(""); setNumero(""); setCiudad(""); setReferencia(""); setIdZona("")
      cargar()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error")
    }
  }

  const handleEliminar = async (id: number) => {
    await api.direcciones.eliminar(id)
    cargar()
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Mis Direcciones</h1>

      <form onSubmit={handleCrear} className="flex flex-col gap-3 mb-8 bg-white p-5 rounded-xl shadow-sm border">
        <div className="flex gap-3">
          <input placeholder="Calle" value={calle} onChange={(e) => setCalle(e.target.value)} required className="border rounded px-3 py-2 flex-1" />
          <input placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} required className="border rounded px-3 py-2 w-24" />
        </div>
        <input placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required className="border rounded px-3 py-2" />
        <input placeholder="Referencia (opcional)" value={referencia} onChange={(e) => setReferencia(e.target.value)} className="border rounded px-3 py-2" />

        <select value={idZona} onChange={(e) => setIdZona(e.target.value ? Number(e.target.value) : "")} required className="border rounded px-3 py-2">
          <option value="">Seleccionar zona de envío</option>
          {zonas.map((z) => (
            <option key={z.idZona} value={z.idZona}>
              {z.nombreZona} (${z.costoEnvio.toFixed(2)})
            </option>
          ))}
        </select>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="bg-amber-500 text-white py-2 rounded hover:bg-amber-600">Agregar Dirección</button>
      </form>

      <div className="flex flex-col gap-3">
        {direcciones.map((d) => (
          <div key={d.idDireccion} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-start">
            <div>
              <p className="font-medium">{d.calle} {d.numero}</p>
              <p className="text-sm text-stone-500">{d.ciudad}</p>
              <p className="text-sm text-stone-500">Zona: {d.zona}</p>
              {d.referencia && <p className="text-sm text-stone-400">Ref: {d.referencia}</p>}
            </div>
            <button onClick={() => handleEliminar(d.idDireccion)} className="text-red-500 text-sm hover:underline">Eliminar</button>
          </div>
        ))}
        {direcciones.length === 0 && <p className="text-stone-400 text-center py-8">No tenés direcciones cargadas</p>}
      </div>
    </>
  )
}
