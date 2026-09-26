import React, { useState, useEffect } from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import { Header } from './components/Header';
import { BarrioTerminalesMap } from './components/Map/BarrioTerminalesMap';
import { PassengerView } from './components/Passenger/PassengerView';
import { TrafficLightDashboard } from './components/Uoct/TrafficLightDashboard';
import { OperationsCenter } from './components/ControlCenter/OperationsCenter';
import { TerminalDocksView } from './components/Docks/TerminalDocksView';
import { StopRiskModal } from './components/StopLayer/StopRiskModal';
import { VoiceAssistantModal } from './components/Accessibility/VoiceAssistantModal';
import { playEarcon } from './utils/audioUtils';
import { Map, LayoutDashboard, Maximize2, Minimize2, Radio, CheckCircle2, Volume2, Mic } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isVoiceAssistantOpen, 
    setIsVoiceAssistantOpen,
    isMapFullscreen,
    setIsMapFullscreen
  } = useTransit();
  const [mobileViewMode, setMobileViewMode] = useState<'both' | 'panel' | 'map'>('both');

  // Global accessibility key listener: press 'v' or 'V' for audio, 'm' or 'M' for fullscreen map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA';
      if (isInput) return;

      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setIsVoiceAssistantOpen(true);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMapFullscreen(!isMapFullscreen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsVoiceAssistantOpen, setIsMapFullscreen]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 relative">
      <Header />

      {/* Mobile view toggle */}
      <div className="lg:hidden flex items-center justify-center p-2 bg-slate-900 border-b border-slate-800 text-xs gap-2">
        <button
          onClick={() => setMobileViewMode('panel')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            mobileViewMode === 'panel' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 bg-slate-800'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Panel Informativo</span>
        </button>
        <button
          onClick={() => setMobileViewMode('map')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            mobileViewMode === 'map' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 bg-slate-800'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Mapa GPS en Vivo</span>
        </button>
        <button
          onClick={() => setMobileViewMode('both')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            mobileViewMode === 'both' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 bg-slate-800'
          }`}
        >
          <span>Dividido</span>
        </button>
      </div>

      {/* Main Container: Expands to full screen width when isMapFullscreen is active */}
      <main className={`flex-1 w-full mx-auto p-2 sm:p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden ${
        isMapFullscreen ? 'max-w-full h-[calc(100vh-80px)]' : 'max-w-7xl h-[calc(100vh-125px)]'
      }`}>
        {/* Left Column: Active tab content */}
        {(!isMapFullscreen && (mobileViewMode === 'panel' || mobileViewMode === 'both')) && (
          <section className={`${isVoiceAssistantOpen ? 'lg:col-span-12' : 'lg:col-span-6 xl:col-span-7'} flex flex-col h-full overflow-hidden transition-all duration-300`}>
            {activeTab === 'passenger' && <PassengerView />}
            {activeTab === 'uoct' && <TrafficLightDashboard />}
            {activeTab === 'control_center' && <OperationsCenter />}
            {activeTab === 'docks_capacity' && <TerminalDocksView />}
            {activeTab === 'stop_security' && <StopRiskModal />}
          </section>
        )}

        {/* Right Column: Live Interactive GPS Map - Hidden when Voice Assistant is active to avoid visual overlap */}
        {!isVoiceAssistantOpen && (isMapFullscreen || mobileViewMode === 'map' || mobileViewMode === 'both') && (
          <section className={`${isMapFullscreen ? 'lg:col-span-12' : 'lg:col-span-6 xl:col-span-5'} flex flex-col h-full relative transition-all duration-300`}>
            <BarrioTerminalesMap />
          </section>
        )}
      </main>

      {/* Floating High-Visibility Audio Assistant Button (Fixed Bottom-Right) - hidden when assistant modal is active */}
      {!isVoiceAssistantOpen && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => {
              playEarcon('open');
              setIsVoiceAssistantOpen(true);
            }}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-2xl border-2 border-yellow-200 transition-all transform hover:scale-105 active:scale-95 group"
            aria-label="Abrir asistente de audio y navegación por voz para personas ciegas (Tecla V)"
            title="Abrir Asistente de Audio para personas ciegas (Presiona tecla V)"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-950 text-yellow-400 flex items-center justify-center font-bold shadow-md group-hover:rotate-6 transition-transform">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="leading-tight font-extrabold text-xs sm:text-sm">Guía de Audio (Ciegos)</span>
              <span className="text-[10px] text-slate-900 font-semibold leading-none">Presiona Tecla "V"</span>
            </div>
          </button>
        </div>
      )}

      {/* Accessible Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <TransitProvider>
      <MainLayout />
    </TransitProvider>
  );
}
