"use client";

import React from "react";
import { FileText, Lightbulb } from "lucide-react";

export default function IluminacionPCI() {
    return (
        <div className="space-y-6 animate-fade-in pb-12 max-w-[95vw] lg:max-w-[85vw] mx-auto">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Iluminación de Emergencia y Señalización</h2>
                    <p className="text-sm text-slate-500">Requerimientos normativos según Ley 19.587.</p>
                </div>
            </div>

            <div className="bg-amber-50 text-amber-900 p-8 rounded-3xl text-base leading-relaxed border border-amber-200 shadow-sm flex gap-6">
                <Lightbulb className="w-12 h-12 text-amber-500 shrink-0" />
                <div>
                    <p className="mb-4">
                        Conforme a lo expuesto en el <strong>Art. 76 de la Ley 19587</strong>, los sectores analizados poseerán luces de emergencias en lugares estratégicos, que garantizarían en caso de algún siniestro la visualización de los distintos sectores, como así también permitirán la evacuación de las personas.
                    </p>
                    <p className="mb-4">
                        Las mismas son de uso "no permanente", cuyo encendido se producirá automáticamente y en forma instantánea por falta de suministro de energía. En los medios de acceso y de circulación se podrán utilizar luces de emergencias y de señalización en una sola unidad.
                    </p>
                    <p className="mb-4">
                        Las luces deben poseer un sistema de funcionamiento independiente a la red eléctrica natural, ya que funcionan con baterías selladas y de libre mantenimiento que se encuentran en carga permanente, provisto con sistema de carga automática y detector de falta de tensión para encendido instantáneo (no más de cinco segundos), y se accionan ante un eventual desperfecto eléctrico y tienen una autonomía de 4/2 horas.
                    </p>
                    <p>
                        Todas las salidas del establecimiento estarán debidamente señalizadas mediante carteles "señaladores". Además, se colocarán carteles autoadhesivos y de plástico de alto impacto, indicando las salidas; como así también se colocarán las chapas balizas correspondientes para señalizar los extintores.
                    </p>
                </div>
            </div>
        </div>
    );
}
