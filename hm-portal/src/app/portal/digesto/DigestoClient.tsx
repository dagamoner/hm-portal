"use client";

import { useState } from "react";
import { ExternalLink, Book, Search } from "lucide-react";
import { digestoData } from "@/data/digesto";

export function DigestoClient() {
  const [activeModule, setActiveModule] = useState(digestoData[0].id);
  const [searchTerm, setSearchTerm] = useState("");

  const currentModule = digestoData.find((m) => m.id === activeModule) || digestoData[0];

  const filteredEntries = currentModule.entries.filter((entry) => {
    const normalize = (str: string) => 
      str.toLowerCase()
         .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
         .replace(/\./g, ""); // remove dots
    
    const term = normalize(searchTerm);
    
    return (
      normalize(entry.type).includes(term) ||
      normalize(entry.topic).includes(term) ||
      normalize(entry.description).includes(term) ||
      normalize(entry.number).includes(term) ||
      normalize(entry.year).includes(term)
    );
  });

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start">
      {/* Sidebar for Modules */}
      <div className="w-full xl:w-80 shrink-0 flex flex-col gap-2">
        {digestoData.map((modulo, index) => (
          <button
            key={modulo.id}
            onClick={() => {
              setActiveModule(modulo.id);
              setSearchTerm(""); // Reset search when switching modules
            }}
            className={`text-left px-5 py-4 rounded-xl transition-all duration-200 border flex items-start gap-3 ${
              activeModule === modulo.id
                ? "bg-indigo-50 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800/60 shadow-sm"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <div
              className={`mt-0.5 shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                activeModule === modulo.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-sm font-medium leading-tight ${
                activeModule === modulo.id
                  ? "text-indigo-900 dark:text-indigo-100"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {/* Extracting title after the 'Módulo X: ' part */}
              {modulo.title.split(": ")[1]}
            </span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[600px] transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 transition-colors">
              <Book className="w-5 h-5 text-indigo-500" />
              {currentModule.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">
              {filteredEntries.length} {filteredEntries.length === 1 ? "norma" : "normas"} en esta categoría
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar norma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 transition-colors">
                <th className="py-3 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Tipo
                </th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Número
                </th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Año / Ámbito
                </th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Temática
                </th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="py-3 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right whitespace-nowrap">
                  Enlace
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="py-4 px-6 text-sm font-medium text-slate-700 dark:text-slate-300 align-top">
                      {entry.type}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-slate-200 align-top whitespace-nowrap">
                      {entry.number}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400 align-top whitespace-nowrap">
                      {entry.year}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-800 dark:text-slate-200 align-top">
                      {entry.topic}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400 align-top min-w-[250px]">
                      {entry.description}
                    </td>
                    <td className="py-4 px-6 align-top text-right">
                      <a
                        href={entry.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors group-hover:shadow-sm whitespace-nowrap border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                        title="Ver / Descargar norma"
                      >
                        Consultar
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    No se encontraron normas que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
