import React from 'react';
import { useTransit } from '../context/TransitContext';
import { 
  Bus, 
  Cpu, 
  Building2, 
  ShieldAlert, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Flame, 
  Radio, 
  MapPin, 
  Search,
  Train,
  Maximize2,
  Minimize2,
  Layers
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    simulationSpeed,
    setSimulationSpeed,
    isRushHour,
    toggleRushHour,
    resetSimulation,
    activeFilterCompany,
    setActiveFilterCompany,
    isVoiceAssistantOpen,
    setIsVoiceAssistantOpen,
    isMapFullscreen,
    setIsMapFullscreen,
    kpis,
    vehicles
  } = useTransit();

  return (
    <header className="bg-slate-950/95 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 px-4 py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Smart City Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-cyan-600/20 border border-cyan-400/40">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                INTERCONECTA <span className="text-cyan-400">TERMINALES</span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
                UOCT GPS v2.6
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">
              Barrio Terminales · EFE Estación Central · Depto. de Semáforos de Chile
            </p>
          </div>
        </div>

        {/* Center: Main View Tabs & Audio Accessibility Trigger */}
        <div className="flex items-center gap-2 overflow-x-auto self-stretch md:self-auto py-0.5">
          <nav className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('passenger')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === 'passenger'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Pasajero (Tipo Uber)</span>
            </button>

            <button
              onClick={() => setActiveTab('uoct')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === 'uoct'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Semáforos UOCT</span>
            </button>

            <button
              onClick={() => setActiveTab('control_center')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === 'control_center'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Centro de Control</span>
            </button>

            <button
              onClick={() => setActiveTab('docks_capacity')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === 'docks_capacity'
                  ? 'bg-purple-600 text-white shadow-md ring-1 ring-purple-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Monitoreo de andenes y conteo de buses dentro de cada terminal"
            >
              <Layers className="w-3.5 h-3.5 text-purple-300" />
              <span>Andenes & Capacidad</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30">
                {vehicles.filter(v => v.isInsideTerminal || v.status === 'en_anden' || v.status === 'embarcando').length} en andén
              </span>
            </button>

            <button
              onClick={() => setActiveTab('stop_security')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === 'stop_security'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>STOP Carabineros</span>
            </button>
          </nav>

          {/* Toggle Fullscreen / Vista Completa del Mapa */}
          <button
            onClick={() => setIsMapFullscreen(!isMapFullscreen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all whitespace-nowrap border shrink-0 ${
              isMapFullscreen
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-300 shadow-cyan-500/30 ring-2 ring-cyan-400/40'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-cyan-500/50 hover:border-cyan-400'
            }`}
            title={isMapFullscreen ? 'Volver a vista dividida con panel de información' : 'Expandir mapa GPS a vista completa sin columnas'}
          >
            {isMapFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-slate-950" /> : <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isMapFullscreen ? 'Dividir Vista' : '🗺️ Vista Completa'}</span>
          </button>

          {/* Accessible Voice Assistant Button */}
          <button
            onClick={() => setIsVoiceAssistantOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 border-2 border-yellow-300 shrink-0 transition-transform hover:scale-105"
            aria-label="Abrir Asistente de Audio para personas ciegas (Tecla V)"
            title="Asistente de Audio por Voz para personas ciegas (Presiona tecla V)"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping"></span>
            <span>Voz & Guía Ciegos</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded font-mono">V</span>
          </button>
        </div>

        {/* Right: Simulation Controls & Filters */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Company filter */}
          <div className="hidden lg:flex items-center text-xs bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
            <span className="text-[10px] text-slate-500 mr-1.5 font-semibold">Flota:</span>
            <select
              value={activeFilterCompany}
              onChange={e => setActiveFilterCompany(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">Todas las flotas</option>
              <option value="turbus" className="bg-slate-900">TurBus (Terminal Alameda)</option>
              <option value="pullman" className="bg-slate-900">Pullman Bus (Term. Sur/Alameda)</option>
              <option value="efe" className="bg-slate-900">EFE Trenes (Nos / Melipilla)</option>
              <option value="rural" className="bg-slate-900">Rurales (San Borja / Talagante)</option>
            </select>
          </div>

          {/* Speed & Sim Controls */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setSimulationSpeed(simulationSpeed === 0 ? 1 : 0)}
              className={`p-1.5 rounded-md ${simulationSpeed === 0 ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title={simulationSpeed === 0 ? 'Reanudar simulación GPS' : 'Pausar simulación'}
            >
              {simulationSpeed === 0 ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 2 : simulationSpeed === 2 ? 5 : 1)}
              className="px-2 py-1 text-[11px] font-mono font-bold text-slate-300 hover:text-cyan-400 transition-colors"
              title="Acelerar simulación (1x, 2x, 5x)"
            >
              {simulationSpeed}x
            </button>

            <button
              onClick={resetSimulation}
              className="p-1.5 rounded-md text-slate-400 hover:text-white"
              title="Restablecer simulación"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
