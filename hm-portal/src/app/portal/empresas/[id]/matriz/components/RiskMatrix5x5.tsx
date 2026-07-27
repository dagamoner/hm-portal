"use client";

import { useMemo } from "react";

const PROBABILITY_LABELS = [
  { value: 5, label: "5 Casi seguro" },
  { value: 4, label: "4 Probable" },
  { value: 3, label: "3 Moderado" },
  { value: 2, label: "2 Poco probable" },
  { value: 1, label: "1 Raro" },
];

const SEVERITY_LABELS = [
  { value: 1, label: "Insignificante 1" },
  { value: 2, label: "Menor 2" },
  { value: 3, label: "Significativo 3" },
  { value: 4, label: "Mayor 4" },
  { value: 5, label: "Severo 5" },
];

function getRiskColorAndLabel(p: number, s: number) {
  const r = p * s;
  if (r <= 2) return { color: "bg-[#22c55e]", label: `Muy bajo ${r}`, text: "text-white" }; // Green
  if (r <= 4) return { color: "bg-[#4ade80]", label: `Bajo ${r}`, text: "text-slate-800" }; // Light Green
  if (r <= 6) return { color: "bg-[#facc15]", label: `Medio ${r}`, text: "text-slate-800" }; // Yellow
  if (r === 8 || r === 9 || r === 10) return { color: "bg-[#fb923c]", label: r === 8 || r === 9 ? `Medio ${r}` : `Alto ${r}`, text: "text-slate-800" }; // Orange/Yellow
  if (r === 12) return { color: "bg-[#f97316]", label: `Alto ${r}`, text: "text-white" }; // Orange
  if (r === 15 || r === 16) return { color: "bg-[#ef4444]", label: `Muy alto ${r}`, text: "text-white" }; // Red
  return { color: "bg-[#b91c1c]", label: `Extremo ${r}`, text: "text-white" }; // Dark Red
}

export default function RiskMatrix5x5({ rows }: { rows: any[] }) {
  // Count hazards for each P, S combination
  const matrixCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rows.forEach(r => {
      if (r.p !== '-' && r.s !== '-') {
        const key = `${r.p}-${r.s}`;
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [rows]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px] border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-center border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-200 bg-slate-50 p-3 w-1/6"></th>
              {SEVERITY_LABELS.map(s => (
                <th key={s.value} className="border border-slate-200 bg-slate-50 p-3 w-1/6 font-bold text-slate-700">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROBABILITY_LABELS.map(p => (
              <tr key={p.value}>
                <td className="border border-slate-200 bg-slate-50 p-3 font-bold text-slate-700 text-left">
                  {p.label}
                </td>
                {SEVERITY_LABELS.map(s => {
                  const info = getRiskColorAndLabel(p.value, s.value);
                  const count = matrixCounts[`${p.value}-${s.value}`] || 0;
                  return (
                    <td key={s.value} className={`border border-slate-200 p-2 relative ${info.color}`}>
                      <div className="flex flex-col items-center justify-center min-h-[60px]">
                        <span className={`font-bold ${info.text} text-xs opacity-90`}>{info.label}</span>
                        {count > 0 && (
                          <div className="mt-1 bg-white/30 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/50 font-black text-slate-900 shadow-sm flex items-center justify-center">
                            {count} {count === 1 ? 'peligro' : 'peligros'}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
