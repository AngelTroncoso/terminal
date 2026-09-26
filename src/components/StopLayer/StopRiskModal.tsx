import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { 
  ShieldAlert, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Info,
  Car,
  Users,
  Building,
  Flame
} from 'lucide-react';

export const StopRiskModal: React.FC = () => {
  const { stopRiskPoints, setSelectedTrafficLightId, setActiveTab } = useTransit();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Vial' | 'Situacional' | 'Social' | 'Siniestro'>('all');

  const filteredPoints = stopRiskPoints.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1">
      {/* Top Banner / STOP Carabineros 2026 Official Identity */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-600/40 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Plataforma STOP · Carabineros de Chile · Dirección de Orden y Seguridad
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                  Manual STOP 2026
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Georreferenciación de Factores de Riesgo y Siniestralidad Vial
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
                Integración del glosario oficial de factores de riesgo (Viales como semaforización defectuosa #36, Situacionales #14 y 59 puntos críticos de siniestros) para optimizar rutas peatonales seguras y coordinación preventiva con UOCT.
              </p>
            </div>
          </div>

          <a
            href="http://stop.carabineros.cl/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
          >
            <span>stop.carabineros.cl</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </a>
        </div>

        {/* 4 Official STOP Categories Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={() => setSelectedCategory('Vial')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedCategory === 'Vial' ? 'bg-purple-950/70 border-purple-500 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
              <Car className="w-3.5 h-3.5" />
              <span>1. Factores Viales (7 tipos)</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Semáforos defectuosos (#36), calzadas (#32), vallas.
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('Situacional')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedCategory === 'Situacional' ? 'bg-blue-950/70 border-blue-500 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
              <Building className="w-3.5 h-3.5" />
              <span>2. Situacional (14 tipos)</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Paraderos (#14), iluminación (#15), lugares trampa (#18).
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('Social')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedCategory === 'Social' ? 'bg-amber-950/70 border-amber-500 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Users className="w-3.5 h-3.5" />
              <span>3. Social (5 tipos)</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Comercio no autorizado (#25), consumo alcohol (#26).
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('Siniestro')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedCategory === 'Siniestro' ? 'bg-rose-950/70 border-rose-500 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>4. Siniestros Viales</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              59 puntos críticos registrados en 2024 en el barrio.
            </span>
          </button>
        </div>
      </div>

      {/* Points detail list */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Puntos de Riesgo Registrados en el Cuadrante (19,5 há)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              ({filteredPoints.length} puntos activos)
            </span>
          </div>

          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs text-cyan-400 hover:underline font-medium"
          >
            Restablecer filtro a todos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredPoints.map(point => {
            const isVial = point.category === 'Vial';
            const isSiniestro = point.category === 'Siniestro';
            const isSituacional = point.category === 'Situacional';

            return (
              <div
                key={point.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      isVial ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      isSiniestro ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      isSituacional ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      Cat. {point.category} · Cód. {point.code}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      point.severity === 'alta' ? 'bg-rose-900/60 text-rose-300' : 'bg-amber-900/60 text-amber-300'
                    }`}>
                      Severidad {point.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-1">
                    {point.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {point.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 bg-slate-900/60 p-2 rounded-lg text-[10px] text-slate-300">
                  <span className="font-semibold text-cyan-400 block mb-0.5">Acción Coordinada UOCT / Municipio:</span>
                  <span>{point.recommendedAction}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
