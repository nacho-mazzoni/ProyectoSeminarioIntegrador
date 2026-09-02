"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CreditCard, Loader2, MapPin, MapPinPlus, Wallet } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { PageContainer } from "@/components/shared/PageContainer";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const qc = useQueryClient();
  const navigate = useRouter();
  const { items, clear } = useCart();
  const { user, isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (isReady) {
      if (!isAuthenticated) {
        navigate.push("/login");
      } else if (user?.rol === "ADMINISTRADOR") {
        navigate.push("/admin");
      }
    }
  }, [isReady, isAuthenticated, user, navigate]);
  const [addressId, setAddressId] = useState<number>();
  const [metodoEntrega, setMetodoEntrega] = useState("retiro");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [placing, setPlacing] = useState(false);
  const [addrOpen, setAddrOpen] = useState(false);
  const [addrCalle, setAddrCalle] = useState("");
  const [addrNumero, setAddrNumero] = useState("");
  const [addrCiudad, setAddrCiudad] = useState("");
  const [addrReferencia, setAddrReferencia] = useState("");
  const [addrIdZona, setAddrIdZona] = useState<string>("");

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: api.direcciones.listar,
  });

  const { data: zonas = [] } = useQuery({
    queryKey: ["zonas"],
    queryFn: api.zonas.listar,
  });

  const createAddress = useMutation({
    mutationFn: (payload: Parameters<typeof api.direcciones.crear>[0]) => api.direcciones.crear(payload),
    onSuccess: (newAddr) => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
      setAddressId(newAddr.idDireccion);
      toast.success("Dirección agregada");
      setAddrCalle(""); setAddrNumero(""); setAddrCiudad(""); setAddrReferencia(""); setAddrIdZona("");
      setAddrOpen(false);
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "No se pudo guardar la dirección";
      console.error("Error al guardar dirección en checkout:", msg);
      toast.error(msg);
    },
  });

  const selectedAddress = addresses.find((a) => a.idDireccion === addressId) ?? addresses[0];
  const selectedAddressId = selectedAddress?.idDireccion;
  const selectedZone = zonas.find((z) => z.idZona === (selectedAddress?.idZona ?? 0));

  const isDelivery = metodoEntrega === "delivery";
  let shippingCost: number | null = 0;
  let shippingLabel: string | undefined = undefined;

  if (isDelivery) {
    if (selectedZone) {
      shippingCost = selectedZone.costoEnvio;
    } else {
      shippingCost = null;
      shippingLabel = addresses.length === 0 ? "Agregar dirección" : "Fuera de cobertura";
    }
  } else {
    shippingCost = 0;
    shippingLabel = "Gratis (retiro en local)";
  }

  if (items.length === 0) {
    return (
      <PageContainer className="py-20 text-center">
        <h1 className="text-2xl font-semibold">Tu carrito está vacío</h1>
        <Button className="mt-6" onClick={() => navigate.push("/catalog")}>
          Explorar el menú
        </Button>
      </PageContainer>
    );
  }

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const res = await api.pedidos.crear({
        metodoEntrega,
        ...(metodoEntrega === "delivery" && selectedAddressId ? { idDireccion: selectedAddressId } : {}),
        metodoPago,
        detalles: items.map((i) => ({
          idProducto: i.product.idProducto,
          cantidad: i.quantity,
          idsSabor: i.sabores.length > 0 ? i.sabores.map((s) => s.idSabor) : undefined,
          idsAdicional: i.adicionales.length > 0 ? i.adicionales.map((a) => a.idAdicional) : undefined,
        })),
      });
      clear();
      if (res.initPoint) {
        window.location.href = res.initPoint;
      } else {
        toast.success("¡Pedido realizado! Estamos preparando tus helados.");
        navigate.push("/orders");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Algo salió mal. Intentalo de nuevo.";
      console.error("Error al crear pedido:", msg);
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <PageContainer className="py-10">
      <h1 className="text-3xl font-semibold sm:text-4xl">Finalizar pedido</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Método de entrega</h2>
            </div>
            <RadioGroup value={metodoEntrega} onValueChange={setMetodoEntrega} className="gap-3">
              {[
                { id: "retiro", label: "Retiro en local" },
                { id: "delivery", label: "Delivery" },
              ].map((m) => (
                <Label
                  key={m.id}
                  htmlFor={`entrega-${m.id}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors",
                    metodoEntrega === m.id ? "border-primary bg-secondary" : "border-border hover:bg-secondary/60",
                  )}
                >
                  <RadioGroupItem id={`entrega-${m.id}`} value={m.id} />
                  <span className="font-medium">{m.label}</span>
                </Label>
              ))}
            </RadioGroup>

            {metodoEntrega === "delivery" ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">Dirección de entrega</p>
                {selectedAddress && !selectedZone && (
                  <p className="text-sm text-destructive">Esta dirección está fuera del área de cobertura de delivery.</p>
                )}
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full rounded-2xl" />
                    <Skeleton className="h-20 w-full rounded-2xl" />
                  </div>
                ) : addresses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tenés direcciones guardadas.</p>
                ) : (
                  <RadioGroup value={String(selectedAddressId ?? "")} onValueChange={(v) => setAddressId(Number(v))} className="gap-3">
                    {addresses.map((a) => {
                      const z = zonas.find((z) => z.idZona === a.idZona);
                      return (
                        <Label
                          key={a.idDireccion}
                          htmlFor={`addr-${a.idDireccion}`}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
                            selectedAddressId === a.idDireccion ? "border-primary bg-secondary" : "border-border hover:bg-secondary/60",
                          )}
                        >
                          <RadioGroupItem id={`addr-${a.idDireccion}`} value={String(a.idDireccion)} className="mt-1" />
                          <span className="space-y-0.5 flex-1">
                            <span className="block font-semibold">{a.calle} {a.numero}</span>
                            <span className="block text-sm text-muted-foreground">{a.ciudad}</span>
                            {z && (
                              <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                {z.nombreZona} — ${z.costoEnvio.toFixed(2)} envío
                              </span>
                            )}
                          </span>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                )}
                <Dialog open={addrOpen} onOpenChange={setAddrOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <MapPinPlus className="size-4" />
                      Agregar dirección
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nueva dirección</DialogTitle>
                      <DialogDescription>Agregá un lugar de entrega para este pedido.</DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!addrIdZona) { toast.error("Seleccioná una zona de envío"); return; }
                        createAddress.mutate({
                          calle: addrCalle,
                          numero: addrNumero,
                          ciudad: addrCiudad,
                          referencia: addrReferencia || undefined,
                          idZona: Number(addrIdZona),
                        });
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-[1fr_auto] gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="addr-calle">Calle</Label>
                          <Input id="addr-calle" required value={addrCalle} onChange={(e) => setAddrCalle(e.target.value)} placeholder="Av. Siempre Viva" />
                        </div>
                        <div className="w-24 space-y-2">
                          <Label htmlFor="addr-numero">Número</Label>
                          <Input id="addr-numero" required value={addrNumero} onChange={(e) => setAddrNumero(e.target.value)} placeholder="123" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addr-ciudad">Ciudad</Label>
                        <Input id="addr-ciudad" required value={addrCiudad} onChange={(e) => setAddrCiudad(e.target.value)} placeholder="Buenos Aires" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addr-referencia">Referencia (opcional)</Label>
                        <Input id="addr-referencia" value={addrReferencia} onChange={(e) => setAddrReferencia(e.target.value)} placeholder="Casa blanca, timbre 3" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addr-zona">Zona de envío</Label>
                        <Select value={addrIdZona} onValueChange={setAddrIdZona}>
                          <SelectTrigger id="addr-zona" className="h-11">
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
                        <Button type="submit" className="rounded-full" disabled={createAddress.isPending}>
                          {createAddress.isPending && <Loader2 className="size-4 animate-spin" />}
                          Guardar dirección
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-border bg-secondary/30 p-4 text-center text-sm text-muted-foreground">
                Retirá tu pedido por nuestra sucursal. No necesitás registrar una dirección.
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <Wallet className="size-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Método de pago</h2>
            </div>
            <RadioGroup value={metodoPago} onValueChange={setMetodoPago} className="gap-3">
              {[
                { id: "efectivo", label: "Efectivo contra entrega", icon: Wallet },
                { id: "mercado_pago", label: "Mercado Pago", icon: CreditCard },
              ].map((m) => (
                <Label
                  key={m.id}
                  htmlFor={`pay-${m.id}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors",
                    metodoPago === m.id ? "border-primary bg-secondary" : "border-border hover:bg-secondary/60",
                  )}
                >
                  <RadioGroupItem id={`pay-${m.id}`} value={m.id} />
                  <m.icon className="size-5 text-muted-foreground" />
                  <span className="font-medium">{m.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <OrderSummary shippingCost={shippingCost} shippingLabel={shippingLabel}>
            <Button
              size="lg"
              className="w-full rounded-full"
              onClick={placeOrder}
              disabled={placing || (metodoEntrega === "delivery" && (!selectedAddressId || !selectedZone))}
            >
              {placing && <Loader2 className="size-4 animate-spin" />}
              {placing ? "Realizando pedido..." : "Confirmar pedido"}
            </Button>
          </OrderSummary>
        </div>
      </div>
    </PageContainer>
  );
}
