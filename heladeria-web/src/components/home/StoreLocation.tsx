import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";

interface StoreLocationProps {
  name?: string;
  address?: string;
  city?: string;
  hours?: string;
  phone?: string;
  mapUrl?: string;
  imageSrc?: string;
}

export function StoreLocation({
  name = "Rumba Habana — Casa Central",
  address = "Av. Santa Fe 3420",
  city = "Palermo, Buenos Aires",
  hours = "Lunes a Domingos: 12:00 a 00:30 hs",
  phone = "+54 11 4821-5540",
  mapUrl = "https://maps.google.com/?q=Av.+Santa+Fe+3420,+Palermo,+Buenos+Aires",
  imageSrc = "/assets/sucursal.jpg",
}: StoreLocationProps) {
  return (
    <section className="py-14">
      <PageContainer className="space-y-8">
        <SectionHeader
          eyebrow="Visitanos"
          title="Nuestra Sucursal"
          description="Vení a descubrir el sabor auténtico en un espacio cálido y artesanal."
        />

        <div className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-12">
          <div className="relative min-h-[300px] lg:col-span-6 lg:min-h-[420px]">
            <Image
              src={imageSrc}
              alt="Sucursal Rumba Habana"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-6">
            <div className="space-y-6">
              <div>
                <span className="inline-block rounded-full bg-secondary/30 px-3 py-1 text-xs font-semibold text-primary">
                  Local oficial
                </span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-foreground sm:text-3xl">
                  {name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Te esperamos con todos nuestros sabores recién batidos, opciones sin TACC, café de especialidad y servicio take away o para disfrutar en el salón.
                </p>
              </div>

              <div className="space-y-4 text-sm text-foreground">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary/30 text-primary">
                    <MapPin className="size-4" />
                  </span>
                  <div>
                    <p className="font-semibold">{address}</p>
                    <p className="text-muted-foreground">{city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary/30 text-primary">
                    <Clock className="size-4" />
                  </span>
                  <div>
                    <p className="font-semibold">Horarios de atención</p>
                    <p className="text-muted-foreground">{hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary/30 text-primary">
                    <Phone className="size-4" />
                  </span>
                  <div>
                    <p className="font-semibold">Teléfono y consultas</p>
                    <p className="text-muted-foreground">{phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/60 pt-4">
              <Button asChild className="rounded-full">
                <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                  Cómo llegar
                  <ExternalLink className="size-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/catalog">Pedir para retirar</Link>
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
