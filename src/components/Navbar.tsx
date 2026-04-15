import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-white">
          <span className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <Image src="/media/logo.png" alt="Kahvaltı Konağı logo" fill className="object-cover" />
          </span>
          <span>Kahvaltı Konağı</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
          <a href="#hakkinda" className="hover:text-white">
            Hakkında
          </a>
          <a href="#menu" className="hover:text-white">
            Açık Büfe
          </a>
          <a href="#galeri" className="hover:text-white">
            Galeri
          </a>
          <a href="#iletisim" className="hover:text-white">
            İletişim
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <ButtonLink href="/rezervasyon" variant="primary">
            Online Rezervasyon
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
