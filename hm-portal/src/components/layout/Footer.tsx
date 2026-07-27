import { Mail, MessageCircle } from "lucide-react";
import Image from "next/image";
import { LegalModals } from "../legal/LegalModals";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--color-secondary)] text-white py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white p-1 rounded-md">
                <Image src="/images/logo.png" alt="MH Logo" width={24} height={24} className="object-contain" />
              </div>
              <h3 className="text-xl font-bold">MH<span className="text-[var(--color-primary)]">.</span></h3>
            </div>
            <p className="text-gray-400 max-w-xs">
              Servicios integrales de Higiene y Seguridad Laboral. Protegemos lo más valioso de tu empresa.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[var(--color-primary)]">Legal</h4>
            <LegalModals />
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MH Higiene y Seguridad. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
