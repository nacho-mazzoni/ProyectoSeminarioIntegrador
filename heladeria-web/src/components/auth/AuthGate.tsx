"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/context/auth-context";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return (
      <PageContainer className="space-y-4 py-10">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </PageContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          icon={LogIn}
          title="Iniciá sesión"
          description="Necesitás una cuenta para ver esta página."
          action={
            <Button asChild size="lg" className="rounded-full">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return <>{children}</>;
}
