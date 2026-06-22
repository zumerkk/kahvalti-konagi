"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  UtensilsCrossed,
  CalendarOff,
  Armchair,
  ShoppingCart,
  Receipt,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/rezervasyonlar", label: "Rezervasyonlar", icon: CalendarCheck },
  { href: "/admin/kasa", label: "Hızlı Satış", icon: ShoppingCart, accent: true },
  { href: "/admin/gun-sonu", label: "Gün Sonu", icon: Receipt },
  { href: "/admin/menu/urunler", label: "Menü", icon: UtensilsCrossed },
  { href: "/admin/masalar", label: "Masalar", icon: Armchair },
  { href: "/admin/kapali-gunler", label: "Kapalı Günler", icon: CalendarOff },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname.startsWith(href);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <aside
      className={`flex flex-col border-r border-white/[0.06] bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[250px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-5">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/20 to-amber-600/10">
          <Image src="/media/logo.png" alt="Logo" fill className="object-cover" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-white">Kahvaltı Konağı</div>
            <div className="text-[10px] text-amber-500/70">Admin Panel</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-amber-500/15 text-amber-400 shadow-sm shadow-amber-500/10"
                  : item.accent
                    ? "text-amber-400/70 hover:bg-amber-500/10 hover:text-amber-400"
                    : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-amber-500" />
              )}
              <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-amber-400" : ""}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.accent && !active && (
                <span className="ml-auto rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                  POS
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 border-t border-white/[0.06] px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 transition hover:bg-white/[0.04] hover:text-white/60"
        >
          <ExternalLink className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Siteye Dön</span>}
        </Link>
        <button
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Çıkış Yap</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/30 transition hover:bg-white/[0.04] hover:text-white/50 md:flex"
        >
          <ChevronLeft
            className={`h-[18px] w-[18px] shrink-0 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
          {!collapsed && <span>Daralt</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-950/90 text-white/70 backdrop-blur md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex">
            {sidebar}
            <button
              onClick={() => setMobileOpen(false)}
              className="mt-5 ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex">{sidebar}</div>
    </>
  );
}
