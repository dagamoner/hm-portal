"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Siren, Users, Calendar, ShieldPlus, Plus, Clock, FileText, CheckCircle, Download, Phone, MapPin, Building2, Truck } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import PlanModal from "./modals/PlanModal";
import DrillModal from "./modals/DrillModal";
import BrigadeModal from "./modals/BrigadeModal";
import EquipmentModal from "./modals/EquipmentModal";

type EmergencyTab = "pge" | "simulacros" | "brigadas" | "equipamiento" | "contactos";

interface EmergencyClientProps {
  companyId: string;
  initialPlans: any[];
  initialDrills: any[];
  initialBrigadistas: any[];
  initialEquipment: any[];
  availableWorkers?: any[];
  initialContacts?: any[];
  availableProjects?: any[];
  availableEstablishments?: any[];
}

export default function EmergencyClient({
  companyId,
  initialPlans,
  initialDrills,
  initialBrigadistas,
  initialEquipment,
  availableWorkers = [],
  initialContacts = [],
  availableProjects = [],
  availableEstablishments = []
}: EmergencyClientProps) {
  const [activeTab, setActiveTab] = useState<EmergencyTab>("pge");
  const { isClient } = useAuth();

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isDrillModalOpen, setIsDrillModalOpen] = useState(false);
  const [isBrigadeModalOpen, setIsBrigadeModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // New Contact Form
  const [contactForm, setContactForm] = useState({
      name: "",
      phone: "",
      type: "HOSPITAL",
      routeContext: "",
      projectId: "",
      establishmentId: ""
  });

  const generateOrgChartPDF = () => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      doc.setFillColor(30, 41, 59); // Slate-800
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Organigrama de Brigadas", 14, 25);
      
      doc.setTextColor(30, 41, 59);
      
      const roles = ['Jefe de Brigada', 'Líder', 'Jefe Evacuación', 'Primeros Auxilios', 'Extinción', 'Rescatista', 'General'];
      let yPos = 50;

      roles.forEach(role => {
          const membersInRole = initialBrigadistas.filter(m => m.role.toLowerCase() === role.toLowerCase() || (role === 'General' && !roles.slice(0,-1).some(r => r.toLowerCase() === m.role.toLowerCase())));
          
          if (membersInRole.length > 0) {
              doc.setFontSize(14);
              doc.setFont("helvetica", "bold");
              doc.text(role, 14, yPos);
              yPos += 10;
              
              membersInRole.forEach(m => {
                  doc.setFontSize(11);
                  doc.setFont("helvetica", "normal");
                  doc.text(`• ${m.worker?.firstName} ${m.worker?.lastName} (Área: ${m.area || 'General'})`, 20, yPos);
                  yPos += 8;
              });
              
              yPos += 5;
          }
      });
      
      doc.save("Organigrama_Brigadas.pdf");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "pge":
        return (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Planes de Emergencia (PGE)</h3>
                <p className="text-sm text-slate-500">Documentos operativos y escenarios de riesgo</p>
              </div>
              {!isClient && (
                <button onClick={() => setIsPlanModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Nuevo Plan
                </button>
              )}
            </div>
            
            {initialPlans.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-slate-600 font-bold mb-2">No hay planes registrados</h4>
                <p className="text-slate-500 text-sm">Comienza agregando un nuevo plan de emergencia para esta empresa.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {initialPlans.map(plan => (
                  <div key={plan.id} className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-100 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-800">{plan.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">Estado: {plan.status}</p>
                    </div>
                    <button className="text-indigo-600 text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
                      Ver Detalles
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case "simulacros":
        return (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Simulacros Programados</h3>
                <p className="text-sm text-slate-500">Evaluación de desempeño y tiempos de evacuación</p>
              </div>
              {!isClient && (
                <button onClick={() => setIsDrillModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Programar Simulacro
                </button>
              )}
            </div>
            
            {initialDrills.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-slate-600 font-bold mb-2">No hay simulacros</h4>
                <p className="text-slate-500 text-sm">Aún no se han registrado simulacros para esta empresa.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {initialDrills.map(drill => (
                  <div key={drill.id} className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-100 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-800">{drill.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">Tipo: {drill.type} | Estado: {drill.status}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {drill.actualTimeStr && (
                         <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md flex items-center gap-1 font-bold">
                           <Clock className="w-3 h-3" />
                           {drill.actualTimeStr}
                         </div>
                      )}
                      <button className="text-indigo-600 text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
                        Gestionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "brigadas":
        return (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Brigadas de Rescate (ERT)</h3>
                <p className="text-sm text-slate-500">Control de personal entrenado y sus competencias</p>
              </div>
              <div className="flex gap-2">
                <button onClick={generateOrgChartPDF} className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors shadow-sm">
                  <Download className="w-4 h-4" />
                  Descargar Org. PDF
                </button>
                {!isClient && (
                  <button onClick={() => setIsBrigadeModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />
                    Asignar Rol
                  </button>
                )}
              </div>
            </div>
            
            {initialBrigadistas.length === 0 ? (
              <div className="text-center py-20">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-slate-600 font-bold mb-2">Sin Brigadistas</h4>
                <p className="text-slate-500 text-sm">Asigna personal de la empresa como miembros de la brigada.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {initialBrigadistas.map(member => (
                  <div key={member.id} className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-100 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-800">{member.worker?.firstName} {member.worker?.lastName}</h4>
                      <p className="text-xs text-slate-500 mt-1">Rol: {member.role} | Área: {member.area || "General"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {member.medicalAptitudeStatus === "Apto" && (
                         <div className="text-xs text-green-600 flex items-center gap-1 font-bold">
                           <CheckCircle className="w-4 h-4" />
                           Apto Médico
                         </div>
                      )}
                      <button className="text-indigo-600 text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
                        Perfil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "equipamiento":
        return (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Inventario de Emergencias</h3>
                <p className="text-sm text-slate-500">Control de extintores, botiquines y redes de incendio</p>
              </div>
              {!isClient && (
                <button onClick={() => setIsEquipmentModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Agregar Equipo
                </button>
              )}
            </div>
            
            {initialEquipment.length === 0 ? (
              <div className="text-center py-20">
                <ShieldPlus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-slate-600 font-bold mb-2">Inventario Vacío</h4>
                <p className="text-slate-500 text-sm">Registra equipos destinados a contingencias (ej. Extintores).</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {initialEquipment.map(eq => (
                  <div key={eq.id} className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-100 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-800">{eq.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">Tipo: {eq.type} | Ubicación: {eq.location}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-xs px-2 py-1 rounded-md font-bold ${eq.status === 'Operativo' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        {eq.status}
                      </div>
                      <button className="text-indigo-600 text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
                        Ver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "contactos":
        return (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Contactos In Itinere</h3>
                <p className="text-sm text-slate-500">Teléfonos de emergencia por Obra o Establecimiento</p>
              </div>
              {!isClient && (
                <button onClick={() => setIsContactModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
                  <Plus className="w-4 h-4" />
                  Nuevo Contacto
                </button>
              )}
            </div>

            {/* In a real scenario, we'd use a modal to create new contacts calling createEmergencyContact */}
            {isContactModalOpen && (
               <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl mb-6">
                   <p className="text-sm font-bold text-slate-700 mb-2">Formulario de Contacto (Mockup/Demo)</p>
                   <button onClick={() => setIsContactModalOpen(false)} className="px-4 py-2 bg-slate-200 rounded-lg text-sm font-bold">Cerrar</button>
               </div>
            )}
            
            {initialContacts.length === 0 ? (
              <div className="text-center py-20">
                <Phone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-slate-600 font-bold mb-2">Sin Contactos</h4>
                <p className="text-slate-500 text-sm">Registra hospitales, bomberos o grúas por zona.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {initialContacts.map(contact => (
                  <div key={contact.id} className="border border-slate-100 rounded-2xl p-4 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        {contact.type === 'HOSPITAL' && <Plus className="w-12 h-12" />}
                        {contact.type === 'BOMBEROS' && <Siren className="w-12 h-12" />}
                        {contact.type === 'GRUA' && <Truck className="w-12 h-12" />}
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-800 text-lg">{contact.name}</h4>
                            <span className="text-[10px] font-black px-2 py-1 bg-slate-100 rounded-lg text-slate-600 border border-slate-200">{contact.type}</span>
                        </div>
                        <p className="text-2xl font-black text-indigo-600 mb-4">{contact.phone}</p>
                        
                        <div className="text-xs text-slate-500 space-y-1">
                            {contact.project && <p className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Obra: {contact.project.name}</p>}
                            {contact.establishment && <p className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Establ.: {contact.establishment.name}</p>}
                            {contact.routeContext && <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Zona/Ruta: {contact.routeContext}</p>}
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* TABS NAVEGACIÓN */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("pge")}
          className={`px-4 py-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "pge" 
              ? "border-indigo-600 text-indigo-600" 
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <FileText className="w-4 h-4" />
          Plan de Emergencias (PGE)
        </button>
        <button
          onClick={() => setActiveTab("simulacros")}
          className={`px-4 py-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "simulacros" 
              ? "border-indigo-600 text-indigo-600" 
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Simulacros
        </button>
        <button
          onClick={() => setActiveTab("brigadas")}
          className={`px-4 py-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "brigadas" 
              ? "border-indigo-600 text-indigo-600" 
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <Users className="w-4 h-4" />
          Brigadas (ERT)
        </button>
        <button
          onClick={() => setActiveTab("equipamiento")}
          className={`px-4 py-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "equipamiento" 
              ? "border-indigo-600 text-indigo-600" 
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <ShieldPlus className="w-4 h-4" />
          Equipamiento
        </button>
      </div>

      {/* CONTENIDO ACTIVO */}
      {renderContent()}

      {/* MODALES */}
      <PlanModal 
        companyId={companyId} 
        isOpen={isPlanModalOpen} 
        onClose={() => setIsPlanModalOpen(false)} 
      />
      <DrillModal 
        companyId={companyId} 
        isOpen={isDrillModalOpen} 
        onClose={() => setIsDrillModalOpen(false)} 
      />
      <BrigadeModal 
        companyId={companyId} 
        availableWorkers={availableWorkers}
        isOpen={isBrigadeModalOpen} 
        onClose={() => setIsBrigadeModalOpen(false)} 
      />
      <EquipmentModal 
        companyId={companyId} 
        isOpen={isEquipmentModalOpen} 
        onClose={() => setIsEquipmentModalOpen(false)} 
      />
    </div>
  );
}
