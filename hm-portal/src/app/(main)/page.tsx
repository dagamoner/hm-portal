"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowRight, ShieldCheck, GraduationCap, HardHat, CheckCircle2, ClipboardCheck, FileText, Flame, X, Activity, Briefcase, Users, AlertTriangle, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [isHigieneModalOpen, setIsHigieneModalOpen] = useState(false)
  const [isLegajoModalOpen, setIsLegajoModalOpen] = useState(false)
  const [isIncendiosModalOpen, setIsIncendiosModalOpen] = useState(false)
  const [isMatrizModalOpen, setIsMatrizModalOpen] = useState(false)
  const [isCapacitacionModalOpen, setIsCapacitacionModalOpen] = useState(false)
  const [isEstudiosModalOpen, setIsEstudiosModalOpen] = useState(false)
  const [isArtModalOpen, setIsArtModalOpen] = useState(false)
  const [isInspeccionesModalOpen, setIsInspeccionesModalOpen] = useState(false)
  const [isContratistasModalOpen, setIsContratistasModalOpen] = useState(false)
  const [isAccidentesModalOpen, setIsAccidentesModalOpen] = useState(false)
  const [isEppModalOpen, setIsEppModalOpen] = useState(false)
  const [isMejorasModalOpen, setIsMejorasModalOpen] = useState(false)
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
                Soluciones integrales en Higiene y Seguridad Laboral. Garantizamos el cumplimiento normativo y el bienestar absoluto de tus colaboradores.
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
              Adaptamos nuestros servicios a las necesidades específicas de tu industria, asegurando los más altos estándares de calidad y seguridad. Estos son algunos de los servicios que ofrecemos:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-[var(--color-primary)] hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setIsMatrizModalOpen(true)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                    <ShieldCheck className="text-amber-500" size={32} />
                  </div>
                  <CardTitle>Matriz y mapa de riesgos</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)] text-sm">
                  <p className="mb-4 text-sm">
                    Identificación de peligros, evaluación por puesto, mapas de riesgos y plan de acciones preventivas.
                  </p>
                  <span className="text-amber-500 font-bold text-xs uppercase tracking-wider group-hover:underline">
                    Ver todos los detalles &rarr;
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-indigo-500 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setIsCapacitacionModalOpen(true)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                    <GraduationCap className="text-indigo-500" size={32} />
                  </div>
                  <CardTitle>Capacitación mensual</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)] text-sm">
                  <p className="mb-4 text-sm">
                    Entrenamiento constante, registro de temas y evaluación de comprensión para el personal.
                  </p>
                  <span className="text-indigo-500 font-bold text-xs uppercase tracking-wider group-hover:underline">
                    Ver todos los detalles &rarr;
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-[var(--color-primary)] hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setIsHigieneModalOpen(true)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                    <ClipboardCheck className="text-[var(--color-primary)]" size={32} />
                  </div>
                  <CardTitle>Higiene y Seguridad Mensual</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)] text-sm">
                  <p className="mb-4 text-sm">
                    Servicio integral y continuo de prevención, mejora continua y cumplimiento normativo ante la ART.
                  </p>
                  <span className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider group-hover:underline">
                    Ver todos los servicios &rarr;
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-[var(--color-secondary)] hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setIsLegajoModalOpen(true)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <FileText className="text-[var(--color-secondary)]" size={32} />
                  </div>
                  <CardTitle>Legajo Técnico</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)] text-sm">
                  <p className="mb-4 text-sm">
                    Gestión completa de la documentación de obra, estadísticas, permisos y matrices de riesgo.
                  </p>
                  <span className="text-[var(--color-secondary)] font-bold text-xs uppercase tracking-wider group-hover:underline">
                    Ver todos los servicios &rarr;
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-red-500 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setIsIncendiosModalOpen(true)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                    <Flame className="text-red-500" size={32} />
                  </div>
                  <CardTitle>Prevención y protección contra incendios</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)] text-sm">
                  <p className="mb-4 text-sm">
                    Auditoría de sistemas de emergencia, extintores, señalización y planes de evacuación.
                  </p>
                  <span className="text-red-500 font-bold text-xs uppercase tracking-wider group-hover:underline">
                    Ver todos los servicios &rarr;
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            {/* Estudios y Mediciones */}
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-teal-500 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setIsEstudiosModalOpen(true)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                    <Activity className="text-teal-500" size={32} />
                  </div>
                  <CardTitle>Estudios y mediciones</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)] text-sm">
                  <p className="mb-4 text-sm">
                    Verificación mensual de estado y vigencia de estudios ambientales, iluminación, ruido y más.
                  </p>
                  <span className="text-teal-500 font-bold text-xs uppercase tracking-wider group-hover:underline">
                    Ver todos los detalles &rarr;
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            {/* Documentación ART */}
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-orange-500 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setIsArtModalOpen(true)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                    <Briefcase className="text-orange-500" size={32} />
                  </div>
                  <CardTitle>Documentación ART</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)] text-sm">
                  <p className="mb-4 text-sm">
                    Gestión integral de requisitos, nóminas, exámenes médicos y relación directa con la ART.
                  </p>
                  <span className="text-orange-500 font-bold text-xs uppercase tracking-wider group-hover:underline">
                    Ver todos los detalles &rarr;
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            {/* Inspecciones de Obra */}
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-cyan-500 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setIsInspeccionesModalOpen(true)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-cyan-50 flex items-center justify-center mb-4">
                    <HardHat className="text-cyan-500" size={32} />
                  </div>
                  <CardTitle>Inspecciones de obra</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)] text-sm">
                  <p className="mb-4 text-sm">
                    Control exhaustivo en terreno de protecciones, andamios, instalaciones eléctricas y equipos.
                  </p>
                  <span className="text-cyan-500 font-bold text-xs uppercase tracking-wider group-hover:underline">
                    Ver todos los detalles &rarr;
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contratistas y terceros */}
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-blue-600 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setIsContratistasModalOpen(true)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                    <Users className="text-blue-600" size={32} />
                  </div>
                  <CardTitle>Contratistas y terceros</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)] text-sm">
                  <p className="mb-4 text-sm">
                    Gestión documental, coberturas, capacitaciones y procedimientos de personal externo.
                  </p>
                  <span className="text-blue-600 font-bold text-xs uppercase tracking-wider group-hover:underline">
                    Ver todos los detalles &rarr;
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            {/* Accidentes, incidentes y enf... */}
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-rose-600 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setIsAccidentesModalOpen(true)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-rose-100 flex items-center justify-center mb-4">
                    <AlertTriangle className="text-rose-600" size={32} />
                  </div>
                  <CardTitle>Accidentes e incidentes</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)] text-sm">
                  <p className="mb-4 text-sm">
                    Investigación de siniestros, métodos de árbol de causas, medidas preventivas y seguimiento.
                  </p>
                  <span className="text-rose-600 font-bold text-xs uppercase tracking-wider group-hover:underline">
                    Ver todos los detalles &rarr;
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            {/* Elementos de protección personal */}
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-green-600 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setIsEppModalOpen(true)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                    <Shield className="text-green-600" size={32} />
                  </div>
                  <CardTitle>Elementos de protección</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)] text-sm">
                  <p className="mb-4 text-sm">
                    Relevamiento, registros de entrega, capacitaciones de uso y reposición de EPP.
                  </p>
                  <span className="text-green-600 font-bold text-xs uppercase tracking-wider group-hover:underline">
                    Ver todos los detalles &rarr;
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            {/* Seguimiento del plan de mejoras */}
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-violet-600 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setIsMejorasModalOpen(true)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
                    <TrendingUp className="text-violet-600" size={32} />
                  </div>
                  <CardTitle>Seguimiento de mejoras</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--color-muted-foreground)] text-sm">
                  <p className="mb-4 text-sm">
                    Monitoreo de acciones preventivas, estados de avance, riesgos asociados y cierres.
                  </p>
                  <span className="text-violet-600 font-bold text-xs uppercase tracking-wider group-hover:underline">
                    Ver todos los detalles &rarr;
                  </span>
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
                alt="Auditoría y Seguridad" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-[var(--color-secondary)]">
                Gestión y Auditoría de <span className="text-[var(--color-primary)]">Primer Nivel</span>
              </h2>
              <p className="text-gray-600 text-lg">
                No dejamos nada al azar. Desde la consultoría inicial hasta la confección de tu legajo técnico, cada paso de nuestro proceso está diseñado para garantizar el cumplimiento absoluto de las normativas de seguridad laboral.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-[var(--color-primary)] shrink-0" size={24} />
                  <span className="text-gray-700 font-medium">Gestión integral de riesgos y cumplimiento normativo ante la ART.</span>
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

      {/* Modals */}
      <AnimatePresence>
        {isCapacitacionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsCapacitacionModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <GraduationCap className="text-indigo-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Capacitación mensual</h3>
                    <p className="text-sm text-gray-500">Listado completo de servicios incluidos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCapacitacionModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                
                <h4 className="font-bold text-[var(--color-secondary)] mb-3">Debe ejecutarse el tema previsto en el Plan Anual de Capacitación, por ejemplo:</h4>
                <ul className="space-y-3 list-none mb-8">
                  {[
                    "Riesgos específicos del puesto.",
                    "Uso y conservación de EPP.",
                    "Riesgo eléctrico.",
                    "Prevención de incendios.",
                    "Uso de extintores.",
                    "Evacuación.",
                    "Manipulación manual de cargas.",
                    "Ergonomía.",
                    "Máquinas y herramientas.",
                    "Sustancias químicas y hojas de seguridad.",
                    "Orden y limpieza.",
                    "Riesgo vial.",
                    "Primeros auxilios.",
                    "Procedimientos de emergencia."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="font-bold text-[var(--color-secondary)] mb-3">Cada capacitación debe registrar:</h4>
                <ul className="space-y-3 list-none mb-6">
                  {[
                    "Tema y contenidos.",
                    "Fecha.",
                    "Duración.",
                    "Instructor.",
                    "Personas asistentes.",
                    "DNI o legajo.",
                    "Puesto.",
                    "Firma.",
                    "Material entregado.",
                    "Evaluación de comprensión.",
                    "Evidencia fotográfica, cuando corresponda."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-100 text-indigo-900 text-sm md:text-base font-medium">
                  Además, debe brindarse inducción a toda persona que ingrese por primera vez o cambie de puesto.
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {isMatrizModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsMatrizModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <ShieldCheck className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Matriz y mapa de riesgos</h3>
                    <p className="text-sm text-gray-500">Listado completo de servicios incluidos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMatrizModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                
                <h4 className="font-bold text-[var(--color-secondary)] mb-3">Debe revisarse o actualizarse cuando existan cambios en:</h4>
                <ul className="space-y-3 list-none mb-8">
                  {[
                    "Procesos.",
                    "Puestos.",
                    "Tareas.",
                    "Maquinarias.",
                    "Sustancias.",
                    "Instalaciones.",
                    "Cantidad de personal.",
                    "Turnos.",
                    "Contratistas.",
                    "Accidentes o incidentes.",
                    "Resultados de mediciones."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="font-bold text-[var(--color-secondary)] mb-3">El servicio debe mantener:</h4>
                <ul className="space-y-3 list-none">
                  {[
                    "Identificación de peligros.",
                    "Evaluación por puesto y tarea.",
                    "Riesgo inherente.",
                    "Controles existentes.",
                    "Riesgo residual.",
                    "Medidas adicionales.",
                    "Mapa de riesgos.",
                    "Relevamiento General de Riesgos Laborales.",
                    "Nómina de Personal Expuesto.",
                    "Plan de acciones preventivas."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
        {isHigieneModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsHigieneModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <ClipboardCheck className="text-[var(--color-primary)]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Higiene y Seguridad Mensual</h3>
                    <p className="text-sm text-gray-500">Listado completo de servicios incluidos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsHigieneModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <ul className="space-y-3 list-none">
                  {[
                    "Mejora contínua",
                    "Plan anual de capacitaciones",
                    "Mediciones varias según Protocolos (Iluminación, Ruido, Ergonomía, etc.)",
                    "Documentación y relación con la ART, cumplimiento con los requisitos propuestos",
                    "Inspección general de las condiciones de trabajo",
                    "Identificación y organización del servicio",
                    "Revisión de máquinas, equipos y herramientas",
                    "Control de instalaciones eléctricas",
                    "Prevención y protección contra incendios",
                    "Matriz y mapa de riesgos",
                    "Seguimiento del plan de mejoras",
                    "Capacitación mensual",
                    "Elementos de protección personal",
                    "Sustancias químicas",
                    "Estudios y mediciones",
                    "Accidentes, incidentes y enfermedades profesionales",
                    "Contratistas y terceros",
                    "Coordinación de contratistas",
                    "Aviso de obra y Programa de Seguridad",
                    "Legajo Técnico de obra",
                    "Inspecciones específicas de obra"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}

        {isLegajoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsLegajoModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <FileText className="text-[var(--color-secondary)]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Legajo Técnico</h3>
                    <p className="text-sm text-gray-500">Listado completo de servicios incluidos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsLegajoModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <ul className="space-y-3 list-none">
                  {[
                    "Programa de Seguridad de Obra",
                    "Aviso de Inicio de Obra",
                    "Cronograma y Plan Anual de Capacitaciones",
                    "Check List decreto 911",
                    "Relevamiento de Agentes de Riesgos",
                    "Relevamiento General de Riesgos Laborales",
                    "Charlas de 5 minutos",
                    "Estadísticas Mensuales de Siniestralidad de la Obra",
                    "Check List de herramientas manuales",
                    "Check List de Simulacros",
                    "Check List de tableros Eléctricos",
                    "Check List de Botiquines de primeros auxilios",
                    "Informes Semanales y Mensuales de HySL",
                    "Mediciones de Puesta A Tierra",
                    "Mediciones de Ruido",
                    "Medición Protocolo de Ergonomía",
                    "Planillas de Mantenimiento de Máquinas y Herramientas",
                    "Planillas de Mantenimiento de Prolongaciones",
                    "Notas Varias",
                    "Pliego de Obra",
                    "Entrega de EPP",
                    "Constancia de Entrega de Credenciales de ART",
                    "Visitas de ART",
                    "Planillas y Verificación de Orden y Limpieza",
                    "Procedimientos Seguros de Trabajo",
                    "Registro de Accidentes e Incidentes",
                    "Investigaciones de Accidentes",
                    "Relevamiento de Extintores de Incendios",
                    "Relevamiento de Escaleras y Andamios",
                    "Relevamiento de herramientas Eléctricas",
                    "Rol de Llamadas de Emergencias en obra e In Itinere",
                    "Plan de Emergencias",
                    "Coordinación Divisional de Emergencias",
                    "Políticas de HySL en la Empresa y en Obra",
                    "Políticas de prevención de alcohol y drogas en la Empresa",
                    "Matriz de riesgos",
                    "Programa de Control de Riesgos, evaluación de riesgos",
                    "Coordinación ante emergencias",
                    "Registros de Permisos de trabajo",
                    "Visación del Libro de higiene y Seguridad en el Trabajo."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-[var(--color-secondary)] shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}

        {isIncendiosModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsIncendiosModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <Flame className="text-red-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Prevención contra incendios</h3>
                    <p className="text-sm text-gray-500">Listado completo de servicios incluidos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsIncendiosModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <ul className="space-y-3 list-none">
                  {[
                    "Ubicación y accesibilidad de extintores.",
                    "Señalización.",
                    "Precintos y seguros.",
                    "Manómetros.",
                    "Tarjetas de mantenimiento.",
                    "Vencimientos de recarga.",
                    "Estado de gabinetes e hidrantes.",
                    "Sistemas de detección y alarma.",
                    "Iluminación de emergencia.",
                    "Salidas y puertas de emergencia.",
                    "Carga de fuego y materiales combustibles.",
                    "Almacenamiento de inflamables.",
                    "Fuentes de ignición.",
                    "Prohibición y control de fumar.",
                    "Planos de evacuación.",
                    "Roles de emergencia.",
                    "Punto de reunión.",
                    "Registro de simulacros.",
                    "Coordinación con servicios externos."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Estudios */}
        {isEstudiosModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsEstudiosModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                    <Activity className="text-teal-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Estudios y mediciones</h3>
                    <p className="text-sm text-gray-500">Listado completo de servicios incluidos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEstudiosModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="p-4 mb-6 bg-teal-50/50 rounded-lg border border-teal-100 text-teal-900 text-sm md:text-base font-medium">
                  No todas las mediciones se realizan mensualmente, pero todos los meses debería verificarse su estado y vigencia:
                </div>
                <ul className="space-y-3 list-none">
                  {[
                    "Iluminación.",
                    "Ruido.",
                    "Puesta a tierra y continuidad de masas.",
                    "Contaminantes químicos.",
                    "Carga térmica.",
                    "Ventilación.",
                    "Vibraciones.",
                    "Ergonomía.",
                    "Radiaciones.",
                    "Calidad del agua.",
                    "Carga de fuego.",
                    "Estudios específicos de la actividad."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-teal-500 shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal ART */}
        {isArtModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsArtModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Briefcase className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Documentación y relación con la ART</h3>
                    <p className="text-sm text-gray-500">Listado completo de servicios incluidos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsArtModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <ul className="space-y-3 list-none">
                  {[
                    "Contrato con ART.",
                    "Establecimientos declarados.",
                    "Nómina de trabajadores.",
                    "RGRL.",
                    "Nómina de Personal Expuesto.",
                    "Exámenes periódicos relacionados con agentes.",
                    "Visitas y recomendaciones de la ART.",
                    "Intimaciones.",
                    "Planes de regularización.",
                    "Denuncias de accidentes.",
                    "Investigaciones solicitadas.",
                    "Constancias de capacitación.",
                    "Registros de EPP.",
                    "Protocolos de medición.",
                    "Certificados y habilitaciones.",
                    "Vencimientos documentales."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Inspecciones */}
        {isInspeccionesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsInspeccionesModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                    <HardHat className="text-cyan-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Inspecciones específicas de obra</h3>
                    <p className="text-sm text-gray-500">Listado completo de servicios incluidos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsInspeccionesModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <ul className="space-y-3 list-none">
                  {[
                    "Protecciones de bordes y vacíos.",
                    "Barandas, rodapiés y redes.",
                    "Andamios.",
                    "Escaleras.",
                    "Plataformas de trabajo.",
                    "Líneas de vida y puntos de anclaje.",
                    "Excavaciones y entibaciones.",
                    "Demoliciones.",
                    "Apuntalamientos.",
                    "Riesgo de derrumbe.",
                    "Instalaciones eléctricas provisorias.",
                    "Tableros de obra.",
                    "Puestas a tierra y disyuntores.",
                    "Equipos de izaje.",
                    "Grúas, hidrogrúas y montacargas.",
                    "Eslingas, cadenas y accesorios.",
                    "Máquinas y herramientas.",
                    "Acopios.",
                    "Circulaciones.",
                    "Trabajos en caliente.",
                    "Espacios confinados.",
                    "Orden y limpieza.",
                    "Extintores.",
                    "Baños, vestuarios y comedor.",
                    "Agua potable.",
                    "Señalización y cerramiento.",
                    "Condiciones climáticas.",
                    "Protección de terceros y vía pública."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Contratistas */}
        {isContratistasModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsContratistasModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Contratistas y terceros</h3>
                    <p className="text-sm text-gray-500">Listado completo de servicios incluidos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsContratistasModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <ul className="space-y-3 list-none">
                  {[
                    "Nómina de contratistas.",
                    "ART y cobertura vigente.",
                    "Cláusula de no repetición, cuando corresponda.",
                    "Personal declarado.",
                    "Aptitud y autorizaciones laborales.",
                    "Capacitaciones.",
                    "EPP.",
                    "Procedimientos de trabajo.",
                    "Matrices de riesgos.",
                    "ATS.",
                    "Permisos de trabajo.",
                    "Equipos y herramientas.",
                    "Seguros y habilitaciones.",
                    "Responsable de Higiene y Seguridad.",
                    "Coordinación de tareas simultáneas.",
                    "Cumplimiento de normas internas."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Accidentes */}
        {isAccidentesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsAccidentesModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                    <AlertTriangle className="text-rose-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Accidentes, incidentes y enfermedades profesionales</h3>
                    <p className="text-sm text-gray-500">Listado completo de servicios incluidos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAccidentesModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <ul className="space-y-3 list-none">
                  {[
                    "Accidentes con y sin baja.",
                    "Incidentes y cuasi accidentes.",
                    "Primeros auxilios.",
                    "Daños materiales.",
                    "Accidentes de contratistas.",
                    "Enfermedades profesionales denunciadas.",
                    "Recomendaciones de la ART.",
                    "Días perdidos.",
                    "Reincidencias.",
                    "Investigación.",
                    "Determinación de causas inmediatas y básicas.",
                    "Árbol de Causas u otro método similar.",
                    "Identificación de fallas de control.",
                    "Medidas correctivas y preventivas.",
                    "Responsable y plazo.",
                    "Comunicación al empleador.",
                    "Seguimiento hasta el cierre."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-rose-600 shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal EPP */}
        {isEppModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsEppModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Shield className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Elementos de protección personal</h3>
                    <p className="text-sm text-gray-500">Listado completo de servicios incluidos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEppModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <ul className="space-y-3 list-none">
                  {[
                    "EPP requerido por puesto y tarea.",
                    "Certificación correspondiente.",
                    "Registro de entrega.",
                    "Estado de conservación.",
                    "Fecha de vencimiento.",
                    "Reposición.",
                    "Uso efectivo.",
                    "Limpieza y almacenamiento.",
                    "Compatibilidad entre distintos EPP.",
                    "Capacitación del usuario.",
                    "Protección respiratoria y selección de filtros.",
                    "Equipos anticaídas.",
                    "Protección auditiva.",
                    "Protección ocular y facial.",
                    "Calzado, guantes, ropa y casco."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-green-600 shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Seguimiento */}
        {isMejorasModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsMejorasModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                    <TrendingUp className="text-violet-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Seguimiento del plan de mejoras</h3>
                    <p className="text-sm text-gray-500">Listado completo de servicios incluidos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMejorasModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <ul className="space-y-3 list-none">
                  {[
                    "Incumplimientos pendientes.",
                    "Riesgo asociado.",
                    "Medida recomendada.",
                    "Medida provisoria.",
                    "Responsable de ejecución.",
                    "Fecha comprometida.",
                    "Estado de avance.",
                    "Acciones vencidas.",
                    "Evidencia presentada.",
                    "Verificación de eficacia.",
                    "Reevaluación del riesgo.",
                    "Cierre de la acción."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-violet-600 shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
