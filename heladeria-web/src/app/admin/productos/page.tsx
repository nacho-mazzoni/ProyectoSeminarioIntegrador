"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Producto, Categoria, Sabor, Adicional } from "@/lib/types"

type Tab = "productos" | "categorias" | "sabores" | "adicionales"

export default function AdminProductosPage() {
  const [tab, setTab] = useState<Tab>("productos")

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Productos</h1>
      <div className="flex gap-2 mb-6">
        {(["productos", "categorias", "sabores", "adicionales"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-sm ${
              tab === t ? "bg-amber-500 text-white" : "bg-white border hover:border-amber-400"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === "productos" && <ProductosTab />}
      {tab === "categorias" && <CategoriasTab />}
      {tab === "sabores" && <SaboresTab />}
      {tab === "adicionales" && <AdicionalesTab />}
    </div>
  )
}

function ProductosTab() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategoria] = useState<Categoria[]>([])
  const [form, setForm] = useState({ nombre: "", stockEnvases: 0, precioBase: 0, maxSabores: 0, idCategoria: 0 })
  const [editId, setEditId] = useState<number | null>(null)

  const cargar = () => {
    api.admin.productos.listar().then(setProductos)
    api.admin.categorias.listar().then(setCategoria)
  }
  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    if (editId) {
      await api.admin.productos.actualizar(editId, form)
    } else {
      await api.admin.productos.crear(form)
    }
    setForm({ nombre: "", stockEnvases: 0, precioBase: 0, maxSabores: 0, idCategoria: 0 })
    setEditId(null)
    cargar()
  }

  const editar = (p: Producto) => {
    setForm({ nombre: p.nombre, stockEnvases: p.stockEnvases, precioBase: p.precioBase, maxSabores: p.maxSabores, idCategoria: p.categoria.idCategoria })
    setEditId(p.idProducto)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={(e) => { e.preventDefault(); guardar() }} className="bg-white border rounded-xl p-5 space-y-3">
        <h2 className="font-semibold">{editId ? "Editar" : "Nuevo"} Producto</h2>
        <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required className="border rounded px-3 py-2 w-full text-sm" />
        <div className="flex gap-3">
          <input type="number" placeholder="Stock" value={form.stockEnvases} onChange={(e) => setForm({ ...form, stockEnvases: +e.target.value })} required className="border rounded px-3 py-2 w-full text-sm" />
          <input type="number" step="0.01" placeholder="Precio" value={form.precioBase} onChange={(e) => setForm({ ...form, precioBase: +e.target.value })} required className="border rounded px-3 py-2 w-full text-sm" />
        </div>
        <div className="flex gap-3">
          <input type="number" placeholder="Max sabores" value={form.maxSabores} onChange={(e) => setForm({ ...form, maxSabores: +e.target.value })} required className="border rounded px-3 py-2 w-full text-sm" />
          <select value={form.idCategoria} onChange={(e) => setForm({ ...form, idCategoria: +e.target.value })} required className="border rounded px-3 py-2 w-full text-sm">
            <option value={0}>Categoria</option>
            {categorias.map((c) => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button className="bg-amber-500 text-white px-4 py-2 rounded text-sm hover:bg-amber-600">{editId ? "Actualizar" : "Crear"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: "", stockEnvases: 0, precioBase: 0, maxSabores: 0, idCategoria: 0 }) }} className="text-sm text-stone-500 underline">Cancelar</button>}
        </div>
      </form>
      <div className="space-y-2">
        {productos.map((p) => (
          <div key={p.idProducto} className="bg-white border rounded-lg p-4 flex justify-between items-start">
            <div>
              <p className="font-medium">{p.nombre}</p>
              <p className="text-sm text-stone-500">${p.precioBase.toFixed(2)} — Stock: {p.stockEnvases} — {p.categoria.nombre}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => editar(p)} className="text-amber-600 text-sm underline">Editar</button>
              <button onClick={() => { api.admin.productos.eliminar(p.idProducto); cargar() }} className="text-red-600 text-sm underline">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoriasTab() {
  const [items, setItems] = useState<Categoria[]>([])
  const [nombre, setNombre] = useState("")
  const [reqSab, setReqSab] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  const cargar = () => api.admin.categorias.listar().then(setItems)
  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    if (editId) await api.admin.categorias.actualizar(editId, { nombre, requiereSabores: reqSab })
    else await api.admin.categorias.crear({ nombre, requiereSabores: reqSab })
    setNombre(""); setReqSab(false); setEditId(null); cargar()
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={(e) => { e.preventDefault(); guardar() }} className="bg-white border rounded-xl p-5 space-y-3">
        <h2 className="font-semibold">{editId ? "Editar" : "Nueva"} Categoría</h2>
        <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="border rounded px-3 py-2 w-full text-sm" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={reqSab} onChange={(e) => setReqSab(e.target.checked)} />
          Requiere sabores
        </label>
        <div className="flex gap-2">
          <button className="bg-amber-500 text-white px-4 py-2 rounded text-sm hover:bg-amber-600">{editId ? "Actualizar" : "Crear"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setNombre(""); setReqSab(false) }} className="text-sm text-stone-500 underline">Cancelar</button>}
        </div>
      </form>
      <div className="space-y-2">
        {items.map((c) => (
          <div key={c.idCategoria} className="bg-white border rounded-lg p-4 flex justify-between items-start">
            <div>
              <p className="font-medium">{c.nombre}</p>
              <p className="text-sm text-stone-500">{c.requiereSabores ? "Requiere sabores" : "Sin sabores"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setNombre(c.nombre); setReqSab(c.requiereSabores); setEditId(c.idCategoria) }} className="text-amber-600 text-sm underline">Editar</button>
              <button onClick={() => { api.admin.categorias.eliminar(c.idCategoria); cargar() }} className="text-red-600 text-sm underline">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SaboresTab() {
  const [items, setItems] = useState<Sabor[]>([])
  const [form, setForm] = useState({ nombre: "", stockBaldes: 0, disponible: true, capBalde: "" })
  const [editId, setEditId] = useState<number | null>(null)

  const cargar = () => api.admin.sabores.listar().then(setItems)
  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    if (editId) await api.admin.sabores.actualizar(editId, form)
    else await api.admin.sabores.crear(form)
    setForm({ nombre: "", stockBaldes: 0, disponible: true, capBalde: "" })
    setEditId(null)
    cargar()
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={(e) => { e.preventDefault(); guardar() }} className="bg-white border rounded-xl p-5 space-y-3">
        <h2 className="font-semibold">{editId ? "Editar" : "Nuevo"} Sabor</h2>
        <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required className="border rounded px-3 py-2 w-full text-sm" />
        <div className="flex gap-3">
          <input type="number" placeholder="Stock baldes" value={form.stockBaldes} onChange={(e) => setForm({ ...form, stockBaldes: +e.target.value })} required className="border rounded px-3 py-2 w-full text-sm" />
          <input placeholder="Cap. balde (ej: 5L)" value={form.capBalde} onChange={(e) => setForm({ ...form, capBalde: e.target.value })} className="border rounded px-3 py-2 w-full text-sm" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.disponible} onChange={(e) => setForm({ ...form, disponible: e.target.checked })} />
          Disponible
        </label>
        <div className="flex gap-2">
          <button className="bg-amber-500 text-white px-4 py-2 rounded text-sm hover:bg-amber-600">{editId ? "Actualizar" : "Crear"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: "", stockBaldes: 0, disponible: true, capBalde: "" }) }} className="text-sm text-stone-500 underline">Cancelar</button>}
        </div>
      </form>
      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.idSabor} className="bg-white border rounded-lg p-4 flex justify-between items-start">
            <div>
              <p className="font-medium">{s.nombre}</p>
              <p className="text-sm text-stone-500">Stock: {s.stockBaldes} baldes {s.capBalde && `(${s.capBalde})`}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setForm({ nombre: s.nombre, stockBaldes: s.stockBaldes, disponible: s.disponible, capBalde: s.capBalde ?? "" }); setEditId(s.idSabor) }} className="text-amber-600 text-sm underline">Editar</button>
              <button onClick={() => { api.admin.sabores.eliminar(s.idSabor); cargar() }} className="text-red-600 text-sm underline">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdicionalesTab() {
  const [items, setItems] = useState<Adicional[]>([])
  const [form, setForm] = useState({ nombre: "", precioExtra: 0, disponible: true })
  const [editId, setEditId] = useState<number | null>(null)

  const cargar = () => api.admin.adicionales.listar().then(setItems)
  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    if (editId) await api.admin.adicionales.actualizar(editId, form)
    else await api.admin.adicionales.crear(form)
    setForm({ nombre: "", precioExtra: 0, disponible: true })
    setEditId(null)
    cargar()
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={(e) => { e.preventDefault(); guardar() }} className="bg-white border rounded-xl p-5 space-y-3">
        <h2 className="font-semibold">{editId ? "Editar" : "Nuevo"} Adicional</h2>
        <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required className="border rounded px-3 py-2 w-full text-sm" />
        <input type="number" step="0.01" placeholder="Precio extra" value={form.precioExtra} onChange={(e) => setForm({ ...form, precioExtra: +e.target.value })} required className="border rounded px-3 py-2 w-full text-sm" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.disponible} onChange={(e) => setForm({ ...form, disponible: e.target.checked })} />
          Disponible
        </label>
        <div className="flex gap-2">
          <button className="bg-amber-500 text-white px-4 py-2 rounded text-sm hover:bg-amber-600">{editId ? "Actualizar" : "Crear"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: "", precioExtra: 0, disponible: true }) }} className="text-sm text-stone-500 underline">Cancelar</button>}
        </div>
      </form>
      <div className="space-y-2">
        {items.map((a) => (
          <div key={a.idAdicional} className="bg-white border rounded-lg p-4 flex justify-between items-start">
            <div>
              <p className="font-medium">{a.nombre}</p>
              <p className="text-sm text-stone-500">+${a.precioExtra.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setForm({ nombre: a.nombre, precioExtra: a.precioExtra, disponible: a.disponible }); setEditId(a.idAdicional) }} className="text-amber-600 text-sm underline">Editar</button>
              <button onClick={() => { api.admin.adicionales.eliminar(a.idAdicional); cargar() }} className="text-red-600 text-sm underline">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
