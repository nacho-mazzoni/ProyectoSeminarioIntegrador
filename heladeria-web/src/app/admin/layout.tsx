"use client";

import { useState, type ReactNode } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminGate>
      <div className="flex min-h-dvh">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:shrink-0">
          <div className="fixed left-0 top-0 z-30 h-full w-64">
            <AdminSidebar />
          </div>
        </div>

        {/* Mobile sidebar */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebar onClose={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className="flex flex-1 flex-col lg:ml-64">
          <AdminHeader onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 bg-background p-6">{children}</main>
        </div>
      </div>
    </AdminGate>
  );
}
