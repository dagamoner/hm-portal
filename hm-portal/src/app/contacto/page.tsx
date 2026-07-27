import { Card, CardContent } from "@/components/ui/Card"
import { Mail, MessageCircle } from "lucide-react"

export default function Contacto() {
  return (
    <div className="w-full py-20 bg-[var(--color-background)] min-h-[70vh] flex flex-col justify-center">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-[var(--color-secondary)] mb-4">Contáctanos</h1>
          <p className="text-[var(--color-muted-foreground)] text-lg">
            Estamos listos para asesorarte y llevar la higiene y seguridad de tu empresa al siguiente nivel. Utiliza nuestros canales directos para comunicarte.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"></div>
            <CardContent className="p-12">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
                
                <a 
                  href="mailto:mhhigieneyseguridad@gmail.com"
                  className="group flex flex-col items-center gap-4 transition-transform hover:scale-110"
                >
                  <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Mail size={48} />
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Email</span>
                </a>

                <a 
                  href="https://wa.me/5492615430866"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-4 transition-transform hover:scale-110"
                >
                  <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-sm group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                    <MessageCircle size={48} />
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-green-500 transition-colors">WhatsApp</span>
                </a>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
