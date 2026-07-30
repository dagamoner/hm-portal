"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Cpu, Download, Save, CheckCircle, Activity, FileText } from 'lucide-react';
import { startOrUpdateInvestigation } from '@/app/actions/investigations';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import IshikawaWizard from './IshikawaWizard';
import ArbolCausasWizard from './ArbolCausasWizard';
import RcaWizard from './RcaWizard';
import ScatWizard from './ScatWizard';
import TripodWizard from './TripodWizard';
import HeinrichWizard from './HeinrichWizard';
import AmfeWizard from './AmfeWizard';
import EstadisticoWizard from './EstadisticoWizard';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const METHODOLOGIES = [
    { id: 'ishikawa', name: 'Diagrama de Ishikawa', disabled: false },
    { id: 'arbol', name: 'Árbol de Causas', disabled: false },
    { id: '5porques', name: '5 Porqués', disabled: false },
    { id: 'rca', name: 'RCA (Root Cause Analysis)', disabled: false },
    { id: 'scat', name: 'Técnica SCAT (DuPont)', disabled: false },
    { id: 'tripod', name: 'Tripod Beta', disabled: false },
    { id: 'heinrich', name: 'Método de Heinrich', disabled: false },
    { id: 'amfe', name: 'AMFE (FMEA)', disabled: false },
    { id: 'estadistico', name: 'Análisis Estadístico e Histórico', disabled: false },
];

export default function InvestigationClient({
    investigations,
    incidents,
    companyId,
    company
}: {
    investigations: any[],
    incidents: any[],
    companyId: string,
    company?: any
}) {
    const router = useRouter();
    const { isClient } = useAuth();
    const searchParams = useSearchParams();
    
    // Tabs superior
    const [activeTab, setActiveTab] = useState<'nueva' | 'historial'>('nueva');

    // Selección de incidente
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
    
    // Metodología
    const [selectedMethod, setSelectedMethod] = useState('ishikawa');

    // Form fields (para 5 porqués y plan de acción heredado)
    const [cause, setCause] = useState('');
    const [actionPlan, setActionPlan] = useState('');
    const [analysisData, setAnalysisData] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);

    // Initial load from URL param if exists
    useEffect(() => {
        const incidentIdFromUrl = searchParams.get('incidentId');
        if (incidentIdFromUrl) {
            setSelectedIncidentId(incidentIdFromUrl);
        }
    }, [searchParams]);

    // Load active investigation details when incident changes
    useEffect(() => {
        if (selectedIncidentId) {
            const existingInv = investigations.find(i => i.incidentId === selectedIncidentId);
            if (existingInv) {
                setCause(existingInv.cause || '');
                setActionPlan(existingInv.actionPlan || '');
                setAnalysisData(existingInv.analysisData || {});
                if (existingInv.methodology) setSelectedMethod(existingInv.methodology);
            } else {
                setCause('');
                setActionPlan('');
                setAnalysisData({});
                setSelectedMethod('ishikawa'); // Default for new
            }
        }
    }, [selectedIncidentId, investigations]);

    const filteredIncidents = useMemo(() => {
        return incidents.filter((inc) => {
            if (isClient) {
                const hasInvestigation = investigations.some(i => i.incidentId === inc.id);
                if (!hasInvestigation) return false;
            }

            const searchLower = searchTerm.toLowerCase();
            return (
                inc.title.toLowerCase().includes(searchLower) ||
                inc.location.toLowerCase().includes(searchLower) ||
                inc.id.toLowerCase().includes(searchLower)
            );
        });
    }, [incidents, searchTerm, isClient, investigations]);

    const activeIncident = incidents.find(i => i.id === selectedIncidentId);
    const activeInvestigation = investigations.find(i => i.incidentId === selectedIncidentId);
    const isCompleted = activeInvestigation?.status === 'Completada';
    const isReadOnly = isCompleted || isClient;

    // Para 5 Porqués (Legacy handler)
    const handleSaveLegacy = async (complete: boolean = false) => {
        if (!selectedIncidentId) return;
        setIsSaving(true);
        try {
            await startOrUpdateInvestigation(companyId, selectedIncidentId, {
                cause,
                actionPlan,
                methodology: selectedMethod,
                status: complete ? 'Completada' : 'En Progreso'
            });
            alert(complete ? 'Investigación completada y documento legal generado' : 'Avances guardados correctamente');
            router.refresh();
        } catch (error) {
            alert('Error al guardar la investigación');
        } finally {
            setIsSaving(false);
        }
    };

    // Para Ishikawa y otras complejas
    const handleSaveAdvanced = async (data: any, complete: boolean = false) => {
        if (!selectedIncidentId) return;
        setIsSaving(true);
        try {
            await startOrUpdateInvestigation(companyId, selectedIncidentId, {
                cause: data.cause || "",
                actionPlan: data.actionPlan || "",
                methodology: data.methodology || selectedMethod,
                analysisData: data,
                status: complete ? 'Completada' : 'En Progreso'
            });
            
            // Update local state to reflect changes without full reload delay
            setCause(data.cause || "");
            setActionPlan(data.actionPlan || "");
            setAnalysisData(data);
            
            alert(complete ? 'Investigación completada y documento legal generado' : 'Avances guardados correctamente');
            router.refresh();
        } catch (error) {
            alert('Error al guardar la investigación');
        } finally {
            setIsSaving(false);
        }
    };

    const getSeverityColor = (level: string) => {
        switch (level) {
            case 'LOW': return 'text-blue-500 font-bold';
            case 'MEDIUM': return 'text-indigo-500 font-bold';
            case 'HIGH': return 'text-orange-500 font-bold';
            case 'CRITICAL': return 'text-red-500 font-black';
            default: return 'text-slate-500';
        }
    };

    const getSeverityText = (level: string) => {
        switch (level) {
            case 'LOW': return 'BAJO';
            case 'MEDIUM': return 'MEDIO';
            case 'HIGH': return 'ALTO';
            case 'CRITICAL': return 'CRÍTICO';
            default: return level;
        }
    };

    const handleExportPDF = () => {
        if (!activeIncident) {
            alert('Seleccione un incidente para exportar');
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        
        // Colores y estilos
        const primaryColor = [107, 33, 168]; // Purple-800
        const secondaryColor = [71, 85, 105]; // Slate-600
        
        // Logo / Cabecera
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        doc.setFontSize(22);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORME DE INVESTIGACIÓN', pageWidth / 2, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.text(company?.name?.toUpperCase() || 'EMPRESA NO DEFINIDA', pageWidth / 2, 28, { align: 'center' });
        doc.setFontSize(10);
        doc.text('Sistema de Gestión SST', pageWidth / 2, 34, { align: 'center' });

        // Datos del Incidente
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42); // Slate-900
        doc.text('DATOS DEL INCIDENTE', 14, 55);
        
        autoTable(doc, {
            startY: 60,
            theme: 'grid',
            headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold' },
            bodyStyles: { textColor: [15, 23, 42] },
            body: [
                ['ID', `INC-${activeIncident.id.substring(0, 8).toUpperCase()}`],
                ['Título', activeIncident.title],
                ['Fecha', new Date(activeIncident.date).toLocaleDateString()],
                ['Ubicación', activeIncident.location],
                ['Severidad', getSeverityText(activeIncident.severity)],
                ['Descripción', activeIncident.description]
            ],
            columnStyles: {
                0: { cellWidth: 40, fontStyle: 'bold' }
            }
        });

        const methodologyName = METHODOLOGIES.find(m => m.id === selectedMethod)?.name || 'Desconocida';
        let currentY = (doc as any).lastAutoTable.finalY + 15;

        doc.setFontSize(14);
        doc.text(`ANÁLISIS DE CAUSAS: ${methodologyName.toUpperCase()}`, 14, currentY);
        currentY += 10;

        if (selectedMethod === 'ishikawa' && analysisData) {
            autoTable(doc, {
                startY: currentY,
                theme: 'grid',
                headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105] },
                body: [
                    [{ content: '1. Efecto / Problema', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [analysisData.efecto || 'No especificado'],
                    [{ content: '2. 6M (Causas)', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Mano de Obra:\n${analysisData.manoDeObra || 'N/A'}`],
                    [`Maquinaria:\n${analysisData.maquinaria || 'N/A'}`],
                    [`Métodos:\n${analysisData.metodos || 'N/A'}`],
                    [`Materiales:\n${analysisData.materiales || 'N/A'}`],
                    [`Medio Ambiente:\n${analysisData.medioAmbiente || 'N/A'}`],
                    [`Medición:\n${analysisData.medicion || 'N/A'}`],
                    [{ content: '3. 5 Porqués (Causa Raíz)', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [analysisData.cincoPorques || 'No especificado'],
                    [{ content: '4. Plan de Acción (CAPA)', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [analysisData.planAccion || 'No especificado']
                ]
            });
        } else if (selectedMethod === 'arbol' && analysisData) {
            autoTable(doc, {
                startY: currentY,
                theme: 'grid',
                headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105] },
                body: [
                    [{ content: '1. Hecho Final / Lesión', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [analysisData.hechoFinal || 'No especificado'],
                    [{ content: '2. Causas Inmediatas', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Condiciones Inseguras:\n${analysisData.condicionesInseguras || 'N/A'}`],
                    [`Actos Inseguros:\n${analysisData.actosInseguros || 'N/A'}`],
                    [{ content: '3. Causas Básicas o Subyacentes', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Factores Personales:\n${analysisData.factoresPersonales || 'N/A'}`],
                    [`Factores del Trabajo:\n${analysisData.factoresTrabajo || 'N/A'}`],
                    [{ content: '4. Causa Raíz Principal', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [analysisData.causaRaiz || 'No especificado'],
                    [{ content: '5. Plan de Acción (CAPA)', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Inmediatas:\n${analysisData.medidasInmediatas || 'N/A'}`],
                    [`Largo Plazo:\n${analysisData.medidasLargoPlazo || 'N/A'}`]
                ]
            });
        } else if (selectedMethod === 'rca' && analysisData) {
            autoTable(doc, {
                startY: currentY,
                theme: 'grid',
                headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105] },
                body: [
                    [{ content: '1. Hecho Inicial', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [analysisData.hechoInicial || 'No especificado'],
                    [{ content: '2. 5 Porqués (Iteración)', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`1º Por qué:\n${analysisData.porque1 || 'N/A'}`],
                    [`2º Por qué:\n${analysisData.porque2 || 'N/A'}`],
                    [`3º Por qué:\n${analysisData.porque3 || 'N/A'}`],
                    [`4º Por qué:\n${analysisData.porque4 || 'N/A'}`],
                    [`5º Por qué:\n${analysisData.porque5 || 'N/A'}`],
                    [{ content: '3. Categorización Causal', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Inmediatas:\n${analysisData.causasInmediatas || 'N/A'}`],
                    [`Subyacentes:\n${analysisData.causasSubyacentes || 'N/A'}`],
                    [`Raíz:\n${analysisData.causasRaiz || 'N/A'}`],
                    [{ content: '4. Plan de Acción (CAPA)', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Inmediatas:\n${analysisData.accionesInmediatas || 'N/A'}`],
                    [`Preventivas:\n${analysisData.accionesPreventivas || 'N/A'}`]
                ]
            });
        } else if (selectedMethod === 'scat' && analysisData) {
            autoTable(doc, {
                startY: currentY,
                theme: 'grid',
                headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105] },
                body: [
                    [{ content: '1. Pérdida y Contacto', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Pérdida (Loss):\n${analysisData.perdida || 'N/A'}`],
                    [`Incidente / Evento:\n${analysisData.contacto || 'N/A'}`],
                    [{ content: '2. Causas Inmediatas', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Actos Subestándar:\n${analysisData.actosSubestandar || 'N/A'}`],
                    [`Condiciones Subestándar:\n${analysisData.condicionesSubestandar || 'N/A'}`],
                    [{ content: '3. Causas Básicas / Raíz', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Factores Personales:\n${analysisData.factoresPersonales || 'N/A'}`],
                    [`Factores del Trabajo:\n${analysisData.factoresTrabajo || 'N/A'}`],
                    [{ content: '4. Falta de Control del Sistema', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [analysisData.faltaControl || 'No especificado'],
                    [{ content: '5. Plan de Medidas Correctivas Directas', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [analysisData.medidasCorrectivas || 'No especificado']
                ]
            });
        } else if (selectedMethod === 'tripod' && analysisData) {
            const bodyData: any[] = [
                [{ content: '1. El Trío del Evento', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                [`Peligro (Hazard):\n${analysisData.peligro || 'N/A'}`],
                [`Objeto (Target):\n${analysisData.objeto || 'N/A'}`],
                [`Evento (Event):\n${analysisData.evento || 'N/A'}`],
                [{ content: '2. Análisis de Barreras y Ruta Causal', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }]
            ];

            if (analysisData.barreras && analysisData.barreras.length > 0) {
                analysisData.barreras.forEach((b: any, index: number) => {
                    bodyData.push([`Barrera #${index + 1}: ${b.nombre || 'Sin nombre'} (${b.estado || 'Sin estado'})`]);
                    if (b.estado === 'Falló' || b.estado === 'Ausente' || b.estado === 'Inadecuada') {
                        bodyData.push([`  - Causa Inmediata: ${b.causaInmediata || 'N/A'}`]);
                        bodyData.push([`  - Precondición: ${b.precondicion || 'N/A'}`]);
                        bodyData.push([`  - Causa Latente: ${b.causaLatente || 'N/A'}`]);
                        bodyData.push([`  - GFT: ${b.gft || 'N/A'}`]);
                    }
                });
            } else {
                bodyData.push(['No se registraron barreras.']);
            }

            bodyData.push([{ content: '3. Medidas Correctivas', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }]);
            bodyData.push([analysisData.medidasCorrectivas || 'No especificado']);

            autoTable(doc, {
                startY: currentY,
                theme: 'grid',
                headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105] },
                body: bodyData
            });
        } else if (selectedMethod === 'heinrich' && analysisData) {
            autoTable(doc, {
                startY: currentY,
                theme: 'grid',
                headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105] },
                body: [
                    [{ content: '1. La Cadena Causal de 5 Fichas de Dominó', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Ficha 1 - Ancestros y Entorno Social:\n${analysisData.ficha1Entorno || 'N/A'}`],
                    [`Ficha 2 - Falta Personal / Defecto de la Persona:\n${analysisData.ficha2Defecto || 'N/A'}`],
                    [`Ficha 3 - Acto Inseguro o Condición Insegura:\n${analysisData.ficha3ActoCondicion || 'N/A'}`],
                    [`Ficha 4 - Accidente:\n${analysisData.ficha4Accidente || 'N/A'}`],
                    [`Ficha 5 - Lesión:\n${analysisData.ficha5Lesion || 'N/A'}`],
                    [{ content: '2. Análisis de Interrupción y Pirámide', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Punto de Interrupción Sugerido:\n${analysisData.puntoInterrupcion || 'N/A'}`],
                    [`Análisis Estadístico bajo Pirámide (1:29:300):\n${analysisData.analisisPiramide || 'N/A'}`],
                    [{ content: '3. Planes de Acción (CAPA)', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [analysisData.medidasCorrectivas || 'No especificado']
                ]
            });
        } else if (selectedMethod === 'amfe' && analysisData) {
            const bodyData: any[] = [
                [{ content: '1. Modos de Falla, Efectos y NPR', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }]
            ];

            if (analysisData.modosFalla && analysisData.modosFalla.length > 0) {
                analysisData.modosFalla.forEach((f: any, index: number) => {
                    bodyData.push([`Falla #${index + 1}: ${f.componente || 'Sin componente'} - ${f.modoFalla || 'Sin falla'}`]);
                    bodyData.push([`  - Efecto: ${f.efecto || 'N/A'}`]);
                    bodyData.push([`  - Causa Raíz: ${f.causaRaiz || 'N/A'}`]);
                    bodyData.push([`  - S: ${f.severidad} | O: ${f.ocurrencia} | D: ${f.deteccion} | NPR: ${f.npr}`]);
                    bodyData.push([`  - Acciones: ${f.medidasCorrectivas || 'N/A'}`]);
                });
            } else {
                bodyData.push(['No se registraron modos de falla.']);
            }

            autoTable(doc, {
                startY: currentY,
                theme: 'grid',
                headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105] },
                body: bodyData
            });
        } else if (selectedMethod === 'estadistico' && analysisData) {
            autoTable(doc, {
                startY: currentY,
                theme: 'grid',
                headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105] },
                body: [
                    [{ content: '1. Recopilación e Ingesta de Datos', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Ubicación / Sector: ${analysisData.ubicacionSector || 'N/A'}`],
                    [`Hora / Turno: ${analysisData.horaTurno || 'N/A'}`],
                    [`Agente Material: ${analysisData.agenteMaterial || 'N/A'}`],
                    [`Parte del Cuerpo Afectada: ${analysisData.parteCuerpo || 'N/A'}`],
                    [`Perfil del Trabajador: ${analysisData.perfilTrabajador || 'N/A'}`],
                    [{ content: '2. Procesamiento: Patrones y Correlación', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Análisis de Pareto: ${analysisData.analisisPareto || 'N/A'}`],
                    [`Correlación Temporal: ${analysisData.correlacionTemporal || 'N/A'}`],
                    [`Desviación de Tendencia: ${analysisData.desviacionTendencia || 'N/A'}`],
                    [{ content: '3. Diagnóstico: Modelos Predictivos', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Factores Críticos: ${analysisData.factoresCriticos || 'N/A'}`],
                    [`Proyección de Riesgo: ${analysisData.proyeccionRiesgo || 'N/A'}`],
                    [{ content: '4. Plan de Acción: Medidas Cuantitativas', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [`Intervención Focalizada: ${analysisData.intervencionFocalizada || 'N/A'}`],
                    [`Modificación de Indicadores: ${analysisData.modificacionIndicadores || 'N/A'}`],
                    [`Seguimiento KPI: ${analysisData.seguimientoKPI || 'N/A'}`]
                ]
            });
        } else if (selectedMethod === '5porques') {
            autoTable(doc, {
                startY: currentY,
                theme: 'grid',
                headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105] },
                body: [
                    [{ content: 'Causa Raíz (5 Porqués)', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [cause || 'No especificado'],
                    [{ content: 'Plan de Acción', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }],
                    [actionPlan || 'No especificado']
                ]
            });
        } else {
            doc.setFontSize(10);
            doc.text('No hay datos de análisis disponibles.', 14, currentY);
        }

        currentY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 15 : currentY + 10;
        
        doc.setFontSize(10);
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.text(`Estado del Análisis: ${isCompleted ? 'COMPLETADO' : 'EN PROGRESO'}`, 14, currentY);
        
        // Footer (Page numbers)
        const pageCount = doc.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        }

        doc.save(`Investigacion_${activeIncident.id.substring(0, 8)}.pdf`);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12 max-w-[1600px] mx-auto">
            {/* Top Tabs */}
            <div className="flex items-center gap-2 mb-6">
                {!isClient && (
                    <button 
                        onClick={() => setActiveTab('nueva')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'nueva' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                    >
                        <span className="text-lg leading-none">+</span> Nueva Investigación
                    </button>
                )}
                <button 
                    onClick={() => setActiveTab('historial')}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'historial' || isClient ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                >
                    <Activity className="w-4 h-4" /> Historial de Análisis
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[800px]">
                {/* Columna Izquierda: Seleccionar Caso */}
                <div className="w-full lg:w-[350px] bg-white border border-slate-200 rounded-3xl p-5 flex flex-col shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-800">
                        <Filter className="w-5 h-5 text-blue-500" />
                        <h3 className="font-bold text-lg tracking-tight">Seleccionar Caso</h3>
                    </div>
                    <p className="text-slate-500 text-xs font-medium mb-4">Busque el incidente que desea investigar.</p>
                    
                    <div className="relative mb-6">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar incidente..."
                            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                        {filteredIncidents.length === 0 ? (
                            <div className="text-center py-10 opacity-50">
                                <p className="text-sm font-bold text-slate-500">No hay incidentes</p>
                            </div>
                        ) : (
                            filteredIncidents.map((inc) => {
                                const isSelected = selectedIncidentId === inc.id;
                                return (
                                    <div 
                                        key={inc.id}
                                        onClick={() => setSelectedIncidentId(inc.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-3 ${isSelected ? 'bg-blue-50/50 border-blue-400 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight">{inc.title}</h4>
                                            <span className="text-[10px] font-bold text-slate-400">INC-{inc.id.substring(0, 3).toUpperCase()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">{new Date(inc.date).toISOString().split('T')[0]}</span>
                                            <span className={getSeverityColor(inc.severity)}>{getSeverityText(inc.severity)}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Columna Derecha: Metodología y Formulario */}
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    
                    {/* Panel Superior: Metodología */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-lg tracking-tight text-slate-800 flex items-center gap-2">
                                    <Cpu className="w-5 h-5 text-purple-500" />
                                    Metodología de Análisis
                                </h3>
                                <p className="text-slate-500 text-xs font-medium mt-1">Elija el paradigma técnico de investigación.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                            {METHODOLOGIES.map(method => (
                                <button
                                    key={method.id}
                                    disabled={method.disabled}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                                        selectedMethod === method.id
                                            ? 'bg-purple-50 border-purple-400 text-purple-700 shadow-sm'
                                            : method.disabled
                                                ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {method.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Panel Inferior: Formulario / Resultados */}
                    <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                            <h3 className="font-black text-slate-400 text-sm tracking-widest uppercase flex items-center gap-2">
                                <Cpu className="w-4 h-4" />
                                {activeIncident ? `INVESTIGACIÓN: ${METHODOLOGIES.find(m => m.id === selectedMethod)?.name}` : 'RESULTADOS DEL ANÁLISIS TÉCNICO'}
                            </h3>
                            <button 
                                onClick={handleExportPDF}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors"
                            >
                                <Download className="w-4 h-4" /> Exportar
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {!activeIncident ? (
                                <div className="h-full flex items-center justify-start text-slate-600 font-medium p-4">
                                    Error de conexión. (Seleccione un incidente para comenzar)
                                </div>
                            ) : selectedMethod === 'ishikawa' ? (
                                <IshikawaWizard
                                  incident={activeIncident}
                                  initialData={analysisData}
                                  isCompleted={isReadOnly}
                                  isSaving={isSaving}
                                  onSave={handleSaveAdvanced}
                                />
                            ) : selectedMethod === 'arbol' ? (
                                <ArbolCausasWizard
                                  incident={activeIncident}
                                  initialData={analysisData}
                                  isCompleted={isReadOnly}
                                  isSaving={isSaving}
                                  onSave={handleSaveAdvanced}
                                />
                            ) : selectedMethod === 'rca' ? (
                                <RcaWizard
                                  incident={activeIncident}
                                  initialData={analysisData}
                                  isCompleted={isReadOnly}
                                  isSaving={isSaving}
                                  onSave={handleSaveAdvanced}
                                />
                            ) : selectedMethod === 'scat' ? (
                                <ScatWizard
                                  incident={activeIncident}
                                  initialData={analysisData}
                                  isCompleted={isReadOnly}
                                  isSaving={isSaving}
                                  onSave={handleSaveAdvanced}
                                />
                            ) : selectedMethod === 'tripod' ? (
                                <TripodWizard
                                  incident={activeIncident}
                                  initialData={analysisData}
                                  isCompleted={isReadOnly}
                                  isSaving={isSaving}
                                  onSave={handleSaveAdvanced}
                                />
                            ) : selectedMethod === 'heinrich' ? (
                                <HeinrichWizard
                                  incident={activeIncident}
                                  initialData={analysisData}
                                  isCompleted={isReadOnly}
                                  isSaving={isSaving}
                                  onSave={handleSaveAdvanced}
                                />
                            ) : selectedMethod === 'amfe' ? (
                                <AmfeWizard
                                  incident={activeIncident}
                                  initialData={analysisData}
                                  isCompleted={isReadOnly}
                                  isSaving={isSaving}
                                  onSave={handleSaveAdvanced}
                                />
                            ) : selectedMethod === 'estadistico' ? (
                                <EstadisticoWizard
                                  incident={activeIncident}
                                  initialData={analysisData}
                                  isCompleted={isReadOnly}
                                  isSaving={isSaving}
                                  onSave={handleSaveAdvanced}
                                />
                            ) : selectedMethod === '5porques' ? (
                                <div className="space-y-6 pb-6">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">{activeIncident.title}</h4>
                                        <p className="text-sm text-slate-500">{activeIncident.description}</p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Desarrollo de los 5 Porqués (Causa Raíz)</label>
                                            <textarea 
                                                rows={5}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500/50 font-medium resize-none custom-scrollbar"
                                                placeholder="1. ¿Por qué ocurrió el incidente? ...\n2. ¿Por qué? ...\n3. ¿Por qué? ...\n4. ¿Por qué? ...\n5. ¿Por qué? ..."
                                                value={cause}
                                                onChange={e => setCause(e.target.value)}
                                                disabled={isCompleted}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Plan de Acción / Medidas Preventivas</label>
                                            <textarea 
                                                rows={5}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500/50 font-medium resize-none custom-scrollbar"
                                                placeholder="¿Qué acciones se tomarán para atacar la causa raíz identificada?"
                                                value={actionPlan}
                                                onChange={e => setActionPlan(e.target.value)}
                                                disabled={isCompleted}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 mt-6 flex justify-end gap-4 border-t border-slate-100">
                                        {isCompleted ? (
                                            <div className="bg-green-50 text-green-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 w-full justify-center">
                                                <CheckCircle className="w-5 h-5" /> Investigación Completada
                                            </div>
                                        ) : !isClient ? (
                                            <>
                                                <button 
                                                    onClick={() => handleSaveLegacy(false)}
                                                    disabled={isSaving}
                                                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-bold tracking-widest uppercase text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" /> Guardar Avances
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if(confirm('Al completar la investigación, se generará un documento legal y no podrá ser editada. ¿Desea continuar?')) {
                                                            handleSaveLegacy(true);
                                                        }
                                                    }}
                                                    disabled={isSaving || !cause || !actionPlan}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold tracking-widest uppercase text-xs flex items-center gap-2 shadow-xl shadow-purple-600/20 transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> Completar Investigación
                                                </button>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                                    <FileText className="w-12 h-12 text-slate-300 mb-4" />
                                    <h4 className="text-lg font-bold text-slate-500">Metodología no disponible</h4>
                                    <p className="text-sm text-slate-400">Esta metodología se habilitará en próximas versiones.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
