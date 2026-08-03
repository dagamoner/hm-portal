const fs = require('fs');

const path = 'src/app/portal/empresas/[id]/incidentes/IncidentsClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Import generateIncidentReport
if (!content.includes('generateIncidentReport')) {
    content = content.replace(
        "import { createIncident, updateIncidentStatus, updateIncident, deleteIncident } from '@/app/actions/incidents';",
        "import { createIncident, updateIncidentStatus, updateIncident, deleteIncident } from '@/app/actions/incidents';\nimport { generateIncidentReport } from '@/lib/pdf/incidentReport';"
    );
}

// 2. Add State variables
if (!content.includes('const [workerName, setWorkerName] = useState')) {
    const stateVars = `
    // Extra details for PDF Report
    const [workerName, setWorkerName] = useState('');
    const [workerDni, setWorkerDni] = useState('');
    const [workerRole, setWorkerRole] = useState('');
    const [immediateBoss, setImmediateBoss] = useState('');
    const [sheaReferent, setSheaReferent] = useState('');
    const [reportType, setReportType] = useState('Incidente preventivo con potencial de daño grave');
    const [unsafeActions, setUnsafeActions] = useState('');
    const [unsafeConditions, setUnsafeConditions] = useState('');
    const [associatedRisks, setAssociatedRisks] = useState('');
    const [immediateMeasures, setImmediateMeasures] = useState('');
    const [reinductionTopics, setReinductionTopics] = useState('');
    const [technicalConclusion, setTechnicalConclusion] = useState('');
    const [generateWarning, setGenerateWarning] = useState(false);
`;
    content = content.replace('const [isSaving, setIsSaving] = useState(false);', stateVars + '\n    const [isSaving, setIsSaving] = useState(false);');
}

// 3. Update details object in handleCreate
const detailsReplacement = `
            const details = {
                incidentType,
                bodyPart,
                machinery,
                witnesses,
                workerName, workerDni, workerRole, immediateBoss, sheaReferent, reportType,
                unsafeActions, unsafeConditions, associatedRisks, immediateMeasures, reinductionTopics,
                technicalConclusion, generateWarning
            };
`;
content = content.replace(/const details = \{\s*incidentType,\s*bodyPart,\s*machinery,\s*witnesses\s*\};/g, detailsReplacement.trim());

// 4. Update form reset in handleCreate
const resetReplacement = `
            setIncidentType('');
            setBodyPart('');
            setMachinery('');
            setWitnesses('');
            setWorkerName(''); setWorkerDni(''); setWorkerRole(''); setImmediateBoss(''); setSheaReferent('');
            setReportType('Incidente preventivo con potencial de daño grave');
            setUnsafeActions(''); setUnsafeConditions(''); setAssociatedRisks('');
            setImmediateMeasures(''); setReinductionTopics(''); setTechnicalConclusion(''); setGenerateWarning(false);
`;
content = content.replace(/setIncidentType\(''\);\s*setBodyPart\(''\);\s*setMachinery\(''\);\s*setWitnesses\(''\);/g, resetReplacement.trim());

// 5. Update handleEditClick to load state
const editClickReplacement = `
        setIncidentType(inc.details?.incidentType || '');
        setBodyPart(inc.details?.bodyPart || '');
        setMachinery(inc.details?.machinery || '');
        setWitnesses(inc.details?.witnesses || '');
        setWorkerName(inc.details?.workerName || '');
        setWorkerDni(inc.details?.workerDni || '');
        setWorkerRole(inc.details?.workerRole || '');
        setImmediateBoss(inc.details?.immediateBoss || '');
        setSheaReferent(inc.details?.sheaReferent || '');
        setReportType(inc.details?.reportType || 'Incidente preventivo con potencial de daño grave');
        setUnsafeActions(inc.details?.unsafeActions || '');
        setUnsafeConditions(inc.details?.unsafeConditions || '');
        setAssociatedRisks(inc.details?.associatedRisks || '');
        setImmediateMeasures(inc.details?.immediateMeasures || '');
        setReinductionTopics(inc.details?.reinductionTopics || '');
        setTechnicalConclusion(inc.details?.technicalConclusion || '');
        setGenerateWarning(inc.details?.generateWarning || false);
`;
content = content.replace(/setIncidentType\(inc\.details\?\.incidentType \|\| ''\);\s*setBodyPart\(inc\.details\?\.bodyPart \|\| ''\);\s*setMachinery\(inc\.details\?\.machinery \|\| ''\);\s*setWitnesses\(inc\.details\?\.witnesses \|\| ''\);/g, editClickReplacement.trim());

// 6. Update JSX form (add after witnesses)
if (!content.includes('Datos del Trabajador y Reporte PDF')) {
    const extraFormJSX = `
                                {/* Separator for PDF Report fields */}
                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    <h4 className="text-lg font-black text-slate-800 mb-4">Datos del Trabajador y Reporte PDF</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Trabajador</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" value={workerName} onChange={e => setWorkerName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">DNI</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" value={workerDni} onChange={e => setWorkerDni(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Puesto / Función</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" value={workerRole} onChange={e => setWorkerRole(e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Jefatura Inmediata</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" value={immediateBoss} onChange={e => setImmediateBoss(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Jefatura / Referente SHEA</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" value={sheaReferent} onChange={e => setSheaReferent(e.target.value)} />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Reporte PDF</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" value={reportType} onChange={e => setReportType(e.target.value)} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Acciones Inseguras Detectadas</label>
                                        <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" value={unsafeActions} onChange={e => setUnsafeActions(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Condiciones Inseguras Asociadas</label>
                                        <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" value={unsafeConditions} onChange={e => setUnsafeConditions(e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Riesgos Asociados</label>
                                        <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" value={associatedRisks} onChange={e => setAssociatedRisks(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Medidas Inmediatas Recomendadas</label>
                                        <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" value={immediateMeasures} onChange={e => setImmediateMeasures(e.target.value)} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Temas de Reinducción</label>
                                    <textarea rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" value={reinductionTopics} onChange={e => setReinductionTopics(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Conclusión Técnica</label>
                                    <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" value={technicalConclusion} onChange={e => setTechnicalConclusion(e.target.value)} />
                                </div>
                                
                                <div className="flex items-center gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                                    <input type="checkbox" id="generateWarning" className="w-5 h-5" checked={generateWarning} onChange={e => setGenerateWarning(e.target.checked)} />
                                    <label htmlFor="generateWarning" className="text-sm font-bold text-red-900 cursor-pointer">Incluir Anexo II: Llamado de Atención Formal por RR.HH.</label>
                                </div>
`;
    content = content.replace(
        'value={description}\n                                        onChange={e => setDescription(e.target.value)}\n                                    />\n                                </div>',
        'value={description}\n                                        onChange={e => setDescription(e.target.value)}\n                                    />\n                                </div>\n' + extraFormJSX
    );
}

// 7. Add "Descargar PDF" button to selected incident view
const pdfBtnJSX = `
                                {canEdit && (
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => generateIncidentReport(selectedIncident, 'Empresa Comitente')}
                                            className="w-full bg-blue-50 text-blue-700 font-bold px-6 py-4 rounded-2xl hover:bg-blue-100 transition-colors uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                                        >
                                            <FileText className="w-4 h-4" /> Descargar Informe PDF
                                        </button>
                                        <button 
`;
content = content.replace(
    '                                {canEdit && (\n                                    <div className="flex flex-col gap-2">\n                                        <button',
    pdfBtnJSX
);

fs.writeFileSync(path, content, 'utf8');
console.log('IncidentsClient.tsx updated successfully');
