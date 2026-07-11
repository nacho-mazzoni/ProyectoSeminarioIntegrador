"use client";

import Link from "next/link";
import { IceCream } from "lucide-react";
import type { ReactNode } from "react";
import { PageContainer } from "@/components/shared/PageContainer";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <PageContainer className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            href="/"
            className="mb-6 flex items-center gap-2"
            aria-label="Rumba Habana home"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <IceCream className="size-5" />
            </span>
            <span className="font-display text-2xl font-semibold">Rumba Habana</span>
          </Link>
          <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </PageContainer>
  );
}
