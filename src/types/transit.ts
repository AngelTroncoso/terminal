export type VehicleType = 'bus_interurbano' | 'bus_rural' | 'tren_efe' | 'metro';

export type TerminalId = 'terminal_sur' | 'terminal_alameda' | 'terminal_san_borja' | 'estacion_trenes_efe' | 'metro_estacion_central';

export interface Terminal {
  id: TerminalId;
  name: string;
  shortName: string;
  operator: string;
  address: string;
  lat: number;
  lng: number;
  capacityDocks: number;
  activeDepartures: number;
  dailyPassengers: number;
  color: string;
  description: string;
  badge: string;
}

export interface RouteWaypoint {
  lat: number;
  lng: number;
  streetName?: string;
}

export type VehicleStatus = 'en_ruta_hacia_terminal' | 'aproximando' | 'en_anden' | 'embarcando' | 'en_salida_cuadrante' | 'viaje_en_carretera';

export type CorridorType = 'local' | 'general_velasquez_norte' | 'general_velasquez_sur';

export interface VehicleGPS {
  id: string;
  plate: string;
  company: string; // TurBus, Pullman Bus, EFE Trenes, Talagante, etc.
  serviceNumber: string;
  origin: string;
  destination: string;
  vehicleType: VehicleType;
  terminalId: TerminalId;
  assignedDock: string; // Andén 12, Pista 4, etc.
  dockNumber?: number; // 1, 2, 3...
  status: VehicleStatus;
  speedKmH: number;
  lat: number;
  lng: number;
  heading: number;
  routePath: [number, number][];
  currentWaypointIndex: number;
  etaMinutes: number;
  passengerCount: number;
  maxCapacity: number;
  priorityRequested: boolean;
  targetTrafficLightId?: string;
  departureTime: string;
  delayMinutes: number;
  driverName: string;
  driverRating: number;
  currentStreetName?: string;
  nextStreetName?: string;
  dockDwellTicks?: number; // ticks staying at dock
  corridorType?: CorridorType;
  isInsideTerminal?: boolean;
}

export interface DockInfo {
  dockNumber: number;
  dockLabel: string;
  status: 'libre' | 'ocupado' | 'reservado_aproximando';
  currentVehicle?: VehicleGPS;
  approachingVehicle?: VehicleGPS;
  departureTime?: string;
  occupancyPercent?: number;
  dwellProgressPercent?: number;
}

export interface TerminalOccupancySummary {
  terminalId: TerminalId;
  terminalName: string;
  shortName: string;
  totalMonitoredDocks: number;
  capacityPhysicalDocks: number;
  occupiedDocks: number;
  availableDocks: number;
  approachingCount: number;
  departingCount: number;
  occupancyRatePercent: number;
  docks: DockInfo[];
}

export type SignalColor = 'green' | 'yellow' | 'red';

export interface TrafficLightIntersection {
  id: string;
  name: string;
  mainStreet: string;
  crossStreet: string;
  lat: number;
  lng: number;
  currentColor: SignalColor;
  secondsRemaining: number;
  standardGreenDuration: number;
  currentGreenDuration: number;
  queueLengthMeters: number;
  congestionLevel: 'bajo' | 'medio' | 'alto' | 'critico';
  isPriorityActive: boolean;
  priorityGrantedToVehicleId?: string;
  greenWaveActive: boolean;
  mode: 'AUTOMATICO_ADAPTATIVO' | 'PRIORIDAD_BUS_GPS' | 'ONDA_VERDE_UOCT' | 'MANUAL';
  lastCycleAdjustmentReason?: string;
}

export interface StopRiskPoint {
  id: string;
  category: 'Vial' | 'Situacional' | 'Social' | 'Siniestro';
  code: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  severity: 'baja' | 'media' | 'alta';
  recommendedAction: string;
}

export interface PedestrianCorridor {
  id: string;
  name: string;
  fromName: string;
  toName: string;
  path: [number, number][];
  distanceMeters: number;
  walkMinutes: number;
  isSafeIlluminated: boolean;
  hasCCTV: boolean;
  carabinerosPatrol: boolean;
}

export interface BarrioTerminalesZone {
  id: string;
  name: string;
  type: 'core_cuadrante_verde' | 'gran_barrio_terminales' | 'terminal_sur_sector' | 'terminal_alameda_sector';
  coordinates: [number, number][];
  color: string;
  fillColor: string;
  fillOpacity: number;
  weight: number;
  dashArray?: string;
  description: string;
}

export interface SystemKPIs {
  totalDailyBuses: number;
  activeBusesInQuadrant: number;
  dailyPassengersTotal: number;
  efePassengersToday: number;
  avgExitDelayMinutes: number;
  trafficFluencyIndex: number; // 0-100%
  uoctPrioritiesGranted: number;
  co2EmissionsSavedKg: number;
}
