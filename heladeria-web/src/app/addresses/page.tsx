"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, MapPinPlus } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { DireccionResponse } from "@/lib/types";
import { AuthGate } from "@/components/auth/AuthGate";
import { PageContainer } from "@/components/shared/PageContainer";
import { AddressCard } from "@/components/profile/AddressCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddressesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [referencia, setReferencia] = useState("");
  const [idZona, setIdZona] = useState<string>("");

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: api.direcciones.listar,
  });

  const { data: zonas = [] } = useQuery({
    queryKey: ["zonas"],
    queryFn: api.zonas.listar,
  });

  const createMutation = useMutation({
    mutationFn: (payload: Parameters<typeof api.direcciones.crear>[0]) => api.direcciones.crear(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Dirección agregada");
      setCalle(""); setNumero(""); setCiudad(""); setReferencia(""); setIdZona("");
      setOpen(false);
    },
    onError: () => toast.error("No se pudo guardar la dirección"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.direcciones.eliminar(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Dirección eliminada");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idZona) {
      toast.error("Seleccioná una zona de envío");
      return;
    }
    createMutation.mutate({
      calle,
      numero,
      ciudad,
      referencia: referencia || undefined,
      idZona: Number(idZona),
    });
  };

  return (
    <AuthGate>
      <PageContainer className="py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Direcciones</h1>
            <p className="mt-2 text-muted-foreground">Administrá dónde recibís tus pedidos.</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <MapPinPlus className="size-4" />
                Agregar dirección
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva dirección</DialogTitle>
                <DialogDescription>Agregá un lugar de entrega a tu cuenta.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="street">Calle</Label>
                    <Input id="street" required value={calle} onChange={(e) => setCalle(e.target.value)} placeholder="Av. Siempre Viva" />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input id="number" required value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="123" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" required value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Buenos Aires" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referencia">Referencia (opcional)</Label>
                  <Input id="referencia" value={referencia} onChange={(e) => setReferencia(e.target.value)} placeholder="Casa blanca, timbre 3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zona">Zona de envío</Label>
                  <Select value={idZona} onValueChange={setIdZona}>
                    <SelectTrigger id="zona" className="h-11">
                      <SelectValue placeholder="Seleccionar zona" />
                    </SelectTrigger>
                    <SelectContent>
                      {zonas.map((z) => (
                        <SelectItem key={z.idZona} value={String(z.idZona)}>
                          {z.nombreZona} (${z.costoEnvio.toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit" className="rounded-full" disabled={createMutation.isPending}>
                    {createMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                    Guardar dirección
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-3xl" />
            ))
          ) : addresses.length === 0 ? (
            <div className="md:col-span-2">
              <EmptyState
                icon={MapPinPlus}
                title="Todavía no tenés direcciones"
                description="Agregá tu primera dirección para agilizar el checkout."
              />
            </div>
          ) : (
            addresses.map((a) => (
              <AddressCard key={a.idDireccion} address={a} onDelete={(id) => deleteMutation.mutate(id)} />
            ))
          )}
        </div>
      </PageContainer>
    </AuthGate>
  );
}
