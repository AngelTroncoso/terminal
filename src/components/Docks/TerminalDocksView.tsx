import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { TerminalId, DockInfo } from '../../types/transit';
import { 
  Building2, 
  Bus, 
  Train, 
  Users, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  Compass, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export const TerminalDocksView: React.FC = () => {
  const {
    terminals,
    vehicles,
    selectedTerminalId,
    setSelectedTerminalId,
    setSelectedVehicleId,
    getTerminalOccupancy,
    clearTerminalDockJam,
    isRushHour
  } = useTransit();

  const [activeTerminalId, setActiveTerminalId] = useState<TerminalId>(
    (selectedTerminalId as TerminalId) || 'terminal_alameda'
  );
  const [dockFilter, setDockFilter] = useState<'all' | 'occupied' | 'available' | 'approaching'>('all');

  const summary = getTerminalOccupancy(activeTerminalId);
  const activeTerminal = terminals.find(t => t.id === activeTerminalId) || terminals[0];
  const isTrainTerminal = activeTerminalId === 'estacion_trenes_efe';

  const filteredDocks = summary.docks.filter(d => {
    if (dockFilter === 'occupied') return d.status === 'ocupado';
    if (dockFilter === 'available') return d.status === 'libre';
    if (dockFilter === 'approaching') return d.status === 'reservado_aproximando';
    return true;
  });

  // Calculate buses on General Velásquez corridor for this terminal
  const velasquezVehicles = vehicles.filter(v => 
    v.terminalId === activeTerminalId && 
    v.corridorType && 
    v.corridorType.includes('velasquez')
  );

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
      {/* Top Banner: Real-time Dock Telemetry & Capacity */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-700/40 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Telemetría de Andenes & Dársenas GPS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                Conteo en Tiempo Real
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <span>Control de Capacidad y Ocupación de Andenes</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              Supervisión de andenes activos, conteo de buses dentro de cada terminal, tiempos de permanencia, embarque de pasajeros y flujos concurrentes por Autopista General Velásquez y avenidas troncales.
            </p>
          </div>

          {/* Quick Action: Expedite Terminal Docks */}
          <button
            onClick={() => clearTerminalDockJam(activeTerminalId)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-900/40 border border-emerald-400/80 active:scale-95 transition-all self-start md:self-auto cursor-pointer"
            title="Despachar buses con embarque listo hacia las vías de salida para liberar andenes"
          >
            <Zap className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span>1-Clic: Despachar & Liberar Andenes</span>
          </button>
        </div>

        {/* Terminal Selection Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800">
          {terminals.slice(0, 4).map(term => {
            const isSelected = term.id === activeTerminalId;
            const termSummary = getTerminalOccupancy(term.id);

            return (
              <button
                key={term.id}
                onClick={() => {
                  setActiveTerminalId(term.id);
                  setSelectedTerminalId(term.id);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate">{term.shortName}</span>
                  <span className="text-sm">{term.id === 'estacion_trenes_efe' ? '🚆' : '🏢'}</span>
                </div>
                <div className="flex items-baseline justify-between mt-1.5">
                  <span className="text-[11px] text-slate-400">Ocupación:</span>
                  <span className={`text-xs font-mono font-extrabold ${
                    termSummary.occupancyRatePercent > 75 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {termSummary.occupiedDocks} / {termSummary.totalMonitoredDocks}
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      termSummary.occupancyRatePercent > 75 ? 'bg-rose-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${termSummary.occupancyRatePercent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Terminal Live KPIs Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              {isTrainTerminal ? 'Trenes en Andén' : 'Buses Dentro del Terminal'}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{summary.occupiedDocks}</span>
            <span className="text-xs text-slate-400 font-semibold font-mono">/ {summary.totalMonitoredDocks} andenes</span>
          </div>
          <span className="text-[11px] text-rose-300 font-medium mt-1">
            {summary.occupancyRatePercent}% de ocupación actual
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Andenes Disponibles
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">{summary.availableDocks}</span>
            <span className="text-xs text-slate-400 font-semibold font-mono">libres</span>
          </div>
          <span className="text-[11px] text-emerald-300 font-medium mt-1">
            Listos para recepción inmediata
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Próximas Llegadas
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300 font-mono">{summary.approachingCount}</span>
            <span className="text-xs text-slate-400 font-semibold font-mono">en camino</span>
          </div>
          <span className="text-[11px] text-amber-200 font-medium mt-1">
            ETA estimado: 1 a 5 min
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Corredor Gral. Velásquez
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-sky-400 font-mono">{velasquezVehicles.length}</span>
            <span className="text-xs text-slate-400 font-semibold font-mono">flotas</span>
          </div>
          <span className="text-[11px] text-sky-300 font-medium mt-1">
            Subiendo & bajando por autopista
          </span>
        </div>
      </div>

      {/* Dock Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setDockFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dockFilter === 'all' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos los Andenes ({summary.totalMonitoredDocks})
          </button>
          <button
            onClick={() => setDockFilter('occupied')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dockFilter === 'occupied' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>Ocupados ({summary.occupiedDocks})</span>
          </button>
          <button
            onClick={() => setDockFilter('available')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dockFilter === 'available' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Disponibles ({summary.availableDocks})</span>
          </button>
          <button
            onClick={() => setDockFilter('approaching')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dockFilter === 'approaching' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Próximas Llegadas ({summary.approachingCount})</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 px-2 font-mono flex items-center gap-1.5">
          <span>Capacidad Física Máxima:</span>
          <b className="text-white">{summary.capacityPhysicalDocks} andenes</b>
        </div>
      </div>

      {/* Docks Interactive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {filteredDocks.map((dock) => {
          const veh = dock.currentVehicle;
          const appVeh = dock.approachingVehicle;

          return (
            <div
              key={dock.dockNumber}
              className={`p-3 rounded-2xl border transition-all shadow-md flex flex-col justify-between ${
                dock.status === 'ocupado'
                  ? 'bg-slate-900/95 border-rose-500/50 hover:border-rose-400'
                  : dock.status === 'reservado_aproximando'
                  ? 'bg-slate-900/90 border-amber-500/40 hover:border-amber-400'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-emerald-500/40'
              }`}
            >
              <div>
                {/* Header: Dock Number + Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-white">
                      {dock.dockLabel}
                    </span>
                    {dock.status === 'ocupado' && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    )}
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      dock.status === 'ocupado'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : dock.status === 'reservado_aproximando'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {dock.status === 'ocupado'
                      ? 'Ocupado'
                      : dock.status === 'reservado_aproximando'
                      ? 'Próximo'
                      : 'Disponible'}
                  </span>
                </div>

                {/* Details based on status */}
                {dock.status === 'ocupado' && veh && (
                  <div className="mt-2.5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <b className="text-cyan-300 font-extrabold truncate">{veh.company}</b>
                      <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                        {veh.plate}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-300">
                      <span className="text-slate-500">Destino:</span>
                      <span className="font-semibold text-white truncate">{veh.destination}</span>
                    </div>

                    {/* Boarding Progress Bar */}
                    <div className="mt-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Embarque ({veh.passengerCount}/{veh.maxCapacity} pax)</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {Math.round((veh.passengerCount / veh.maxCapacity) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                          style={{ width: `${(veh.passengerCount / veh.maxCapacity) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 mt-0.5 border-t border-slate-800/80">
                      <span>Salida estimada:</span>
                      <b className="text-amber-300 font-mono">{veh.departureTime} hrs</b>
                    </div>
                  </div>
                )}

                {dock.status === 'reservado_aproximando' && appVeh && (
                  <div className="mt-2.5 flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <b className="text-amber-300 truncate">{appVeh.company}</b>
                      <span className="font-mono text-[10px] text-slate-400">{appVeh.plate}</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <span className="text-slate-500">Origen:</span> {appVeh.origin}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-amber-400 bg-amber-950/40 p-1.5 rounded-lg border border-amber-800/40 font-semibold">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>ETA a andén: {appVeh.etaMinutes} min</span>
                    </div>
                  </div>
                )}

                {dock.status === 'libre' && (
                  <div className="mt-3 py-3 flex flex-col items-center justify-center text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400/80 mb-1" />
                    <span className="text-xs font-bold text-slate-300">Andén Libre</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Listo para recepción</span>
                  </div>
                )}
              </div>

              {/* Footer action button */}
              {veh && (
                <button
                  onClick={() => setSelectedVehicleId(veh.id)}
                  className="mt-3 w-full py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold transition-all border border-slate-700/60 flex items-center justify-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>Ubicar en Mapa GPS</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
