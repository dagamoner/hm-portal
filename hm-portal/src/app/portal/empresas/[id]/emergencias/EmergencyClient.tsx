"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Siren, Users, Calendar, ShieldPlus, Plus, Clock, FileText, CheckCircle } from "lucide-react";

import PlanModal from "./modals/PlanModal";
import DrillModal from "./modals/DrillModal";
import BrigadeModal from "./modals/BrigadeModal";
import EquipmentModal from "./modals/EquipmentModal";

type EmergencyTab = "pge" | "simulacros" | "brigadas" | "equipamiento";

interface EmergencyClientProps {
  companyId: string;
  initialPlans: any[];
  initialDrills: any[];
  initialBrigadistas: any[];
  initialEquipment: any[];
  availableWorkers?: any[];
}

export default function EmergencyClient({
  companyId,
  initialPlans,
  initialDrills,
  initialBrigadistas,
  initialEquipment,
  availableWorkers = []
}: EmergencyClientProps) {
  const [activeTab, setActiveTab] = useState<EmergencyTab>("pge");
  const { isClient } = useAuth();

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isDrillModalOpen, setIsDrillModalOpen] = useState(false);
  const [isBrigadeModalOpen, setIsBrigadeModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);

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
              {!isClient && (
                <button onClick={() => setIsBrigadeModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Asignar Brigadista
                </button>
              )}
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
