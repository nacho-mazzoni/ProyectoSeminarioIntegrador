"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { Categoria } from "@/lib/types"

export default function NuevoProductoPage() {
  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [autorizado, setAutorizado] = useState<boolean | null>(null)
  const [nombre, setNombre] = useState("")
  const [idCategoria, setIdCategoria] = useState("")
  const [precioBase, setPrecioBase] = useState("")
  const [stockEnvases, setStockEnvases] = useState("")
  const [maxSabores, setMaxSabores] = useState("")
  const [error, setError] = useState("")
  const [ok, setOk] = useState(false)

  useEffect(() => {
    api.auth.me()
      .then((u) => {
        if (u.rol !== "Administrador") {
          setAutorizado(false)
          return
        }
        setAutorizado(true)
        api.categorias.listar().then(setCategorias)
      })
      .catch(() => router.push("/login"))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await api.admin.productos.crear({
        nombre,
        idCategoria: Number(idCategoria),
        precioBase: Number(precioBase),
        stockEnvases: Number(stockEnvases),
        maxSabores: Number(maxSabores),
      })
      setOk(true)
      setTimeout(() => router.push("/admin/productos"), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear producto")
    }
  }

  if (autorizado === null)
    return <div className="text-center py-16">Cargando...</div>
  if (!autorizado)
    return <div className="text-center py-16 text-red-600">No autorizado</div>

  if (ok)
    return (
      <div className="max-w-lg mx-auto mt-16 px-4 text-center">
        <p className="text-green-600 font-semibold">Producto creado correctamente</p>
        <p className="text-sm text-stone-400 mt-2">Redirigiendo...</p>
      </div>
    )

  return (
    <div className="max-w-lg mx-auto mt-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Categoría</label>
          <select
            value={idCategoria}
            onChange={(e) => setIdCategoria(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Seleccionar...</option>
            {categorias.map((c) => (
              <option key={c.idCategoria} value={c.idCategoria}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Precio Base</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={precioBase}
            onChange={(e) => setPrecioBase(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Stock (envases)</label>
          <input
            type="number"
            min="0"
            value={stockEnvases}
            onChange={(e) => setStockEnvases(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Máx. Sabores</label>
          <input
            type="number"
            min="0"
            value={maxSabores}
            onChange={(e) => setMaxSabores(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <p className="text-xs text-stone-400 mt-0.5">0 si no aplica (ej: palitos)</p>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-amber-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-amber-600"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/productos")}
            className="border px-5 py-2 rounded-lg text-sm hover:bg-stone-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
