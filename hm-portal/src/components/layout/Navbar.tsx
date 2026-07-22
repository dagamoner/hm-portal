import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo placeholder - text for now */}
          <span className="text-2xl font-bold text-[var(--color-secondary)]">HM<span className="text-[var(--color-primary)]">.</span></span>
        </Link>
        
        <nav className="hidden md:flex gap-6">
          <Link href="#servicios" className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
            Servicios
          </Link>
          <Link href="#nosotros" className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
            Nosotros
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="hidden md:inline-flex">Portal B2B</Button>
          </Link>
          <Link href="/contacto">
            <Button>Contacto</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
