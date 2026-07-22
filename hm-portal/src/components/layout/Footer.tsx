import { Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--color-secondary)] text-white py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">HM<span className="text-[var(--color-primary)]">.</span></h3>
            <p className="text-gray-400 max-w-xs">
              Servicios integrales de Higiene y Seguridad Laboral. Protegemos lo más valioso de tu empresa.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[var(--color-primary)]">Contacto Rápido</h4>
            <div className="flex flex-col gap-3">
              <a 
                href="mailto:mhhigieneyseguridad@gmail.com" 
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <Mail size={18} />
                mhhigieneyseguridad@gmail.com
              </a>
              <a 
                href="https://wa.me/5492615430866" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-[#25D366] transition-colors"
              >
                <MessageCircle size={18} />
                +54 9 261 543 0866
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[var(--color-primary)]">Legal</h4>
            <ul className="flex flex-col gap-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} HM Higiene y Seguridad. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
