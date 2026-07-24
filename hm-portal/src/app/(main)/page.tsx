"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowRight, ShieldCheck, GraduationCap, HardHat, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full py-32 md:py-48 bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero.png" 
            alt="Profesionales de Seguridad Laboral" 
            fill 
            className="object-cover object-center opacity-40 mix-blend-overlay"
            priority
          />
        </div>
        {/* Gradient Overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary)]/90 to-transparent z-0"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-12 items-start md:items-center w-full"
          >
            {/* Left side: Logo & Brand */}
            <div className="flex flex-col items-start shrink-0">
              <div className="flex items-center gap-2">
                <Image 
                  src="/images/logo.png" 
                  alt="MH Logo" 
                  width={150} 
                  height={150} 
                  className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" 
                />
                <span className="text-7xl md:text-8xl font-black text-white tracking-tighter drop-shadow-lg">
                  MH<span className="text-[var(--color-primary)]">.</span>
                </span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-200 mt-4 uppercase tracking-widest drop-shadow-md">
                Higiene y Seguridad Laboral
              </span>
            </div>

            {/* Right side: H1 and P */}
            <div className="flex flex-col items-start space-y-6 md:pl-12 md:border-l-4 border-[var(--color-primary)]">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
                Protegemos lo más <span className="text-[var(--color-primary)]">valioso</span> de tu empresa
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-xl drop-shadow-md">
                Soluciones integrales B2B. Garantizamos el cumplimiento normativo y el bienestar absoluto de tus colaboradores.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                <Link href="/contacto" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-lg gap-2 shadow-xl">
                    Solicitar Asesoría <ArrowRight size={20} />
                  </Button>
                </Link>
                <Link href="#servicios" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg bg-black/30 backdrop-blur-sm border-gray-400 text-white hover:bg-white/10 hover:text-white">
                    Ver Servicios
                  </Button>
                </Link>
              </div>
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
              Adaptamos nuestros servicios a las necesidades específicas de tu industria, asegurando los más altos estándares de calidad y seguridad.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card className="h-full border-t-4 border-t-[var(--color-primary)] hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                    <ShieldCheck className="text-[var(--color-primary)]" size={32} />
                  </div>
                  <CardTitle>Evaluación de Riesgos</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)]">
                  Auditorías completas en planta, elaboración de planes de evacuación y estudios ergonómicos avanzados para mitigar accidentes.
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card className="h-full border-t-4 border-t-[var(--color-secondary)] hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <GraduationCap className="text-[var(--color-secondary)]" size={32} />
                  </div>
                  <CardTitle>Capacitaciones</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)]">
                  Entrenamiento constante y certificado para tu personal en RCP, manejo de extintores, trabajos en altura y normativas.
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card className="h-full border-t-4 border-t-[var(--color-primary)] hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                    <HardHat className="text-[var(--color-primary)]" size={32} />
                  </div>
                  <CardTitle>Venta de Insumos</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)]">
                  Provisión de Elementos de Protección Personal (EPP) de primera calidad, homologados y específicos para tu industria.
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Quality Section (New) */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/images/safety_new.png" 
                alt="Equipamiento de Protección de Alta Calidad" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-[var(--color-secondary)]">
                Equipamiento y Auditoría de <span className="text-[var(--color-primary)]">Primer Nivel</span>
              </h2>
              <p className="text-gray-600 text-lg">
                No dejamos nada al azar. Desde la consultoría inicial hasta la entrega del equipo de protección personal, cada paso de nuestro proceso está diseñado para cumplir con las normativas internacionales y nacionales de seguridad.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-[var(--color-primary)] shrink-0" size={24} />
                  <span className="text-gray-700 font-medium">Equipos 100% Homologados e inspeccionados.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-[var(--color-primary)] shrink-0" size={24} />
                  <span className="text-gray-700 font-medium">Profesionales con más de 10 años de experiencia en campo.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-[var(--color-primary)] shrink-0" size={24} />
                  <span className="text-gray-700 font-medium">Atención inmediata y planes a medida para cada cliente.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-sm">¿Listo para elevar los estándares de tu empresa?</h2>
            <p className="text-white/95 text-lg font-medium">
              Contáctanos hoy mismo y diseñaremos un plan de acción a la medida de tus instalaciones.
            </p>
          </div>
          <Link href="/contacto" className="shrink-0">
            <Button size="lg" className="bg-white text-[var(--color-secondary)] hover:bg-gray-100 border-none font-bold shadow-xl px-8 h-14 text-lg">
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
