import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useTransit } from '../../context/TransitContext';
import { BARRIO_TERMINALES_ZONES, BARRIO_TERMINALES_STREET_LABELS } from '../../data/mockData';
import { 
  Navigation, 
  ShieldAlert, 
  Cpu, 
  Layers, 
  Maximize2, 
  Minimize2, 
  LocateFixed, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Radio, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  SlidersHorizontal,
  Info,
  X,
  Bus,
  Clock,
  User,
  Gauge,
  Signal,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Check
} from 'lucide-react';

type ActionDrawer = 'none' | 'trip' | 'uoct' | 'fleet' | 'stop' | 'layers';

export const BarrioTerminalesMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vehicleMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const trafficLightMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routePolylinesRef = useRef<L.Polyline[]>([]);
  const corridorPolylinesRef = useRef<L.Polyline[]>([]);
  const riskMarkersRef = useRef<L.CircleMarker[]>([]);
  const zoneLayersRef = useRef<L.Layer[]>([]);
  const streetLabelMarkersRef = useRef<L.Marker[]>([]);

  const {
    vehicles,
    trafficLights,
    terminals,
    pedestrianCorridors,
    stopRiskPoints,
    selectedVehicleId,
    setSelectedVehicleId,
    selectedTrafficLightId,
    setSelectedTrafficLightId,
    setSelectedTerminalId,
    activeFilterCompany,
    setActiveFilterCompany,
    triggerGreenWave,
    forceTrafficLightState,
    toggleTrafficLight,
    triggerFlowDirection,
    clearIntersectionJam,
    isMapFullscreen,
    setIsMapFullscreen,
    getTerminalOccupancy,
    setActiveTab
  } = useTransit();

  const [showBarrioTerminalesZone, setShowBarrioTerminalesZone] = useState(true);
  const [showStreetLabels, setShowStreetLabels] = useState(true);
  const [showGranBarrioZone, setShowGranBarrioZone] = useState(true);
  const [showTrafficLights, setShowTrafficLights] = useState(true);
  const [showPedestrianCorridors, setShowPedestrianCorridors] = useState(true);
  const [showStopRiskLayer, setShowStopRiskLayer] = useState(true);
  const [mapTileTheme, setMapTileTheme] = useState<'osm' | 'dark' | 'voyager'>('voyager');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dotSize, setDotSize] = useState<'compact' | 'standard' | 'large'>('compact');
  
  // Collapsible action drawer so map isn't cluttered and user can inspect details on demand
  const [activeDrawer, setActiveDrawer] = useState<ActionDrawer>('none');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 4000);
  };

  // Expose 1-click action triggers for Leaflet popup HTML buttons
  useEffect(() => {
    (window as any).toggleTlState = (id: string) => {
      toggleTrafficLight(id);
      const tl = trafficLights.find(t => t.id === id);
      const nextColor = tl?.currentColor === 'green' ? 'ROJO' : 'VERDE';
      showToast(`🚦 ${tl?.name || id}: Fase cambiada a ${nextColor}.`);
    };

    (window as any).clearJamState = (id: string) => {
      clearIntersectionJam(id);
      const tl = trafficLights.find(t => t.id === id);
      showToast(`🟢 Cruce ${tl?.name || id} despejado en 1-Clic: Semáforo en VERDE y cola liberada.`);
    };

    (window as any).triggerFlowState = (flow: 'llegada' | 'salida') => {
      triggerFlowDirection(flow);
      showToast(flow === 'llegada'
        ? '🟢 Flujo de LLEGADA activado: Eje Alameda en VERDE para ingreso continuo a terminales.'
        : '🟢 Flujo de SALIDA activado: Ejes 5 de Abril y Souper en VERDE para evacuación hacia autopista.');
    };

    (window as any).openTerminalDocks = (termId: string) => {
      setSelectedTerminalId(termId);
      setActiveTab('docks_capacity');
    };

    return () => {
      delete (window as any).toggleTlState;
      delete (window as any).clearJamState;
      delete (window as any).triggerFlowState;
      delete (window as any).openTerminalDocks;
    };
  }, [toggleTrafficLight, clearIntersectionJam, triggerFlowDirection, trafficLights, setSelectedTerminalId, setActiveTab]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered around Barrio Terminales - Estación Central, Santiago
    const map = L.map(mapContainerRef.current, {
      center: [-33.4545, -70.6865],
      zoom: 15,
      minZoom: 13,
      maxZoom: 19,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate map size when fullscreen changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [isMapFullscreen]);

  // Update Tile Layer with valid subdomains to eliminate gray tiles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let subdomains: string | string[] = 'abcd';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

    if (mapTileTheme === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      subdomains = 'abcd';
    } else if (mapTileTheme === 'osm') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      subdomains = 'abc'; // OpenStreetMap only has a, b, c
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }

    const tileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
      subdomains,
      crossOrigin: true
    });

    tileLayer.addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [mapTileTheme]);

  // Render Terminals (Polygons, Real-time Occupancy Badge and Interactive Markers)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const terminalLayers: L.Layer[] = [];

    terminals.forEach(terminal => {
      const occ = getTerminalOccupancy(terminal.id);

      const areaCircle = L.circle([terminal.lat, terminal.lng], {
        radius: terminal.id === 'estacion_trenes_efe' ? 95 : 75,
        color: terminal.color,
        fillColor: terminal.color,
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '4, 4'
      }).addTo(map);

      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute -inset-1 rounded-xl bg-opacity-30 blur-sm transition-all" style="background-color: ${terminal.color}"></div>
          <div class="relative px-2.5 py-1.5 rounded-xl shadow-xl border border-slate-700 bg-slate-900/95 text-white flex flex-col gap-0.5 backdrop-blur-md min-w-[130px]">
            <div class="flex items-center justify-between gap-1.5">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full" style="background-color: ${terminal.color}"></span>
                <span class="text-[10px] font-black tracking-tight text-white leading-tight">${terminal.shortName}</span>
              </div>
              <span class="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-300 font-bold">${terminal.badge}</span>
            </div>
            <div class="flex items-center justify-between text-[9px] pt-1 border-t border-slate-800">
              <span class="text-slate-400">En andén:</span>
              <span class="font-mono font-black ${occ.occupancyRatePercent > 75 ? 'text-rose-400' : 'text-emerald-400'}">
                ${occ.occupiedDocks} / ${occ.totalMonitoredDocks}
              </span>
            </div>
            <div class="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full ${occ.occupancyRatePercent > 75 ? 'bg-rose-500' : 'bg-cyan-400'}" style="width: ${occ.occupancyRatePercent}%"></div>
            </div>
          </div>
        </div>
      `;

      const marker = L.marker([terminal.lat, terminal.lng], {
        icon: L.divIcon({
          className: 'terminal-marker',
          html: iconHtml,
          iconSize: [130, 46],
          iconAnchor: [65, 23]
        })
      }).addTo(map);

      marker.on('click', () => {
        setSelectedTerminalId(terminal.id);
      });

      marker.bindPopup(`
        <div class="p-2 text-slate-900 font-sans text-xs min-w-[210px]">
          <div class="flex items-center justify-between font-bold text-sm text-slate-950 mb-0.5">
            <span>${terminal.name}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded text-white font-bold" style="background-color: ${terminal.color}">${terminal.badge}</span>
          </div>
          <div class="text-[11px] text-slate-600 mb-1.5">${terminal.address}</div>
          
          <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-2 mb-2">
            <div class="flex items-center justify-between text-[11px] font-bold text-indigo-950 mb-1">
              <span>Capacidad de Andenes en Vivo</span>
              <span class="px-1.5 py-0.2 rounded font-mono text-[10px] ${occ.occupancyRatePercent > 75 ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'}">
                ${occ.occupancyRatePercent}% Ocupado
              </span>
            </div>
            <div class="grid grid-cols-3 gap-1 text-[10px] text-slate-700 font-medium text-center">
              <div class="bg-white p-1 rounded border border-indigo-100">
                <span class="block text-slate-400 text-[9px]">Dentro</span>
                <b class="text-rose-600 text-xs">${occ.occupiedDocks} buses</b>
              </div>
              <div class="bg-white p-1 rounded border border-indigo-100">
                <span class="block text-slate-400 text-[9px]">Libres</span>
                <b class="text-emerald-600 text-xs">${occ.availableDocks}</b>
              </div>
              <div class="bg-white p-1 rounded border border-indigo-100">
                <span class="block text-slate-400 text-[9px]">Llegadas</span>
                <b class="text-amber-600 text-xs">${occ.approachingCount}</b>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-1 text-[10px] bg-slate-100 p-1.5 rounded mb-2">
            <div><span class="font-semibold">Andenes Totales:</span> ${terminal.capacityDocks}</div>
            <div><span class="font-semibold">Salidas/día:</span> ${terminal.activeDepartures}</div>
            <div class="col-span-2"><span class="font-semibold">Pasajeros/día:</span> ${terminal.dailyPassengers.toLocaleString()}</div>
          </div>

          <button onclick="window.openTerminalDocks('${terminal.id}')" class="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow cursor-pointer">
            <span>Ver Andenes & Capacidad en Vivo ➔</span>
          </button>
        </div>
      `);

      terminalLayers.push(areaCircle);
      terminalLayers.push(marker);
    });

    return () => {
      terminalLayers.forEach(l => map.removeLayer(l));
    };
  }, [terminals, vehicles, setSelectedTerminalId, setActiveTab, getTerminalOccupancy]);

  // Render Official Barrio Terminales Polygons (Verde Oficial) & Sector Highlights
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    zoneLayersRef.current.forEach(layer => map.removeLayer(layer));
    zoneLayersRef.current = [];

    if (!showBarrioTerminalesZone) return;

    BARRIO_TERMINALES_ZONES.forEach(zone => {
      if (zone.type === 'gran_barrio_terminales' && !showGranBarrioZone) return;

      const isCoreVerde = zone.type === 'core_cuadrante_verde';

      // Halo for the green core polygon
      if (isCoreVerde) {
        const glowOutline = L.polyline(zone.coordinates, {
          color: '#34d399',
          weight: 8,
          opacity: 0.35,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
        zoneLayersRef.current.push(glowOutline);

        // Center badge for Cuadrante Verde
        const centerMarker = L.marker([-33.4554, -70.6892], {
          icon: L.divIcon({
            className: 'cuadrante-badge',
            html: `
              <div class="px-2.5 py-1 rounded-xl bg-slate-950/95 border-2 border-emerald-400 text-emerald-300 font-extrabold text-[10px] shadow-2xl flex items-center gap-1.5 whitespace-nowrap pointer-events-auto backdrop-blur-md">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>BARRIO TERMINALES (Cuadrante Núcleo)</span>
              </div>
            `,
            iconSize: [220, 26],
            iconAnchor: [110, 13]
          })
        }).addTo(map);
        zoneLayersRef.current.push(centerMarker);
      }

      // Polygon layer
      const polygon = L.polygon(zone.coordinates, {
        color: zone.color,
        weight: zone.weight,
        fillColor: zone.fillColor,
        fillOpacity: zone.fillOpacity,
        dashArray: zone.dashArray,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      polygon.bindTooltip(`
        <div class="p-1 font-sans text-xs">
          <div class="font-bold text-slate-950 flex items-center gap-1">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${zone.color}"></span>
            <span>${zone.name}</span>
          </div>
          <div class="text-[11px] text-slate-700 mt-0.5">${zone.description}</div>
        </div>
      `, {
        permanent: false,
        direction: 'top',
        className: 'custom-tooltip'
      });

      polygon.bindPopup(`
        <div class="p-2 font-sans text-slate-900 text-xs">
          <div class="font-bold text-sm text-slate-950 mb-1 flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full" style="background-color: ${zone.color}"></span>
            <span>${zone.name}</span>
          </div>
          <p class="text-[11px] text-slate-700 mb-2">${zone.description}</p>
          <div class="bg-emerald-50 border border-emerald-200 text-emerald-950 p-2 rounded text-[10px] space-y-1">
            <div><b>Límite Norte:</b> Av. Libertador Bernardo O'Higgins (Alameda)</div>
            <div><b>Límite Poniente:</b> Autopista General Velásquez</div>
            <div><b>Límite Sur:</b> Av. 5 de Abril (Calle Arica en polígono extendido)</div>
            <div><b>Límite Oriente:</b> Calle Jotabeche (San Borja / EFE en polígono extendido)</div>
          </div>
        </div>
      `);

      zoneLayersRef.current.push(polygon);
    });

    return () => {
      zoneLayersRef.current.forEach(layer => map.removeLayer(layer));
      zoneLayersRef.current = [];
    };
  }, [showBarrioTerminalesZone, showGranBarrioZone]);

  // Render Official Street Labels along the quadrant borders
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    streetLabelMarkersRef.current.forEach(m => map.removeLayer(m));
    streetLabelMarkersRef.current = [];

    if (!showStreetLabels || !showBarrioTerminalesZone) return;

    BARRIO_TERMINALES_STREET_LABELS.forEach(label => {
      const marker = L.marker([label.lat, label.lng], {
        icon: L.divIcon({
          className: 'street-label-marker',
          html: `
            <div class="px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-700 shadow-md text-[9px] font-bold text-slate-200 whitespace-nowrap pointer-events-none flex items-center gap-1 backdrop-blur-sm tracking-tight">
              <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${label.color || '#94a3b8'}"></span>
              <span>${label.name}</span>
            </div>
          `,
          iconSize: [120, 18],
          iconAnchor: [60, 9]
        })
      }).addTo(map);

      streetLabelMarkersRef.current.push(marker);
    });

    return () => {
      streetLabelMarkersRef.current.forEach(m => map.removeLayer(m));
      streetLabelMarkersRef.current = [];
    };
  }, [showStreetLabels, showBarrioTerminalesZone]);

  // Render Pedestrian Corridors
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    corridorPolylinesRef.current.forEach(p => map.removeLayer(p));
    corridorPolylinesRef.current = [];

    if (!showPedestrianCorridors) return;

    pedestrianCorridors.forEach(corridor => {
      // Glow underlay
      const glowPolyline = L.polyline(corridor.path, {
        color: '#22d3ee',
        weight: 7,
        opacity: 0.35,
        lineCap: 'round'
      }).addTo(map);
      corridorPolylinesRef.current.push(glowPolyline);

      // Core dashed line
      const polyline = L.polyline(corridor.path, {
        color: '#0891b2',
        weight: 4,
        opacity: 0.95,
        dashArray: '6, 8',
        lineCap: 'round'
      }).addTo(map);

      polyline.bindTooltip(`🚶 <b>${corridor.name}</b><br/>${corridor.distanceMeters}m · ${corridor.walkMinutes} min a pie · Huella Podotáctil & Cruces Accesibles`, {
        permanent: false,
        direction: 'top',
        className: 'custom-tooltip'
      });

      corridorPolylinesRef.current.push(polyline);
    });
  }, [pedestrianCorridors, showPedestrianCorridors]);

  // Render STOP Carabineros Risk Points
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    riskMarkersRef.current.forEach(m => map.removeLayer(m));
    riskMarkersRef.current = [];

    if (!showStopRiskLayer) return;

    stopRiskPoints.forEach(risk => {
      const color = risk.category === 'Vial' ? '#8b5cf6' : risk.category === 'Situacional' ? '#3b82f6' : risk.category === 'Siniestro' ? '#ef4444' : '#f59e0b';

      const circle = L.circleMarker([risk.lat, risk.lng], {
        radius: 8,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 0.95,
        fillOpacity: 0.85
      }).addTo(map);

      circle.bindTooltip(`🛡️ <b>STOP Carabineros (Cód. ${risk.code})</b><br/>${risk.name}<br/>Severidad: <b style="color:${color}">${risk.severity.toUpperCase()}</b>`, {
        permanent: false,
        direction: 'top'
      });

      circle.bindPopup(`
        <div class="p-2 font-sans text-slate-900 text-xs">
          <div class="flex items-center gap-1.5 font-bold text-slate-950 mb-1">
            <span class="w-3 h-3 rounded-full flex items-center justify-center text-[8px] text-white font-bold" style="background-color: ${color}">!</span>
            <span>STOP Carabineros - Cat. ${risk.category} (Cód. ${risk.code})</span>
          </div>
          <p class="font-bold text-slate-800 text-[11px] mb-1">${risk.name}</p>
          <p class="text-[10px] text-slate-600 mb-1.5">${risk.description}</p>
          <div class="text-[9px] bg-amber-50 border border-amber-200 text-amber-900 p-1.5 rounded font-medium">
            <b>Acción UOCT / Carabineros:</b> ${risk.recommendedAction}
          </div>
        </div>
      `);

      riskMarkersRef.current.push(circle);
    });
  }, [stopRiskPoints, showStopRiskLayer]);

  // Render & Update Traffic Lights
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!showTrafficLights) {
      trafficLightMarkersRef.current.forEach(m => map.removeLayer(m));
      trafficLightMarkersRef.current.clear();
      return;
    }

    trafficLights.forEach(tl => {
      const colorHex = tl.currentColor === 'green' ? '#22c55e' : tl.currentColor === 'yellow' ? '#eab308' : '#ef4444';
      const isSelected = selectedTrafficLightId === tl.id;
      // Actual stopped buses in queue at this corner
      const stoppedBuses = vehicles.filter(v => v.speedKmH === 0 && Math.hypot(v.lat - tl.lat, v.lng - tl.lng) < 0.0014);
      const queuedCount = stoppedBuses.length;

      const html = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
          <div class="absolute -inset-1 rounded-full blur-[3px] opacity-75" style="background-color: ${colorHex}"></div>
          <div class="relative w-7 h-7 rounded-full border border-slate-900 flex flex-col items-center justify-center text-white font-mono shadow-md" style="background-color: #0f172a">
            <span class="w-3 h-3 rounded-full animate-pulse" style="background-color: ${colorHex}"></span>
            <span class="text-[7px] font-bold leading-none mt-0.5 text-slate-200">${tl.secondsRemaining}s</span>
          </div>
          ${tl.isPriorityActive ? `
            <div class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-cyan-500 border border-white flex items-center justify-center text-[7px] text-white font-bold" title="Prioridad GPS UOCT Activa">
              ⚡
            </div>
          ` : ''}
          ${queuedCount > 0 ? `
            <div class="absolute -top-2 -right-2 px-1 py-0.2 rounded-full bg-rose-600 border border-white text-[8px] text-white font-extrabold shadow-md animate-bounce" title="${queuedCount} buses detenidos en cola">
              ${queuedCount}🛑
            </div>
          ` : ''}
        </div>
      `;

      const tooltipContent = `🚦 <b>${tl.id}: ${tl.name}</b><br/><span style="color:#94a3b8">Cruce vial:</span> <b>${tl.mainStreet}</b> con <b>${tl.crossStreet}</b><br/>Fase: <b style="color: ${colorHex}">${tl.currentColor.toUpperCase()}</b> (${tl.secondsRemaining}s)<br/>${queuedCount > 0 ? `<b style="color:#ef4444">🛑 ${queuedCount} bus(es) en cola vial</b><br/>` : ''}Control: ${tl.mode.replace(/_/g, ' ')}<br/><span style="color:#38bdf8; font-size:10px;">👉 Clic para abrir control de flujo 1-Clic · Doble Clic: Verde Inmediato</span>`;

      const popupContent = `
        <div class="p-3 font-sans text-slate-900 text-xs min-w-[245px]">
          <div class="flex items-center justify-between gap-1.5 font-bold text-slate-950 mb-1.5 border-b border-slate-200 pb-1.5">
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] text-white font-bold" style="background-color: ${colorHex}">🚦</span>
              <span class="text-xs font-extrabold text-slate-900">${tl.id} · ${tl.name}</span>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-sm" style="background-color: ${colorHex}">
              ${tl.currentColor.toUpperCase()} ${tl.secondsRemaining}s
            </span>
          </div>

          <div class="text-[11px] text-slate-700 font-medium mb-1">
            <b>Intersección:</b> ${tl.mainStreet} con ${tl.crossStreet}
          </div>

          <div class="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-100 p-2 rounded-lg my-1.5 border border-slate-200">
            <div><span class="text-slate-500">Buses en cruce:</span> <b class="${queuedCount > 0 ? 'text-rose-600 font-extrabold' : 'text-slate-800'}">${queuedCount} detenido(s)</b></div>
            <div><span class="text-slate-500">Nivel flujo:</span> <b class="uppercase">${tl.congestionLevel}</b></div>
            <div><span class="text-slate-500">Cola estimada:</span> ${tl.queueLengthMeters}m</div>
            <div><span class="text-slate-500">Prioridad GPS:</span> ${tl.isPriorityActive ? '⚡ ACTIVA' : 'Normal'}</div>
          </div>

          <!-- BOTONES DE CONTROL DE FLUJO Y DESCONGESTIÓN EN 1-CLIC -->
          <div class="mt-2.5 flex flex-col gap-1.5">
            <button onclick="window.clearJamState('${tl.id}')" class="w-full py-2 px-3 rounded-xl font-extrabold text-xs text-white shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-400/60 active:scale-95">
              <span>🟢 1-CLIC: DESPEJAR ATASCO (Verde Inmediato)</span>
            </button>
            <div class="grid grid-cols-2 gap-1.5 text-[10px]">
              <button onclick="window.toggleTlState('${tl.id}')" class="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg border border-slate-700 text-center cursor-pointer active:scale-95">
                ${tl.currentColor === 'green' ? '🔴 Detener (Rojo)' : '🔄 Alternar a Verde'}
              </button>
              <button onclick="window.triggerFlowState('${tl.id === 'SEM-01' || tl.id === 'SEM-02' || tl.id === 'SEM-03' || tl.id === 'SEM-04' || tl.id === 'SEM-08' ? 'llegada' : 'salida'}')" class="py-1.5 px-2 bg-indigo-900 hover:bg-indigo-800 text-cyan-200 font-bold rounded-lg border border-indigo-700 text-center cursor-pointer active:scale-95">
                ⚡ Onda de Flujo
              </button>
            </div>
          </div>

          <div class="text-[9px] text-slate-500 italic bg-amber-50 p-1.5 rounded-lg border border-amber-200 mt-2">
            ${tl.lastCycleAdjustmentReason || 'Control Adaptativo UOCT'}
          </div>
        </div>
      `;

      let marker = trafficLightMarkersRef.current.get(tl.id);
      if (!marker) {
        marker = L.marker([tl.lat, tl.lng], {
          icon: L.divIcon({
            className: 'traffic-light-icon',
            html,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          })
        }).addTo(map);

        marker.bindTooltip(tooltipContent, {
          permanent: false,
          direction: 'top'
        });

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          setSelectedTrafficLightId(tl.id);
          marker?.openPopup();
        });

        marker.on('dblclick', (e) => {
          L.DomEvent.stopPropagation(e);
          clearIntersectionJam(tl.id);
          showToast(`🟢 Cruce ${tl.name} despejado en 1-Clic: Semáforo puesto en VERDE.`);
        });

        trafficLightMarkersRef.current.set(tl.id, marker);
      } else {
        marker.setLatLng([tl.lat, tl.lng]);
        marker.setIcon(
          L.divIcon({
            className: 'traffic-light-icon',
            html,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          })
        );
        marker.setTooltipContent(tooltipContent);
        marker.setPopupContent(popupContent);
      }
    });

    trafficLightMarkersRef.current.forEach((marker, id) => {
      if (!trafficLights.find(tl => tl.id === id)) {
        map.removeLayer(marker);
        trafficLightMarkersRef.current.delete(id);
      }
    });
  }, [trafficLights, showTrafficLights, selectedTrafficLightId, setSelectedTrafficLightId, vehicles, clearIntersectionJam]);

  // Render & Update Vehicles: Puntos negros compactos que circulan estrictamente por las calles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const filteredVehicles = vehicles.filter(v => {
      if (activeFilterCompany === 'all') return true;
      if (activeFilterCompany === 'turbus') return v.company.toLowerCase().includes('turbus');
      if (activeFilterCompany === 'pullman') return v.company.toLowerCase().includes('pullman');
      if (activeFilterCompany === 'efe') return v.company.toLowerCase().includes('efe');
      if (activeFilterCompany === 'rural') return v.vehicleType === 'bus_rural' || v.company.toLowerCase().includes('talagante') || v.company.toLowerCase().includes('melipilla') || v.company.toLowerCase().includes('bupolsa');
      if (activeFilterCompany === 'terminal_alameda') return v.terminalId === 'terminal_alameda';
      if (activeFilterCompany === 'terminal_sur') return v.terminalId === 'terminal_sur';
      if (activeFilterCompany === 'terminal_san_borja') return v.terminalId === 'terminal_san_borja';
      if (activeFilterCompany === 'velasquez') return Boolean(v.corridorType && v.corridorType.includes('velasquez'));
      return true;
    });

    const pixelSize = dotSize === 'compact' ? 10 : dotSize === 'standard' ? 12 : 14;
    const innerPip = dotSize === 'compact' ? 3 : dotSize === 'standard' ? 4 : 5;
    const containerBox = pixelSize + 6;
    const anchorCoord = containerBox / 2;

    filteredVehicles.forEach(veh => {
      const isSelected = selectedVehicleId === veh.id;
      const isTrain = veh.vehicleType === 'tren_efe';
      const isStopped = veh.speedKmH === 0;

      // Color de anillo según la flota de buses
      let fleetColor = '#10b981'; // TurBus (Verde)
      if (veh.company.toLowerCase().includes('pullman')) fleetColor = '#f97316'; // Pullman Bus (Naranja)
      else if (isTrain) fleetColor = '#0284c7'; // EFE Trenes (Azul EFE)
      else if (veh.vehicleType === 'bus_rural' || veh.company.toLowerCase().includes('talagante') || veh.company.toLowerCase().includes('melipilla') || veh.company.toLowerCase().includes('bupolsa')) fleetColor = '#06b6d4'; // San Borja (Cian)
      else if (veh.company.toLowerCase().includes('cóndor') || veh.company.toLowerCase().includes('jet sur')) fleetColor = '#f59e0b'; // Cóndor/Jet Sur (Ámbar)
      else if (veh.company.toLowerCase().includes('eme')) fleetColor = '#ec4899'; // Eme Bus (Rosa)

      // Punto Negro Compacto Proporcional al Ancho de la Calle (no invade edificios ni veredas)
      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-150 ${isSelected ? 'scale-125 z-50' : 'hover:scale-125'}" title="${veh.company} · ${veh.serviceNumber}">
          ${isSelected ? `<div class="absolute -inset-2 rounded-full border-2 border-cyan-400 animate-ping opacity-75 pointer-events-none"></div>` : ''}
          ${isStopped ? `<div class="absolute -inset-1 rounded-full bg-rose-500/40 animate-pulse pointer-events-none"></div>` : ''}
          
          <!-- Punto negro sólido con borde fino del color de la flota -->
          <div class="relative rounded-full shadow-md flex items-center justify-center pointer-events-auto" style="width: ${pixelSize}px; height: ${pixelSize}px; border: 1.5px solid ${fleetColor}; background-color: #020617; box-shadow: ${isStopped ? '0 0 6px rgba(239, 68, 68, 0.85)' : '0 1px 3px rgba(0,0,0,0.6)'};">
            <!-- Indicador direccional de avance según el rumbo en la calle -->
            <div style="transform: rotate(${veh.heading}deg);" class="w-full h-full flex items-center justify-center pointer-events-none">
              <div class="rounded-full ${isStopped ? 'bg-rose-400' : 'bg-emerald-300'}" style="width: ${innerPip}px; height: ${innerPip}px; box-shadow: 0 0 2px ${fleetColor};"></div>
            </div>
          </div>
        </div>
      `;

      let marker = vehicleMarkersRef.current.get(veh.id);
      const isInside = veh.isInsideTerminal || veh.status === 'en_anden' || veh.status === 'embarcando';
      const isHighway = veh.corridorType && veh.corridorType.includes('velasquez');

      const tooltipContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 180px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; font-weight: bold; margin-bottom: 2px;">
            <span style="color: ${fleetColor}; font-size: 11px;">${isTrain ? '🚆' : '🚌'} ${veh.company}</span>
            <span style="color: ${isStopped ? '#ef4444' : '#22c55e'}; font-family: monospace; font-weight: bold; font-size: 11px;">${veh.speedKmH} km/h</span>
          </div>
          <div style="font-size: 11px; font-weight: 700; color: #f1f5f9; margin-bottom: 2px;">
            ${veh.serviceNumber} · <span style="font-family: monospace; color: #94a3b8; font-size: 10px;">${veh.plate}</span>
          </div>
          <div style="color: #38bdf8; font-size: 10px; margin-bottom: 2px;">
            📍 Calle: <b>${veh.currentStreetName || 'Red Vial OSM'}</b>
          </div>
          ${isHighway ? `<div style="color: #38bdf8; font-size: 9px; background: rgba(14,165,233,0.15); border: 1px solid rgba(14,165,233,0.3); padding: 1px 4px; border-radius: 4px; margin-bottom: 2px;">🛣️ Autopista Gral. Velásquez</div>` : ''}
          ${isInside ? `<div style="color: #a855f7; font-size: 9px; background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.3); padding: 1px 4px; border-radius: 4px; margin-bottom: 2px;">🏢 <b>Dentro del Terminal</b> (${veh.assignedDock})</div>` : ''}
          <div style="color: #cbd5e1; font-size: 9.5px; border-top: 1px solid #334155; padding-top: 3px; margin-top: 2px;">
            ${veh.origin} ➔ <b>${veh.destination}</b>
          </div>
          <div style="color: #e2e8f0; font-size: 9px; margin-top: 2px;">
            Andén: <b style="color: #f59e0b;">${veh.assignedDock}</b> · ETA: <b>${veh.etaMinutes} min</b>
          </div>
          <div style="color: ${isStopped ? (isInside ? '#c084fc' : '#fca5a5') : '#86efac'}; font-size: 9px; font-weight: 600; margin-top: 2px;">
            ${isInside ? '🏢 En andén de terminal (Embarcando pasajeros)' : isStopped ? '🛑 Detenido en semáforo / cola vial' : '🟢 En circulación fluida por calzada'}
          </div>
        </div>
      `;

      if (!marker) {
        marker = L.marker([veh.lat, veh.lng], {
          icon: L.divIcon({
            className: 'vehicle-black-dot-marker',
            html: iconHtml,
            iconSize: [containerBox, containerBox],
            iconAnchor: [anchorCoord, anchorCoord]
          })
        }).addTo(map);

        marker.bindTooltip(tooltipContent, {
          direction: 'top',
          offset: [0, -8],
          opacity: 0.95,
          className: 'custom-vehicle-tooltip'
        });

        marker.on('click', () => {
          setSelectedVehicleId(veh.id);
          setActiveDrawer('trip');
        });

        vehicleMarkersRef.current.set(veh.id, marker);
      } else {
        marker.setLatLng([veh.lat, veh.lng]);
        marker.setIcon(
          L.divIcon({
            className: 'vehicle-black-dot-marker',
            html: iconHtml,
            iconSize: [containerBox, containerBox],
            iconAnchor: [anchorCoord, anchorCoord]
          })
        );
        marker.setTooltipContent(tooltipContent);
      }
    });

    vehicleMarkersRef.current.forEach((marker, id) => {
      if (!filteredVehicles.find(v => v.id === id)) {
        map.removeLayer(marker);
        vehicleMarkersRef.current.delete(id);
      }
    });
  }, [vehicles, selectedVehicleId, activeFilterCompany, setSelectedVehicleId, dotSize]);

  // Draw active selected vehicle route polyline strictly along street network with transit styling
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    routePolylinesRef.current.forEach(p => map.removeLayer(p));
    routePolylinesRef.current = [];

    const selectedVeh = vehicles.find(v => v.id === selectedVehicleId);
    if (selectedVeh && selectedVeh.routePath.length > 0) {
      const isTrain = selectedVeh.vehicleType === 'tren_efe';
      const companyColor = isTrain ? '#0284c7' :
                           selectedVeh.company.includes('TurBus') ? '#10b981' :
                           selectedVeh.company.includes('Pullman') ? '#f97316' :
                           selectedVeh.company.includes('Talagante') ? '#0284c7' :
                           selectedVeh.company.includes('Cóndor') ? '#f59e0b' : '#38bdf8';
      
      // Outer glow line following street centerline
      const glowPolyline = L.polyline(selectedVeh.routePath, {
        color: companyColor,
        weight: 6,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Core transit line with dashed styling (distinct from boundary polygons)
      const polyline = L.polyline(selectedVeh.routePath, {
        color: companyColor,
        weight: 3.5,
        dashArray: '8, 8',
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      polyline.bindTooltip(`🚌 <b>Trayectoria de Tránsito:</b> ${selectedVeh.company} (${selectedVeh.serviceNumber})<br/>📍 Calle actual: <b>${selectedVeh.currentStreetName || 'Alameda'}</b><br/>🏁 Andén: <b>${selectedVeh.assignedDock}</b>`, {
        permanent: false,
        direction: 'top'
      });

      routePolylinesRef.current.push(glowPolyline, polyline);
    }
  }, [vehicles, selectedVehicleId]);

  const centerOnVehicle = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const veh = vehicles.find(v => v.id === selectedVehicleId);
    if (veh) {
      map.setView([veh.lat, veh.lng], 16, { animate: true });
    }
  };

  const centerOnQuadrant = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    // Centers on the official Barrio Terminales quadrant (-33.4545, -70.6875)
    map.setView([-33.4545, -70.6875], 15, { animate: true });
  };

  const activeVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const alamedaCount = vehicles.filter(v => v.terminalId === 'terminal_alameda').length;
  const surCount = vehicles.filter(v => v.terminalId === 'terminal_sur').length;
  const sanBorjaCount = vehicles.filter(v => v.terminalId === 'terminal_san_borja').length;
  const efeCount = vehicles.filter(v => v.vehicleType === 'tren_efe').length;
  const velasquezCount = vehicles.filter(v => Boolean(v.corridorType && v.corridorType.includes('velasquez'))).length;
  const insideTerminalsCount = vehicles.filter(v => v.isInsideTerminal || v.status === 'en_anden' || v.status === 'embarcando').length;

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleId(id);
    const veh = vehicles.find(v => v.id === id);
    if (veh && mapInstanceRef.current) {
      mapInstanceRef.current.setView([veh.lat, veh.lng], 16, { animate: true });
    }
  };

  return (
    <div className={`relative w-full h-full flex-1 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl transition-all duration-300 ${
      isMapFullscreen ? 'min-h-[85vh]' : 'min-h-[500px]'
    }`}>
      {/* Real Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Interactive Toast Notification */}
      {toastMessage && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[460] px-4 py-2 rounded-xl bg-slate-950/95 border-2 border-emerald-400 text-emerald-300 text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-2 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-col gap-2 pointer-events-none">
        {/* Main Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Top Left: Flow Controls & Layers */}
          <div className="flex items-center gap-1.5 pointer-events-auto flex-wrap">
            {/* Prominent Barrio Terminales Official Green Demarcation Button */}
            <button
              onClick={() => setShowBarrioTerminalesZone(!showBarrioTerminalesZone)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xl backdrop-blur-md transition-all border ${
                showBarrioTerminalesZone
                  ? 'bg-emerald-600/90 text-white border-emerald-400 shadow-emerald-950/60 ring-2 ring-emerald-400/40'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700/80'
              }`}
              title="Activar/desactivar demarcación en color verde del Barrio Terminales (Plano oficial)"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Polígono Verde</span>
              {showBarrioTerminalesZone && (
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              )}
            </button>

            {/* 1-Click Flow Controls */}
            <button
              onClick={() => {
                triggerFlowDirection('llegada');
                showToast('🟢 Flujo de LLEGADA activado: Eje Alameda en VERDE para ingreso continuo a terminales.');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-xl backdrop-blur-md transition-all border border-emerald-300/60 active:scale-95 cursor-pointer"
              title="1-Clic: Abrir Onda Verde en Alameda para ingreso expedito de buses a los terminales"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>🟢 Flujo Llegada</span>
            </button>

            <button
              onClick={() => {
                triggerFlowDirection('salida');
                showToast('🟢 Flujo de SALIDA activado: Ejes 5 de Abril y Souper en VERDE para evacuación hacia autopista.');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-extrabold shadow-xl backdrop-blur-md transition-all border border-amber-300/60 active:scale-95 cursor-pointer"
              title="1-Clic: Abrir Onda Verde en 5 de Abril y Souper para evacuación expedita hacia autopista"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
              <span>🟢 Flujo Salida</span>
            </button>

            <button
              onClick={() => {
                trafficLights.forEach(tl => {
                  if (tl.currentColor === 'red' || tl.queueLengthMeters > 20) {
                    clearIntersectionJam(tl.id);
                  }
                });
                showToast('🟢 Todos los cruces despejados en 1-Clic: Semáforos en VERDE y colas liberadas.');
              }}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900/95 hover:bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-xl transition-all cursor-pointer active:scale-95"
              title="1-Clic: Despejar atascos poniendo semáforos en verde"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Despejar Atascos</span>
            </button>

            <button
              onClick={() => setActiveDrawer(activeDrawer === 'layers' ? 'none' : 'layers')}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold shadow-xl backdrop-blur-md transition-all border ${
                activeDrawer === 'layers'
                  ? 'bg-cyan-600 text-white border-cyan-400'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80'
              }`}
              title="Configurar capas cartográficas y tema del mapa"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Capas</span>
            </button>
          </div>

          {/* Top Right: Fullscreen & Re-Center Buttons */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={() => setIsMapFullscreen(!isMapFullscreen)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xl backdrop-blur-md transition-all border ${
                isMapFullscreen 
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-300 ring-2 ring-cyan-400/50' 
                  : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border-cyan-500/60'
              }`}
              title={isMapFullscreen ? 'Restaurar vista dividida con panel' : 'Ver mapa en pantalla completa'}
            >
              {isMapFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isMapFullscreen ? 'Dividir' : 'Pantalla Completa'}</span>
            </button>

            <button
              onClick={centerOnQuadrant}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-xl text-xs font-semibold backdrop-blur-md transition-all"
              title="Centrar Cuadrante Barrio Terminales"
            >
              <LocateFixed className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Centrar</span>
            </button>
          </div>
        </div>

        {/* Secondary Ribbon: Fleet Filter Pills (~20 buses per terminal) & Jam Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto overflow-x-auto py-1 scrollbar-none">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300 text-[11px] font-bold shadow-lg backdrop-blur-md shrink-0">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Flota:</span>
          </div>

          <button
            onClick={() => setActiveFilterCompany('all')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shadow-md shrink-0 border ${
              activeFilterCompany === 'all'
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-cyan-900/40 ring-1 ring-cyan-400'
                : 'bg-slate-900/85 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            Todas ({vehicles.length})
          </button>

          <button
            onClick={() => setActiveFilterCompany('terminal_alameda')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shadow-md shrink-0 border ${
              activeFilterCompany === 'terminal_alameda'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-900/40 ring-1 ring-emerald-400'
                : 'bg-slate-900/85 text-emerald-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Term. Alameda ({alamedaCount})</span>
          </button>

          <button
            onClick={() => setActiveFilterCompany('terminal_sur')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shadow-md shrink-0 border ${
              activeFilterCompany === 'terminal_sur'
                ? 'bg-orange-600 text-white border-orange-400 shadow-orange-900/40 ring-1 ring-orange-400'
                : 'bg-slate-900/85 text-orange-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
            <span>Term. Sur ({surCount})</span>
          </button>

          <button
            onClick={() => setActiveFilterCompany('terminal_san_borja')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shadow-md shrink-0 border ${
              activeFilterCompany === 'terminal_san_borja'
                ? 'bg-purple-600 text-white border-purple-400 shadow-purple-900/40 ring-1 ring-purple-400'
                : 'bg-slate-900/85 text-purple-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span>Term. San Borja ({sanBorjaCount})</span>
          </button>

          <button
            onClick={() => setActiveFilterCompany('efe')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shadow-md shrink-0 border ${
              activeFilterCompany === 'efe'
                ? 'bg-sky-600 text-white border-sky-400 shadow-sky-900/40 ring-1 ring-sky-400'
                : 'bg-slate-900/85 text-sky-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span>EFE Trenes ({efeCount})</span>
          </button>

          <button
            onClick={() => setActiveFilterCompany('velasquez')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shadow-md shrink-0 border ${
              activeFilterCompany === 'velasquez'
                ? 'bg-sky-500 text-white border-sky-300 shadow-sky-900/40 ring-1 ring-sky-300'
                : 'bg-slate-900/85 text-sky-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="Buses subiendo y bajando por Autopista General Velásquez"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
            <span>Gral. Velásquez ({velasquezCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('docks_capacity')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-800 border border-purple-500/60 text-purple-200 hover:text-white text-[11px] font-bold transition-all shadow-md shrink-0 cursor-pointer"
            title="Ver telemetría y conteo de buses dentro de cada terminal"
          >
            <Layers className="w-3.5 h-3.5 text-purple-300" />
            <span>Andenes: {insideTerminalsCount} dentro</span>
          </button>

          {/* Active Jam Alerts (1-Click Clear Corner) */}
          {trafficLights.filter(t => {
            const count = vehicles.filter(v => v.speedKmH === 0 && Math.hypot(v.lat - t.lat, v.lng - t.lng) < 0.0014).length;
            return count > 0;
          }).slice(0, 2).map(tl => {
            const count = vehicles.filter(v => v.speedKmH === 0 && Math.hypot(v.lat - tl.lat, v.lng - tl.lng) < 0.0014).length;
            return (
              <button
                key={tl.id}
                onClick={() => {
                  clearIntersectionJam(tl.id);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([tl.lat, tl.lng], 17, { animate: true });
                  }
                  showToast(`🟢 Cruce ${tl.name} despejado en 1-Clic: Semáforo en VERDE y ${count} bus(es) liberados.`);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-extrabold text-[11px] border border-rose-300 shadow-md animate-pulse shrink-0 cursor-pointer active:scale-95"
                title={`Atasco en ${tl.name}: Haz 1-Clic para despejar en VERDE inmediato`}
              >
                <span>⚠️ {tl.id}: {count} en cola</span>
                <span className="text-[9px] bg-rose-900 px-1 py-0.2 rounded font-mono">1-Clic Verde</span>
              </button>
            );
          })}

          {/* Simulate Jam button for testing */}
          <button
            onClick={() => {
              forceTrafficLightState('SEM-02', 'red');
              showToast('⚠️ Atasco simulado en SEM-02 (Alameda / Ruiz Tagle): Semáforo en ROJO. Observa los puntos negros deteniéndose en cola.');
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-amber-300 border border-slate-700/80 text-[10px] font-bold shrink-0 cursor-pointer"
            title="Simular un atasco en SEM-02 para probar el despeje en 1-Clic"
          >
            <span>⚠️ Simular Atasco</span>
          </button>

          {/* Sizing toggle for Puntos Negros */}
          <div className="flex items-center gap-0.5 bg-slate-950/90 border border-slate-800 rounded-xl p-0.5 shadow-lg text-[10px] shrink-0">
            <span className="px-1.5 text-slate-400 font-bold hidden xl:inline">Puntos:</span>
            <button
              onClick={() => setDotSize('compact')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                dotSize === 'compact' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="10px diámetro: Escala óptima para la calzada OSM"
            >
              10px
            </button>
            <button
              onClick={() => setDotSize('standard')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                dotSize === 'standard' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="12px diámetro: Estándar"
            >
              12px
            </button>
            <button
              onClick={() => setDotSize('large')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                dotSize === 'large' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="14px diámetro: Visible"
            >
              14px
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Drawers (Popups that don't block the screen permanently) */}
      {activeDrawer !== 'none' && (
        <div className="absolute top-14 left-3 z-[450] max-w-sm sm:max-w-md w-[calc(100%-24px)] bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 max-h-[72vh] overflow-y-auto animate-in fade-in slide-in-from-top-3 duration-200 text-white">
          {/* Trip Drawer */}
          {activeDrawer === 'trip' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">Mi Viaje GPS (Tipo Uber)</h3>
                    <p className="text-[10px] text-slate-400">Seguimiento en vivo y andenes asignados</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDrawer('none')}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Cerrar ventana"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Trip Selector */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold mb-1 block">Seleccionar viaje activo:</label>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {vehicles.map(v => (
                    <button
                      key={v.id}
                      onClick={() => handleSelectVehicle(v.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all border ${
                        selectedVehicleId === v.id
                          ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {v.company} ({v.serviceNumber})
                    </button>
                  ))}
                </div>
              </div>

              {activeVehicle && (
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase">{activeVehicle.company}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{activeVehicle.serviceNumber} · {activeVehicle.plate}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Tiempo estimado:</span>
                      <span className="text-base sm:text-lg font-black text-amber-400 font-mono">{activeVehicle.etaMinutes} min</span>
                    </div>
                  </div>

                  {/* OSM Street Tracking Card */}
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/60 border border-emerald-500/50 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Trazado Vial OSM Estricto (Prototipo)
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/40">
                        100% en Calzada
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{activeVehicle.currentStreetName || 'Av. Libertador Bernardo O\'Higgins'}</span>
                    </div>
                    {activeVehicle.nextStreetName && (
                      <div className="text-[10px] text-slate-300 flex items-center gap-1 pl-5">
                        <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>Rumbo a: <b className="text-cyan-300">{activeVehicle.nextStreetName}</b></span>
                      </div>
                    )}
                  </div>

                  {/* Route & Dock Badge */}
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[10px]">Destino / Terminal</span>
                      <span className="font-semibold text-white truncate max-w-[200px]">{activeVehicle.destination}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-cyan-400 text-[10px] font-bold">Andén Asignado</span>
                      <span className="font-mono font-extrabold text-cyan-300 text-xs sm:text-sm">{activeVehicle.assignedDock}</span>
                    </div>
                  </div>

                  {/* Telemetry info */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Velocidad</span>
                      <span className="font-bold text-white font-mono text-xs">{activeVehicle.speedKmH} km/h</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Pasajeros</span>
                      <span className="font-bold text-white font-mono text-xs">{activeVehicle.passengerCount}/{activeVehicle.maxCapacity}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Conductor</span>
                      <span className="font-bold text-emerald-400 text-xs">⭐ {activeVehicle.driverRating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span className="flex items-center gap-1">
                      <Signal className="w-3 h-3 text-emerald-400 animate-pulse" />
                      GPS activo en calzada oficial
                    </span>
                    <button
                      onClick={centerOnVehicle}
                      className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      Centrar en mapa
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* UOCT Drawer */}
          {activeDrawer === 'uoct' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">Departamento de Semáforos UOCT</h3>
                    <p className="text-[10px] text-slate-400">Coordinación en tiempo real del cuadrante</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDrawer('none')}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Green Wave Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => triggerGreenWave('alameda')}
                  className="p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 text-[11px] font-bold flex flex-col items-center gap-1 transition-all"
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Onda Alameda (SEM 01-03)</span>
                </button>
                <button
                  onClick={() => triggerGreenWave('cinco_de_abril')}
                  className="p-2 rounded-xl bg-orange-950/80 hover:bg-orange-900 border border-orange-500/60 text-orange-300 text-[11px] font-bold flex flex-col items-center gap-1 transition-all"
                >
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span>Onda 5 de Abril (SEM 05-09)</span>
                </button>
              </div>

              {/* Key Intersections */}
              <div className="flex flex-col gap-1.5 max-h-[35vh] overflow-y-auto pr-1">
                {trafficLights.slice(0, 6).map(tl => (
                  <div
                    key={tl.id}
                    onClick={() => {
                      setSelectedTrafficLightId(tl.id);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.setView([tl.lat, tl.lng], 17, { animate: true });
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between hover:border-slate-700 cursor-pointer text-[11px] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        tl.currentColor === 'green' ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' :
                        tl.currentColor === 'yellow' ? 'bg-amber-400' : 'bg-red-500'
                      }`} />
                      <div>
                        <span className="font-bold text-white block leading-tight">{tl.name}</span>
                        <span className="text-[9px] text-slate-400">{tl.mainStreet} · {tl.crossStreet}</span>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {tl.secondsRemaining}s
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fleet Drawer */}
          {activeDrawer === 'fleet' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">Flotas en Circulación ({vehicles.length})</h3>
                    <p className="text-[10px] text-slate-400">Haz clic en un vehículo para enfocar su ruta en el mapa</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDrawer('none')}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
                {['all', 'turbus', 'pullman', 'efe', 'rural'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilterCompany(filter)}
                    className={`px-2 py-0.5 rounded-md font-semibold whitespace-nowrap capitalize transition-all ${
                      activeFilterCompany === filter
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter === 'all' ? 'Todas' : filter}
                  </button>
                ))}
              </div>

              {/* Vehicle List */}
              <div className="flex flex-col gap-1.5 max-h-[40vh] overflow-y-auto pr-1">
                {vehicles.map(veh => {
                  const isSelected = selectedVehicleId === veh.id;
                  const isTrain = veh.vehicleType === 'tren_efe';
                  return (
                    <div
                      key={veh.id}
                      onClick={() => handleSelectVehicle(veh.id)}
                      className={`p-2 rounded-xl border flex items-center justify-between text-[11px] cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-500/80 shadow-lg'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{isTrain ? '🚆' : '🚌'}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{veh.serviceNumber}</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">{veh.company}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 block truncate max-w-[190px]">{veh.destination}</span>
                          <span className="text-[9px] text-emerald-400 font-semibold block truncate max-w-[190px] mt-0.5">
                            📍 {veh.currentStreetName || 'Red Vial OSM'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-xs text-amber-400 block">{veh.speedKmH} km/h</span>
                        <span className="text-[9px] text-cyan-400 font-bold">{veh.assignedDock}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STOP Security Drawer */}
          {activeDrawer === 'stop' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">STOP Carabineros 2026</h3>
                    <p className="text-[10px] text-slate-400">Corredores peatonales seguros y puntos críticos</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDrawer('none')}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex flex-col gap-2 text-[11px]">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Corredores Peatonales Protegidos EFE:</span>
                {pedestrianCorridors.map(c => (
                  <div key={c.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-cyan-300 block">{c.name}</span>
                      <span className="text-[9px] text-slate-400">{c.distanceMeters}m · Huella podotáctil e iluminación</span>
                    </div>
                    <span className="font-mono font-bold text-amber-400 text-xs">{c.walkMinutes} min</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[10px] text-amber-200">
                <p className="font-bold mb-0.5">⚠️ Monitoreo de Seguridad Vial Cuadrante 21:</p>
                <p>59 puntos críticos registrados por siniestralidad. Los semáforos UOCT extienden el verde peatonal en cruces de alta demanda para personas con movilidad reducida.</p>
              </div>
            </div>
          )}

          {/* Layers Drawer */}
          {activeDrawer === 'layers' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">Capas Cartográficas</h3>
                    <p className="text-[10px] text-slate-400">Activar o desactivar elementos en el mapa</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDrawer('none')}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                {/* Barrio Terminales Demarcation Toggles */}
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>Demarcación Oficial Barrio Terminales</span>
                  </span>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white">
                    <input
                      type="checkbox"
                      checked={showBarrioTerminalesZone}
                      onChange={e => setShowBarrioTerminalesZone(e.target.checked)}
                      className="w-4 h-4 rounded accent-emerald-500"
                    />
                    <span className="flex items-center gap-1.5 font-medium text-xs">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-400 border border-emerald-200"></span>
                      <span><b>Cuadrante Núcleo (Verde)</b>: Alameda - Velásquez - 5 de Abril - Jotabeche</span>
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white pl-5">
                    <input
                      type="checkbox"
                      checked={showStreetLabels}
                      disabled={!showBarrioTerminalesZone}
                      onChange={e => setShowStreetLabels(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-emerald-500"
                    />
                    <span className="text-[11px] text-slate-300">
                      🏷️ Nombres de calles del cuadrante (Alameda, Velásquez, Souper, etc.)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white pl-5">
                    <input
                      type="checkbox"
                      checked={showGranBarrioZone}
                      disabled={!showBarrioTerminalesZone}
                      onChange={e => setShowGranBarrioZone(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-blue-500"
                    />
                    <span className="text-[11px] text-slate-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-blue-400 border border-blue-200"></span>
                      <span>Gran Barrio Terminales (Área extendida EFE, San Borja y Arica)</span>
                    </span>
                  </label>

                  {/* Legend of 4 Terminals matching reference photo */}
                  <div className="mt-1 pt-1.5 border-t border-emerald-500/30 grid grid-cols-2 gap-1 text-[10px]">
                    <div className="flex items-center gap-1 text-cyan-300">
                      <span className="w-4 h-4 rounded-full bg-cyan-500/30 text-cyan-300 border border-cyan-400 flex items-center justify-center font-bold text-[9px]">1</span>
                      <span className="truncate">Terminal Sur</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-300">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400 flex items-center justify-center font-bold text-[9px]">2</span>
                      <span className="truncate">Terminal Alameda</span>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-300">
                      <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400 flex items-center justify-center font-bold text-[9px]">3</span>
                      <span className="truncate">Terminal San Borja</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-300">
                      <span className="w-4 h-4 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400 flex items-center justify-center font-bold text-[9px]">4</span>
                      <span className="truncate">Estación Central EFE</span>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white p-1.5 rounded-lg hover:bg-slate-900">
                  <input
                    type="checkbox"
                    checked={showTrafficLights}
                    onChange={e => setShowTrafficLights(e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-500"
                  />
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    Semáforos UOCT ({trafficLights.length})
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white p-1.5 rounded-lg hover:bg-slate-900">
                  <input
                    type="checkbox"
                    checked={showPedestrianCorridors}
                    onChange={e => setShowPedestrianCorridors(e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-500"
                  />
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                    Corredores Peatonales Seguros EFE
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white p-1.5 rounded-lg hover:bg-slate-900">
                  <input
                    type="checkbox"
                    checked={showStopRiskLayer}
                    onChange={e => setShowStopRiskLayer(e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-500"
                  />
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    STOP Carabineros (Puntos Críticos)
                  </span>
                </label>

                {/* OSM Strict Street Grid notice */}
                <div className="mt-1 p-2 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-[10px] text-slate-300">
                  <div className="flex items-center gap-1 font-bold text-emerald-400 mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Malla Vial OpenStreetMap (OSM) Estricta:</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Los buses y trenes circulan con precisión ortogonal por calzadas oficiales (Alameda, Ruiz Tagle, Souper, Jotabeche, 5 de Abril, San Borja y faja férrea confinada EFE) respetando los ejes viales sin atravesar manzanas ni edificios.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold">Estilo del Mapa:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setMapTileTheme('voyager')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                      mapTileTheme === 'voyager' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-900 text-slate-300'
                    }`}
                  >
                    Claro
                  </button>
                  <button
                    onClick={() => setMapTileTheme('dark')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                      mapTileTheme === 'dark' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-900 text-slate-300'
                    }`}
                  >
                    Noche
                  </button>
                  <button
                    onClick={() => setMapTileTheme('osm')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                      mapTileTheme === 'osm' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-900 text-slate-300'
                    }`}
                  >
                    OSM
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Floating Interactive Action Bar (Buttons for fast access without taking space) */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] flex items-center justify-center sm:justify-start gap-1.5 pointer-events-none flex-wrap">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/90 border border-slate-700/80 shadow-2xl backdrop-blur-md pointer-events-auto max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'trip' ? 'none' : 'trip')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDrawer === 'trip'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>🎫 Mi Viaje (Uber)</span>
          </button>

          <button
            onClick={() => setActiveDrawer(activeDrawer === 'uoct' ? 'none' : 'uoct')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDrawer === 'uoct'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>🚦 Semáforos UOCT</span>
          </button>

          <button
            onClick={() => setActiveDrawer(activeDrawer === 'fleet' ? 'none' : 'fleet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDrawer === 'fleet'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>🚌 Flota GPS ({vehicles.length})</span>
          </button>

          <button
            onClick={() => setActiveDrawer(activeDrawer === 'stop' ? 'none' : 'stop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDrawer === 'stop'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>🛡️ Seguridad STOP</span>
          </button>

          <button
            onClick={() => setActiveDrawer(activeDrawer === 'layers' ? 'none' : 'layers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDrawer === 'layers'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>🛣️ Malla OSM</span>
          </button>

          {activeDrawer !== 'none' && (
            <button
              onClick={() => setActiveDrawer('none')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/60 transition-all border border-rose-500/30 whitespace-nowrap ml-1"
              title="Ocultar panel flotante para ver todo el mapa despejado"
            >
              <X className="w-3 h-3" />
              <span>Ocultar Info</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
