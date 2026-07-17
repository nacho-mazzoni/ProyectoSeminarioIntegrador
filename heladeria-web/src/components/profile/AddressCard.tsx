"use client";

import { MapPin, Trash2 } from "lucide-react";
import type { DireccionResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function AddressCard({
  address,
  onDelete,
}: {
  address: DireccionResponse;
  onDelete: (id: number) => void;
}) {
  return (
    <article className="flex items-start gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
        <MapPin className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold">{address.calle} {address.numero}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{address.ciudad}</p>
        <p className="text-xs text-muted-foreground">Zona: {address.zona}</p>
        {address.referencia && (
          <p className="mt-1 text-xs text-muted-foreground">Ref: {address.referencia}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 rounded-full text-muted-foreground hover:text-destructive"
        aria-label={`Eliminar dirección ${address.calle}`}
        onClick={() => onDelete(address.idDireccion)}
      >
        <Trash2 className="size-4" />
      </Button>
    </article>
  );
}
