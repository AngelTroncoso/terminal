import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { 
  Zap, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Sliders, 
  Radio, 
  ArrowUpRight, 
  CheckCircle, 
  Flame, 
  RefreshCw,
  Clock,
  Compass,
  Building2,
  Cpu
} from 'lucide-react';

export const TrafficLightDashboard: React.FC = () => {
  const {
    trafficLights,
    uoctLogs,
    triggerGreenWave,
    forceTrafficLightState,
    triggerFlowDirection,
    clearIntersectionJam,
    injectTrafficIncident,
    toggleRushHour,
    isRushHour,
    kpis,
    selectedTrafficLightId,
    setSelectedTrafficLightId,
    vehicles
  } = useTransit();

  const [filterMode, setFilterMode] = useState<'all' | 'priority' | 'critical'>('all');

  const selectedIntersection = trafficLights.find(tl => tl.id === selectedTrafficLightId) || trafficLights[1];

  const filteredLights = trafficLights.filter(tl => {
    if (filterMode === 'priority') return tl.isPriorityActive || tl.greenWaveActive;
    if (filterMode === 'critical') return tl.congestionLevel === 'alto' || tl.congestionLevel === 'critico';
    return true;
  });

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1">
      {/* Top Banner / Department of Traffic Lights Chile Branding */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-700/40 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Unidad Operativa de Control de Tránsito (UOCT) · MTT Chile
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                  SCATS Adaptativo Activo
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Coordinación Semafórica Inteligente · Cuadrante Barrio Terminales
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
                Interconexión directa entre la telemetría GPS de buses (TurBus, Pullman, San Borja) y la red de semáforos para optimizar dinámicamente la duración de fases verdes y evitar el colapso vial del polígono de 19,5 há.
              </p>
            </div>
          </div>

          {/* Quick Global Action Controls */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={toggleRushHour}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isRushHour 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-600/30' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{isRushHour ? 'Hora Punta Activada' : 'Simular Hora Punta'}</span>
            </button>
          </div>
        </div>

        {/* Global Quadrant Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/80">
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Prioridades GPS Otorgadas</span>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
              {kpis.uoctPrioritiesGranted} eventos hoy
            </div>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Demora Media en Salida</span>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
              {kpis.avgExitDelayMinutes} min <span className="text-xs text-slate-400 font-normal">(-17.8m)</span>
            </div>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Índice de Fluidez Vial</span>
            <div className="text-lg font-bold text-indigo-400 font-mono mt-0.5">
              {kpis.trafficFluencyIndex}%
            </div>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Ahorro CO2 Estimado</span>
            <div className="text-lg font-bold text-teal-400 font-mono mt-0.5">
              {kpis.co2EmissionsSavedKg} kg CO2
            </div>
          </div>
        </div>
      </div>

      {/* Onda Verde / Green Wave Dispatcher Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Despliegue de Onda Verde Coordinada (Onda Verde UOCT)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Alinea sincronizadamente los ciclos verdes en corredores de alta demanda
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => triggerGreenWave('alameda')}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/60 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                Onda Verde Eje Alameda
              </div>
              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                SEM-01, SEM-02, SEM-03 hacia Ruta 68 / Valparaíso. +55s verde continuo.
              </div>
            </div>
          </button>

          <button
            onClick={() => triggerGreenWave('cinco_de_abril')}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 hover:bg-orange-950/40 border border-slate-800 hover:border-orange-500/60 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-orange-300">
                Onda Verde 5 de Abril / Souper
              </div>
              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                SEM-05 y SEM-06. Descongestiona salida de Terminal Sur hacia Autopista Central.
              </div>
            </div>
          </button>

          <button
            onClick={() => triggerGreenWave('san_borja')}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/60 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-indigo-300">
                Onda Verde San Borja / EFE
              </div>
              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                SEM-07 y SEM-10. Evacua 3.600 buses/día de servicios rurales a Talagante y Melipilla.
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Intersections Grid & Active Controller Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Intersections List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Semáforos Conectados en el Cuadrante ({trafficLights.length})
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-lg ${filterMode === 'all' ? 'bg-cyan-600 text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                Todos ({trafficLights.length})
              </button>
              <button
                onClick={() => setFilterMode('priority')}
                className={`px-2.5 py-1 rounded-lg ${filterMode === 'priority' ? 'bg-cyan-600 text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                Prioridad GPS ({trafficLights.filter(t => t.isPriorityActive).length})
              </button>
              <button
                onClick={() => setFilterMode('critical')}
                className={`px-2.5 py-1 rounded-lg ${filterMode === 'critical' ? 'bg-cyan-600 text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                Alta Demora
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto max-h-[380px] pr-1">
            {filteredLights.map(tl => {
              const isSelected = tl.id === selectedIntersection?.id;
              const colorBg = tl.currentColor === 'green' ? 'bg-emerald-500' : tl.currentColor === 'yellow' ? 'bg-amber-500' : 'bg-rose-500';
              const colorText = tl.currentColor === 'green' ? 'text-emerald-400' : tl.currentColor === 'yellow' ? 'text-amber-400' : 'text-rose-400';

              return (
                <div
                  key={tl.id}
                  onClick={() => setSelectedTrafficLightId(tl.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/70 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                          {tl.id}
                        </span>
                        <span className="text-xs font-bold text-white truncate max-w-[170px]">
                          {tl.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                        {tl.mainStreet}
                      </span>
                    </div>

                    {/* Live Signal Badge */}
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700">
                      <span className={`w-2.5 h-2.5 rounded-full ${colorBg} ${tl.currentColor === 'green' ? 'animate-pulse' : ''}`}></span>
                      <span className={`text-xs font-mono font-bold ${colorText}`}>
                        {tl.secondsRemaining}s
                      </span>
                    </div>
                  </div>

                  {/* Status metrics footer */}
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      Cola: <b className="text-slate-200">{tl.queueLengthMeters}m</b>
                    </span>
                    <span className={`font-semibold uppercase text-[9px] px-1.5 py-0.5 rounded ${
                      tl.congestionLevel === 'critico' ? 'bg-rose-500/20 text-rose-300' :
                      tl.congestionLevel === 'alto' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {tl.congestionLevel}
                    </span>
                    {tl.isPriorityActive && (
                      <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                        <Zap className="w-3 h-3" /> GPS ON
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Intersection Deep Dive & Manual Override */}
        {selectedIntersection && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-bold">
                    {selectedIntersection.id}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold uppercase">Panel de Control UOCT</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedIntersection.mode === 'PRIORIDAD_BUS_GPS' ? 'bg-cyan-500/20 text-cyan-300' :
                  selectedIntersection.mode === 'ONDA_VERDE_UOCT' ? 'bg-emerald-500/20 text-emerald-300' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {selectedIntersection.mode.replace(/_/g, ' ')}
                </div>
              </div>

              <h4 className="text-base font-bold text-white mt-3">
                {selectedIntersection.name}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Cruce entre {selectedIntersection.mainStreet} y {selectedIntersection.crossStreet}
              </p>

              {/* Huge Live Traffic Light Visual */}
              <div className="my-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-around">
                {/* Simulated physical Chilean UOCT traffic light head */}
                <div className="w-14 bg-slate-900 border-2 border-slate-700 rounded-3xl p-2 flex flex-col gap-2 shadow-2xl items-center">
                  <div className={`w-8 h-8 rounded-full border border-slate-700 transition-all ${
                    selectedIntersection.currentColor === 'red' ? 'bg-rose-500 shadow-lg shadow-rose-500/50' : 'bg-rose-950/40 opacity-40'
                  }`}></div>
                  <div className={`w-8 h-8 rounded-full border border-slate-700 transition-all ${
                    selectedIntersection.currentColor === 'yellow' ? 'bg-amber-400 shadow-lg shadow-amber-400/50 animate-pulse' : 'bg-amber-950/40 opacity-40'
                  }`}></div>
                  <div className={`w-8 h-8 rounded-full border border-slate-700 transition-all ${
                    selectedIntersection.currentColor === 'green' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-emerald-950/40 opacity-40'
                  }`}></div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Tiempo restante en fase:</span>
                  <div className="text-4xl font-extrabold text-white font-mono mt-0.5 flex items-baseline gap-1">
                    <span>{selectedIntersection.secondsRemaining}</span>
                    <span className="text-sm font-semibold text-slate-500">seg</span>
                  </div>
                  <span className="text-[11px] text-slate-300 mt-1">
                    Duración verde ajustada: <b className="text-cyan-400">{selectedIntersection.currentGreenDuration}s</b>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    (Estándar fijo: {selectedIntersection.standardGreenDuration}s)
                  </span>
                </div>
              </div>

              {/* Adjustment Reason */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Motivo del ajuste algorítmico:</span>
                <p className="text-slate-300 italic">
                  "{selectedIntersection.lastCycleAdjustmentReason}"
                </p>
              </div>
            </div>

            {/* Operator Manual Override Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Intervención de Flujo y Atasco en 1-Clic:
              </span>

              {/* Prominent 1-Click Clear Jam Button */}
              <button
                onClick={() => clearIntersectionJam(selectedIntersection.id)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-900/30 border border-emerald-400/80 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ring-2 ring-emerald-400/50"
              >
                <span>🟢 1-CLIC: DESPEJAR ATASCO (Verde Inmediato)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => triggerFlowDirection('llegada')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-1 active:scale-95"
                  title="Flujo de llegada por Alameda y San Borja hacia terminales"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Flujo Llegada</span>
                </button>

                <button
                  onClick={() => triggerFlowDirection('salida')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 hover:border-amber-500/50 transition-all flex items-center justify-center gap-1 active:scale-95"
                  title="Flujo de salida por Souper y 5 de Abril hacia autopista"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Flujo Salida</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => forceTrafficLightState(selectedIntersection.id, 'green')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Abrir Verde (+40s)</span>
                </button>

                <button
                  onClick={() => forceTrafficLightState(selectedIntersection.id, 'red')}
                  className="px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-700/60 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Detener (Rojo)</span>
                </button>
              </div>

              <button
                onClick={() => injectTrafficIncident(selectedIntersection.name)}
                className="w-full py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-300 text-[11px] font-medium transition-all flex items-center justify-center gap-1 border border-slate-800"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Simular Bloqueo de Pista en este Cruce</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live UOCT Telemetry & Communication Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Registro de Interconexión en Tiempo Real (GPS Flotas ⇄ Servidores UOCT)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Protocolo NTCIP 1202 / SCATS API
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto font-mono text-xs pr-1">
          {uoctLogs.slice(0, 8).map(log => {
            const isPriority = log.action === 'PRIORIDAD_GPS_OTORGADA';
            const isWave = log.action === 'ONDA_VERDE_ACTIVADA';
            const isAlert = log.action === 'ALERTA_RIESGO';

            return (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-slate-500 text-[10px] shrink-0 mt-0.5">
                    [{log.timestamp}]
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        isPriority ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                        isWave ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        isAlert ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-white font-semibold text-[11px]">
                        {log.intersectionName}
                      </span>
                      {log.vehicleCompany && (
                        <span className="text-amber-400 text-[10px]">
                          ({log.vehicleCompany})
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-[11px] font-sans mt-0.5">
                      {log.details}
                    </p>
                  </div>
                </div>

                <span className="text-emerald-400 text-[10px] font-bold shrink-0 hidden sm:inline">
                  ACK 200 OK
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
