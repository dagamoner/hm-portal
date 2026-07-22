import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Mail, MessageCircle, MapPin } from "lucide-react"

export default function Contacto() {
  return (
    <div className="w-full py-20 bg-[var(--color-background)]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-[var(--color-secondary)] mb-4">Contáctanos</h1>
          <p className="text-[var(--color-muted-foreground)] text-lg">
            Estamos listos para asesorarte y llevar la higiene y seguridad de tu empresa al siguiente nivel. Completa el formulario o utiliza nuestros canales directos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Direct Contact Info */}
          <div className="space-y-8">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Información Directa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <a 
                  href="mailto:mhhigieneyseguridad@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Correo Electrónico</h4>
                    <p className="text-sm text-gray-500">mhhigieneyseguridad@gmail.com</p>
                  </div>
                </a>

                <a 
                  href="https://wa.me/5492615430866"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                    <p className="text-sm text-gray-500">+54 9 261 543 0866</p>
                  </div>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form Placeholder */}
          <Card className="shadow-lg border-t-4 border-t-[var(--color-primary)]">
            <CardHeader>
              <CardTitle>Envíanos un mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Empresa</label>
                    <input type="text" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="Nombre de empresa" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <input type="email" className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="correo@empresa.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mensaje</label>
                  <textarea className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] min-h-[120px]" placeholder="¿En qué podemos ayudarte?"></textarea>
                </div>
                <Button className="w-full" size="lg">Enviar Mensaje</Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
