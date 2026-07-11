"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/components/dashboard/sidebar";

// The Sidebar is hidden below the md breakpoint (see sidebar.tsx), so without
// this the dashboard's other sections (Sessions/Offers/Survey/Settings) are
// completely unreachable on a phone. Closes on route change and on Escape.
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [open]);

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-4.5" strokeWidth={1.75} /> : <Menu className="size-4.5" strokeWidth={1.75} />}
      </Button>

      {open ? (
        <>
          <div
            className="fixed inset-0 top-14 z-40 bg-foreground/20"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav className="fixed inset-x-0 top-14 z-50 flex flex-col gap-1 border-b border-border bg-background p-3 shadow-md">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground",
                    isActive && "bg-muted text-foreground",
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </>
      ) : null}
    </div>
  );
}
