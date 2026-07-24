const fs = require('fs');
const path = require('path');
const modules = ['documentacion', 'mediciones', 'ergonomia', 'cancerigenos', 'incidentes', 'investigacion', 'riesgos', 'programa-anual', 'vehiculos', 'equipos', 'personal', 'auditorias', 'log-auditoria', 'capacitaciones'];
const baseDir = path.join(process.cwd(), 'src/app/portal/empresas/[id]');

modules.forEach(mod => {
  const dir = path.join(baseDir, mod);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const componentName = mod.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') + 'Page';
  
  const content = `export default function ${componentName}() {
  return (
    <div className="bg-white/60 backdrop-blur-xl p-12 rounded-[2.5rem] shadow-sm border border-white/50 text-center animate-fade-in mt-6">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-inner">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-2">Módulo: ${mod}</h2>
      <p className="text-slate-500 font-medium max-w-md mx-auto">Este módulo está en construcción. Aquí se implementará la gestión específica para esta entidad.</p>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
});
console.log('All modules created.');
