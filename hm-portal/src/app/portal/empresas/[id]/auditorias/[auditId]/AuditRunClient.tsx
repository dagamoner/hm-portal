"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, CheckCircle, XCircle, MinusCircle, Check, Info } from "lucide-react";
import { saveInspectionAnswers, updateInspectionStatus } from "../actions";
import { useAuth } from "@/components/providers/AuthProvider";

type AnswerType = "CUMPLE" | "NO_CUMPLE" | "NO_APLICA" | null;

interface QuestionItem {
  id: string;
  question: string;
  answer: AnswerType;
  observation: string;
}

interface Category {
  categoryName: string;
  questions: QuestionItem[];
}

export function AuditRunClient({ 
  companyId, 
  inspection
}: { 
  companyId: string, 
  inspection: any
}) {
  const router = useRouter();
  const { isClient } = useAuth();
  
  // Parse items from JSON
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      return typeof inspection.items === 'string' 
        ? JSON.parse(inspection.items) 
        : inspection.items;
    } catch {
      return [];
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);

  const calculateScore = (cats: Category[]) => {
    let totalScoreable = 0;
    let totalComplied = 0;
    
    cats.forEach(cat => {
      cat.questions.forEach(q => {
        if (q.answer === "CUMPLE" || q.answer === "NO_CUMPLE") {
          totalScoreable++;
          if (q.answer === "CUMPLE") totalComplied++;
        }
      });
    });

    if (totalScoreable === 0) return 0;
    return Math.round((totalComplied / totalScoreable) * 100);
  };

  const handleAnswer = (catIdx: number, qId: string, answer: AnswerType) => {
    if (isClient || inspection.status === "Completada") return;
    
    const newCats = [...categories];
    const q = newCats[catIdx].questions.find(x => x.id === qId);
    if (q) {
      q.answer = answer;
      setCategories(newCats);
    }
  };

  const handleObservation = (catIdx: number, qId: string, obs: string) => {
    if (isClient || inspection.status === "Completada") return;

    const newCats = [...categories];
    const q = newCats[catIdx].questions.find(x => x.id === qId);
    if (q) {
      q.observation = obs;
      setCategories(newCats);
    }
  };

  const handleSave = async (complete: boolean = false) => {
    if (isClient) return;
    
    setIsSaving(true);
    try {
      const score = calculateScore(categories);
      await saveInspectionAnswers(inspection.id, categories, score, companyId);
      
      if (complete) {
        if (window.confirm("¿Desea finalizar la auditoría? Ya no podrá modificar las respuestas.")) {
          await updateInspectionStatus(inspection.id, "Completada", companyId);
          router.push(`/portal/empresas/${companyId}/auditorias`);
        }
      } else {
        alert("Progreso guardado correctamente.");
      }
    } catch (e) {
      console.error(e);
      alert("Error al guardar la auditoría");
    } finally {
      setIsSaving(false);
    }
  };

  const currentScore = calculateScore(categories);
  const totalQuestions = categories.reduce((acc, cat) => acc + cat.questions.length, 0);
  const answeredQuestions = categories.reduce((acc, cat) => acc + cat.questions.filter(q => q.answer !== null).length, 0);
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push(`/portal/empresas/${companyId}/auditorias`)}
              className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white">{inspection.title}</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {inspection.location} • {new Date(inspection.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="text-right flex items-center gap-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Cumplimiento</p>
              <p className={`text-3xl font-black ${currentScore >= 80 ? 'text-emerald-500' : currentScore >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                {currentScore}%
              </p>
            </div>
            {!isClient && inspection.status !== "Completada" && (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> Guardar Avance
                </button>
                <button 
                  onClick={() => handleSave(true)}
                  disabled={isSaving || progress < 100}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 shadow-sm"
                  title={progress < 100 ? "Responda todas las preguntas para finalizar" : "Finalizar y sellar auditoría"}
                >
                  <Check className="w-4 h-4" /> Finalizar
                </button>
              </div>
            )}
            {inspection.status === "Completada" && (
              <div className="px-4 py-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold rounded-xl text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Completada
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-slate-500">Progreso general</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{answeredQuestions} de {totalQuestions} respondidas</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Checklist Area */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Categories Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          {categories.map((cat, idx) => {
            const answeredInCat = cat.questions.filter(q => q.answer !== null).length;
            const totalInCat = cat.questions.length;
            const isComplete = answeredInCat === totalInCat && totalInCat > 0;
            
            return (
              <button
                key={idx}
                onClick={() => setActiveCategoryIdx(idx)}
                className={`text-left p-4 rounded-xl transition-colors border flex flex-col gap-2 relative overflow-hidden ${
                  activeCategoryIdx === idx
                    ? "bg-indigo-50 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800 shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-bold leading-tight pr-4 ${
                    activeCategoryIdx === idx ? "text-indigo-900 dark:text-indigo-100" : "text-slate-700 dark:text-slate-300"
                  }`}>
                    {cat.categoryName}
                  </span>
                  {isComplete && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-indigo-500 h-full transition-all" 
                    style={{ width: `${totalInCat > 0 ? (answeredInCat/totalInCat)*100 : 0}%` }}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Questions Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {categories.length > 0 ? (
            <div>
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="text-xl font-black text-slate-800 dark:text-white">
                  {categories[activeCategoryIdx].categoryName}
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-8">
                {categories[activeCategoryIdx].questions.map((q, i) => (
                  <div key={q.id} className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 pt-1">
                        {q.question}
                      </p>
                    </div>
                    
                    <div className="pl-9 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                        <button
                          onClick={() => handleAnswer(activeCategoryIdx, q.id, "CUMPLE")}
                          disabled={isClient || inspection.status === "Completada"}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            q.answer === "CUMPLE" 
                              ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                          } disabled:opacity-50`}
                        >
                          <CheckCircle className="w-4 h-4" /> Cumple
                        </button>
                        <button
                          onClick={() => handleAnswer(activeCategoryIdx, q.id, "NO_CUMPLE")}
                          disabled={isClient || inspection.status === "Completada"}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            q.answer === "NO_CUMPLE" 
                              ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm" 
                              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                          } disabled:opacity-50`}
                        >
                          <XCircle className="w-4 h-4" /> No Cumple
                        </button>
                        <button
                          onClick={() => handleAnswer(activeCategoryIdx, q.id, "NO_APLICA")}
                          disabled={isClient || inspection.status === "Completada"}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            q.answer === "NO_APLICA" 
                              ? "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm" 
                              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                          } disabled:opacity-50`}
                        >
                          <MinusCircle className="w-4 h-4" /> N/A
                        </button>
                      </div>

                      <div className="flex-1 w-full max-w-sm">
                        <input 
                          type="text" 
                          placeholder="Observaciones (opcional)"
                          value={q.observation || ""}
                          onChange={(e) => handleObservation(activeCategoryIdx, q.id, e.target.value)}
                          disabled={isClient || inspection.status === "Completada"}
                          className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-colors disabled:opacity-50 text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
              <Info className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Esta inspección no tiene preguntas configuradas.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
