import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { 
  Building2, 
  Bus, 
  Train, 
  Users, 
  TrendingUp, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Compass, 
  ShieldAlert,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export const OperationsCenter: React.FC = () => {
  const {
    terminals,
    vehicles,
    kpis,
    trafficLights,
    isRushHour,
    toggleRushHour,
    triggerGreenWave,
    setSelectedTerminalId,
    setActiveTab,
    getTerminalOccupancy
  } = useTransit();

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1">
      {/* Smart City Barrio Terminales Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-700/40 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Gobierno de Santiago · Sé Santiago Smart City · CORFO · PRETEM
              </span>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                Desafío N°1: Operación Conectada
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Centro de Control Unificado e Interconexión Barrio Terminales
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl mt-0.5">
              Plataforma integradora para la toma de decisiones compartida entre Rodovías (San Borja), Terminal Sur, Terminal Alameda (TurBus/Pullman), EFE Trenes de Chile, Metro de Santiago, SEREMI MTT y SECPLA Estación Central.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('uoct')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <span>Ver Panel Semáforos UOCT</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Polígono de Influencia Official PDF stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-3 border-t border-slate-800">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Flujo Buses Diarios</span>
            <div className="text-xl font-extrabold text-white font-mono mt-0.5">5.140</div>
            <span className="text-[10px] text-cyan-400 font-medium">231.300 personas/día</span>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Población Flotante Metro</span>
            <div className="text-xl font-extrabold text-white font-mono mt-0.5">180.146</div>
            <span className="text-[10px] text-emerald-400 font-medium">Estación Central L1</span>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Pasajeros EFE / Meli-Tren</span>
            <div className="text-xl font-extrabold text-white font-mono mt-0.5">50.000</div>
            <span className="text-[10px] text-indigo-400 font-medium">Tren Nos + Melipilla</span>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Polígono Crítico</span>
            <div className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">19,5 há</div>
            <span className="text-[10px] text-slate-400 font-medium">117 há influencia total</span>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Empresas Operando</span>
            <div className="text-xl font-extrabold text-white font-mono mt-0.5">152</div>
            <span className="text-[10px] text-teal-400 font-medium">ABI Chile & FENABUS</span>
          </div>
        </div>
      </div>

      {/* 4 Connected Poles (Terminal Sur, Alameda, San Borja, EFE Trenes) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Nodos Interconectados del Cuadrante
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Capacidad de andenes y telemetría en tiempo real
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {terminals.slice(0, 4).map(term => {
            const isTrain = term.id === 'estacion_trenes_efe';
            const activeVehs = vehicles.filter(v => v.terminalId === term.id);
            const occ = getTerminalOccupancy(term.id);

            return (
              <div
                key={term.id}
                onClick={() => setSelectedTerminalId(term.id)}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 transition-all shadow-lg flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wide"
                      style={{ backgroundColor: term.color }}
                    >
                      {term.badge}
                    </span>
                    <span className="text-lg">{isTrain ? '🚆' : '🏢'}</span>
                  </div>

                  <h4 className="text-base font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors">
                    {term.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {term.operator}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                    {term.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Capacidad Física</span>
                      <span className="font-bold text-white font-mono">{term.capacityDocks} andenes</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Buses Adentro</span>
                      <span className={`font-bold font-mono ${occ.occupancyRatePercent > 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {occ.occupiedDocks} / {occ.totalMonitoredDocks}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-xl">
                    <span>Monitoreo GPS:</span>
                    <b className="text-cyan-400">{activeVehs.length} flotas ({occ.availableDocks} andenes libres)</b>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTerminalId(term.id);
                      setActiveTab('docks_capacity');
                    }}
                    className="mt-2.5 w-full py-2 rounded-xl bg-purple-950/60 hover:bg-purple-800/80 border border-purple-700/60 text-purple-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-98"
                  >
                    <Layers className="w-3.5 h-3.5 text-purple-300" />
                    <span>Ver Andenes & Capacidad en Vivo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Urban Plan & Bottleneck Resolution Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Analysis from PDF */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Análisis Urbano y Mitigación de Congestión (PRC Estación Central)
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Según el Plan Regulador Comunal (PRC) y el levantamiento de flujos de 5.140 buses diarios, las calles clave <b>Coronel Souper, 5 de Abril, Obispo Javier Vásquez, Jotabeche y Ruiz Tagle</b> sufren sobrecarga por detenciones indebidas y demoras semafóricas.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <div>
                <b className="text-white">Interoperabilidad GPS en tiempo real:</b>
                <span className="text-slate-400 block text-[11px]">
                  Buses transmiten posición cada segundo, permitiendo a los terminales saber qué andén liberar anticipadamente.
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <div>
                <b className="text-white">Enlace UOCT con Algoritmo de Demoras:</b>
                <span className="text-slate-400 block text-[11px]">
                  Alivio de los 59 puntos críticos de siniestralidad vial al eliminar detenciones en vías perpendiculares a la Alameda.
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <div>
                <b className="text-white">Reducción de Tiempo de Espera Pasajero:</b>
                <span className="text-slate-400 block text-[11px]">
                  Visualización tipo Uber elimina aglomeraciones en veredas y paraderos saturados (44.700 pax flotantes).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Committee & Partners Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
              <Users className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Comité Gestor de la Iniciativa (Convocatoria 2026)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <b className="text-slate-200 block">Cristian Sánchez</b>
                <span className="text-slate-400 text-[10px]">Gerente General Rodovías (Terminal San Borja)</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <b className="text-slate-200 block">Alejandro Gonzales</b>
                <span className="text-slate-400 text-[10px]">Gerente WIT L.A. (Terminal Sur / Pullman Bus)</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <b className="text-slate-200 block">Cristian Ocaranza</b>
                <span className="text-slate-400 text-[10px]">Gerente ANDO (Terminal Alameda TurBus)</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <b className="text-slate-200 block">Carolina Navarrete</b>
                <span className="text-slate-400 text-[10px]">Gerente General ABI a.g.</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <b className="text-slate-200 block">Rodrigo García</b>
                <span className="text-slate-400 text-[10px]">Unidad de Análisis SEREMI MTT</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <b className="text-slate-200 block">Felipe Gallegos</b>
                <span className="text-slate-400 text-[10px]">Director SECPLA Mun. Estación Central</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-950/40 rounded-xl border border-blue-500/30 text-xs flex items-center justify-between">
            <span className="text-slate-300">
              Presupuesto Convocatoria Piloto: <b className="text-cyan-400">$50.000.000 CLP</b>
            </span>
            <span className="text-emerald-400 font-semibold text-[11px]">
              Fase 1: Admisible & Operativo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
