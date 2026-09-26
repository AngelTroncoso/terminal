import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  VehicleGPS, 
  TrafficLightIntersection, 
  Terminal, 
  TerminalId,
  StopRiskPoint, 
  PedestrianCorridor, 
  SystemKPIs,
  DockInfo,
  TerminalOccupancySummary
} from '../types/transit';
import { 
  TERMINALS, 
  INITIAL_TRAFFIC_LIGHTS, 
  MOCK_VEHICLES, 
  PEDESTRIAN_CORRIDORS, 
  STOP_RISK_POINTS, 
  INITIAL_KPIS 
} from '../data/mockData';

export type MainTab = 'passenger' | 'uoct' | 'control_center' | 'docks_capacity' | 'stop_security';

export interface UoctLogEvent {
  id: string;
  timestamp: string;
  intersectionId: string;
  intersectionName: string;
  action: 'PRIORIDAD_GPS_OTORGADA' | 'ONDA_VERDE_ACTIVADA' | 'CAMBIO_DE_FASE' | 'DESCONGESTION_CUADRANTE' | 'ALERTA_RIESGO';
  vehiclePlate?: string;
  vehicleCompany?: string;
  details: string;
}

interface TransitContextType {
  vehicles: VehicleGPS[];
  trafficLights: TrafficLightIntersection[];
  terminals: Terminal[];
  pedestrianCorridors: PedestrianCorridor[];
  stopRiskPoints: StopRiskPoint[];
  kpis: SystemKPIs;
  uoctLogs: UoctLogEvent[];
  selectedVehicleId: string | null;
  selectedTerminalId: string | null;
  selectedTrafficLightId: string | null;
  activeTab: MainTab;
  simulationSpeed: number; // 0 = paused, 1 = 1x, 2 = 2x, 5 = 5x
  isRushHour: boolean;
  activeFilterCompany: string;
  isVoiceAssistantOpen: boolean;
  isMapFullscreen: boolean;
  
  // Actions
  setIsMapFullscreen: (fullscreen: boolean) => void;
  setIsVoiceAssistantOpen: (open: boolean) => void;
  setSelectedVehicleId: (id: string | null) => void;
  setSelectedTerminalId: (id: string | null) => void;
  setSelectedTrafficLightId: (id: string | null) => void;
  setActiveTab: (tab: MainTab) => void;
  setSimulationSpeed: (speed: number) => void;
  setActiveFilterCompany: (company: string) => void;
  toggleRushHour: () => void;
  triggerGreenWave: (axis: 'alameda' | 'cinco_de_abril' | 'san_borja') => void;
  forceTrafficLightState: (intersectionId: string, color: 'green' | 'red') => void;
  toggleTrafficLight: (intersectionId: string) => void;
  triggerFlowDirection: (direction: 'llegada' | 'salida') => void;
  clearIntersectionJam: (intersectionId: string) => void;
  requestEmergencyPriority: (vehicleId: string) => void;
  injectTrafficIncident: (locationName: string) => void;
  resetSimulation: () => void;
  
  // Terminal Docks & Capacity Real-time Analytics
  getTerminalOccupancy: (terminalId: TerminalId) => TerminalOccupancySummary;
  isVehicleInsideTerminal: (vehicle: VehicleGPS, terminalId: TerminalId) => boolean;
  clearTerminalDockJam: (terminalId: TerminalId) => void;
}

const TransitContext = createContext<TransitContextType | undefined>(undefined);

// Terminal Dock Epicenters (exact coordinates inside the terminal gates where docks are located)
export const getTerminalDockCoords = (terminalId: TerminalId): [number, number] => {
  switch (terminalId) {
    case 'terminal_alameda': return [-33.45409, -70.68445];
    case 'terminal_sur': return [-33.45412, -70.68740];
    case 'terminal_san_borja': return [-33.45362, -70.68046];
    case 'estacion_trenes_efe': return [-33.45200, -70.67880];
    default: return [-33.45400, -70.68820];
  }
};

export const isVehicleInsideTerminal = (veh: VehicleGPS, terminalId: TerminalId): boolean => {
  if (veh.terminalId !== terminalId) return false;
  if (veh.status === 'en_anden' || veh.status === 'embarcando') return true;
  if (veh.isInsideTerminal) return true;
  const [dLat, dLng] = getTerminalDockCoords(terminalId);
  return Math.hypot(veh.lat - dLat, veh.lng - dLng) < 0.00065;
};

export const calculateTerminalOccupancy = (
  terminalId: TerminalId,
  vehicles: VehicleGPS[],
  terminals: Terminal[]
): TerminalOccupancySummary => {
  const terminal = terminals.find(t => t.id === terminalId);
  const totalMonitoredDocks = terminalId === 'terminal_alameda' ? 26 :
                              terminalId === 'terminal_sur' ? 35 :
                              terminalId === 'terminal_san_borja' ? 45 : 6;
  const capacityPhysicalDocks = terminal?.capacityDocks ?? totalMonitoredDocks;
  
  const terminalVehs = vehicles.filter(v => v.terminalId === terminalId);
  const insideVehs = terminalVehs.filter(v => isVehicleInsideTerminal(v, terminalId));
  const approachingVehs = terminalVehs.filter(v => !isVehicleInsideTerminal(v, terminalId) && (v.status === 'aproximando' || v.status === 'en_ruta_hacia_terminal'));
  const departingVehs = terminalVehs.filter(v => v.status === 'en_salida_cuadrante' || v.status === 'viaje_en_carretera');

  const occupiedDocks = insideVehs.length;
  const availableDocks = Math.max(0, totalMonitoredDocks - occupiedDocks);
  const occupancyRatePercent = Math.min(100, Math.round((occupiedDocks / totalMonitoredDocks) * 100));

  const docks: DockInfo[] = [];
  for (let i = 1; i <= totalMonitoredDocks; i++) {
    const label = `Andén ${String(i).padStart(2, '0')}`;
    const occupyingVeh = insideVehs.find(v => v.dockNumber === i || v.assignedDock.includes(String(i)));
    const approachingVeh = !occupyingVeh ? approachingVehs.find(v => v.dockNumber === i || v.assignedDock.includes(String(i))) : undefined;

    let status: DockInfo['status'] = 'libre';
    if (occupyingVeh) status = 'ocupado';
    else if (approachingVeh) status = 'reservado_aproximando';

    const dwellProgress = occupyingVeh ? Math.round(((20 - (occupyingVeh.dockDwellTicks || 0)) / 20) * 100) : 0;

    docks.push({
      dockNumber: i,
      dockLabel: label,
      status,
      currentVehicle: occupyingVeh,
      approachingVehicle: approachingVeh,
      departureTime: occupyingVeh?.departureTime ?? approachingVeh?.departureTime,
      occupancyPercent: occupyingVeh ? Math.round((occupyingVeh.passengerCount / occupyingVeh.maxCapacity) * 100) : 0,
      dwellProgressPercent: dwellProgress
    });
  }

  return {
    terminalId,
    terminalName: terminal?.name ?? terminalId,
    shortName: terminal?.shortName ?? terminalId,
    totalMonitoredDocks,
    capacityPhysicalDocks,
    occupiedDocks,
    availableDocks,
    approachingCount: approachingVehs.length,
    departingCount: departingVehs.length,
    occupancyRatePercent,
    docks
  };
};

// Helper to identify street names strictly along OpenStreetMap (OSM) grid in Estación Central
export const resolveOsmStreetName = (lat: number, lng: number, vehicleType?: string): string => {
  if (vehicleType === 'tren_efe' || (lng > -70.6795 && lng < -70.6780)) {
    if (lat > -33.4530) return 'Estación Central EFE (Vías Férreas y Andenes)';
    if (lat < -33.4670) return 'Faja Vía Férrea EFE · Maestranza Pedro Montt';
    return 'Faja Vía Férrea Central EFE (Vía Confinada)';
  }

  // Terminal Docks inside areas
  if (Math.hypot(lat - (-33.45409), lng - (-70.68445)) < 0.0006) return 'Terminal Alameda (Dársena de Andenes)';
  if (Math.hypot(lat - (-33.45412), lng - (-70.68740)) < 0.0006) return 'Terminal Sur (Dársena de Andenes)';
  if (Math.hypot(lat - (-33.45362), lng - (-70.68046)) < 0.0006) return 'Terminal San Borja (Dársena de Andenes)';

  // General Velásquez Corridor (Express motorway & local frontage road)
  if (lng <= -70.6890 || (lat < -33.4585 && lng < -70.6880) || (lat > -33.4500 && lng < -70.6910)) {
    if (lat < -33.4610) return 'Autopista General Velásquez (Eje Sur / Conexión Ruta 5 Sur)';
    if (lat > -33.4510) return 'Autopista General Velásquez (Eje Norte / Renca / Costanera)';
    return 'Autopista General Velásquez (Vía Expresa & Caletera)';
  }

  // Alameda (East-West corridor)
  if (Math.abs(lat - (-33.4530)) < 0.0009) {
    if (lng < -70.6930) return 'Av. Libertador Bernardo O\'Higgins (Eje Poniente)';
    if (lng > -70.6840) return 'Av. Libertador Bernardo O\'Higgins (Eje Oriente)';
    return 'Av. Libertador Bernardo O\'Higgins (Alameda)';
  }

  // Coronel Souper (East-West corridor)
  if (Math.abs(lat - (-33.4552)) < 0.0006) {
    return 'Calle Coronel Souper (Eje Evacuación Sur)';
  }

  // 5 de Abril (East-West corridor)
  if (Math.abs(lat - (-33.4580)) < 0.0007) {
    return 'Av. 5 de Abril (Eje de Salida & Acceso)';
  }

  // Arica (East-West corridor)
  if (Math.abs(lat - (-33.4602)) < 0.0006) {
    return 'Calle Arica (Enlace General Velásquez)';
  }

  // Ruiz Tagle (North-South corridor)
  if (Math.abs(lng - (-70.6892)) < 0.0006) {
    if (lat > -33.4548 && lat < -33.4536) return 'Calle Ruiz Tagle (Acceso Terminal Sur)';
    return 'Calle Ruiz Tagle';
  }

  // Jotabeche (North-South corridor)
  if (Math.abs(lng - (-70.6868)) < 0.0006) {
    return 'Calle Jotabeche (Acceso Terminal Alameda)';
  }

  // San Francisco de Borja (North-South corridor)
  if (Math.abs(lng - (-70.6806)) < 0.0006) {
    if (lat > -33.4540 && lat < -33.4522) return 'Calle San Francisco de Borja (Terminal San Borja)';
    return 'Calle San Francisco de Borja';
  }

  return 'Red Vial Barrio Terminales (OSM)';
};

export const TransitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<VehicleGPS[]>(MOCK_VEHICLES);
  const [trafficLights, setTrafficLights] = useState<TrafficLightIntersection[]>(INITIAL_TRAFFIC_LIGHTS);
  const [terminals] = useState<Terminal[]>(TERMINALS);
  const [pedestrianCorridors] = useState<PedestrianCorridor[]>(PEDESTRIAN_CORRIDORS);
  const [stopRiskPoints] = useState<StopRiskPoint[]>(STOP_RISK_POINTS);
  const [kpis, setKpis] = useState<SystemKPIs>(INITIAL_KPIS);
  const [uoctLogs, setUoctLogs] = useState<UoctLogEvent[]>([
    {
      id: 'log-1',
      timestamp: '10:22:15',
      intersectionId: 'SEM-02',
      intersectionName: 'Alameda / Ruiz Tagle',
      action: 'PRIORIDAD_GPS_OTORGADA',
      vehiclePlate: 'KZXD-44',
      vehicleCompany: 'TurBus TB-102',
      details: 'Aproximación detectada a 120m. Fase verde extendida +15 seg para despejar salida de Terminal Alameda.'
    },
    {
      id: 'log-2',
      timestamp: '10:21:40',
      intersectionId: 'SEM-05',
      intersectionName: '5 de Abril / Jotabeche',
      action: 'DESCONGESTION_CUADRANTE',
      vehiclePlate: 'LPTR-89',
      vehicleCompany: 'Pullman Bus PB-412',
      details: 'Detección de cola 110m. Se activa ciclo de emergencia para evitar bloqueo de salida Terminal Sur.'
    }
  ]);

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('BUS-TB-102');
  const [selectedTerminalId, setSelectedTerminalId] = useState<string | null>(null);
  const [selectedTrafficLightId, setSelectedTrafficLightId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MainTab>('passenger');
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isRushHour, setIsRushHour] = useState<boolean>(false);
  const [activeFilterCompany, setActiveFilterCompany] = useState<string>('all');
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState<boolean>(false);

  const addUoctLog = useCallback((
    intersectionId: string,
    intersectionName: string,
    action: UoctLogEvent['action'],
    details: string,
    vehiclePlate?: string,
    vehicleCompany?: string
  ) => {
    const newLog: UoctLogEvent = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toLocaleTimeString('es-CL', { hour12: false }),
      intersectionId,
      intersectionName,
      action,
      details,
      vehiclePlate,
      vehicleCompany
    };
    setUoctLogs(prev => [newLog, ...prev.slice(0, 49)]);
  }, []);

  // Main tick simulation loop
  useEffect(() => {
    if (simulationSpeed === 0) return;

    const intervalTime = 1000 / simulationSpeed;
    const interval = setInterval(() => {
      // 1. Move vehicles strictly along OpenStreetMap street network with traffic queuing
      setVehicles(prevVehicles => {
        // Build map of vehicles approaching each traffic light
        const approachingMap = new Map<string, { veh: VehicleGPS; dist: number }[]>();

        prevVehicles.forEach(v => {
          if (v.vehicleType === 'tren_efe') return;
          for (const tl of trafficLights) {
            const d = Math.hypot(tl.lat - v.lat, tl.lng - v.lng);
            if (d < 0.0014) { // within ~140m
              // Check if vehicle is moving toward the intersection
              const hRad = (v.heading * Math.PI) / 180;
              const dLat = tl.lat - v.lat;
              const dLng = tl.lng - v.lng;
              const dot = dLat * Math.cos(hRad) + dLng * Math.sin(hRad);
              if (dot > 0.00005) {
                if (!approachingMap.has(tl.id)) approachingMap.set(tl.id, []);
                approachingMap.get(tl.id)!.push({ veh: v, dist: d });
                break;
              }
            }
          }
        });

        // Sort each queue by proximity to the light (nearest to light is index 0)
        const queueRankMap = new Map<string, number>();
        approachingMap.forEach((list) => {
          list.sort((a, b) => a.dist - b.dist);
          list.forEach((item, rank) => {
            queueRankMap.set(item.veh.id, rank);
          });
        });

        return prevVehicles.map(veh => {
          const path = veh.routePath;
          if (path.length <= 1) return veh;

          // Trains on dedicated railway lines have steady priority and dwell at Estación Central
          if (veh.vehicleType === 'tren_efe') {
            const isAtEfeDock = Math.hypot(veh.lat - (-33.45200), veh.lng - (-70.67880)) < 0.00045;
            if (isAtEfeDock && (veh.dockDwellTicks ?? 0) > 0) {
              const rem = (veh.dockDwellTicks ?? 1) - 1;
              return {
                ...veh,
                speedKmH: rem === 0 ? 35 : 0,
                status: rem === 0 ? 'en_salida_cuadrante' : 'en_anden',
                isInsideTerminal: rem > 0,
                dockDwellTicks: rem,
                passengerCount: Math.min(veh.maxCapacity, (veh.passengerCount || 420) + 4)
              };
            }

            let tIdx = veh.currentWaypointIndex;
            const cCoord = [veh.lat, veh.lng];
            const tCoord = path[tIdx];
            const dLat = tCoord[0] - cCoord[0];
            const dLng = tCoord[1] - cCoord[1];
            const dist = Math.hypot(dLat, dLng);
            const step = 0.00018;

            let nLat = veh.lat;
            let nLng = veh.lng;
            let nIdx = tIdx;

            if (dist <= step) {
              nLat = tCoord[0];
              nLng = tCoord[1];
              nIdx = (tIdx + 1) % path.length;
            } else {
              nLat += (dLat / dist) * step;
              nLng += (dLng / dist) * step;
            }

            const isNowInside = Math.hypot(nLat - (-33.45200), nLng - (-70.67880)) < 0.0005;

            return {
              ...veh,
              lat: nLat,
              lng: nLng,
              currentWaypointIndex: nIdx,
              speedKmH: isNowInside ? 0 : 54,
              status: isNowInside ? 'en_anden' : (nIdx > 4 ? 'en_salida_cuadrante' : 'aproximando'),
              isInsideTerminal: isNowInside,
              dockDwellTicks: isNowInside ? 16 : 0,
              currentStreetName: isNowInside ? 'Estación Central EFE (Andenes Principales)' : 'Faja Vía Férrea EFE Central (Vía Confinada)'
            };
          }

          // 1. Check if bus is currently docked inside terminal (dwell / boarding time)
          if ((veh.dockDwellTicks ?? 0) > 0) {
            const rem = (veh.dockDwellTicks ?? 1) - 1;
            const isDeparting = rem === 0;

            let nextIdx = veh.currentWaypointIndex;
            if (isDeparting) {
              nextIdx = (veh.currentWaypointIndex + 1) % path.length;
            }

            return {
              ...veh,
              speedKmH: isDeparting ? 18 : 0,
              status: isDeparting ? 'en_salida_cuadrante' : 'embarcando',
              isInsideTerminal: !isDeparting,
              dockDwellTicks: rem,
              currentWaypointIndex: nextIdx,
              passengerCount: Math.min(veh.maxCapacity, (veh.passengerCount || 24) + 1),
              currentStreetName: `${veh.assignedDock} (Dársena de Andenes)`
            };
          }

          // 2. Check if bus just reached the terminal dock epicenter
          const [dockLat, dockLng] = getTerminalDockCoords(veh.terminalId);
          const distToDock = Math.hypot(veh.lat - dockLat, veh.lng - dockLng);
          if (distToDock < 0.00035 && veh.status !== 'en_salida_cuadrante') {
            return {
              ...veh,
              lat: dockLat,
              lng: dockLng,
              speedKmH: 0,
              status: 'en_anden',
              isInsideTerminal: true,
              dockDwellTicks: 16 + ((veh.dockNumber || 1) % 6),
              etaMinutes: 0,
              passengerCount: 16,
              currentStreetName: `${veh.assignedDock} (Llegada & Andén)`
            };
          }

          let targetIdx = veh.currentWaypointIndex;
          const currentCoord = [veh.lat, veh.lng];
          const targetCoord = path[targetIdx];

          // Calculate distance to target waypoint
          const dLat = targetCoord[0] - currentCoord[0];
          const dLng = targetCoord[1] - currentCoord[1];
          const distToWaypoint = Math.hypot(dLat, dLng);

          // Check traffic light ahead
          let newSpeed = veh.speedKmH;
          let shouldHalt = false;
          let nearbyLight: TrafficLightIntersection | undefined;

          for (const tl of trafficLights) {
            const tlDist = Math.hypot(tl.lat - veh.lat, tl.lng - veh.lng);
            if (tlDist < 0.0014) {
              const hRad = (veh.heading * Math.PI) / 180;
              const dot = (tl.lat - veh.lat) * Math.cos(hRad) + (tl.lng - veh.lng) * Math.sin(hRad);
              if (dot > 0.00005) {
                nearbyLight = tl;
                const rank = queueRankMap.get(veh.id) ?? 0;
                // Lead vehicle stops ~18m before light, trailing vehicles queue with ~16m gap
                const allowedStopDist = 0.00018 + rank * 0.00016;

                if (tl.currentColor === 'red' || (tl.currentColor === 'yellow' && tlDist < 0.00035)) {
                  if (tlDist <= allowedStopDist) {
                    shouldHalt = true;
                    newSpeed = 0;
                  } else {
                    // Smooth deceleration towards queue position
                    newSpeed = Math.max(6, Math.round(veh.speedKmH * 0.7));
                  }
                } else if (tl.currentColor === 'green') {
                  // Accelerate through intersection
                  newSpeed = Math.min(isRushHour ? 24 : 34, Math.max(16, veh.speedKmH + 6));
                }
                break;
              }
            }
          }

          // If not near light, cruise speed (faster on General Velásquez)
          if (!nearbyLight) {
            const isExpress = veh.corridorType?.includes('velasquez') && (veh.lat < -33.4580 || veh.lat > -33.4500);
            const maxCruise = isExpress ? 48 : (isRushHour ? 22 : 32);
            newSpeed = Math.min(maxCruise, Math.max(18, veh.speedKmH + 4));
          }

          let newLat = veh.lat;
          let newLng = veh.lng;
          let newIdx = targetIdx;
          let newStatus = veh.status;
          let newEta = veh.etaMinutes;

          if (shouldHalt || newSpeed === 0) {
            newSpeed = 0;
            newStatus = 'aproximando';
            newEta = Math.min(15, veh.etaMinutes + 0.05);
          } else {
            // Step size proportional to speed
            const stepFactor = 0.000085 * (newSpeed / 30);

            if (distToWaypoint <= stepFactor || distToWaypoint < 0.00003) {
              newLat = targetCoord[0];
              newLng = targetCoord[1];
              newIdx = (targetIdx + 1) % path.length;

              const remaining = Math.max(0, stepFactor - distToWaypoint);
              if (remaining > 0) {
                const nextTarget = path[newIdx];
                const ndLat = nextTarget[0] - newLat;
                const ndLng = nextTarget[1] - newLng;
                const nextDist = Math.hypot(ndLat, ndLng);
                if (nextDist > 0.00001) {
                  const subTravel = Math.min(nextDist, remaining);
                  newLat += (ndLat / nextDist) * subTravel;
                  newLng += (ndLng / nextDist) * subTravel;
                }
              }
            } else {
              const travel = Math.min(distToWaypoint, stepFactor);
              newLat = veh.lat + (dLat / distToWaypoint) * travel;
              newLng = veh.lng + (dLng / distToWaypoint) * travel;
            }

            newEta = Math.max(1, veh.etaMinutes - 0.03);
          }

          // Compute heading
          const targetForHeading = path[newIdx];
          const hLat = targetForHeading[0] - newLat;
          const hLng = targetForHeading[1] - newLng;
          let headingDeg = veh.heading;
          if (Math.abs(hLat) > 0.000001 || Math.abs(hLng) > 0.000001) {
            const angleRad = Math.atan2(hLng, hLat);
            headingDeg = (angleRad * 180) / Math.PI;
            if (headingDeg < 0) headingDeg += 360;
          }

          // Identify status along corridor
          const insideNow = isVehicleInsideTerminal({ ...veh, lat: newLat, lng: newLng }, veh.terminalId);
          if (insideNow) {
            newStatus = 'en_anden';
          } else if (veh.corridorType?.includes('velasquez') && (newLat < -33.4610 || newLat > -33.4500)) {
            newStatus = 'viaje_en_carretera';
          } else if (veh.status === 'en_salida_cuadrante') {
            newStatus = 'en_salida_cuadrante';
          } else {
            newStatus = 'aproximando';
          }

          // Identify OSM street names
          const currentStreet = resolveOsmStreetName(newLat, newLng, veh.vehicleType);
          const nextCoord = path[newIdx];
          const nextStreet = resolveOsmStreetName(nextCoord[0], nextCoord[1], veh.vehicleType);

          return {
            ...veh,
            lat: Number(newLat.toFixed(5)),
            lng: Number(newLng.toFixed(5)),
            heading: Math.round(headingDeg),
            currentWaypointIndex: newIdx,
            speedKmH: Math.round(newSpeed),
            status: newStatus,
            isInsideTerminal: insideNow,
            etaMinutes: Math.max(1, Math.round(newEta * 10) / 10),
            currentStreetName: currentStreet,
            nextStreetName: nextStreet
          };
        });
      });

      // 2. Traffic Lights cycle update & GPS Priority enforcement
      setTrafficLights(prevLights => {
        return prevLights.map(tl => {
          let secs = tl.secondsRemaining - 1;
          let currentColor = tl.currentColor;
          let isPriority = tl.isPriorityActive;
          let greenDuration = tl.currentGreenDuration;
          let queue = tl.queueLengthMeters;
          let lastReason = tl.lastCycleAdjustmentReason;

          // Check if any bus with priority is approaching this intersection
          const approachingVehicle = vehicles.find(v => {
            const dist = Math.hypot(v.lat - tl.lat, v.lng - tl.lng);
            return dist < 0.0018 && v.priorityRequested;
          });

          if (approachingVehicle && !isPriority) {
            // Trigger automatic UOCT priority!
            isPriority = true;
            if (currentColor === 'red' && secs > 4) {
              secs = 3; // Accelerate red to switch to green quickly
              lastReason = `UOCT: Detección GPS ${approachingVehicle.serviceNumber}. Adelantando fase verde.`;
              addUoctLog(
                tl.id,
                tl.name,
                'PRIORIDAD_GPS_OTORGADA',
                `Detección GPS a 150m (${approachingVehicle.company}). Adelantando fase verde para evitar detención en eje crítico.`,
                approachingVehicle.plate,
                approachingVehicle.company
              );
            } else if (currentColor === 'green') {
              secs = Math.max(secs, 15); // Extend green light!
              lastReason = `UOCT: Extensión de fase verde +15s para paso de ${approachingVehicle.serviceNumber}.`;
              addUoctLog(
                tl.id,
                tl.name,
                'PRIORIDAD_GPS_OTORGADA',
                `Extensión de fase verde +15s. Despeje de andén y salida fluida a ${approachingVehicle.serviceNumber}.`,
                approachingVehicle.plate,
                approachingVehicle.company
              );
            }
          }

          // Count actual queued buses at this corner
          const stoppedBusesAtCorner = vehicles.filter(v => {
            if (v.vehicleType === 'tren_efe') return false;
            const dist = Math.hypot(v.lat - tl.lat, v.lng - tl.lng);
            return dist < 0.0014 && v.speedKmH === 0;
          });
          const stoppedCount = stoppedBusesAtCorner.length;

          if (secs <= 0) {
            // Transition color
            if (currentColor === 'green') {
              currentColor = 'yellow';
              secs = 3;
            } else if (currentColor === 'yellow') {
              currentColor = 'red';
              secs = tl.standardGreenDuration;
              isPriority = false;
            } else {
              // red to green
              currentColor = 'green';
              secs = greenDuration;
              // Wake up stopped buses at this intersection immediately
              setVehicles(prev => prev.map(v => {
                const d = Math.hypot(v.lat - tl.lat, v.lng - tl.lng);
                if (d < 0.0015 && v.speedKmH === 0) {
                  return { ...v, speedKmH: 26 };
                }
                return v;
              }));
            }
          }

          if (currentColor === 'green') {
            queue = Math.max(0, queue - 18);
          } else {
            queue = Math.min(140, Math.max(queue, stoppedCount * 18));
          }

          // Evaluate congestion level based on real queue
          let congestion: TrafficLightIntersection['congestionLevel'] = 'bajo';
          if (queue > 80 || stoppedCount >= 4) congestion = 'critico';
          else if (queue > 50 || stoppedCount >= 2) congestion = 'alto';
          else if (queue > 20 || stoppedCount >= 1) congestion = 'medio';

          return {
            ...tl,
            secondsRemaining: secs,
            currentColor,
            isPriorityActive: isPriority,
            queueLengthMeters: queue,
            congestionLevel: congestion,
            lastCycleAdjustmentReason: lastReason
          };
        });
      });

      // 3. Update dynamic KPIs
      setKpis(prev => ({
        ...prev,
        activeBusesInQuadrant: Math.min(180, Math.max(120, prev.activeBusesInQuadrant + (Math.random() > 0.5 ? 1 : -1))),
        trafficFluencyIndex: Math.min(94, Math.max(65, prev.trafficFluencyIndex + (Math.random() > 0.48 ? 0.3 : -0.3))),
        co2EmissionsSavedKg: Math.round(prev.co2EmissionsSavedKg + 0.2)
      }));

    }, intervalTime);

    return () => clearInterval(interval);
  }, [simulationSpeed, isRushHour, trafficLights, vehicles, addUoctLog]);

  // Actions
  const toggleRushHour = useCallback(() => {
    setIsRushHour(prev => {
      const next = !prev;
      if (next) {
        // High load
        setTrafficLights(tls => tls.map(t => ({
          ...t,
          queueLengthMeters: Math.min(130, t.queueLengthMeters + 35),
          congestionLevel: 'alto'
        })));
        addUoctLog(
          'CUADRANTE',
          'Barrio Terminales - Cuadrante Completo',
          'DESCONGESTION_CUADRANTE',
          'Modo Hora Punta activado: Aumento de flotas concurrentes (TurBus, Pullman, San Borja, EFE). Iniciando algoritmos de despeje continuo.'
        );
      } else {
        addUoctLog(
          'CUADRANTE',
          'Barrio Terminales - Cuadrante Completo',
          'DESCONGESTION_CUADRANTE',
          'Modo Hora Punta desactivado: Retorno a ciclos SCATS adaptativos estándar.'
        );
      }
      return next;
    });
  }, [addUoctLog]);

  const triggerGreenWave = useCallback((axis: 'alameda' | 'cinco_de_abril' | 'san_borja') => {
    let affectedIds: string[] = [];
    let axisName = '';

    if (axis === 'alameda') {
      affectedIds = ['SEM-01', 'SEM-02', 'SEM-03', 'SEM-04', 'SEM-08'];
      axisName = 'Eje Av. Libertador Bernardo O\'Higgins (Alameda Poniente)';
    } else if (axis === 'cinco_de_abril') {
      affectedIds = ['SEM-05', 'SEM-06', 'SEM-09'];
      axisName = 'Eje 5 de Abril / Coronel Souper (Salida Terminal Sur)';
    } else {
      affectedIds = ['SEM-07', 'SEM-10'];
      axisName = 'Eje San Francisco de Borja (Salida Terminal San Borja)';
    }

    setTrafficLights(prev => prev.map(tl => {
      if (affectedIds.includes(tl.id)) {
        return {
          ...tl,
          currentColor: 'green',
          secondsRemaining: 45,
          currentGreenDuration: 55,
          greenWaveActive: true,
          mode: 'ONDA_VERDE_UOCT',
          queueLengthMeters: Math.max(5, tl.queueLengthMeters - 40),
          congestionLevel: 'bajo',
          lastCycleAdjustmentReason: `UOCT Onda Verde forzada por operador en ${axisName}`
        };
      }
      return tl;
    }));

    setKpis(prev => ({
      ...prev,
      uoctPrioritiesGranted: prev.uoctPrioritiesGranted + 1,
      avgExitDelayMinutes: Math.max(2.1, prev.avgExitDelayMinutes - 0.4),
      trafficFluencyIndex: Math.min(95, prev.trafficFluencyIndex + 4)
    }));

    addUoctLog(
      'UOCT-ONDA',
      axisName,
      'ONDA_VERDE_ACTIVADA',
      `Onda Verde UOCT desplegada exitosamente. Sincronización de semáforos a verde continuo durante 55s para evacuación de buses.`
    );
  }, [addUoctLog]);

  const forceTrafficLightState = useCallback((intersectionId: string, color: 'green' | 'red') => {
    let targetTl: TrafficLightIntersection | undefined;
    setTrafficLights(prev => prev.map(tl => {
      if (tl.id === intersectionId) {
        targetTl = tl;
        return {
          ...tl,
          currentColor: color,
          secondsRemaining: color === 'green' ? 45 : 25,
          mode: 'MANUAL',
          queueLengthMeters: color === 'green' ? 0 : Math.max(25, tl.queueLengthMeters),
          congestionLevel: color === 'green' ? 'bajo' : tl.congestionLevel,
          lastCycleAdjustmentReason: `Control manual en 1-Clic por inspector UOCT en sala de mando`
        };
      }
      return tl;
    }));

    // Accelerate waiting vehicles near this intersection if turned green
    if (color === 'green') {
      const currentTl = trafficLights.find(t => t.id === intersectionId) || targetTl;
      if (currentTl) {
        const { lat, lng } = currentTl;
        setVehicles(prev => prev.map(v => {
          const d = Math.hypot(v.lat - lat, v.lng - lng);
          if (d < 0.0016) {
            return { ...v, speedKmH: 34, priorityRequested: true };
          }
          return v;
        }));
      }
    }

    addUoctLog(
      intersectionId,
      trafficLights.find(t => t.id === intersectionId)?.name || intersectionId,
      'CAMBIO_DE_FASE',
      `Fase cambiada en 1-Clic a ${color.toUpperCase()} por operador UOCT. Flujo vehicular actualizado.`
    );
  }, [trafficLights, addUoctLog]);

  const toggleTrafficLight = useCallback((intersectionId: string) => {
    const tl = trafficLights.find(t => t.id === intersectionId);
    if (!tl) return;
    const nextColor = tl.currentColor === 'green' ? 'red' : 'green';
    forceTrafficLightState(intersectionId, nextColor);
  }, [trafficLights, forceTrafficLightState]);

  const clearIntersectionJam = useCallback((intersectionId: string) => {
    forceTrafficLightState(intersectionId, 'green');
    addUoctLog(
      intersectionId,
      trafficLights.find(t => t.id === intersectionId)?.name || intersectionId,
      'DESCONGESTION_CUADRANTE',
      `🟢 Cruce despejado en 1-Clic: Semáforo forzado en verde continuo y cola vehicular liberada.`
    );
  }, [trafficLights, forceTrafficLightState, addUoctLog]);

  const triggerFlowDirection = useCallback((direction: 'llegada' | 'salida') => {
    let affectedIds: string[] = [];
    let flowLabel = '';

    if (direction === 'llegada') {
      affectedIds = ['SEM-01', 'SEM-02', 'SEM-03', 'SEM-04', 'SEM-08'];
      flowLabel = 'Flujo de Llegada a Terminales (Eje Alameda / San Borja)';
    } else {
      affectedIds = ['SEM-05', 'SEM-06', 'SEM-07', 'SEM-09', 'SEM-10'];
      flowLabel = 'Flujo de Salida de Terminales (Ejes Souper, 5 de Abril y Arica)';
    }

    setTrafficLights(prev => prev.map(tl => {
      if (affectedIds.includes(tl.id)) {
        return {
          ...tl,
          currentColor: 'green',
          secondsRemaining: 55,
          currentGreenDuration: 55,
          greenWaveActive: true,
          mode: 'ONDA_VERDE_UOCT',
          queueLengthMeters: 0,
          congestionLevel: 'bajo',
          lastCycleAdjustmentReason: `Sincronización en 1-Clic para ${flowLabel}`
        };
      }
      return tl;
    }));

    setVehicles(prev => prev.map(v => {
      const isTarget = direction === 'llegada'
        ? v.status === 'aproximando' || v.destination.includes('Terminal') || v.destination.includes('Santiago')
        : v.status === 'en_salida_cuadrante' || v.origin.includes('Terminal') || v.origin.includes('Santiago');
      if (isTarget) {
        return { ...v, speedKmH: 34, priorityRequested: true };
      }
      return v;
    }));

    setKpis(prev => ({
      ...prev,
      uoctPrioritiesGranted: prev.uoctPrioritiesGranted + 4,
      avgExitDelayMinutes: Math.max(1.8, prev.avgExitDelayMinutes - 0.5),
      trafficFluencyIndex: Math.min(98, prev.trafficFluencyIndex + 5)
    }));

    addUoctLog(
      'UOCT-FLUJO',
      flowLabel,
      'ONDA_VERDE_ACTIVADA',
      `🟢 ${flowLabel} activado en 1-Clic: Semáforos sincronizados a VERDE para paso libre de buses.`
    );
  }, [addUoctLog]);

  const requestEmergencyPriority = useCallback((vehicleId: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return { ...v, priorityRequested: true };
      }
      return v;
    }));

    const veh = vehicles.find(v => v.id === vehicleId);
    if (veh && veh.targetTrafficLightId) {
      forceTrafficLightState(veh.targetTrafficLightId, 'green');
      addUoctLog(
        veh.targetTrafficLightId,
        'Cruce Objetivo de ' + veh.serviceNumber,
        'PRIORIDAD_GPS_OTORGADA',
        `Prioridad inmediata de emergencia solicitada para ${veh.company} (${veh.plate}). Semáforo abierto en verde.`,
        veh.plate,
        veh.company
      );
    }
  }, [vehicles, forceTrafficLightState, addUoctLog]);

  const injectTrafficIncident = useCallback((locationName: string) => {
    setTrafficLights(prev => prev.map(tl => {
      if (tl.name.includes(locationName) || tl.crossStreet.includes(locationName)) {
        return {
          ...tl,
          queueLengthMeters: 125,
          congestionLevel: 'critico',
          currentColor: 'red',
          secondsRemaining: 30,
          lastCycleAdjustmentReason: `INCIDENTE DETECTADO: Congestión inducida por detención irregular en calzada`
        };
      }
      return tl;
    }));

    addUoctLog(
      'ALERTA-INCIDENTE',
      locationName,
      'ALERTA_RIESGO',
      `Reporte de obstaculización vial en ${locationName}. UOCT activando cámaras C4 y reprogramando intersecciones aledañas.`
    );
  }, [addUoctLog]);

  const getTerminalOccupancy = useCallback((terminalId: TerminalId): TerminalOccupancySummary => {
    return calculateTerminalOccupancy(terminalId, vehicles, terminals);
  }, [vehicles, terminals]);

  const clearTerminalDockJam = useCallback((terminalId: TerminalId) => {
    setVehicles(prev => prev.map(v => {
      if (v.terminalId === terminalId && (v.status === 'en_anden' || v.status === 'embarcando')) {
        return {
          ...v,
          dockDwellTicks: 0,
          status: 'en_salida_cuadrante',
          speedKmH: 22,
          isInsideTerminal: false
        };
      }
      return v;
    }));
    addUoctLog(
      'TERMINAL',
      terminalId.toUpperCase(),
      'DESCONGESTION_CUADRANTE',
      `Operación 1-Clic: Despacho acelerado de buses en andenes de ${terminalId}. Dársenas liberadas para ingreso de flotas.`
    );
  }, [addUoctLog]);

  const resetSimulation = useCallback(() => {
    setVehicles(MOCK_VEHICLES);
    setTrafficLights(INITIAL_TRAFFIC_LIGHTS);
    setKpis(INITIAL_KPIS);
    setIsRushHour(false);
    setSelectedVehicleId('BUS-TB-102');
    addUoctLog(
      'SISTEMA',
      'Plataforma Interconecta Barrio Terminales',
      'DESCONGESTION_CUADRANTE',
      'Simulación restablecida a condiciones normales de operación.'
    );
  }, [addUoctLog]);

  return (
    <TransitContext.Provider
      value={{
        vehicles,
        trafficLights,
        terminals,
        pedestrianCorridors,
        stopRiskPoints,
        kpis,
        uoctLogs,
        selectedVehicleId,
        selectedTerminalId,
        selectedTrafficLightId,
        activeTab,
        simulationSpeed,
        isRushHour,
        activeFilterCompany,
        isVoiceAssistantOpen,
        isMapFullscreen,
        setIsMapFullscreen,
        setIsVoiceAssistantOpen,
        setSelectedVehicleId,
        setSelectedTerminalId,
        setSelectedTrafficLightId,
        setActiveTab,
        setSimulationSpeed,
        setActiveFilterCompany,
        toggleRushHour,
        triggerGreenWave,
        forceTrafficLightState,
        toggleTrafficLight,
        triggerFlowDirection,
        clearIntersectionJam,
        requestEmergencyPriority,
        injectTrafficIncident,
        resetSimulation,
        getTerminalOccupancy,
        isVehicleInsideTerminal,
        clearTerminalDockJam
      }}
    >
      {children}
    </TransitContext.Provider>
  );
};

export const useTransit = () => {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
};
