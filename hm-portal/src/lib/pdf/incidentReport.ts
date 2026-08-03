import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export async function generateIncidentReport(incident: any, companyName: string) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const details = incident.details || {};
    
    // Configuración base
    const leftMargin = 15;
    const topMargin = 20;
    const contentWidth = 180;
    let currentY = topMargin;

    // Helper function for adding text and managing page breaks
    const addText = (text: string, fontSize = 11, isBold = false, options: any = {}) => {
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setFontSize(fontSize);
        
        const lines = doc.splitTextToSize(text, options.maxWidth || contentWidth);
        const textHeight = lines.length * (fontSize * 0.4);
        
        if (currentY + textHeight > 280) {
            doc.addPage();
            currentY = topMargin;
        }
        
        doc.text(lines, options.x || leftMargin, currentY, options);
        currentY += textHeight + (options.spacing || 5);
    };

    // Título Principal
    addText('INFORME TÉCNICO DE HIGIENE Y SEGURIDAD EN EL TRABAJO', 14, true, { align: 'center', x: 105, spacing: 8 });
    
    // Subtítulo
    const docTitle = details.reportType === 'accidente' ? 'Elevación por accidente laboral' : 'Elevación por incidente preventivo';
    addText(docTitle, 12, true, { align: 'center', x: 105, spacing: 15 });

    // Cabecera
    const formatValue = (val: any) => val || 'No especificado';
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    addText(`Informe N.º: INC-${incident.id.substring(0,6).toUpperCase()}/${new Date(incident.date).getFullYear()}`, 10, true, { spacing: 4 });
    addText(`Fecha: ${format(new Date(incident.date), "dd / MM / yyyy", { locale: es })}`, 10, true, { spacing: 4 });
    addText(`Empresa contratista/prestadora: Oralco S.R.L.`, 10, true, { spacing: 4 });
    addText(`Empresa comitente: ${companyName}`, 10, true, { spacing: 4 });
    addText(`Sector / Área: ${incident.location}`, 10, true, { spacing: 4 });
    addText(`Trabajador involucrado: ${formatValue(details.workerName)} - DNI: ${formatValue(details.workerDni)}`, 10, true, { spacing: 4 });
    addText(`Puesto / Función: ${formatValue(details.workerRole)}`, 10, true, { spacing: 4 });
    addText(`Elaborado por: Servicio Externo de Higiene y Seguridad en el Trabajo - Oralco S.R.L.`, 10, true, { spacing: 4 });
    
    const destinatarios = `Jefatura Oralco S.R.L. / RR.HH. Oralco S.R.L. / Jefatura SHEA ${companyName}`;
    addText(`Destinatarios: ${destinatarios}`, 10, true, { spacing: 10 });
    
    // Línea separadora
    doc.setDrawColor(150);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, currentY, leftMargin + contentWidth, currentY);
    currentY += 10;

    // 1. Objeto
    addText('1. Objeto del informe', 11, true, { spacing: 6 });
    addText(`El presente informe tiene por objeto dejar constancia técnica del evento relevado e informado por la Jefatura SHEA de ${companyName}, vinculado a tareas ejecutadas por personal de Oralco S.R.L. dentro del establecimiento de la empresa comitente.`, 10, false, { spacing: 5, maxWidth: contentWidth });
    addText(`Asimismo, se eleva el análisis preliminar de las acciones inseguras, condiciones inseguras, riesgos asociados, medidas correctivas y preventivas recomendadas.`, 10, false, { spacing: 10, maxWidth: contentWidth });

    // 2. Antecedentes
    addText('2. Antecedentes', 11, true, { spacing: 6 });
    addText(`En fecha ${format(new Date(incident.date), "dd/MM/yyyy", { locale: es })}, este Servicio Externo de Higiene y Seguridad toma conocimiento de un evento informado por la Jefatura, relacionado con tareas ejecutadas por personal de Oralco S.R.L.`, 10, false, { spacing: 5, maxWidth: contentWidth });
    addText(`De acuerdo con lo informado, durante la ejecución o preparación de tareas se detectaron los siguientes desvíos o hechos relevantes:`, 10, false, { spacing: 5, maxWidth: contentWidth });
    addText(formatValue(incident.description), 10, false, { spacing: 10, maxWidth: contentWidth });

    // 3. Alcance
    addText('3. Alcance', 11, true, { spacing: 6 });
    addText(`El presente informe se limita al análisis técnico-preventivo del evento informado, sin perjuicio de las medidas administrativas, laborales o disciplinarias que correspondan ser evaluadas y aplicadas por Oralco S.R.L., en su carácter de empleador.`, 10, false, { spacing: 5, maxWidth: contentWidth });
    addText(`Este Servicio Externo de Higiene y Seguridad interviene en carácter de asesor técnico, recomendando acciones preventivas, correctivas, de capacitación y de control operativo.`, 10, false, { spacing: 10, maxWidth: contentWidth });

    // 4. Descripción del incidente / accidente
    addText('4. Descripción del evento', 11, true, { spacing: 6 });
    addText(`Según lo informado, durante las tareas se identificó la siguiente situación:\n\n${formatValue(incident.description)}`, 10, false, { spacing: 10, maxWidth: contentWidth });

    // 5. Acciones y Condiciones Inseguras
    addText('5. Acciones y Condiciones Inseguras detectadas', 11, true, { spacing: 6 });
    addText('Acciones inseguras:', 10, true, { spacing: 4 });
    addText(formatValue(details.unsafeActions), 10, false, { spacing: 6, maxWidth: contentWidth });
    
    addText('Condiciones inseguras asociadas:', 10, true, { spacing: 4 });
    addText(formatValue(details.unsafeConditions), 10, false, { spacing: 10, maxWidth: contentWidth });

    // 6. Evaluación cualitativa
    addText('6. Evaluación cualitativa del riesgo', 11, true, { spacing: 6 });
    const severityMap: Record<string, string> = {
        'LOW': 'Bajo / Menor',
        'MEDIUM': 'Medio / Moderado',
        'HIGH': 'Alto / Serio',
        'CRITICAL': 'Crítico / Catastrófico'
    };
    addText(`Nivel de riesgo estimado: ${severityMap[incident.severity] || 'No definido'}`, 10, false, { spacing: 4 });
    addText(`Riesgos asociados:`, 10, true, { spacing: 4 });
    addText(formatValue(details.associatedRisks), 10, false, { spacing: 10, maxWidth: contentWidth });

    // 7. Medidas inmediatas
    addText('7. Medidas inmediatas recomendadas', 11, true, { spacing: 6 });
    addText(formatValue(details.immediateMeasures), 10, false, { spacing: 10, maxWidth: contentWidth });

    // 8. Reinducción
    addText('8. Reinducción preventiva requerida', 11, true, { spacing: 6 });
    addText(formatValue(details.reinductionTopics), 10, false, { spacing: 10, maxWidth: contentWidth });

    // 9. Conclusión técnica
    addText('9. Conclusión técnica', 11, true, { spacing: 6 });
    addText(formatValue(details.technicalConclusion), 10, false, { spacing: 15, maxWidth: contentWidth });

    // Firmas
    if (currentY > 230) {
        doc.addPage();
        currentY = topMargin;
    }

    addText('Firma:', 10, false, { spacing: 5 });
    addText('Profesional responsable de Higiene y Seguridad', 10, false, { spacing: 5 });
    addText('Servicio Externo de Higiene y Seguridad – Oralco S.R.L.', 10, false, { spacing: 15 });

    addText('Recibido por Oralco S.R.L.: _______________________________', 10, false, { spacing: 10 });
    addText(`Recibido por ${companyName} / SHEA: _______________________________`, 10, false, { spacing: 10 });

    // ==========================================
    // ANEXO I - Registro
    // ==========================================
    doc.addPage();
    currentY = topMargin;

    addText('ANEXO I', 12, true, { spacing: 8 });
    addText(`Registro del evento informado por Jefatura SHEA – ${companyName}`, 12, true, { spacing: 12 });

    addText(`Informe principal: Informe Técnico de Higiene y Seguridad`, 10, true, { spacing: 4 });
    addText(`Empresa contratista/prestadora: Oralco S.R.L.`, 10, true, { spacing: 4 });
    addText(`Empresa comitente: ${companyName}`, 10, true, { spacing: 4 });
    addText(`Área / Sector: ${incident.location}`, 10, true, { spacing: 4 });
    addText(`Fecha del evento: ${format(new Date(incident.date), "dd/MM/yyyy", { locale: es })}`, 10, true, { spacing: 4 });
    addText(`Trabajador involucrado: ${formatValue(details.workerName)}`, 10, true, { spacing: 4 });
    addText(`Puesto / Función: ${formatValue(details.workerRole)}`, 10, true, { spacing: 4 });
    addText(`Jefatura inmediata Oralco: ${formatValue(details.immediateBoss)}`, 10, true, { spacing: 4 });
    addText(`Jefatura / Referente SHEA ${companyName}: ${formatValue(details.sheaReferent)}`, 10, true, { spacing: 10 });

    addText('1. Motivo del registro', 11, true, { spacing: 6 });
    addText(`El presente Anexo tiene por finalidad dejar constancia documental del evento informado.`, 10, false, { spacing: 10, maxWidth: contentWidth });

    addText('2. Tipo de evento', 11, true, { spacing: 6 });
    addText(`Clasificación principal: ${formatValue(details.reportType)}`, 10, false, { spacing: 10 });

    // ==========================================
    // ANEXO II - Llamado de atención (Opcional)
    // ==========================================
    if (details.generateWarning) {
        doc.addPage();
        currentY = topMargin;
        
        addText('ANEXO II', 12, true, { spacing: 8 });
        addText('Nota de llamado de atención emitida por RR.HH. – Oralco S.R.L.', 12, true, { spacing: 12 });
        
        addText(`Trabajador involucrado: ${formatValue(details.workerName)}`, 10, true, { spacing: 4 });
        addText(`DNI: ${formatValue(details.workerDni)}`, 10, true, { spacing: 10 });

        addText('LLAMADO DE ATENCIÓN FORMAL', 12, true, { align: 'center', x: 105, spacing: 10 });
        addText(`Fecha: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}`, 10, false, { spacing: 10 });
        
        addText(`Sr. ${formatValue(details.workerName)},`, 10, false, { spacing: 6 });
        addText(`Por medio de la presente, Oralco S.R.L., en su carácter de empleador, le comunica formalmente un llamado de atención con motivo del evento preventivo informado, vinculado a tareas desarrolladas en instalaciones de la empresa comitente.`, 10, false, { spacing: 6, maxWidth: contentWidth });
        addText(`De acuerdo con lo relevado, se detectaron desvíos vinculados a acciones y condiciones inseguras relacionadas con procedimientos críticos de seguridad.`, 10, false, { spacing: 6, maxWidth: contentWidth });
        addText(`Las situaciones mencionadas representan un riesgo para su propia integridad física como para la de compañeros y terceros. Se le recuerda que todo trabajador tiene la obligación de cumplir estrictamente las normas de Higiene y Seguridad.`, 10, false, { spacing: 6, maxWidth: contentWidth });
        addText(`La presente comunicación tiene carácter correctivo, preventivo y documental, quedando incorporada al legajo laboral correspondiente.`, 10, false, { spacing: 15, maxWidth: contentWidth });

        addText('Sin otro particular, se firma la presente en prueba de notificación.', 10, false, { spacing: 20 });
        
        addText('Por Oralco S.R.L. / RR.HH.: _______________________', 10, false, { spacing: 8 });
        addText('Jefatura inmediata Oralco S.R.L.: _________________', 10, false, { spacing: 8 });
        addText('Servicio Externo de Higiene y Seguridad: ___________', 10, false, { spacing: 8 });
        addText('Trabajador notificado: __________________________', 10, false, { spacing: 8 });
    }

    doc.save(`Informe_Tecnico_INC-${incident.id.substring(0,8)}.pdf`);
}
