"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, telefono || undefined);
      toast.success("¡Cuenta creada! Disfrutá tus helados.");
      router.push("/account");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No pudimos crear la cuenta. Intentalo de nuevo.";
      console.error("Error al registrarse:", msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Crear tu cuenta"
      subtitle="Unite a Rumba Habana para pedir más rápido y tener tu historial."
      footer={
        <>
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Iniciar sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Al menos 6 caracteres"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono (opcional)</Label>
          <Input
            id="telefono"
            type="tel"
            autoComplete="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+54 11 1234-5678"
            className="h-11"
          />
        </div>
        <Button type="submit" size="lg" className="w-full rounded-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          Crear cuenta
        </Button>
      </form>
    </AuthShell>
  );
}
