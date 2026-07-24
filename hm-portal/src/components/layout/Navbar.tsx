import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md py-2">
      <div className="container mx-auto flex min-h-[5rem] items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <Image src="/images/logo.png" alt="MH Logo" width={80} height={80} className="object-contain" />
          <span className="text-5xl font-extrabold text-[var(--color-secondary)] tracking-tight">MH<span className="text-[var(--color-primary)]">.</span></span>
        </Link>
        
        <nav className="hidden md:flex gap-6">
          <Link href="/#servicios" className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
            Servicios
          </Link>
          <Link href="/#nosotros" className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
            Nosotros
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="hidden md:inline-flex">Portal MH</Button>
          </Link>
          <Link href="/contacto">
            <Button>Contacto</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
