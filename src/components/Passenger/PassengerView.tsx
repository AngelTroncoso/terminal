import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { 
  Compass, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Share2, 
  QrCode, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Bus, 
  Train, 
  Footprints, 
  AlertCircle,
  PhoneCall,
  UserCheck
} from 'lucide-react';

export const PassengerView: React.FC = () => {
  const {
    vehicles,
    selectedVehicleId,
    setSelectedVehicleId,
    terminals,
    pedestrianCorridors,
    trafficLights,
    requestEmergencyPriority,
    setActiveTab,
    setIsVoiceAssistantOpen
  } = useTransit();

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeIntermodalTab, setActiveIntermodalTab] = useState<'walk' | 'terminal' | 'uoct_link'>('walk');

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  const terminal = terminals.find(t => t.id === selectedVehicle?.terminalId);
  const targetTrafficLight = trafficLights.find(tl => tl.id === selectedVehicle?.targetTrafficLightId);

  // Filter vehicles for search
  const filteredTrips = vehicles.filter(v => 
    v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.serviceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.plate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aproximando':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Aproximando al Terminal</span>;
      case 'embarcando':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> En Andén · Embarcando</span>;
      case 'en_salida_cuadrante':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> Despachado · Saliendo</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full text-xs font-semibold">En Tránsito</span>;
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1">
      {/* Top Banner / Passenger Title */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-950/60 to-slate-900/90 border border-blue-800/40 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Seguimiento GPS en Tiempo Real · Solución Uber Pasajeros</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Mi Viaje Interconectado (Barrio Terminales & EFE Trenes)
          </h2>
          <p className="text-xs text-slate-300">
            Unificamos la información de GPS para que sepas con exactitud dónde viene tu bus o tren, andén de abordaje y semáforos coordinados.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all shadow-md"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Ver Pasaje QR</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{copiedShare ? '¡Link Copiado!' : 'Compartir Viaje'}</span>
          </button>
        </div>
      </div>

      {/* Accessible Audio & Voice Guide for Blind Passengers */}
      <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-slate-900 border-2 border-yellow-400/60 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center text-xl font-bold shadow-lg shrink-0">
            🎙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-yellow-300">
                Accesibilidad Universal · Asistente de Audio en Vivo
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-yellow-200 border border-yellow-400/40">
                Tecla V
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">
              ¿Requieres guía por voz o eres persona ciega?
            </h3>
            <p className="text-xs text-slate-300">
              Presiona para activar a <b>Luz Guía</b>: te describe tu andén, distancia, huellas podotáctiles y si el semáforo emite pitido sonoro para cruzar.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsVoiceAssistantOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-yellow-400/20 border-2 border-white shrink-0 transition-transform hover:scale-105"
          aria-label="Iniciar asistente de voz accesible"
        >
          <span>Activar Asistente de Audio</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
        </button>
      </div>

      {/* Trip Switcher / Quick Search */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Bus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Selecciona tu viaje activo o busca servicio:</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {filteredTrips.length} servicios con GPS en vivo
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
          {vehicles.slice(0, 4).map(veh => {
            const isSelected = veh.id === selectedVehicle?.id;
            const isTrain = veh.vehicleType === 'tren_efe';
            return (
              <button
                key={veh.id}
                onClick={() => setSelectedVehicleId(veh.id)}
                className={`flex flex-col text-left p-2.5 rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-blue-950/80 border-cyan-500 shadow-md ring-1 ring-cyan-400' 
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="flex items-center gap-1 text-white">
                    {isTrain ? '🚆' : '🚌'} {veh.serviceNumber}
                  </span>
                  <span className={`text-[10px] font-mono font-semibold px-1 rounded ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-slate-200'}`}>
                    {veh.etaMinutes} min
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-1">
                  {veh.destination}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Trip Card (Uber Passenger Experience) */}
      {selectedVehicle && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
          {/* Accent glow top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-500"></div>

          {/* Header info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-2xl shadow-lg border border-cyan-400/30">
                {selectedVehicle.vehicleType === 'tren_efe' ? '🚆' : '🚌'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {selectedVehicle.company} · {selectedVehicle.serviceNumber}
                  </h3>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                    {selectedVehicle.plate}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>Conductor: <b className="text-slate-200">{selectedVehicle.driverName}</b></span>
                  <span>·</span>
                  <span className="text-amber-400 font-semibold">★ {selectedVehicle.driverRating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {getStatusBadge(selectedVehicle.status)}
            </div>
          </div>

          {/* Huge Uber-like ETA & Live Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Tiempo Estimado de Llegada (ETA)
              </span>
              <div className="text-3xl font-extrabold text-cyan-400 tracking-tight flex items-baseline gap-1 mt-0.5">
                <span>{selectedVehicle.etaMinutes}</span>
                <span className="text-sm font-semibold text-slate-400">minutos</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> GPS Sincronizado vía Satélite
              </span>
              {selectedVehicle.currentStreetName && (
                <div className="text-[10px] text-cyan-300 font-semibold mt-1 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">Vía OSM: {selectedVehicle.currentStreetName}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col border-y sm:border-y-0 sm:border-x border-slate-800/80 py-2 sm:py-0 sm:px-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Andén y Terminal Asignado
              </span>
              <div className="text-xl font-bold text-white tracking-tight mt-0.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>{selectedVehicle.assignedDock}</span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                {terminal?.name || 'Barrio Terminales'}
              </span>
            </div>

            <div className="flex flex-col sm:pl-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Velocidad & Telemetría
              </span>
              <div className="text-xl font-bold text-emerald-400 font-mono tracking-tight mt-0.5">
                {selectedVehicle.speedKmH} km/h
              </div>
              <span className="text-[11px] text-slate-400 truncate mt-0.5">
                Ocupación: {selectedVehicle.passengerCount} / {selectedVehicle.maxCapacity} pasajeros
              </span>
            </div>
          </div>

          {/* Route Stepper (Uber progress visual) */}
          <div className="my-5 px-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Trayecto en Vivo
            </div>
            <div className="relative flex items-center justify-between">
              {/* Progress track */}
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
              <div 
                className="absolute top-1/2 left-4 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${selectedVehicle.currentWaypointIndex === 0 ? '15%' : selectedVehicle.currentWaypointIndex === 1 ? '50%' : '90%'}` }}
              ></div>

              {/* Waypoints */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-xs text-white shadow-lg">
                  📍
                </div>
                <span className="text-[11px] font-bold text-white mt-1.5 max-w-[90px] text-center leading-tight">
                  {selectedVehicle.origin.split('(')[0]}
                </span>
                <span className="text-[9px] text-slate-400">{selectedVehicle.departureTime}</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-sm shadow-xl animate-pulse">
                  {selectedVehicle.vehicleType === 'tren_efe' ? '🚆' : '🚌'}
                </div>
                <span className="text-[11px] font-bold text-cyan-300 mt-1.5 max-w-[120px] text-center leading-tight">
                  Cuadrante Barrio Terminales
                </span>
                <span className="text-[9px] text-emerald-400 font-semibold">En tiempo real</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-xs text-slate-300">
                  🏁
                </div>
                <span className="text-[11px] font-bold text-slate-300 mt-1.5 max-w-[90px] text-center leading-tight">
                  {selectedVehicle.destination.split('(')[0]}
                </span>
                <span className="text-[9px] text-slate-400">Destino final</span>
              </div>
            </div>
          </div>

          {/* Department of Traffic Lights Connection Card for this vehicle */}
          <div className="mt-4 p-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                    Interconexión UOCT Semáforos Cuadrante
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    Sincronizado
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Próxima intersección: <b className="text-white">{targetTrafficLight?.name || 'Alameda con Ruiz Tagle'}</b>.
                  {targetTrafficLight?.currentColor === 'green' ? (
                    <span className="text-emerald-400 font-semibold ml-1">Luz verde activa ({targetTrafficLight.secondsRemaining}s) para paso prioritario.</span>
                  ) : (
                    <span className="text-amber-400 font-semibold ml-1">Semáforo adaptando fase para liberar el bus en {targetTrafficLight?.secondsRemaining}s.</span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                requestEmergencyPriority(selectedVehicle.id);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Pedir Prioridad UOCT</span>
            </button>
          </div>

          {/* Multimodal Walking Corridors from Train/Metro to Terminals */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Footprints className="w-4 h-4 text-cyan-400" />
                <span>Interconexión Peatonal Segura (Trenes EFE ➔ Terminales)</span>
              </div>
              <button
                onClick={() => setActiveTab('control_center')}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Ver plano logístico</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {pedestrianCorridors.map(corr => (
                <div
                  key={corr.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-1">
                      <span className="truncate">{corr.toName}</span>
                      <span className="text-cyan-400 font-mono text-[11px] shrink-0">
                        {corr.walkMinutes} min
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      Desde: {corr.fromName}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3 h-3" /> Seguro e Iluminado
                    </span>
                    <span>·</span>
                    <span>{corr.distanceMeters}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QR Ticket Modal */}
      {showQrModal && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-3">
                <QrCode className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Pase de Abordaje Digital
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Válido para acceso directo a torniquetes y andenes en Barrio Terminales.
              </p>
            </div>

            <div className="my-5 bg-white p-4 rounded-2xl flex flex-col items-center justify-center shadow-inner">
              {/* High fidelity simulated QR code */}
              <div className="w-44 h-44 bg-slate-950 rounded-xl p-2.5 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-10 h-10 border-4 border-cyan-400 bg-white p-1.5"><div className="w-full h-full bg-cyan-600"></div></div>
                  <div className="w-10 h-10 border-4 border-cyan-400 bg-white p-1.5"><div className="w-full h-full bg-cyan-600"></div></div>
                </div>
                <div className="text-center font-mono text-[9px] text-cyan-400 tracking-widest font-bold">
                  EFE · TERMINALES · GPS
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-10 h-10 border-4 border-cyan-400 bg-white p-1.5"><div className="w-full h-full bg-cyan-600"></div></div>
                  <div className="text-[8px] font-mono text-white text-right leading-tight">
                    {selectedVehicle.serviceNumber}<br/>{selectedVehicle.assignedDock}
                  </div>
                </div>
              </div>
              <div className="text-slate-800 font-mono text-xs font-bold mt-2">
                BOL-{selectedVehicle.plate}-{selectedVehicle.serviceNumber}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex flex-col gap-1 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Servicio:</span>
                <span className="font-semibold text-white">{selectedVehicle.company} ({selectedVehicle.serviceNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Andén:</span>
                <span className="font-semibold text-cyan-400">{selectedVehicle.assignedDock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hora Salida:</span>
                <span className="font-semibold text-white">{selectedVehicle.departureTime} hrs</span>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-lg"
            >
              Listo · Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
