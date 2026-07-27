import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MeasurementRecord } from '@/app/portal/empresas/[id]/mediciones/MeasurementsClient';

export function generateMeasurementReportPDF(mea: MeasurementRecord, companyName: string) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text('PROTOCOLO OFICIAL SRT', 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(`Empresa: ${companyName}`, 14, 30);
    doc.text(`Establecimiento / Área: ${mea.area}`, 14, 37);
    doc.text(`Fecha de Medición: ${new Date(mea.date).toLocaleDateString()}`, 14, 44);
    doc.text(`Instrumento Utilizado: ${mea.instrument}`, 14, 51);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.line(14, 55, 196, 55);

    if (mea.type === 'Ruido' && mea.details.noisePoints) {
        doc.setFontSize(16);
        doc.setTextColor(225, 29, 72); // Rose 600
        doc.text('Relevamiento de Sonometría (Res 85/12)', 14, 65);
        
        const body = mea.details.noisePoints.map((p: any) => [
            p.sector,
            p.lAeq.toString(),
            p.noiseDose.toString(),
            p.type,
            p.lAeq > 85 ? 'EXCEDIDO' : 'NORMAL'
        ]);

        autoTable(doc, {
            startY: 70,
            head: [['Puesto / Tarea', 'LAeq (dBA)', 'Dosis %', 'Tipo', 'Estado']],
            body: body,
            headStyles: { fillColor: [225, 29, 72] },
            alternateRowStyles: { fillColor: [255, 241, 242] }
        });
    } 
    else if (mea.type === 'Iluminación' && mea.details.lightingPoints) {
        doc.setFontSize(16);
        doc.setTextColor(217, 119, 6); // Amber 600
        doc.text('Metodología Cuadrícula (Res 84/12)', 14, 65);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Largo: ${mea.details.roomLength}m | Ancho: ${mea.details.roomWidth}m | Alt. Montaje: ${mea.details.mountingHeight}m`, 14, 72);
        doc.text(`Constante del Local (K): ${mea.details.calculatedK?.toFixed(2) || 0}`, 14, 78);
        doc.text(`Puntos Mínimos (N): ${mea.details.calculatedN || 0}`, 14, 84);

        const body = mea.details.lightingPoints.map((p: any, i: number) => [
            `Pto ${i + 1}`,
            p.measuredValue.toString(),
            p.requiredValue.toString(),
            p.measuredValue >= p.requiredValue ? 'CUMPLE' : 'NO CUMPLE'
        ]);

        autoTable(doc, {
            startY: 90,
            head: [['Punto de Medición', 'Lux Medido', 'Requerido (Lux)', 'Estado']],
            body: body,
            headStyles: { fillColor: [217, 119, 6] },
            alternateRowStyles: { fillColor: [254, 243, 199] }
        });
    }
    else if (mea.type === 'Puesta a Tierra' && mea.details.earthingPoints) {
        doc.setFontSize(16);
        doc.setTextColor(37, 99, 235); // Blue 600
        doc.text('Verificación Protocolo Res 900/15', 14, 65);
        
        const body = mea.details.earthingPoints.map((p: any) => {
            const isOk = p.resistanceValue <= 40 && p.hasContinuity && p.tripTime <= 300;
            return [
                p.position,
                `${p.condition || 'Seco'} / ${p.scheme || 'TT'} / ${p.protection || 'DD'}`,
                p.resistanceValue.toString(),
                p.tripTime.toString(),
                p.hasContinuity ? 'SI' : 'NO',
                isOk ? 'CUMPLE' : 'NO CUMPLE'
            ];
        });

        autoTable(doc, {
            startY: 70,
            head: [['Ubicación Jabalina', 'Cond. / Esq. / Prot.', 'R (Ohms)', 'T. Disparo (ms)', 'Cont. Masas', 'Estado']],
            body: body,
            headStyles: { fillColor: [37, 99, 235] },
            alternateRowStyles: { fillColor: [239, 246, 255] }
        });
    }

    // Diagnóstico y Plan de Acción
    if (mea.details.diagnostico || mea.details.planAccion) {
        const finalY = (doc as any).lastAutoTable.finalY || 120;
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59); // Slate 800
        doc.text('Conclusiones y Plan de Acción', 14, finalY + 15);
        
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105); // Slate 600
        
        let currentY = finalY + 25;
        if (mea.details.diagnostico) {
            doc.setFont("helvetica", 'bold');
            doc.text('Diagnóstico General:', 14, currentY);
            doc.setFont("helvetica", 'normal');
            const lines = doc.splitTextToSize(mea.details.diagnostico, 180);
            doc.text(lines, 14, currentY + 6);
            currentY += 6 + (lines.length * 5);
        }

        if (mea.details.planAccion) {
            currentY += 5;
            doc.setFont("helvetica", 'bold');
            doc.text('Plan de Acción:', 14, currentY);
            doc.setFont("helvetica", 'normal');
            const lines = doc.splitTextToSize(mea.details.planAccion, 180);
            doc.text(lines, 14, currentY + 6);
        }
    }

    doc.save(`Protocolo_SRT_${mea.type}_${companyName}.pdf`);
}

export function generateErgonomicsReportPDF(ev: any, companyName: string) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // Emerald 500
    doc.text('PROTOCOLO DE ERGONOMÍA (SRT 886/15)', 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(`Empresa: ${companyName}`, 14, 30);
    doc.text(`Puesto de Trabajo: ${ev.jobPosition}`, 14, 37);
    doc.text(`Sector: ${ev.sector}`, 14, 44);
    doc.text(`Trabajador Evaluado: ${ev.workerName || 'N/A'}`, 14, 51);
    doc.text(`Fecha de Evaluación: ${new Date(ev.date).toLocaleDateString()}`, 14, 58);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.line(14, 62, 196, 62);

    doc.setFontSize(16);
    doc.setTextColor(15, 118, 110); // Teal 700
    doc.text('Identificación de Riesgos y Nivel (Planillas 1 y 2)', 14, 72);

    const levels = ev.planilla1?.riskLevels || {};
    const riskBody = Object.keys(levels).map(factorId => [
        `Factor ${factorId}`,
        levels[factorId] === 3 ? 'NO TOLERABLE (3)' : 'TOLERABLE (1)'
    ]);

    if (riskBody.length > 0) {
        autoTable(doc, {
            startY: 77,
            head: [['Factor de Riesgo Identificado', 'Nivel de Riesgo']],
            body: riskBody,
            headStyles: { fillColor: [16, 185, 129] },
            alternateRowStyles: { fillColor: [236, 253, 245] }
        });
    } else {
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('No se identificaron factores de riesgo en la tarea.', 14, 82);
    }

    let finalY = (doc as any).lastAutoTable?.finalY || 82;

    if (ev.globalStatus === 'No Tolerable' && ev.planilla3 && ev.planilla3.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(15, 118, 110);
        doc.text('Medidas Preventivas/Correctivas (Planilla 3)', 14, finalY + 15);

        const medidasBody = ev.planilla3.map((m: any) => [
            m.type,
            m.description
        ]);

        autoTable(doc, {
            startY: finalY + 20,
            head: [['Tipo de Medida', 'Descripción']],
            body: medidasBody,
            headStyles: { fillColor: [5, 150, 105] },
            alternateRowStyles: { fillColor: [209, 250, 229] }
        });
        
        finalY = (doc as any).lastAutoTable.finalY;
    }

    // Diagnóstico y Plan de Acción (Planilla 4)
    const p4 = ev.planilla4 || {};
    if (p4.diagnostico || p4.planAccion) {
        doc.setFontSize(16);
        doc.setTextColor(30, 41, 59); // Slate 800
        doc.text('Seguimiento y Diagnóstico (Planilla 4)', 14, finalY + 15);
        
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105); // Slate 600
        
        let currentY = finalY + 25;
        if (p4.diagnostico) {
            doc.setFont("helvetica", 'bold');
            doc.text('Diagnóstico General:', 14, currentY);
            doc.setFont("helvetica", 'normal');
            const lines = doc.splitTextToSize(p4.diagnostico, 180);
            doc.text(lines, 14, currentY + 6);
            currentY += 6 + (lines.length * 5);
        }

        if (p4.planAccion) {
            currentY += 5;
            doc.setFont("helvetica", 'bold');
            doc.text('Plan de Acción:', 14, currentY);
            doc.setFont("helvetica", 'normal');
            const lines = doc.splitTextToSize(p4.planAccion, 180);
            doc.text(lines, 14, currentY + 6);
        }
    }

    doc.save(`Ergonomia_SRT886_${ev.jobPosition}_${companyName}.pdf`);
}

export function generateCancerigenosReportPDF(ev: any, companyName: string) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(225, 29, 72); // Rose 600
    doc.text('REGISTRO DE SUSTANCIAS CANCERÍGENAS (SRT 81/19)', 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Empresa: ${companyName}`, 14, 30);
    doc.text(`Año Declarado: ${ev.year}`, 14, 37);
    doc.text(`Fecha de Presentación: ${new Date(ev.createdAt).toLocaleDateString()}`, 14, 44);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 48, 196, 48);

    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('Responsables de Registro', 14, 58);
    
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    const resp = ev.responsables || { datos: {}, hys: {}, medicina: {} };
    doc.text(`Legal/Empresa - CUIL: ${resp.datos?.cuil || '-'} | Cargo: ${resp.datos?.cargo || '-'}`, 14, 65);
    doc.text(`Servicio de Higiene - CUIL: ${resp.hys?.cuil || '-'} | Matrícula: ${resp.hys?.matricula || '-'} | Horas: ${resp.hys?.horas || '-'}`, 14, 71);
    doc.text(`Servicio de Medicina - CUIL: ${resp.medicina?.cuil || '-'} | Matrícula: ${resp.medicina?.matricula || '-'} | Horas: ${resp.medicina?.horas || '-'}`, 14, 77);

    let finalY = 87;

    // Puestos Afectados
    if (ev.puestos && ev.puestos.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(225, 29, 72);
        doc.text('Nómina de Puestos Afectados', 14, finalY);
        
        const puestosBody = ev.puestos.map((p: any) => [
            p.nombre,
            p.sector,
            p.ciiu || '-',
            p.expuestos?.toString() || '0'
        ]);

        autoTable(doc, {
            startY: finalY + 5,
            head: [['Puesto de Trabajo', 'Sector', 'Código CIIU', 'Cant. Expuestos']],
            body: puestosBody,
            headStyles: { fillColor: [225, 29, 72] },
            alternateRowStyles: { fillColor: [255, 241, 242] }
        });
        
        finalY = (doc as any).lastAutoTable.finalY + 15;
    }

    // Sustancias Declaradas
    if (ev.sustancias && ev.sustancias.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(225, 29, 72);
        doc.text('Agentes / Sustancias Declaradas', 14, finalY);
        
        const sustBody = ev.sustancias.map((s: any) => {
            const puestoNombre = ev.puestos?.find((p: any) => p.id === s.puestoId)?.nombre || 'Desconocido';
            return [
                s.esop,
                s.nombreEsop || s.nombreComercial,
                puestoNombre,
                `${s.cantidad} ${s.unidad}`
            ];
        });

        autoTable(doc, {
            startY: finalY + 5,
            head: [['Cod. ESOP', 'Agente', 'Puesto Afectado', 'Cant. Anual']],
            body: sustBody,
            headStyles: { fillColor: [190, 18, 60] },
            alternateRowStyles: { fillColor: [255, 228, 230] }
        });
        
        finalY = (doc as any).lastAutoTable.finalY + 15;
    }

    // Diagnóstico y Plan de Acción
    const med = ev.medidas || {};
    if (med.diagnostico || med.planAccion) {
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59); // Slate 800
        doc.text('Conclusiones y Diagnóstico', 14, finalY);
        
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105); // Slate 600
        
        let currentY = finalY + 10;
        if (med.diagnostico) {
            doc.setFont("helvetica", 'bold');
            doc.text('Diagnóstico General:', 14, currentY);
            doc.setFont("helvetica", 'normal');
            const lines = doc.splitTextToSize(med.diagnostico, 180);
            doc.text(lines, 14, currentY + 6);
            currentY += 6 + (lines.length * 5);
        }

        if (med.planAccion) {
            currentY += 5;
            doc.setFont("helvetica", 'bold');
            doc.text('Plan de Acción:', 14, currentY);
            doc.setFont("helvetica", 'normal');
            const lines = doc.splitTextToSize(med.planAccion, 180);
            doc.text(lines, 14, currentY + 6);
        }
    }

    doc.save(`Cancerigenos_SRT81_${ev.year}_${companyName}.pdf`);
}

