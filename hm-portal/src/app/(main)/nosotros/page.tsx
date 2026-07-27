"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { CheckCircle2, X, Award, Briefcase, GraduationCap, Building2, Flame, MapPin, ShieldCheck, Users, Target } from "lucide-react"
import Image from "next/image"

export default function NosotrosPage() {
  const [isDanteModalOpen, setIsDanteModalOpen] = useState(false)
  const [isFernandoModalOpen, setIsFernandoModalOpen] = useState(false)

  const danteExp = [
    "Dirección y gestión de áreas de Recursos Humanos e Higiene y Seguridad.",
    "Servicios externos de prevención de riesgos laborales.",
    "Supervisión de seguridad en obras industriales y de infraestructura.",
    "Elaboración de Programas de Seguridad.",
    "Evaluación de riesgos y peligros.",
    "Investigación de accidentes.",
    "Gestión de contratistas.",
    "Mediciones de puestos de trabajo.",
    "Sistemas de gestión integrados.",
    "Protección contra incendios y planes de emergencia.",
    "Capacitación y manejo defensivo.",
    "Seguridad vial, movilidad y transporte."
  ]

  const fernandoExp = [
    "Gestión integral de riesgos.",
    "Prevención y respuesta ante emergencias.",
    "Evaluación de proyectos de protección contra incendios.",
    "Diseño de planes de emergencia y evacuación.",
    "Inspecciones de seguridad en obras.",
    "Investigación de accidentes laborales.",
    "Mediciones de ruido, iluminación y puesta a tierra.",
    "Gestión de EPP y ropa de trabajo.",
    "Cumplimiento de la Resolución SRT 905/2015.",
    "Trámites y coordinación con ART.",
    "Capacitación presencial y virtual.",
    "Coordinación de servicios de emergencias médicas."
  ]

  const distintivos = [
    { title: "Formación técnica multidisciplinaria", desc: "Integramos conocimientos de Higiene y Seguridad, protección contra incendios, medioambiente, seguridad vial, gestión de riesgos, recursos humanos, tecnología y protección civil." },
    { title: "Experiencia de campo", desc: "Nuestra actividad no se limita a la elaboración documental. Realizamos inspecciones, relevamientos, mediciones, capacitaciones, supervisión de obras, investigación de accidentes y seguimiento de planes de mejora." },
    { title: "Conocimiento normativo", desc: "Trabajamos conforme a la legislación argentina vigente, normativa de la Superintendencia de Riesgos del Trabajo, reglamentaciones específicas por actividad y normas técnicas aplicables." },
    { title: "Soluciones adaptadas", desc: "Cada empresa posee riesgos y necesidades diferentes. Por eso, nuestros programas, informes, matrices y planes de acción se elaboran considerando las características reales de cada establecimiento y puesto de trabajo." },
    { title: "Innovación y tecnología", desc: "Aplicamos herramientas digitales para mejorar el registro, seguimiento y análisis de la información preventiva, facilitando la gestión documental y la toma de decisiones." }
  ]

  const sectores = [
    "Construcción y obra pública.",
    "Industria y mantenimiento electromecánico.",
    "Petróleo, gas y combustibles.",
    "Gastronomía y servicios.",
    "Comercios y establecimientos privados.",
    "Administración pública.",
    "Seguridad privada.",
    "Eventos de gran concurrencia.",
    "Gestión municipal de riesgos.",
    "Protección civil y emergencias.",
    "Movilidad y seguridad vial.",
    "Sistemas de protección contra incendios."
  ]

  const compromiso = [
    "Proteger la vida y la salud de los trabajadores.",
    "Prevenir accidentes y enfermedades profesionales.",
    "Detectar condiciones inseguras antes de que generen daños.",
    "Mejorar los procesos de trabajo.",
    "Reducir pérdidas y costos asociados a la siniestralidad.",
    "Fortalecer la cultura preventiva.",
    "Brindar respaldo técnico y documental a la organización."
  ]

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="w-full bg-[var(--color-secondary)] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20 z-0"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-[100px] opacity-20"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Profesionales comprometidos <br/> con la <span className="text-[var(--color-primary)]">prevención</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Somos MH Higiene y Seguridad, un equipo profesional radicado en Mendoza, especializado en prevención de riesgos laborales, gestión de emergencias, protección contra incendios, seguridad vial y cumplimiento normativo.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-[var(--color-secondary)]">Experiencia, compromiso y prevención</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Nuestra actividad se encuentra liderada por los licenciados Dante Gabriel Moner y Fernando Gabriel Moner, profesionales matriculados con experiencia en empresas privadas, organismos públicos, industrias, obras de construcción, establecimientos comerciales, servicios, eventos y proyectos de infraestructura.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Trabajamos con un enfoque técnico y preventivo, orientado a identificar peligros, evaluar riesgos y desarrollar soluciones aplicables a cada organización. Nuestro objetivo es proteger la salud y la integridad de las personas, reducir accidentes, acompañar el cumplimiento legal y mejorar continuamente las condiciones de trabajo.
            </p>
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center text-[var(--color-secondary)] mb-12">Nuestro Equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Dante Card */}
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-[var(--color-primary)] hover:shadow-xl transition-all cursor-pointer bg-white"
                onClick={() => setIsDanteModalOpen(true)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-28 h-28 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative">
                    <Image src="/images/dante.png" alt="Dante Gabriel Moner" fill className="object-cover" />
                  </div>
                  <CardTitle className="text-2xl text-[var(--color-secondary)]">Dante Gabriel Moner</CardTitle>
                  <p className="text-sm font-medium text-[var(--color-primary)] uppercase tracking-wider">Lic. en Higiene y Seguridad en el Trabajo</p>
                </CardHeader>
                <CardContent className="text-slate-600 text-center">
                  <p className="mb-6 line-clamp-3">
                    Magíster en Tráfico, Movilidad y Seguridad Vial. Especialista en ISO 14001, sistemas integrados y programas de seguridad industrial.
                  </p>
                  <span className="text-[var(--color-primary)] font-bold text-sm uppercase tracking-wider group-hover:underline flex items-center justify-center gap-2">
                    Ver perfil completo <ArrowRightIcon />
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            {/* Fernando Card */}
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                className="h-full border-t-4 border-t-blue-600 hover:shadow-xl transition-all cursor-pointer bg-white"
                onClick={() => setIsFernandoModalOpen(true)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-28 h-28 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative">
                    <Image src="/images/fernando.png" alt="Fernando Gabriel Moner" fill className="object-cover" />
                  </div>
                  <CardTitle className="text-2xl text-[var(--color-secondary)]">Fernando Gabriel Moner</CardTitle>
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Lic. en Higiene y Seguridad en el Trabajo</p>
                </CardHeader>
                <CardContent className="text-slate-600 text-center">
                  <p className="mb-6 line-clamp-3">
                    Jefe del Dpto. de Gestión de Riesgos de la Municipalidad de Mendoza. Especialista en emergencias, incendios e ISO 14001.
                  </p>
                  <span className="text-blue-600 font-bold text-sm uppercase tracking-wider group-hover:underline flex items-center justify-center gap-2">
                    Ver perfil completo <ArrowRightIcon />
                  </span>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Experience & Distinctions Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Experiencia */}
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                  <Building2 className="text-[var(--color-primary)]" size={28} />
                </div>
                <h2 className="text-3xl font-bold text-[var(--color-secondary)] mb-4">Nuestra experiencia profesional</h2>
                <p className="text-slate-600 mb-6">
                  Nuestra trayectoria abarca distintos sectores y actividades, lo que nos permite adaptar cada servicio a la realidad operativa de la empresa:
                </p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sectores.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0"></div>
                    <span className="text-slate-700 text-sm">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Distintivos */}
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <Award className="text-blue-600" size={28} />
                </div>
                <h2 className="text-3xl font-bold text-[var(--color-secondary)] mb-4">Qué nos distingue</h2>
              </div>
              <div className="space-y-6">
                {distintivos.map((d, i) => (
                  <div key={i} className="bg-slate-50 p-5 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                      <CheckCircle2 className="text-blue-500" size={18} /> {d.title}
                    </h3>
                    <p className="text-slate-600 text-sm">{d.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Compromise & Indicators */}
      <section className="py-20 bg-[var(--color-secondary)] text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Nuestro compromiso</h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                Creemos que la Higiene y Seguridad no debe limitarse al cumplimiento formal de una obligación. Debe convertirse en una herramienta de gestión que permita:
              </p>
              <ul className="space-y-4 pt-4">
                {compromiso.map((c, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ShieldCheck className="text-[var(--color-primary)] shrink-0" size={24} />
                    <span className="text-slate-200">{c}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-6 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                <p className="text-xl font-medium text-white italic">
                  "Trabajamos para transformar la prevención en una práctica concreta, medible y sostenida en el tiempo."
                </p>
              </div>
            </div>

            {/* Indicadores / Summary Box */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl text-slate-800">
              <h3 className="text-2xl font-bold text-[var(--color-secondary)] mb-8 text-center border-b pb-4">
                Indicadores destacados
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <GraduationCap className="text-blue-600" size={24} />
                  </div>
                  <span className="font-medium text-sm">Profesionales matriculados.</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Briefcase className="text-[var(--color-primary)]" size={24} />
                  </div>
                  <span className="font-medium text-sm">Experiencia pública y privada.</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <MapPin className="text-rose-600" size={24} />
                  </div>
                  <span className="font-medium text-sm">Cobertura en Mendoza.</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Building2 className="text-teal-600" size={24} />
                  </div>
                  <span className="font-medium text-sm">Servicios para empresas y obras.</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Flame className="text-orange-600" size={24} />
                  </div>
                  <span className="font-medium text-sm">Especialización en incendios y emergencias.</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-green-600" size={24} />
                  </div>
                  <span className="font-medium text-sm">Gestión basada en normativa vigente.</span>
                </div>
              </div>

              <div className="mt-12 text-center bg-slate-50 p-6 rounded-xl border border-slate-100">
                <Target className="mx-auto mb-3 text-[var(--color-primary)]" size={32} />
                <h4 className="text-lg font-bold text-[var(--color-secondary)]">Convertimos los riesgos en acciones concretas de prevención.</h4>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        
        {/* Dante Modal */}
        {isDanteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsDanteModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm relative">
                    <Image src="/images/dante.png" alt="Dante Gabriel Moner" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Dante Gabriel Moner</h3>
                    <p className="text-sm font-medium text-[var(--color-primary)]">Lic. en Higiene y Seguridad en el Trabajo</p>
                  </div>
                </div>
                <button onClick={() => setIsDanteModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6 text-slate-700">
                <p>
                  Magíster en Tráfico, Movilidad y Seguridad Vial y Licenciado en Higiene y Seguridad en el Trabajo, egresado de la Universidad Tecnológica Nacional. También es Técnico Universitario en Seguridad e Higiene Laboral, Técnico Químico en Industrias y especialista en implementación de la Norma ISO 14001.
                </p>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 flex items-start gap-3 text-orange-800">
                  <Award className="shrink-0 mt-0.5" size={20} />
                  <p className="text-sm font-medium">Cuenta con matrícula profesional del COPIG Mendoza y registro provincial como profesional de Higiene y Seguridad.</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-lg mb-3 text-[var(--color-secondary)]">Su experiencia comprende:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {danteExp.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0"></div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 text-sm leading-relaxed">
                  Ha participado en proyectos vinculados con YPF, Siemens, Petrobras, aprovechamientos hidroeléctricos, estaciones transformadoras, plantas industriales, obras de construcción y la Fiesta Nacional de la Vendimia, incluyendo tareas de montaje, desmontaje, evaluación de riesgos escénicos, evacuación y supervisión operativa.
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Fernando Modal */}
        {isFernandoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsFernandoModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm relative">
                    <Image src="/images/fernando.png" alt="Fernando Gabriel Moner" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)]">Fernando Gabriel Moner</h3>
                    <p className="text-sm font-medium text-blue-600">Lic. en Higiene y Seguridad en el Trabajo</p>
                  </div>
                </div>
                <button onClick={() => setIsFernandoModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6 text-slate-700">
                <p>
                  Licenciado en Seguridad e Higiene en el Trabajo, egresado de la Universidad Tecnológica Nacional, y Técnico Universitario en Seguridad e Higiene en el Trabajo por la Universidad Nacional de Cuyo. Posee además especialización en implementación de la Norma ISO 14001 y formación técnica ambiental.
                </p>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3 text-blue-800">
                  <Award className="shrink-0 mt-0.5" size={20} />
                  <p className="text-sm font-medium">Cuenta con matrícula profesional del COPIG Mendoza y registro provincial correspondiente.</p>
                </div>
                
                <p className="text-sm">
                  Se desempeña como <strong>Jefe del Departamento de Gestión de Riesgos y Protección Civil de la Municipalidad de la Ciudad de Mendoza</strong>, desarrollando funciones relacionadas con:
                </p>

                <div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {fernandoExp.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 text-sm leading-relaxed">
                  Como asesor externo desarrolla servicios para empresas constructoras, industrias, estaciones de combustible y GNC, empresas de seguridad privada, establecimientos de servicios y proyectos de obra pública. También cuenta con formación específica en NFPA 25, sistemas fijos de agua, hidrantes, cálculos de extintores, control de humos, ergonomía, riesgo eléctrico, sustancias químicas, protección civil, comando de incidentes, primeros auxilios y RCP con DEA.
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  )
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  )
}
