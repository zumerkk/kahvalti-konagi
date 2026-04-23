import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-black">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-semibold tracking-tight text-white">
              Admin
            </Link>
            <nav className="hidden items-center gap-4 text-sm text-white/70 md:flex">
              <Link href="/admin" className="hover:text-white">
                Rezervasyonlar
              </Link>
              <Link href="/admin/menu/urunler" className="hover:text-white">
                Menü
              </Link>
              <Link href="/admin/kapali-gunler" className="hover:text-white">
                Kapalı Günler
              </Link>
              <Link href="/admin/masalar" className="hover:text-white">
                Masalar
              </Link>
            </nav>
          </div>
          <ButtonLink href="/" variant="secondary">
            Siteye Dön
          </ButtonLink>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
