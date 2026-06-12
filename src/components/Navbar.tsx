import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e6dfd5]/60 bg-[#faf6ee]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 font-bold tracking-tight text-[#3d3023] hover:text-orange-600 transition-colors"
        >
          <span className="relative h-10 w-10 overflow-hidden rounded-xl border border-[#e6dfd5] bg-white shadow-sm">
            <Image src="/media/logo.png" alt="Kahvaltı Konağı logo" fill className="object-cover" />
          </span>
          <span className="text-lg">Kahvaltı Konağı</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#5c4d3c] md:flex">
          <Link href="/#hakkinda" className="hover:text-orange-600 transition-colors">
            Hakkında
          </Link>
          <Link href="/#menu" className="hover:text-orange-600 transition-colors">
            Açık Büfe
          </Link>
          <Link href="/menu" className="hover:text-orange-600 transition-colors">
            Menü
          </Link>
          <Link href="/#galeri" className="hover:text-orange-600 transition-colors">
            Galeri
          </Link>
          <Link href="/#iletisim" className="hover:text-orange-600 transition-colors">
            İletişim
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ButtonLink href="/rezervasyon" variant="primary">
            Rezervasyon Yap
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
