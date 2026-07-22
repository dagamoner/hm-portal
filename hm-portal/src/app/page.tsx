"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowRight, ShieldCheck, GraduationCap, HardHat } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-40 bg-[var(--color-secondary)] overflow-hidden">
        {/* Subtle background pattern/overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Protegemos lo más <span className="text-[var(--color-primary)]">valioso</span> de tu empresa
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
              Soluciones integrales B2B en Higiene y Seguridad Laboral. Garantizamos el cumplimiento normativo y el bienestar de tus colaboradores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/contacto">
                <Button size="lg" className="w-full sm:w-auto text-lg gap-2">
                  Solicitar Asesoría <ArrowRight size={20} />
                </Button>
              </Link>
              <Link href="#servicios">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg bg-transparent border-gray-500 text-white hover:bg-white/10 hover:text-white">
                  Ver Servicios
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="w-full py-24 bg-[var(--color-background)]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] mb-4">Nuestros Servicios</h2>
            <p className="text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
              Adaptamos nuestros servicios a las necesidades específicas de tu industria, asegurando los más altos estándares de calidad.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card className="h-full border-t-4 border-t-[var(--color-primary)] hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                    <ShieldCheck className="text-[var(--color-primary)]" size={28} />
                  </div>
                  <CardTitle>Evaluación de Riesgos</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)]">
                  Auditorías completas, planes de evacuación y estudios ergonómicos para mitigar accidentes laborales.
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card className="h-full border-t-4 border-t-[var(--color-secondary)] hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                    <GraduationCap className="text-[var(--color-secondary)]" size={28} />
                  </div>
                  <CardTitle>Capacitaciones</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)]">
                  Entrenamiento constante para tu personal en RCP, manejo de extintores y normativas de seguridad.
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card className="h-full border-t-4 border-t-[var(--color-primary)] hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                    <HardHat className="text-[var(--color-primary)]" size={28} />
                  </div>
                  <CardTitle>Venta de Insumos</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)]">
                  Provisión de Elementos de Protección Personal (EPP) de primera calidad y homologados.
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-2 text-white">¿Listo para elevar los estándares de tu empresa?</h2>
            <p className="text-white/90 text-lg">
              Contáctanos hoy mismo y diseñaremos un plan de acción a medida.
            </p>
          </div>
          <Link href="/contacto" className="shrink-0">
            <Button size="lg" className="bg-white text-[var(--color-primary)] hover:bg-gray-100 border-none font-bold shadow-md">
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
