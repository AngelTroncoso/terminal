import { Terminal, TrafficLightIntersection, StopRiskPoint, PedestrianCorridor, VehicleGPS, BarrioTerminalesZone } from '../types/transit';

export const TERMINALS: Terminal[] = [
  {
    id: 'terminal_sur',
    name: '① Terminal Sur (Santiago)',
    shortName: '① Term. Sur',
    operator: 'Terminal Sur / 95 Empresas Interurbanas',
    address: 'Av. Libertador Bernardo O\'Higgins 3850',
    lat: -33.4540,
    lng: -70.6882,
    capacityDocks: 68,
    activeDepartures: 440,
    dailyPassengers: 65000,
    color: '#06b6d4',
    description: 'Polo principal de viajes al sur de Chile y destinos internacionales (Argentina, Perú). Sector delimitado en cian.',
    badge: '① 95 Empresas'
  },
  {
    id: 'terminal_alameda',
    name: '② Terminal Alameda',
    shortName: '② Term. Alameda',
    operator: 'TurBus & Pullman Bus (ANDO / WIT)',
    address: 'Av. Libertador Bernardo O\'Higgins 3750 (esq. Jotabeche)',
    lat: -33.4536,
    lng: -70.6865,
    capacityDocks: 52,
    activeDepartures: 1100,
    dailyPassengers: 85000,
    color: '#10b981',
    description: 'Polo de alta frecuencia TurBus y Pullman Bus con salidas minuto a minuto a la costa, norte y centros mineros.',
    badge: '② TurBus & Pullman'
  },
  {
    id: 'terminal_san_borja',
    name: '③ Terminal San Borja',
    shortName: '③ Term. San Borja',
    operator: 'Rodovías S.A. / 55 Empresas',
    address: 'San Francisco de Borja 184 (Mall Arauco Estación)',
    lat: -33.4542,
    lng: -70.6802,
    capacityDocks: 110,
    activeDepartures: 3600,
    dailyPassengers: 120000,
    color: '#6366f1',
    description: 'Mayor nodo de transferencias con 3.600 buses/día: servicios rurales a Talagante, Melipilla, Peñaflor e interurbanos al norte.',
    badge: '③ 3.600 Buses/Día'
  },
  {
    id: 'estacion_trenes_efe',
    name: '④ Terminal de Trenes Estación Central',
    shortName: '④ EFE Trenes',
    operator: 'EFE Trenes de Chile',
    address: 'Av. Libertador Bernardo O\'Higgins 3170 (esq. Exposición)',
    lat: -33.4523,
    lng: -70.6788,
    capacityDocks: 12,
    activeDepartures: 160,
    dailyPassengers: 50000,
    color: '#0284c7',
    description: 'Terminal ferroviario patrimonial de Chile. Tren Nos, Tren Rancagua, Tren Chillán y futuro proyecto Meli-Tren.',
    badge: '④ Red Ferroviaria EFE'
  },
  {
    id: 'metro_estacion_central',
    name: 'Metro Estación Central (Línea 1)',
    shortName: 'Metro L1',
    operator: 'Metro de Santiago',
    address: 'Alameda con Matucana / Exposición (Plaza Argentina)',
    lat: -33.4518,
    lng: -70.6795,
    capacityDocks: 2,
    activeDepartures: 480,
    dailyPassengers: 180146,
    color: '#ef4444',
    description: 'Población flotante más densa de Santiago con 180.146 usuarios diarios interconectando con trenes y buses.',
    badge: '180k Pax Flotante'
  }
];

export const INITIAL_TRAFFIC_LIGHTS: TrafficLightIntersection[] = [
  {
    id: 'SEM-01',
    name: 'Alameda / Gral. Velásquez',
    mainStreet: 'Av. Libertador Bernardo O\'Higgins',
    crossStreet: 'Av. General Velásquez (San Alberto Hurtado)',
    lat: -33.45386,
    lng: -70.69085,
    currentColor: 'green',
    secondsRemaining: 24,
    standardGreenDuration: 35,
    currentGreenDuration: 35,
    queueLengthMeters: 45,
    congestionLevel: 'medio',
    isPriorityActive: false,
    greenWaveActive: false,
    mode: 'AUTOMATICO_ADAPTATIVO',
    lastCycleAdjustmentReason: 'Ciclo regular SCATS hora valle'
  },
  {
    id: 'SEM-02',
    name: 'Alameda / Ruiz Tagle',
    mainStreet: 'Av. Libertador Bernardo O\'Higgins',
    crossStreet: 'Ruiz Tagle',
    lat: -33.45325,
    lng: -70.68770,
    currentColor: 'green',
    secondsRemaining: 18,
    standardGreenDuration: 30,
    currentGreenDuration: 45,
    queueLengthMeters: 75,
    congestionLevel: 'alto',
    isPriorityActive: true,
    priorityGrantedToVehicleId: 'BUS-TB-102',
    greenWaveActive: true,
    mode: 'PRIORIDAD_BUS_GPS',
    lastCycleAdjustmentReason: 'Despeje preferencial salida Terminal Sur y Alameda'
  },
  {
    id: 'SEM-03',
    name: 'Alameda / Jotabeche (Obispo Manuel Umaña)',
    mainStreet: 'Av. Libertador Bernardo O\'Higgins',
    crossStreet: 'Jotabeche / Av. Obispo Manuel Umaña Salinas',
    lat: -33.45252,
    lng: -70.68507,
    currentColor: 'yellow',
    secondsRemaining: 4,
    standardGreenDuration: 35,
    currentGreenDuration: 40,
    queueLengthMeters: 60,
    congestionLevel: 'medio',
    isPriorityActive: false,
    greenWaveActive: true,
    mode: 'ONDA_VERDE_UOCT',
    lastCycleAdjustmentReason: 'Sincronizado en Onda Verde eje Alameda poniente'
  },
  {
    id: 'SEM-04',
    name: 'Alameda / San Borja (Metro Estación Central)',
    mainStreet: 'Av. Libertador Bernardo O\'Higgins',
    crossStreet: 'San Francisco de Borja (Metro Estación Central / Mall)',
    lat: -33.45164,
    lng: -70.68087,
    currentColor: 'red',
    secondsRemaining: 14,
    standardGreenDuration: 30,
    currentGreenDuration: 30,
    queueLengthMeters: 30,
    congestionLevel: 'bajo',
    isPriorityActive: false,
    greenWaveActive: false,
    mode: 'AUTOMATICO_ADAPTATIVO',
    lastCycleAdjustmentReason: 'Cruce peatonal preferencial Metro Estación Central / Mall Plaza Alameda'
  },
  {
    id: 'SEM-05',
    name: '5 de Abril / Jotabeche',
    mainStreet: 'Av. 5 de Abril',
    crossStreet: 'Jotabeche',
    lat: -33.45615,
    lng: -70.68527,
    currentColor: 'green',
    secondsRemaining: 29,
    standardGreenDuration: 25,
    currentGreenDuration: 35,
    queueLengthMeters: 110,
    congestionLevel: 'critico',
    isPriorityActive: true,
    priorityGrantedToVehicleId: 'BUS-PB-412',
    greenWaveActive: false,
    mode: 'PRIORIDAD_BUS_GPS',
    lastCycleAdjustmentReason: 'Alivio de cuello de botella crítico salida sur'
  },
  {
    id: 'SEM-06',
    name: 'Coronel Souper / Ruiz Tagle',
    mainStreet: 'Coronel Souper',
    crossStreet: 'Ruiz Tagle',
    lat: -33.45550,
    lng: -70.68694,
    currentColor: 'red',
    secondsRemaining: 8,
    standardGreenDuration: 25,
    currentGreenDuration: 25,
    queueLengthMeters: 55,
    congestionLevel: 'medio',
    isPriorityActive: false,
    greenWaveActive: false,
    mode: 'AUTOMATICO_ADAPTATIVO',
    lastCycleAdjustmentReason: 'Tránsito local de encomiendas y logística'
  },
  {
    id: 'SEM-07',
    name: 'San Borja / 5 de Abril (Acceso Andenes)',
    mainStreet: 'San Francisco de Borja',
    crossStreet: 'Av. 5 de Abril / Acceso Andenes Terminal San Borja',
    lat: -33.45421,
    lng: -70.68050,
    currentColor: 'green',
    secondsRemaining: 20,
    standardGreenDuration: 30,
    currentGreenDuration: 40,
    queueLengthMeters: 85,
    congestionLevel: 'alto',
    isPriorityActive: true,
    priorityGrantedToVehicleId: 'BUS-FL-88',
    greenWaveActive: true,
    mode: 'PRIORIDAD_BUS_GPS',
    lastCycleAdjustmentReason: 'Onda verde evacuación buses rurales San Borja'
  },
  {
    id: 'SEM-08',
    name: 'Alameda / Exposición (EFE Estación Central)',
    mainStreet: 'Av. Libertador Bernardo O\'Higgins',
    crossStreet: 'Exposición / Matucana',
    lat: -33.45056,
    lng: -70.67788,
    currentColor: 'green',
    secondsRemaining: 15,
    standardGreenDuration: 40,
    currentGreenDuration: 40,
    queueLengthMeters: 40,
    congestionLevel: 'medio',
    isPriorityActive: false,
    greenWaveActive: true,
    mode: 'AUTOMATICO_ADAPTATIVO',
    lastCycleAdjustmentReason: 'Sincronizado con llegada de tren EFE Nos'
  },
  {
    id: 'SEM-09',
    name: '5 de Abril / Gral. Velásquez',
    mainStreet: 'Av. 5 de Abril',
    crossStreet: 'Av. General Velásquez (San Alberto Hurtado)',
    lat: -33.45797,
    lng: -70.68948,
    currentColor: 'green',
    secondsRemaining: 32,
    standardGreenDuration: 35,
    currentGreenDuration: 35,
    queueLengthMeters: 65,
    congestionLevel: 'medio',
    isPriorityActive: false,
    greenWaveActive: false,
    mode: 'AUTOMATICO_ADAPTATIVO',
    lastCycleAdjustmentReason: 'Ingreso a Autopista Central - Eje General Velásquez'
  },
  {
    id: 'SEM-10',
    name: 'San Borja / Arica',
    mainStreet: 'San Francisco de Borja',
    crossStreet: 'Arica',
    lat: -33.45879,
    lng: -70.68080,
    currentColor: 'red',
    secondsRemaining: 12,
    standardGreenDuration: 25,
    currentGreenDuration: 25,
    queueLengthMeters: 20,
    congestionLevel: 'bajo',
    isPriorityActive: false,
    greenWaveActive: false,
    mode: 'AUTOMATICO_ADAPTATIVO',
    lastCycleAdjustmentReason: 'Monitoreo preventivo sector talleres'
  }
];

// ============================================================================
// RUTAS DE CIRCULACION ESTRICTA POR CALZADAS OSM Y CORREDOR GENERAL VELASQUEZ
// ============================================================================

// 1. TERMINAL ALAMEDA: Ruta Local (Alameda - Jotabeche - Andenes - 5 de Abril)
export const ROUTE_TERMINAL_ALAMEDA_LOCAL: [number, number][] = [
  [
    -33.4545,
    -70.69384
  ],
  [
    -33.45386,
    -70.69085
  ],
  [
    -33.45325,
    -70.6877
  ],
  [
    -33.45252,
    -70.68507
  ],
  [
    -33.45262,
    -70.68503
  ],
  [
    -33.4533,
    -70.6848
  ],
  [
    -33.45409,
    -70.68445
  ],
  [
    -33.45548,
    -70.68395
  ],
  [
    -33.45624,
    -70.68536
  ],
  [
    -33.45678,
    -70.68652
  ],
  [
    -33.45737,
    -70.68796
  ],
  [
    -33.45774,
    -70.68897
  ],
  [
    -33.45797,
    -70.68948
  ],
  [
    -33.45742,
    -70.68961
  ],
  [
    -33.45688,
    -70.68978
  ],
  [
    -33.4553,
    -70.69029
  ],
  [
    -33.45386,
    -70.69085
  ],
  [
    -33.4545,
    -70.69384
  ]
];

// 2. TERMINAL ALAMEDA: Ruta Expresa General Velasquez (Sube desde el Sur, entra a andenes, sale al Norte)
export const ROUTE_TERMINAL_ALAMEDA_VELASQUEZ: [number, number][] = [
  [
    -33.4672,
    -70.68831
  ],
  [
    -33.46223,
    -70.68827
  ],
  [
    -33.45788,
    -70.68948
  ],
  [
    -33.45737,
    -70.68796
  ],
  [
    -33.45678,
    -70.68652
  ],
  [
    -33.45624,
    -70.68536
  ],
  [
    -33.45548,
    -70.68395
  ],
  [
    -33.45409,
    -70.68445
  ],
  [
    -33.4533,
    -70.6848
  ],
  [
    -33.45252,
    -70.68507
  ],
  [
    -33.45325,
    -70.6877
  ],
  [
    -33.45386,
    -70.69085
  ],
  [
    -33.45131,
    -70.69165
  ],
  [
    -33.44786,
    -70.69218
  ],
  [
    -33.44784,
    -70.69232
  ],
  [
    -33.45134,
    -70.69179
  ],
  [
    -33.45386,
    -70.69085
  ],
  [
    -33.45534,
    -70.69044
  ],
  [
    -33.45711,
    -70.68986
  ],
  [
    -33.45781,
    -70.68963
  ],
  [
    -33.46223,
    -70.68827
  ],
  [
    -33.4672,
    -70.68831
  ]
];

// Alias para compatibilidad
export const ROUTE_TERMINAL_ALAMEDA: [number, number][] = ROUTE_TERMINAL_ALAMEDA_LOCAL;

// 3. TERMINAL SUR: Ruta Local (Alameda - Ruiz Tagle - Andenes - Coronel Souper)
export const ROUTE_TERMINAL_SUR_LOCAL: [number, number][] = [
  [
    -33.4545,
    -70.69384
  ],
  [
    -33.45386,
    -70.69085
  ],
  [
    -33.45325,
    -70.6877
  ],
  [
    -33.45367,
    -70.68755
  ],
  [
    -33.45412,
    -70.6874
  ],
  [
    -33.45454,
    -70.68726
  ],
  [
    -33.4555,
    -70.68694
  ],
  [
    -33.4557,
    -70.68776
  ],
  [
    -33.45588,
    -70.68848
  ],
  [
    -33.45608,
    -70.68931
  ],
  [
    -33.4562,
    -70.68979
  ],
  [
    -33.45685,
    -70.69014
  ],
  [
    -33.4553,
    -70.69029
  ],
  [
    -33.45386,
    -70.69085
  ],
  [
    -33.4545,
    -70.69384
  ]
];

// 4. TERMINAL SUR: Ruta Expresa General Velasquez (Baja desde el Norte, entra a andenes, sale al Sur)
export const ROUTE_TERMINAL_SUR_VELASQUEZ: [number, number][] = [
  [
    -33.44784,
    -70.69232
  ],
  [
    -33.45134,
    -70.69179
  ],
  [
    -33.45386,
    -70.69085
  ],
  [
    -33.45325,
    -70.6877
  ],
  [
    -33.45367,
    -70.68755
  ],
  [
    -33.45412,
    -70.6874
  ],
  [
    -33.45454,
    -70.68726
  ],
  [
    -33.4555,
    -70.68694
  ],
  [
    -33.4557,
    -70.68776
  ],
  [
    -33.45608,
    -70.68931
  ],
  [
    -33.45685,
    -70.69014
  ],
  [
    -33.45781,
    -70.68963
  ],
  [
    -33.46223,
    -70.68827
  ],
  [
    -33.4672,
    -70.68831
  ],
  [
    -33.46223,
    -70.68827
  ],
  [
    -33.45788,
    -70.68948
  ],
  [
    -33.45688,
    -70.68978
  ],
  [
    -33.4553,
    -70.69029
  ],
  [
    -33.45386,
    -70.69085
  ],
  [
    -33.45131,
    -70.69165
  ],
  [
    -33.44786,
    -70.69218
  ]
];

// Alias para compatibilidad
export const ROUTE_TERMINAL_SUR: [number, number][] = ROUTE_TERMINAL_SUR_LOCAL;

// 5. TERMINAL SAN BORJA: Ruta Local (Alameda - San Francisco de Borja - Andenes - Arica)
export const ROUTE_TERMINAL_SAN_BORJA_LOCAL: [number, number][] = [
  [
    -33.45056,
    -70.67788
  ],
  [
    -33.45164,
    -70.68087
  ],
  [
    -33.45178,
    -70.68033
  ],
  [
    -33.45362,
    -70.68046
  ],
  [
    -33.45421,
    -70.6805
  ],
  [
    -33.4561,
    -70.68062
  ],
  [
    -33.45879,
    -70.6808
  ],
  [
    -33.45898,
    -70.68408
  ],
  [
    -33.45905,
    -70.68534
  ],
  [
    -33.45905,
    -70.68665
  ],
  [
    -33.45911,
    -70.6893
  ],
  [
    -33.45917,
    -70.69221
  ],
  [
    -33.45802,
    -70.68961
  ],
  [
    -33.45737,
    -70.68796
  ],
  [
    -33.45548,
    -70.68395
  ],
  [
    -33.45421,
    -70.6805
  ],
  [
    -33.45178,
    -70.68033
  ],
  [
    -33.45164,
    -70.68087
  ],
  [
    -33.45056,
    -70.67788
  ]
];

// 6. TERMINAL SAN BORJA: Ruta Expresa General Velasquez (Sube desde el Sur por 5 de Abril, entra a andenes, sale por Arica al Sur)
export const ROUTE_TERMINAL_SAN_BORJA_VELASQUEZ: [number, number][] = [
  [
    -33.4672,
    -70.68831
  ],
  [
    -33.46223,
    -70.68827
  ],
  [
    -33.45788,
    -70.68948
  ],
  [
    -33.45737,
    -70.68796
  ],
  [
    -33.45548,
    -70.68395
  ],
  [
    -33.45421,
    -70.6805
  ],
  [
    -33.45362,
    -70.68046
  ],
  [
    -33.45178,
    -70.68033
  ],
  [
    -33.45164,
    -70.68087
  ],
  [
    -33.45262,
    -70.68503
  ],
  [
    -33.45386,
    -70.69085
  ],
  [
    -33.45534,
    -70.69044
  ],
  [
    -33.45711,
    -70.68986
  ],
  [
    -33.45781,
    -70.68963
  ],
  [
    -33.46223,
    -70.68827
  ],
  [
    -33.4672,
    -70.68831
  ]
];

// Alias para compatibilidad
export const ROUTE_TERMINAL_SAN_BORJA: [number, number][] = ROUTE_TERMINAL_SAN_BORJA_LOCAL;

// 7. EFE TRENES: Faja confinada ferroviaria Estacion Central
export const ROUTE_EFE_TRENES: [number, number][] = [
  [
    -33.47,
    -70.6788
  ],
  [
    -33.465,
    -70.6788
  ],
  [
    -33.46,
    -70.6788
  ],
  [
    -33.4555,
    -70.6788
  ],
  [
    -33.452,
    -70.6788
  ],
  [
    -33.4555,
    -70.6788
  ],
  [
    -33.46,
    -70.6788
  ],
  [
    -33.465,
    -70.6788
  ],
  [
    -33.47,
    -70.6788
  ]
];

// Flota completa con 94 vehiculos GPS activos en tiempo real:
// - Terminal Alameda: 28 buses (14 local + 14 General Velasquez)
// - Terminal Sur: 28 buses (14 local + 14 General Velasquez)
// - Terminal San Borja: 32 buses (16 local + 16 General Velasquez)
// - EFE Trenes: 6 convoyes ferroviarios
// Distribuidos entre andenes interiores (conteo de ocupacion en tiempo real) y calzadas/autopistas exteriores.
export const MOCK_VEHICLES: VehicleGPS[] = [
  {
    "id": "BUS-ALA-LOC-1",
    "plate": "ABTR-10",
    "company": "TurBus",
    "serviceNumber": "TB-101",
    "origin": "Santiago",
    "destination": "Viña del Mar",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 01",
    "dockNumber": 1,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45409,
    "lng": -70.68445,
    "heading": 160,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:00",
    "delayMinutes": 3,
    "driverName": "Conductor TB-101",
    "driverRating": 4.6,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 12
  },
  {
    "id": "BUS-ALA-LOC-2",
    "plate": "CGTR-13",
    "company": "Cóndor Bus",
    "serviceNumber": "CB-102",
    "origin": "Santiago",
    "destination": "Valparaíso",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 02",
    "dockNumber": 2,
    "status": "en_salida_cuadrante",
    "speedKmH": 23,
    "lat": -33.45406,
    "lng": -70.69178,
    "heading": 78,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 1,
    "etaMinutes": 2.2,
    "passengerCount": 25,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:04",
    "delayMinutes": 0,
    "driverName": "Conductor CB-102",
    "driverRating": 4.7,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-LOC-3",
    "plate": "ELTR-16",
    "company": "Flota Barrios",
    "serviceNumber": "FB-103",
    "origin": "La Serena",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 03",
    "dockNumber": 3,
    "status": "aproximando",
    "speedKmH": 24,
    "lat": -33.45369,
    "lng": -70.68999,
    "heading": 79,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 2,
    "etaMinutes": 3.2,
    "passengerCount": 26,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:08",
    "delayMinutes": 0,
    "driverName": "Conductor FB-103",
    "driverRating": 4.8,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-LOC-4",
    "plate": "GQTR-19",
    "company": "TurBus Platinum",
    "serviceNumber": "TBP-104",
    "origin": "Santiago",
    "destination": "Coquimbo",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 04",
    "dockNumber": 4,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45409,
    "lng": -70.68445,
    "heading": 160,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:12",
    "delayMinutes": 0,
    "driverName": "Conductor TBP-104",
    "driverRating": 4.9,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 15
  },
  {
    "id": "BUS-ALA-LOC-5",
    "plate": "IVTR-22",
    "company": "TurBus",
    "serviceNumber": "TB-105",
    "origin": "Rancagua",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 05",
    "dockNumber": 5,
    "status": "aproximando",
    "speedKmH": 26,
    "lat": -33.45289,
    "lng": -70.68642,
    "heading": 74,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 3,
    "etaMinutes": 5.2,
    "passengerCount": 28,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:16",
    "delayMinutes": 0,
    "driverName": "Conductor TB-105",
    "driverRating": 5,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-LOC-6",
    "plate": "KBTR-25",
    "company": "Cóndor Bus",
    "serviceNumber": "CB-106",
    "origin": "Santiago",
    "destination": "Curicó",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 06",
    "dockNumber": 6,
    "status": "en_salida_cuadrante",
    "speedKmH": 27,
    "lat": -33.45293,
    "lng": -70.68493,
    "heading": 161,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 5,
    "etaMinutes": 6.2,
    "passengerCount": 29,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:20",
    "delayMinutes": 0,
    "driverName": "Conductor CB-106",
    "driverRating": 4.6,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-LOC-7",
    "plate": "MGTR-28",
    "company": "Flota Barrios",
    "serviceNumber": "FB-107",
    "origin": "Santiago",
    "destination": "Talca",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 07",
    "dockNumber": 7,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45409,
    "lng": -70.68445,
    "heading": 160,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:24",
    "delayMinutes": 3,
    "driverName": "Conductor FB-107",
    "driverRating": 4.7,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 18
  },
  {
    "id": "BUS-ALA-LOC-8",
    "plate": "OLTR-31",
    "company": "TurBus Platinum",
    "serviceNumber": "TBP-108",
    "origin": "Santiago",
    "destination": "Chillán",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 08",
    "dockNumber": 8,
    "status": "en_salida_cuadrante",
    "speedKmH": 29,
    "lat": -33.45592,
    "lng": -70.68477,
    "heading": 242,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 8,
    "etaMinutes": 2.2,
    "passengerCount": 31,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:28",
    "delayMinutes": 0,
    "driverName": "Conductor TBP-108",
    "driverRating": 4.8,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-LOC-9",
    "plate": "QQTR-34",
    "company": "TurBus",
    "serviceNumber": "TB-109",
    "origin": "Concepción",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 09",
    "dockNumber": 9,
    "status": "aproximando",
    "speedKmH": 30,
    "lat": -33.45673,
    "lng": -70.68641,
    "heading": 245,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 9,
    "etaMinutes": 3.2,
    "passengerCount": 32,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:32",
    "delayMinutes": 0,
    "driverName": "Conductor TB-109",
    "driverRating": 4.9,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-LOC-10",
    "plate": "SVTR-37",
    "company": "Cóndor Bus",
    "serviceNumber": "CB-110",
    "origin": "Santiago",
    "destination": "Temuco",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 10",
    "dockNumber": 10,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45409,
    "lng": -70.68445,
    "heading": 160,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:36",
    "delayMinutes": 0,
    "driverName": "Conductor CB-110",
    "driverRating": 5,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 13
  },
  {
    "id": "BUS-ALA-LOC-11",
    "plate": "UBTR-40",
    "company": "Flota Barrios",
    "serviceNumber": "FB-111",
    "origin": "Antofagasta",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 11",
    "dockNumber": 11,
    "status": "aproximando",
    "speedKmH": 32,
    "lat": -33.45763,
    "lng": -70.68956,
    "heading": 347,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 13,
    "etaMinutes": 5.2,
    "passengerCount": 34,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:40",
    "delayMinutes": 0,
    "driverName": "Conductor FB-111",
    "driverRating": 4.6,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-LOC-12",
    "plate": "WGTR-43",
    "company": "TurBus Platinum",
    "serviceNumber": "TBP-112",
    "origin": "Santiago",
    "destination": "Iquique",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 12",
    "dockNumber": 12,
    "status": "en_salida_cuadrante",
    "speedKmH": 33,
    "lat": -33.45588,
    "lng": -70.6901,
    "heading": 342,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 15,
    "etaMinutes": 6.2,
    "passengerCount": 35,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:44",
    "delayMinutes": 0,
    "driverName": "Conductor TBP-112",
    "driverRating": 4.7,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-LOC-13",
    "plate": "YLTR-46",
    "company": "TurBus",
    "serviceNumber": "TB-113",
    "origin": "Santiago",
    "destination": "Viña del Mar",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 13",
    "dockNumber": 13,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45409,
    "lng": -70.68445,
    "heading": 160,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:48",
    "delayMinutes": 3,
    "driverName": "Conductor TB-113",
    "driverRating": 4.8,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 16
  },
  {
    "id": "BUS-ALA-LOC-14",
    "plate": "AQTR-49",
    "company": "Cóndor Bus",
    "serviceNumber": "CB-114",
    "origin": "Santiago",
    "destination": "Valparaíso",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 14",
    "dockNumber": 14,
    "status": "en_salida_cuadrante",
    "speedKmH": 35,
    "lat": -33.45417,
    "lng": -70.69232,
    "heading": 258,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45774,
        -70.68897
      ],
      [
        -33.45797,
        -70.68948
      ],
      [
        -33.45742,
        -70.68961
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 17,
    "etaMinutes": 2.2,
    "passengerCount": 37,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:52",
    "delayMinutes": 0,
    "driverName": "Conductor CB-114",
    "driverRating": 4.9,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-VEL-1",
    "plate": "ABTR-10",
    "company": "TurBus",
    "serviceNumber": "TB-101",
    "origin": "Santiago",
    "destination": "Viña del Mar",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 15",
    "dockNumber": 15,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45409,
    "lng": -70.68445,
    "heading": 336,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 8,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:00",
    "delayMinutes": 3,
    "driverName": "Conductor TB-101",
    "driverRating": 4.6,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": true,
    "dockDwellTicks": 12
  },
  {
    "id": "BUS-ALA-VEL-2",
    "plate": "CGTR-13",
    "company": "Cóndor Bus",
    "serviceNumber": "CB-102",
    "origin": "Santiago",
    "destination": "Valparaíso",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 16",
    "dockNumber": 16,
    "status": "en_salida_cuadrante",
    "speedKmH": 23,
    "lat": -33.46302,
    "lng": -70.68828,
    "heading": 0,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 1,
    "etaMinutes": 2.2,
    "passengerCount": 25,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:04",
    "delayMinutes": 0,
    "driverName": "Conductor CB-102",
    "driverRating": 4.7,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-VEL-3",
    "plate": "ELTR-16",
    "company": "Flota Barrios",
    "serviceNumber": "FB-103",
    "origin": "La Serena",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 17",
    "dockNumber": 17,
    "status": "aproximando",
    "speedKmH": 24,
    "lat": -33.45949,
    "lng": -70.68903,
    "heading": 344,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 2,
    "etaMinutes": 3.2,
    "passengerCount": 26,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:08",
    "delayMinutes": 0,
    "driverName": "Conductor FB-103",
    "driverRating": 4.8,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-VEL-4",
    "plate": "GQTR-19",
    "company": "TurBus Platinum",
    "serviceNumber": "TBP-104",
    "origin": "Santiago",
    "destination": "Coquimbo",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 18",
    "dockNumber": 18,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45409,
    "lng": -70.68445,
    "heading": 336,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 8,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:12",
    "delayMinutes": 0,
    "driverName": "Conductor TBP-104",
    "driverRating": 4.9,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": true,
    "dockDwellTicks": 15
  },
  {
    "id": "BUS-ALA-VEL-5",
    "plate": "IVTR-22",
    "company": "TurBus",
    "serviceNumber": "TB-105",
    "origin": "Rancagua",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 19",
    "dockNumber": 19,
    "status": "aproximando",
    "speedKmH": 26,
    "lat": -33.45569,
    "lng": -70.68434,
    "heading": 62,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 6,
    "etaMinutes": 5.2,
    "passengerCount": 28,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:16",
    "delayMinutes": 0,
    "driverName": "Conductor TB-105",
    "driverRating": 5,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-VEL-6",
    "plate": "KBTR-25",
    "company": "Cóndor Bus",
    "serviceNumber": "CB-106",
    "origin": "Santiago",
    "destination": "Curicó",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 20",
    "dockNumber": 20,
    "status": "en_salida_cuadrante",
    "speedKmH": 27,
    "lat": -33.45253,
    "lng": -70.6851,
    "heading": 254,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 10,
    "etaMinutes": 6.2,
    "passengerCount": 29,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:20",
    "delayMinutes": 0,
    "driverName": "Conductor CB-106",
    "driverRating": 4.6,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-VEL-7",
    "plate": "MGTR-28",
    "company": "Flota Barrios",
    "serviceNumber": "FB-107",
    "origin": "Santiago",
    "destination": "Talca",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 21",
    "dockNumber": 21,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45409,
    "lng": -70.68445,
    "heading": 336,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 8,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:24",
    "delayMinutes": 3,
    "driverName": "Conductor FB-107",
    "driverRating": 4.7,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": true,
    "dockDwellTicks": 18
  },
  {
    "id": "BUS-ALA-VEL-8",
    "plate": "OLTR-31",
    "company": "TurBus Platinum",
    "serviceNumber": "TBP-108",
    "origin": "Santiago",
    "destination": "Chillán",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 22",
    "dockNumber": 22,
    "status": "en_salida_cuadrante",
    "speedKmH": 29,
    "lat": -33.45256,
    "lng": -70.69126,
    "heading": 343,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 12,
    "etaMinutes": 2.2,
    "passengerCount": 31,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:28",
    "delayMinutes": 0,
    "driverName": "Conductor TBP-108",
    "driverRating": 4.8,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-VEL-9",
    "plate": "QQTR-34",
    "company": "TurBus",
    "serviceNumber": "TB-109",
    "origin": "Concepción",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 23",
    "dockNumber": 23,
    "status": "aproximando",
    "speedKmH": 30,
    "lat": -33.44901,
    "lng": -70.692,
    "heading": 351,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 13,
    "etaMinutes": 3.2,
    "passengerCount": 32,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:32",
    "delayMinutes": 0,
    "driverName": "Conductor TB-109",
    "driverRating": 4.9,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-VEL-10",
    "plate": "SVTR-37",
    "company": "Cóndor Bus",
    "serviceNumber": "CB-110",
    "origin": "Santiago",
    "destination": "Temuco",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 24",
    "dockNumber": 24,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45409,
    "lng": -70.68445,
    "heading": 336,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 8,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:36",
    "delayMinutes": 0,
    "driverName": "Conductor CB-110",
    "driverRating": 5,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": true,
    "dockDwellTicks": 13
  },
  {
    "id": "BUS-ALA-VEL-11",
    "plate": "UBTR-40",
    "company": "Flota Barrios",
    "serviceNumber": "FB-111",
    "origin": "Antofagasta",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 25",
    "dockNumber": 25,
    "status": "aproximando",
    "speedKmH": 32,
    "lat": -33.45361,
    "lng": -70.69094,
    "heading": 160,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 16,
    "etaMinutes": 5.2,
    "passengerCount": 34,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:40",
    "delayMinutes": 0,
    "driverName": "Conductor FB-111",
    "driverRating": 4.6,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-VEL-12",
    "plate": "WGTR-43",
    "company": "TurBus Platinum",
    "serviceNumber": "TBP-112",
    "origin": "Santiago",
    "destination": "Iquique",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 26",
    "dockNumber": 26,
    "status": "en_salida_cuadrante",
    "speedKmH": 33,
    "lat": -33.45708,
    "lng": -70.68987,
    "heading": 162,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 18,
    "etaMinutes": 6.2,
    "passengerCount": 35,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:44",
    "delayMinutes": 0,
    "driverName": "Conductor TBP-112",
    "driverRating": 4.7,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-ALA-VEL-13",
    "plate": "YLTR-46",
    "company": "TurBus",
    "serviceNumber": "TB-113",
    "origin": "Santiago",
    "destination": "Viña del Mar",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 27",
    "dockNumber": 27,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45409,
    "lng": -70.68445,
    "heading": 336,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 8,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:48",
    "delayMinutes": 3,
    "driverName": "Conductor TB-113",
    "driverRating": 4.8,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": true,
    "dockDwellTicks": 16
  },
  {
    "id": "BUS-ALA-VEL-14",
    "plate": "AQTR-49",
    "company": "Cóndor Bus",
    "serviceNumber": "CB-114",
    "origin": "Santiago",
    "destination": "Valparaíso",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_alameda",
    "assignedDock": "Andén 28",
    "dockNumber": 28,
    "status": "en_salida_cuadrante",
    "speedKmH": 35,
    "lat": -33.46411,
    "lng": -70.68829,
    "heading": 180,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45678,
        -70.68652
      ],
      [
        -33.45624,
        -70.68536
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45409,
        -70.68445
      ],
      [
        -33.4533,
        -70.6848
      ],
      [
        -33.45252,
        -70.68507
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ],
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 21,
    "etaMinutes": 2.2,
    "passengerCount": 37,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:52",
    "delayMinutes": 0,
    "driverName": "Conductor CB-114",
    "driverRating": 4.9,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-LOC-1",
    "plate": "ABTR-10",
    "company": "Pullman Bus",
    "serviceNumber": "PB-101",
    "origin": "Santiago",
    "destination": "Pichilemu",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 01",
    "dockNumber": 1,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45412,
    "lng": -70.6874,
    "heading": 162,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 5,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:00",
    "delayMinutes": 3,
    "driverName": "Conductor PB-101",
    "driverRating": 4.6,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 12
  },
  {
    "id": "BUS-SUR-LOC-2",
    "plate": "CGTR-13",
    "company": "Jet Sur",
    "serviceNumber": "JS-102",
    "origin": "Santiago",
    "destination": "San Antonio",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 02",
    "dockNumber": 2,
    "status": "en_salida_cuadrante",
    "speedKmH": 23,
    "lat": -33.45418,
    "lng": -70.69236,
    "heading": 78,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 1,
    "etaMinutes": 2.2,
    "passengerCount": 25,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:04",
    "delayMinutes": 0,
    "driverName": "Conductor JS-102",
    "driverRating": 4.7,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-LOC-3",
    "plate": "ELTR-16",
    "company": "Eme Bus",
    "serviceNumber": "EB-103",
    "origin": "Linares",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 03",
    "dockNumber": 3,
    "status": "aproximando",
    "speedKmH": 24,
    "lat": -33.45391,
    "lng": -70.69107,
    "heading": 78,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 1,
    "etaMinutes": 3.2,
    "passengerCount": 26,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:08",
    "delayMinutes": 0,
    "driverName": "Conductor EB-103",
    "driverRating": 4.8,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-LOC-4",
    "plate": "GQTR-19",
    "company": "Buses Linatal",
    "serviceNumber": "LT-104",
    "origin": "Santiago",
    "destination": "Talca",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 04",
    "dockNumber": 4,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45412,
    "lng": -70.6874,
    "heading": 162,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 5,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:12",
    "delayMinutes": 0,
    "driverName": "Conductor LT-104",
    "driverRating": 4.9,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 15
  },
  {
    "id": "BUS-SUR-LOC-5",
    "plate": "IVTR-22",
    "company": "Buses Nilahue",
    "serviceNumber": "NL-105",
    "origin": "Concepción",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 05",
    "dockNumber": 5,
    "status": "aproximando",
    "speedKmH": 26,
    "lat": -33.4534,
    "lng": -70.68848,
    "heading": 79,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 2,
    "etaMinutes": 5.2,
    "passengerCount": 28,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:16",
    "delayMinutes": 0,
    "driverName": "Conductor NL-105",
    "driverRating": 5,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-LOC-6",
    "plate": "KBTR-25",
    "company": "Pullman Bus",
    "serviceNumber": "PB-106",
    "origin": "Santiago",
    "destination": "Los Ángeles",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 06",
    "dockNumber": 6,
    "status": "en_salida_cuadrante",
    "speedKmH": 27,
    "lat": -33.45375,
    "lng": -70.68752,
    "heading": 162,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 4,
    "etaMinutes": 6.2,
    "passengerCount": 29,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:20",
    "delayMinutes": 0,
    "driverName": "Conductor PB-106",
    "driverRating": 4.6,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-LOC-7",
    "plate": "MGTR-28",
    "company": "Jet Sur",
    "serviceNumber": "JS-107",
    "origin": "Santiago",
    "destination": "Villarrica",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 07",
    "dockNumber": 7,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45412,
    "lng": -70.6874,
    "heading": 162,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 5,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:24",
    "delayMinutes": 3,
    "driverName": "Conductor JS-107",
    "driverRating": 4.7,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 18
  },
  {
    "id": "BUS-SUR-LOC-8",
    "plate": "OLTR-31",
    "company": "Eme Bus",
    "serviceNumber": "EB-108",
    "origin": "Santiago",
    "destination": "Pucón",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 08",
    "dockNumber": 8,
    "status": "en_salida_cuadrante",
    "speedKmH": 29,
    "lat": -33.45569,
    "lng": -70.68771,
    "heading": 256,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 2.2,
    "passengerCount": 31,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:28",
    "delayMinutes": 0,
    "driverName": "Conductor EB-108",
    "driverRating": 4.8,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-LOC-9",
    "plate": "QQTR-34",
    "company": "Buses Linatal",
    "serviceNumber": "LT-109",
    "origin": "Puerto Montt",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 09",
    "dockNumber": 9,
    "status": "aproximando",
    "speedKmH": 30,
    "lat": -33.456,
    "lng": -70.68899,
    "heading": 256,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 9,
    "etaMinutes": 3.2,
    "passengerCount": 32,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:32",
    "delayMinutes": 0,
    "driverName": "Conductor LT-109",
    "driverRating": 4.9,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-LOC-10",
    "plate": "SVTR-37",
    "company": "Buses Nilahue",
    "serviceNumber": "NL-110",
    "origin": "Santiago",
    "destination": "Castro",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 10",
    "dockNumber": 10,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45412,
    "lng": -70.6874,
    "heading": 162,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 5,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:36",
    "delayMinutes": 0,
    "driverName": "Conductor NL-110",
    "driverRating": 5,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 13
  },
  {
    "id": "BUS-SUR-LOC-11",
    "plate": "UBTR-40",
    "company": "Pullman Bus",
    "serviceNumber": "PB-111",
    "origin": "Mendoza (AR)",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 11",
    "dockNumber": 11,
    "status": "aproximando",
    "speedKmH": 32,
    "lat": -33.45578,
    "lng": -70.69024,
    "heading": 354,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 12,
    "etaMinutes": 5.2,
    "passengerCount": 34,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:40",
    "delayMinutes": 0,
    "driverName": "Conductor PB-111",
    "driverRating": 4.6,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-LOC-12",
    "plate": "WGTR-43",
    "company": "Jet Sur",
    "serviceNumber": "JS-112",
    "origin": "Santiago",
    "destination": "Osorno",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 12",
    "dockNumber": 12,
    "status": "en_salida_cuadrante",
    "speedKmH": 33,
    "lat": -33.45452,
    "lng": -70.6906,
    "heading": 339,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 13,
    "etaMinutes": 6.2,
    "passengerCount": 35,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:44",
    "delayMinutes": 0,
    "driverName": "Conductor JS-112",
    "driverRating": 4.7,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-LOC-13",
    "plate": "YLTR-46",
    "company": "Eme Bus",
    "serviceNumber": "EB-113",
    "origin": "Santiago",
    "destination": "Pichilemu",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 13",
    "dockNumber": 13,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45412,
    "lng": -70.6874,
    "heading": 162,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 5,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:48",
    "delayMinutes": 3,
    "driverName": "Conductor EB-113",
    "driverRating": 4.8,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 16
  },
  {
    "id": "BUS-SUR-LOC-14",
    "plate": "AQTR-49",
    "company": "Buses Linatal",
    "serviceNumber": "LT-114",
    "origin": "Santiago",
    "destination": "San Antonio",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 14",
    "dockNumber": 14,
    "status": "en_salida_cuadrante",
    "speedKmH": 35,
    "lat": -33.45427,
    "lng": -70.69274,
    "heading": 258,
    "routePath": [
      [
        -33.4545,
        -70.69384
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45588,
        -70.68848
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.4562,
        -70.68979
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.4545,
        -70.69384
      ]
    ],
    "currentWaypointIndex": 14,
    "etaMinutes": 2.2,
    "passengerCount": 37,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:52",
    "delayMinutes": 0,
    "driverName": "Conductor LT-114",
    "driverRating": 4.9,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-VEL-1",
    "plate": "ABTR-10",
    "company": "Pullman Bus",
    "serviceNumber": "PB-101",
    "origin": "Santiago",
    "destination": "Pichilemu",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 15",
    "dockNumber": 15,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45412,
    "lng": -70.6874,
    "heading": 162,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 6,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:00",
    "delayMinutes": 3,
    "driverName": "Conductor PB-101",
    "driverRating": 4.6,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": true,
    "dockDwellTicks": 12
  },
  {
    "id": "BUS-SUR-VEL-2",
    "plate": "CGTR-13",
    "company": "Jet Sur",
    "serviceNumber": "JS-102",
    "origin": "Santiago",
    "destination": "San Antonio",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 16",
    "dockNumber": 16,
    "status": "en_salida_cuadrante",
    "speedKmH": 23,
    "lat": -33.45156,
    "lng": -70.69171,
    "heading": 160,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 2,
    "etaMinutes": 2.2,
    "passengerCount": 25,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:04",
    "delayMinutes": 0,
    "driverName": "Conductor JS-102",
    "driverRating": 4.7,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-VEL-3",
    "plate": "ELTR-16",
    "company": "Eme Bus",
    "serviceNumber": "EB-103",
    "origin": "Linares",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 17",
    "dockNumber": 17,
    "status": "aproximando",
    "speedKmH": 24,
    "lat": -33.4537,
    "lng": -70.69004,
    "heading": 79,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 3,
    "etaMinutes": 3.2,
    "passengerCount": 26,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:08",
    "delayMinutes": 0,
    "driverName": "Conductor EB-103",
    "driverRating": 4.8,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-VEL-4",
    "plate": "GQTR-19",
    "company": "Buses Linatal",
    "serviceNumber": "LT-104",
    "origin": "Santiago",
    "destination": "Talca",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 18",
    "dockNumber": 18,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45412,
    "lng": -70.6874,
    "heading": 162,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 6,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:12",
    "delayMinutes": 0,
    "driverName": "Conductor LT-104",
    "driverRating": 4.9,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": true,
    "dockDwellTicks": 15
  },
  {
    "id": "BUS-SUR-VEL-5",
    "plate": "IVTR-22",
    "company": "Buses Nilahue",
    "serviceNumber": "NL-105",
    "origin": "Concepción",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 19",
    "dockNumber": 19,
    "status": "aproximando",
    "speedKmH": 26,
    "lat": -33.45593,
    "lng": -70.6887,
    "heading": 256,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 9,
    "etaMinutes": 5.2,
    "passengerCount": 28,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:16",
    "delayMinutes": 0,
    "driverName": "Conductor NL-105",
    "driverRating": 5,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-VEL-6",
    "plate": "KBTR-25",
    "company": "Pullman Bus",
    "serviceNumber": "PB-106",
    "origin": "Santiago",
    "destination": "Los Ángeles",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 20",
    "dockNumber": 20,
    "status": "en_salida_cuadrante",
    "speedKmH": 27,
    "lat": -33.45823,
    "lng": -70.6895,
    "heading": 163,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 12,
    "etaMinutes": 6.2,
    "passengerCount": 29,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:20",
    "delayMinutes": 0,
    "driverName": "Conductor PB-106",
    "driverRating": 4.6,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-VEL-7",
    "plate": "MGTR-28",
    "company": "Jet Sur",
    "serviceNumber": "JS-107",
    "origin": "Santiago",
    "destination": "Villarrica",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 21",
    "dockNumber": 21,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45412,
    "lng": -70.6874,
    "heading": 162,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 6,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:24",
    "delayMinutes": 3,
    "driverName": "Conductor JS-107",
    "driverRating": 4.7,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": true,
    "dockDwellTicks": 18
  },
  {
    "id": "BUS-SUR-VEL-8",
    "plate": "OLTR-31",
    "company": "Eme Bus",
    "serviceNumber": "EB-108",
    "origin": "Santiago",
    "destination": "Pucón",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 22",
    "dockNumber": 22,
    "status": "en_salida_cuadrante",
    "speedKmH": 29,
    "lat": -33.46461,
    "lng": -70.68829,
    "heading": 180,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 13,
    "etaMinutes": 2.2,
    "passengerCount": 31,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:28",
    "delayMinutes": 0,
    "driverName": "Conductor EB-108",
    "driverRating": 4.8,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-VEL-9",
    "plate": "QQTR-34",
    "company": "Buses Linatal",
    "serviceNumber": "LT-109",
    "origin": "Puerto Montt",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 23",
    "dockNumber": 23,
    "status": "aproximando",
    "speedKmH": 30,
    "lat": -33.46651,
    "lng": -70.6883,
    "heading": 0,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 14,
    "etaMinutes": 3.2,
    "passengerCount": 32,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:32",
    "delayMinutes": 0,
    "driverName": "Conductor LT-109",
    "driverRating": 4.9,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-VEL-10",
    "plate": "SVTR-37",
    "company": "Buses Nilahue",
    "serviceNumber": "NL-110",
    "origin": "Santiago",
    "destination": "Castro",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 24",
    "dockNumber": 24,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45412,
    "lng": -70.6874,
    "heading": 162,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 6,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:36",
    "delayMinutes": 0,
    "driverName": "Conductor NL-110",
    "driverRating": 5,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": true,
    "dockDwellTicks": 13
  },
  {
    "id": "BUS-SUR-VEL-11",
    "plate": "UBTR-40",
    "company": "Pullman Bus",
    "serviceNumber": "PB-111",
    "origin": "Mendoza (AR)",
    "destination": "Santiago",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 25",
    "dockNumber": 25,
    "status": "aproximando",
    "speedKmH": 32,
    "lat": -33.46003,
    "lng": -70.68888,
    "heading": 344,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 15,
    "etaMinutes": 5.2,
    "passengerCount": 34,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:40",
    "delayMinutes": 0,
    "driverName": "Conductor PB-111",
    "driverRating": 4.6,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-VEL-12",
    "plate": "WGTR-43",
    "company": "Jet Sur",
    "serviceNumber": "JS-112",
    "origin": "Santiago",
    "destination": "Osorno",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 26",
    "dockNumber": 26,
    "status": "en_salida_cuadrante",
    "speedKmH": 33,
    "lat": -33.45687,
    "lng": -70.68978,
    "heading": 342,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 17,
    "etaMinutes": 6.2,
    "passengerCount": 35,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:44",
    "delayMinutes": 0,
    "driverName": "Conductor JS-112",
    "driverRating": 4.7,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-SUR-VEL-13",
    "plate": "YLTR-46",
    "company": "Eme Bus",
    "serviceNumber": "EB-113",
    "origin": "Santiago",
    "destination": "Pichilemu",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 27",
    "dockNumber": 27,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45412,
    "lng": -70.6874,
    "heading": 162,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 6,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:48",
    "delayMinutes": 3,
    "driverName": "Conductor EB-113",
    "driverRating": 4.8,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": true,
    "dockDwellTicks": 16
  },
  {
    "id": "BUS-SUR-VEL-14",
    "plate": "AQTR-49",
    "company": "Buses Linatal",
    "serviceNumber": "LT-114",
    "origin": "Santiago",
    "destination": "San Antonio",
    "vehicleType": "bus_interurbano",
    "terminalId": "terminal_sur",
    "assignedDock": "Andén 28",
    "dockNumber": 28,
    "status": "en_salida_cuadrante",
    "speedKmH": 35,
    "lat": -33.45062,
    "lng": -70.69176,
    "heading": 351,
    "routePath": [
      [
        -33.44784,
        -70.69232
      ],
      [
        -33.45134,
        -70.69179
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45325,
        -70.6877
      ],
      [
        -33.45367,
        -70.68755
      ],
      [
        -33.45412,
        -70.6874
      ],
      [
        -33.45454,
        -70.68726
      ],
      [
        -33.4555,
        -70.68694
      ],
      [
        -33.4557,
        -70.68776
      ],
      [
        -33.45608,
        -70.68931
      ],
      [
        -33.45685,
        -70.69014
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45688,
        -70.68978
      ],
      [
        -33.4553,
        -70.69029
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45131,
        -70.69165
      ],
      [
        -33.44786,
        -70.69218
      ]
    ],
    "currentWaypointIndex": 20,
    "etaMinutes": 2.2,
    "passengerCount": 37,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:52",
    "delayMinutes": 0,
    "driverName": "Conductor LT-114",
    "driverRating": 4.9,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_norte",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-LOC-1",
    "plate": "ABTR-10",
    "company": "Flota Talagante",
    "serviceNumber": "TAL-101",
    "origin": "Santiago",
    "destination": "Talagante",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 01",
    "dockNumber": 1,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45362,
    "lng": -70.68046,
    "heading": 184,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 4,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:00",
    "delayMinutes": 3,
    "driverName": "Conductor TAL-101",
    "driverRating": 4.6,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 12
  },
  {
    "id": "BUS-BOR-LOC-2",
    "plate": "CGTR-13",
    "company": "Buses Melipilla",
    "serviceNumber": "MEL-102",
    "origin": "Santiago",
    "destination": "Melipilla",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 02",
    "dockNumber": 2,
    "status": "en_salida_cuadrante",
    "speedKmH": 23,
    "lat": -33.45156,
    "lng": -70.68066,
    "heading": 250,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 1,
    "etaMinutes": 2.2,
    "passengerCount": 25,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:04",
    "delayMinutes": 0,
    "driverName": "Conductor MEL-102",
    "driverRating": 4.7,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-LOC-3",
    "plate": "ELTR-16",
    "company": "Autobuses Peñaflor",
    "serviceNumber": "PEÑ-103",
    "origin": "Peñaflor",
    "destination": "Santiago",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 03",
    "dockNumber": 3,
    "status": "aproximando",
    "speedKmH": 24,
    "lat": -33.45356,
    "lng": -70.68046,
    "heading": 184,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 3,
    "etaMinutes": 3.2,
    "passengerCount": 26,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:08",
    "delayMinutes": 0,
    "driverName": "Conductor PEÑ-103",
    "driverRating": 4.8,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-LOC-4",
    "plate": "GQTR-19",
    "company": "Bupolsa Buin/Paine",
    "serviceNumber": "BUP-104",
    "origin": "Santiago",
    "destination": "El Monte",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 04",
    "dockNumber": 4,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45362,
    "lng": -70.68046,
    "heading": 184,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 4,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:12",
    "delayMinutes": 0,
    "driverName": "Conductor BUP-104",
    "driverRating": 4.9,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 15
  },
  {
    "id": "BUS-BOR-LOC-5",
    "plate": "IVTR-22",
    "company": "Buses Lampa",
    "serviceNumber": "LAM-105",
    "origin": "Isla de Maipo",
    "destination": "Santiago",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 05",
    "dockNumber": 5,
    "status": "aproximando",
    "speedKmH": 26,
    "lat": -33.45868,
    "lng": -70.68079,
    "heading": 184,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 6,
    "etaMinutes": 5.2,
    "passengerCount": 28,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:16",
    "delayMinutes": 0,
    "driverName": "Conductor LAM-105",
    "driverRating": 5,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-LOC-6",
    "plate": "KBTR-25",
    "company": "Flota Talagante",
    "serviceNumber": "TAL-106",
    "origin": "Santiago",
    "destination": "Buin",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 06",
    "dockNumber": 6,
    "status": "en_salida_cuadrante",
    "speedKmH": 27,
    "lat": -33.45893,
    "lng": -70.68326,
    "heading": 267,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 6.2,
    "passengerCount": 29,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:20",
    "delayMinutes": 0,
    "driverName": "Conductor TAL-106",
    "driverRating": 4.6,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-LOC-7",
    "plate": "MGTR-28",
    "company": "Buses Melipilla",
    "serviceNumber": "MEL-107",
    "origin": "Santiago",
    "destination": "Paine",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 07",
    "dockNumber": 7,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45362,
    "lng": -70.68046,
    "heading": 184,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 4,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:24",
    "delayMinutes": 3,
    "driverName": "Conductor MEL-107",
    "driverRating": 4.7,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 18
  },
  {
    "id": "BUS-BOR-LOC-8",
    "plate": "OLTR-31",
    "company": "Autobuses Peñaflor",
    "serviceNumber": "PEÑ-108",
    "origin": "Santiago",
    "destination": "Calera de Tango",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 08",
    "dockNumber": 8,
    "status": "en_salida_cuadrante",
    "speedKmH": 29,
    "lat": -33.45909,
    "lng": -70.68839,
    "heading": 269,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 10,
    "etaMinutes": 2.2,
    "passengerCount": 31,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:28",
    "delayMinutes": 0,
    "driverName": "Conductor PEÑ-108",
    "driverRating": 4.8,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-LOC-9",
    "plate": "QQTR-34",
    "company": "Bupolsa Buin/Paine",
    "serviceNumber": "BUP-109",
    "origin": "Padre Hurtado",
    "destination": "Santiago",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 09",
    "dockNumber": 9,
    "status": "aproximando",
    "speedKmH": 30,
    "lat": -33.45914,
    "lng": -70.69095,
    "heading": 269,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 11,
    "etaMinutes": 3.2,
    "passengerCount": 32,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:32",
    "delayMinutes": 0,
    "driverName": "Conductor BUP-109",
    "driverRating": 4.9,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-LOC-10",
    "plate": "SVTR-37",
    "company": "Buses Lampa",
    "serviceNumber": "LAM-110",
    "origin": "Santiago",
    "destination": "Malloco",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 10",
    "dockNumber": 10,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45362,
    "lng": -70.68046,
    "heading": 184,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 4,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:36",
    "delayMinutes": 0,
    "driverName": "Conductor LAM-110",
    "driverRating": 5,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 13
  },
  {
    "id": "BUS-BOR-LOC-11",
    "plate": "UBTR-40",
    "company": "Flota Talagante",
    "serviceNumber": "TAL-111",
    "origin": "San Antonio Rural",
    "destination": "Santiago",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 11",
    "dockNumber": 11,
    "status": "aproximando",
    "speedKmH": 32,
    "lat": -33.45764,
    "lng": -70.68865,
    "heading": 68,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 13,
    "etaMinutes": 5.2,
    "passengerCount": 34,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:40",
    "delayMinutes": 0,
    "driverName": "Conductor TAL-111",
    "driverRating": 4.6,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-LOC-12",
    "plate": "WGTR-43",
    "company": "Buses Melipilla",
    "serviceNumber": "MEL-112",
    "origin": "Santiago",
    "destination": "Talagante",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 12",
    "dockNumber": 12,
    "status": "en_salida_cuadrante",
    "speedKmH": 33,
    "lat": -33.45659,
    "lng": -70.6863,
    "heading": 65,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 14,
    "etaMinutes": 6.2,
    "passengerCount": 35,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:44",
    "delayMinutes": 0,
    "driverName": "Conductor MEL-112",
    "driverRating": 4.7,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-LOC-13",
    "plate": "YLTR-46",
    "company": "Autobuses Peñaflor",
    "serviceNumber": "PEÑ-113",
    "origin": "Santiago",
    "destination": "Melipilla",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 13",
    "dockNumber": 13,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45362,
    "lng": -70.68046,
    "heading": 184,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 4,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:48",
    "delayMinutes": 3,
    "driverName": "Conductor PEÑ-113",
    "driverRating": 4.8,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 16
  },
  {
    "id": "BUS-BOR-LOC-14",
    "plate": "AQTR-49",
    "company": "Bupolsa Buin/Paine",
    "serviceNumber": "BUP-114",
    "origin": "Santiago",
    "destination": "Peñaflor",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 14",
    "dockNumber": 14,
    "status": "en_salida_cuadrante",
    "speedKmH": 35,
    "lat": -33.45461,
    "lng": -70.68157,
    "heading": 70,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 15,
    "etaMinutes": 2.2,
    "passengerCount": 37,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:52",
    "delayMinutes": 0,
    "driverName": "Conductor BUP-114",
    "driverRating": 4.9,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-LOC-15",
    "plate": "CVTR-52",
    "company": "Buses Lampa",
    "serviceNumber": "LAM-115",
    "origin": "El Monte",
    "destination": "Santiago",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 15",
    "dockNumber": 15,
    "status": "aproximando",
    "speedKmH": 22,
    "lat": -33.45279,
    "lng": -70.6804,
    "heading": 4,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 16,
    "etaMinutes": 3.2,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:56",
    "delayMinutes": 0,
    "driverName": "Conductor LAM-115",
    "driverRating": 5,
    "currentStreetName": "Red Vial Barrio Terminales",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-LOC-16",
    "plate": "EBTR-55",
    "company": "Flota Talagante",
    "serviceNumber": "TAL-116",
    "origin": "Santiago",
    "destination": "Isla de Maipo",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 16",
    "dockNumber": 16,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45362,
    "lng": -70.68046,
    "heading": 184,
    "routePath": [
      [
        -33.45056,
        -70.67788
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.4561,
        -70.68062
      ],
      [
        -33.45879,
        -70.6808
      ],
      [
        -33.45898,
        -70.68408
      ],
      [
        -33.45905,
        -70.68534
      ],
      [
        -33.45905,
        -70.68665
      ],
      [
        -33.45911,
        -70.6893
      ],
      [
        -33.45917,
        -70.69221
      ],
      [
        -33.45802,
        -70.68961
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45056,
        -70.67788
      ]
    ],
    "currentWaypointIndex": 4,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:00",
    "delayMinutes": 0,
    "driverName": "Conductor TAL-116",
    "driverRating": 4.6,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 19
  },
  {
    "id": "BUS-BOR-VEL-1",
    "plate": "ABTR-10",
    "company": "Flota Talagante",
    "serviceNumber": "TAL-101",
    "origin": "Santiago",
    "destination": "Talagante",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 17",
    "dockNumber": 17,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45362,
    "lng": -70.68046,
    "heading": 4,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:00",
    "delayMinutes": 3,
    "driverName": "Conductor TAL-101",
    "driverRating": 4.6,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": true,
    "dockDwellTicks": 12
  },
  {
    "id": "BUS-BOR-VEL-2",
    "plate": "CGTR-13",
    "company": "Buses Melipilla",
    "serviceNumber": "MEL-102",
    "origin": "Santiago",
    "destination": "Melipilla",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 18",
    "dockNumber": 18,
    "status": "en_salida_cuadrante",
    "speedKmH": 23,
    "lat": -33.46388,
    "lng": -70.68828,
    "heading": 0,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 1,
    "etaMinutes": 2.2,
    "passengerCount": 25,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:04",
    "delayMinutes": 0,
    "driverName": "Conductor MEL-102",
    "driverRating": 4.7,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-VEL-3",
    "plate": "ELTR-16",
    "company": "Autobuses Peñaflor",
    "serviceNumber": "PEÑ-103",
    "origin": "Peñaflor",
    "destination": "Santiago",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 19",
    "dockNumber": 19,
    "status": "aproximando",
    "speedKmH": 24,
    "lat": -33.46104,
    "lng": -70.6886,
    "heading": 344,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 2,
    "etaMinutes": 3.2,
    "passengerCount": 26,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:08",
    "delayMinutes": 0,
    "driverName": "Conductor PEÑ-103",
    "driverRating": 4.8,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-VEL-4",
    "plate": "GQTR-19",
    "company": "Bupolsa Buin/Paine",
    "serviceNumber": "BUP-104",
    "origin": "Santiago",
    "destination": "El Monte",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 20",
    "dockNumber": 20,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45362,
    "lng": -70.68046,
    "heading": 4,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:12",
    "delayMinutes": 0,
    "driverName": "Conductor BUP-104",
    "driverRating": 4.9,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": true,
    "dockDwellTicks": 15
  },
  {
    "id": "BUS-BOR-VEL-5",
    "plate": "IVTR-22",
    "company": "Buses Lampa",
    "serviceNumber": "LAM-105",
    "origin": "Isla de Maipo",
    "destination": "Santiago",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 21",
    "dockNumber": 21,
    "status": "aproximando",
    "speedKmH": 26,
    "lat": -33.45699,
    "lng": -70.68716,
    "heading": 65,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 4,
    "etaMinutes": 5.2,
    "passengerCount": 28,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:16",
    "delayMinutes": 0,
    "driverName": "Conductor LAM-105",
    "driverRating": 5,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-VEL-6",
    "plate": "KBTR-25",
    "company": "Flota Talagante",
    "serviceNumber": "TAL-106",
    "origin": "Santiago",
    "destination": "Buin",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 22",
    "dockNumber": 22,
    "status": "en_salida_cuadrante",
    "speedKmH": 27,
    "lat": -33.45576,
    "lng": -70.68455,
    "heading": 65,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 4,
    "etaMinutes": 6.2,
    "passengerCount": 29,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:20",
    "delayMinutes": 0,
    "driverName": "Conductor TAL-106",
    "driverRating": 4.6,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-VEL-7",
    "plate": "MGTR-28",
    "company": "Buses Melipilla",
    "serviceNumber": "MEL-107",
    "origin": "Santiago",
    "destination": "Paine",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 23",
    "dockNumber": 23,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45362,
    "lng": -70.68046,
    "heading": 4,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:24",
    "delayMinutes": 3,
    "driverName": "Conductor MEL-107",
    "driverRating": 4.7,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": true,
    "dockDwellTicks": 18
  },
  {
    "id": "BUS-BOR-VEL-8",
    "plate": "OLTR-31",
    "company": "Autobuses Peñaflor",
    "serviceNumber": "PEÑ-108",
    "origin": "Santiago",
    "destination": "Calera de Tango",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 24",
    "dockNumber": 24,
    "status": "en_salida_cuadrante",
    "speedKmH": 29,
    "lat": -33.45279,
    "lng": -70.6804,
    "heading": 4,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 2.2,
    "passengerCount": 31,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:28",
    "delayMinutes": 0,
    "driverName": "Conductor PEÑ-108",
    "driverRating": 4.8,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-VEL-9",
    "plate": "QQTR-34",
    "company": "Bupolsa Buin/Paine",
    "serviceNumber": "BUP-109",
    "origin": "Padre Hurtado",
    "destination": "Santiago",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 25",
    "dockNumber": 25,
    "status": "aproximando",
    "speedKmH": 30,
    "lat": -33.45194,
    "lng": -70.68215,
    "heading": 257,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 9,
    "etaMinutes": 3.2,
    "passengerCount": 32,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:32",
    "delayMinutes": 0,
    "driverName": "Conductor BUP-109",
    "driverRating": 4.9,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-VEL-10",
    "plate": "SVTR-37",
    "company": "Buses Lampa",
    "serviceNumber": "LAM-110",
    "origin": "Santiago",
    "destination": "Malloco",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 26",
    "dockNumber": 26,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45362,
    "lng": -70.68046,
    "heading": 4,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:36",
    "delayMinutes": 0,
    "driverName": "Conductor LAM-110",
    "driverRating": 5,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": true,
    "dockDwellTicks": 13
  },
  {
    "id": "BUS-BOR-VEL-11",
    "plate": "UBTR-40",
    "company": "Flota Talagante",
    "serviceNumber": "TAL-111",
    "origin": "San Antonio Rural",
    "destination": "Santiago",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 27",
    "dockNumber": 27,
    "status": "aproximando",
    "speedKmH": 32,
    "lat": -33.45321,
    "lng": -70.68778,
    "heading": 258,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 10,
    "etaMinutes": 5.2,
    "passengerCount": 34,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:40",
    "delayMinutes": 0,
    "driverName": "Conductor TAL-111",
    "driverRating": 4.6,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-VEL-12",
    "plate": "WGTR-43",
    "company": "Buses Melipilla",
    "serviceNumber": "MEL-112",
    "origin": "Santiago",
    "destination": "Talagante",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 28",
    "dockNumber": 28,
    "status": "en_salida_cuadrante",
    "speedKmH": 33,
    "lat": -33.45381,
    "lng": -70.6906,
    "heading": 258,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 10,
    "etaMinutes": 6.2,
    "passengerCount": 35,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:44",
    "delayMinutes": 0,
    "driverName": "Conductor MEL-112",
    "driverRating": 4.7,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-VEL-13",
    "plate": "YLTR-46",
    "company": "Autobuses Peñaflor",
    "serviceNumber": "PEÑ-113",
    "origin": "Santiago",
    "destination": "Melipilla",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 29",
    "dockNumber": 29,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45362,
    "lng": -70.68046,
    "heading": 4,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:48",
    "delayMinutes": 3,
    "driverName": "Conductor PEÑ-113",
    "driverRating": 4.8,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": true,
    "dockDwellTicks": 16
  },
  {
    "id": "BUS-BOR-VEL-14",
    "plate": "AQTR-49",
    "company": "Bupolsa Buin/Paine",
    "serviceNumber": "BUP-114",
    "origin": "Santiago",
    "destination": "Peñaflor",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 30",
    "dockNumber": 30,
    "status": "en_salida_cuadrante",
    "speedKmH": 35,
    "lat": -33.45912,
    "lng": -70.68923,
    "heading": 163,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 14,
    "etaMinutes": 2.2,
    "passengerCount": 37,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:52",
    "delayMinutes": 0,
    "driverName": "Conductor BUP-114",
    "driverRating": 4.9,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-VEL-15",
    "plate": "CVTR-52",
    "company": "Buses Lampa",
    "serviceNumber": "LAM-115",
    "origin": "El Monte",
    "destination": "Santiago",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 31",
    "dockNumber": 31,
    "status": "aproximando",
    "speedKmH": 22,
    "lat": -33.46188,
    "lng": -70.68838,
    "heading": 163,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 14,
    "etaMinutes": 3.2,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-03",
    "departureTime": "10:56",
    "delayMinutes": 0,
    "driverName": "Conductor LAM-115",
    "driverRating": 5,
    "currentStreetName": "Av. General Velásquez",
    "nextStreetName": "Eje Vial Barrio Terminales",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "BUS-BOR-VEL-16",
    "plate": "EBTR-55",
    "company": "Flota Talagante",
    "serviceNumber": "TAL-116",
    "origin": "Santiago",
    "destination": "Isla de Maipo",
    "vehicleType": "bus_rural",
    "terminalId": "terminal_san_borja",
    "assignedDock": "Andén 32",
    "dockNumber": 32,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.45362,
    "lng": -70.68046,
    "heading": 4,
    "routePath": [
      [
        -33.4672,
        -70.68831
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.45788,
        -70.68948
      ],
      [
        -33.45737,
        -70.68796
      ],
      [
        -33.45548,
        -70.68395
      ],
      [
        -33.45421,
        -70.6805
      ],
      [
        -33.45362,
        -70.68046
      ],
      [
        -33.45178,
        -70.68033
      ],
      [
        -33.45164,
        -70.68087
      ],
      [
        -33.45262,
        -70.68503
      ],
      [
        -33.45386,
        -70.69085
      ],
      [
        -33.45534,
        -70.69044
      ],
      [
        -33.45711,
        -70.68986
      ],
      [
        -33.45781,
        -70.68963
      ],
      [
        -33.46223,
        -70.68827
      ],
      [
        -33.4672,
        -70.68831
      ]
    ],
    "currentWaypointIndex": 7,
    "etaMinutes": 0,
    "passengerCount": 38,
    "maxCapacity": 44,
    "priorityRequested": false,
    "targetTrafficLightId": "SEM-02",
    "departureTime": "10:00",
    "delayMinutes": 0,
    "driverName": "Conductor TAL-116",
    "driverRating": 4.6,
    "currentStreetName": "Dársena de Andenes (Terminal)",
    "nextStreetName": "Vía de Salida a Calzada",
    "corridorType": "general_velasquez_sur",
    "isInsideTerminal": true,
    "dockDwellTicks": 19
  },
  {
    "id": "TREN-EFE-101",
    "plate": "EFE-XT-101",
    "company": "EFE Trenes de Chile",
    "serviceNumber": "Tren Nos Express 101",
    "origin": "Nos (San Bernardo)",
    "destination": "Estación Central",
    "vehicleType": "tren_efe",
    "terminalId": "estacion_trenes_efe",
    "assignedDock": "Andén 01",
    "dockNumber": 1,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.452,
    "lng": -70.6788,
    "heading": 0,
    "routePath": [
      [
        -33.47,
        -70.6788
      ],
      [
        -33.465,
        -70.6788
      ],
      [
        -33.46,
        -70.6788
      ],
      [
        -33.4555,
        -70.6788
      ],
      [
        -33.452,
        -70.6788
      ],
      [
        -33.4555,
        -70.6788
      ],
      [
        -33.46,
        -70.6788
      ],
      [
        -33.465,
        -70.6788
      ],
      [
        -33.47,
        -70.6788
      ]
    ],
    "currentWaypointIndex": 5,
    "etaMinutes": 0,
    "passengerCount": 480,
    "maxCapacity": 520,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-08",
    "departureTime": "10:10",
    "delayMinutes": 0,
    "driverName": "Maquinista EFE 1",
    "driverRating": 5,
    "currentStreetName": "Estación Central EFE (Vía 1)",
    "nextStreetName": "Faja Vía Férrea EFE Central",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 15
  },
  {
    "id": "TREN-EFE-102",
    "plate": "EFE-XT-102",
    "company": "EFE Trenes de Chile",
    "serviceNumber": "Tren Nos Express 102",
    "origin": "Estación Central",
    "destination": "Nos (San Bernardo)",
    "vehicleType": "tren_efe",
    "terminalId": "estacion_trenes_efe",
    "assignedDock": "Andén 02",
    "dockNumber": 2,
    "status": "en_salida_cuadrante",
    "speedKmH": 52,
    "lat": -33.4555,
    "lng": -70.6788,
    "heading": 180,
    "routePath": [
      [
        -33.47,
        -70.6788
      ],
      [
        -33.465,
        -70.6788
      ],
      [
        -33.46,
        -70.6788
      ],
      [
        -33.4555,
        -70.6788
      ],
      [
        -33.452,
        -70.6788
      ],
      [
        -33.4555,
        -70.6788
      ],
      [
        -33.46,
        -70.6788
      ],
      [
        -33.465,
        -70.6788
      ],
      [
        -33.47,
        -70.6788
      ]
    ],
    "currentWaypointIndex": 6,
    "etaMinutes": 4,
    "passengerCount": 420,
    "maxCapacity": 520,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-08",
    "departureTime": "10:05",
    "delayMinutes": 0,
    "driverName": "Maquinista EFE 2",
    "driverRating": 5,
    "currentStreetName": "Faja Vía Férrea EFE Central (Sur)",
    "nextStreetName": "Estación Pedro Montt",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "TREN-RANC-01",
    "plate": "EFE-RANC-01",
    "company": "EFE Trenes de Chile",
    "serviceNumber": "Tren Rancagua 01",
    "origin": "Rancagua",
    "destination": "Estación Central",
    "vehicleType": "tren_efe",
    "terminalId": "estacion_trenes_efe",
    "assignedDock": "Andén 03",
    "dockNumber": 3,
    "status": "en_anden",
    "speedKmH": 0,
    "lat": -33.452,
    "lng": -70.6788,
    "heading": 0,
    "routePath": [
      [
        -33.47,
        -70.6788
      ],
      [
        -33.465,
        -70.6788
      ],
      [
        -33.46,
        -70.6788
      ],
      [
        -33.4555,
        -70.6788
      ],
      [
        -33.452,
        -70.6788
      ],
      [
        -33.4555,
        -70.6788
      ],
      [
        -33.46,
        -70.6788
      ],
      [
        -33.465,
        -70.6788
      ],
      [
        -33.47,
        -70.6788
      ]
    ],
    "currentWaypointIndex": 5,
    "etaMinutes": 0,
    "passengerCount": 510,
    "maxCapacity": 520,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-08",
    "departureTime": "10:20",
    "delayMinutes": 0,
    "driverName": "Maquinista EFE 3",
    "driverRating": 5,
    "currentStreetName": "Estación Central EFE (Vía 3)",
    "nextStreetName": "Faja Vía Férrea EFE Central",
    "corridorType": "local",
    "isInsideTerminal": true,
    "dockDwellTicks": 20
  },
  {
    "id": "TREN-RANC-02",
    "plate": "EFE-RANC-02",
    "company": "EFE Trenes de Chile",
    "serviceNumber": "Tren Rancagua 02",
    "origin": "Rancagua",
    "destination": "Estación Central",
    "vehicleType": "tren_efe",
    "terminalId": "estacion_trenes_efe",
    "assignedDock": "Andén 04",
    "dockNumber": 4,
    "status": "aproximando",
    "speedKmH": 52,
    "lat": -33.465,
    "lng": -70.6788,
    "heading": 0,
    "routePath": [
      [
        -33.47,
        -70.6788
      ],
      [
        -33.465,
        -70.6788
      ],
      [
        -33.46,
        -70.6788
      ],
      [
        -33.4555,
        -70.6788
      ],
      [
        -33.452,
        -70.6788
      ],
      [
        -33.4555,
        -70.6788
      ],
      [
        -33.46,
        -70.6788
      ],
      [
        -33.465,
        -70.6788
      ],
      [
        -33.47,
        -70.6788
      ]
    ],
    "currentWaypointIndex": 3,
    "etaMinutes": 2,
    "passengerCount": 390,
    "maxCapacity": 520,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-08",
    "departureTime": "10:25",
    "delayMinutes": 0,
    "driverName": "Maquinista EFE 4",
    "driverRating": 5,
    "currentStreetName": "Faja Vía Férrea EFE Central (Norte)",
    "nextStreetName": "Estación Central EFE",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "TREN-MELI-01",
    "plate": "EFE-MELI-01",
    "company": "EFE Trenes de Chile",
    "serviceNumber": "Meli-Tren 01",
    "origin": "Melipilla / Padre Hurtado",
    "destination": "Estación Central",
    "vehicleType": "tren_efe",
    "terminalId": "estacion_trenes_efe",
    "assignedDock": "Andén 05",
    "dockNumber": 5,
    "status": "aproximando",
    "speedKmH": 52,
    "lat": -33.46,
    "lng": -70.6788,
    "heading": 0,
    "routePath": [
      [
        -33.47,
        -70.6788
      ],
      [
        -33.465,
        -70.6788
      ],
      [
        -33.46,
        -70.6788
      ],
      [
        -33.4555,
        -70.6788
      ],
      [
        -33.452,
        -70.6788
      ],
      [
        -33.4555,
        -70.6788
      ],
      [
        -33.46,
        -70.6788
      ],
      [
        -33.465,
        -70.6788
      ],
      [
        -33.47,
        -70.6788
      ]
    ],
    "currentWaypointIndex": 4,
    "etaMinutes": 1,
    "passengerCount": 460,
    "maxCapacity": 520,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-08",
    "departureTime": "10:30",
    "delayMinutes": 0,
    "driverName": "Maquinista EFE 5",
    "driverRating": 5,
    "currentStreetName": "Faja Vía Férrea EFE Central",
    "nextStreetName": "Estación Central EFE",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  },
  {
    "id": "TREN-EFE-103",
    "plate": "EFE-XT-103",
    "company": "EFE Trenes de Chile",
    "serviceNumber": "Tren Nos Express 103",
    "origin": "Nos (San Bernardo)",
    "destination": "Estación Central",
    "vehicleType": "tren_efe",
    "terminalId": "estacion_trenes_efe",
    "assignedDock": "Andén 06",
    "dockNumber": 6,
    "status": "aproximando",
    "speedKmH": 52,
    "lat": -33.47,
    "lng": -70.6788,
    "heading": 0,
    "routePath": [
      [
        -33.47,
        -70.6788
      ],
      [
        -33.465,
        -70.6788
      ],
      [
        -33.46,
        -70.6788
      ],
      [
        -33.4555,
        -70.6788
      ],
      [
        -33.452,
        -70.6788
      ],
      [
        -33.4555,
        -70.6788
      ],
      [
        -33.46,
        -70.6788
      ],
      [
        -33.465,
        -70.6788
      ],
      [
        -33.47,
        -70.6788
      ]
    ],
    "currentWaypointIndex": 1,
    "etaMinutes": 3,
    "passengerCount": 440,
    "maxCapacity": 520,
    "priorityRequested": true,
    "targetTrafficLightId": "SEM-08",
    "departureTime": "10:35",
    "delayMinutes": 0,
    "driverName": "Maquinista EFE 6",
    "driverRating": 5,
    "currentStreetName": "Faja Vía Férrea EFE Central",
    "nextStreetName": "Estación Central EFE",
    "corridorType": "local",
    "isInsideTerminal": false,
    "dockDwellTicks": 0
  }
];

export const PEDESTRIAN_CORRIDORS: PedestrianCorridor[] = [
  {
    id: 'CORR-01',
    name: 'Corredor Seguro EFE Trenes ➔ Terminal San Borja (Pasarela Segura)',
    fromName: 'Estación Central EFE / Metro L1',
    toName: 'Terminal San Borja (Rodovías)',
    path: [
      [-33.45070, -70.67786], // Explanada Alameda con Exposición EFE
      [-33.45156, -70.68067], // Alameda con San Francisco de Borja
      [-33.45260, -70.68030], // Pasarela Comercial Mall Arauco Estación
      [-33.45409, -70.68049]  // Hall y Andenes Terminal San Borja
    ],
    distanceMeters: 380,
    walkMinutes: 5,
    isSafeIlluminated: true,
    hasCCTV: true,
    carabinerosPatrol: true
  },
  {
    id: 'CORR-02',
    name: 'Eje Peatonal Alameda: EFE Trenes ➔ Terminal Alameda ➔ Terminal Sur',
    fromName: 'Estación Central EFE / Metro L1',
    toName: 'Terminal Sur (Av. Bernardo O\'Higgins)',
    path: [
      [-33.45056, -70.67788], // Explanada EFE / Metro Estación Central (SEM-08)
      [-33.45164, -70.68087], // Alameda con San Francisco de Borja / Metro Estación Central (SEM-04)
      [-33.45252, -70.68507], // Alameda con Jotabeche / Obispo Manuel Umaña (SEM-03)
      [-33.45325, -70.68770], // Alameda con Ruiz Tagle (Terminal Sur / Alameda) (SEM-02)
      [-33.45360, -70.68922], // Alameda con Nicasio Retamales
      [-33.45386, -70.69085]  // Alameda con Av. San Alberto Hurtado (Gral. Velásquez) (SEM-01)
    ],
    distanceMeters: 880,
    walkMinutes: 11,
    isSafeIlluminated: true,
    hasCCTV: true,
    carabinerosPatrol: true
  },
  {
    id: 'CORR-03',
    name: 'Conexión Peatonal Ruiz Tagle: Terminal Sur ➔ Coronel Souper ➔ 5 de Abril',
    fromName: 'Terminal Sur (Alameda)',
    toName: 'Av. 5 de Abril con Ruiz Tagle',
    path: [
      [-33.45325, -70.68770], // Alameda con Ruiz Tagle (SEM-02)
      [-33.45454, -70.68726], // Ruiz Tagle tramo norte
      [-33.45550, -70.68694], // Ruiz Tagle con Coronel Souper (SEM-06)
      [-33.45678, -70.68652]  // 5 de Abril con Ruiz Tagle
    ],
    distanceMeters: 420,
    walkMinutes: 5,
    isSafeIlluminated: true,
    hasCCTV: true,
    carabinerosPatrol: true
  },
  {
    id: 'CORR-04',
    name: 'Conexión Peatonal Jotabeche: Terminal Alameda ➔ 5 de Abril',
    fromName: 'Terminal Alameda (Jotabeche)',
    toName: 'Av. 5 de Abril con Jotabeche',
    path: [
      [-33.45252, -70.68507], // Alameda con Jotabeche (SEM-03)
      [-33.45371, -70.68576], // Jotabeche acceso terminal
      [-33.45431, -70.68565], // Jotabeche tramo medio
      [-33.45615, -70.68527]  // 5 de Abril con Jotabeche (SEM-05)
    ],
    distanceMeters: 370,
    walkMinutes: 5,
    isSafeIlluminated: true,
    hasCCTV: true,
    carabinerosPatrol: true
  },
  {
    id: 'CORR-05',
    name: 'Paseo Conector Interior: Terminal Sur ➔ Terminal Alameda',
    fromName: 'Terminal Sur',
    toName: 'Terminal Alameda',
    path: [
      [-33.45400, -70.68820], // Andenes Terminal Sur
      [-33.45550, -70.68694], // Cruce seguro Ruiz Tagle / Coronel Souper
      [-33.45431, -70.68565], // Conexión a Jotabeche
      [-33.45360, -70.68650]  // Andenes Terminal Alameda
    ],
    distanceMeters: 260,
    walkMinutes: 3,
    isSafeIlluminated: true,
    hasCCTV: true,
    carabinerosPatrol: true
  }
];

// Based on the Carabineros STOP Manual 2026:
// Factores de riesgo en cruces reales (Semaforización, calzada, siniestralidad, aglomeración)
export const STOP_RISK_POINTS: StopRiskPoint[] = [
  {
    id: 'STOP-CRIT-59',
    category: 'Siniestro',
    code: 59,
    name: 'Cruce Alameda / Ruiz Tagle (Salida Terminal Sur)',
    description: 'Intersección con viraje cerrado de buses interurbanos y alto flujo de peatones conectando Terminal Sur y Alameda.',
    lat: -33.45325,
    lng: -70.68770,
    severity: 'alta',
    recommendedAction: 'Fase semafórica exclusiva de viraje protegida por UOCT y barrera peatonal.'
  },
  {
    id: 'STOP-S-14',
    category: 'Situacional',
    code: 14,
    name: 'Cruce Alameda / Jotabeche (Frontis Terminal Alameda)',
    description: 'Frontis Terminal Alameda con sobrecarga de 44.700 pasajeros diarios, paraderos interurbanos y cruce masivo.',
    lat: -33.45252,
    lng: -70.68507,
    severity: 'media',
    recommendedAction: 'Iluminación LED reforzada, presencia policial y tótem informativo en tiempo real.'
  },
  {
    id: 'STOP-V-32',
    category: 'Vial',
    code: 32,
    name: 'Cruce Coronel Souper / Ruiz Tagle',
    description: 'Deterioro en carpeta asfáltica por virajes cerrados de buses de dos pisos y maniobras de carga.',
    lat: -33.45550,
    lng: -70.68694,
    severity: 'media',
    recommendedAction: 'Reparación prioritaria de pavimento por Municipalidad y control de tránsito.'
  },
  {
    id: 'STOP-V-36',
    category: 'Vial',
    code: 36,
    name: 'Cruce 5 de Abril / Jotabeche (Cuello de Botella)',
    description: 'Intersección semafórica con desajuste de ciclos en hora punta frente a salida masiva de buses interurbanos hacia Autopista Central.',
    lat: -33.45615,
    lng: -70.68527,
    severity: 'alta',
    recommendedAction: 'Coordinación con UOCT para Onda Verde y prioridad adaptativa por GPS.'
  },
  {
    id: 'STOP-SEC-18',
    category: 'Situacional',
    code: 18,
    name: 'Cruce 5 de Abril / Ruiz Tagle',
    description: 'Punto de cruce peatonal de vecinos y estudiantes de colegios aledaños con comercio en calzadas.',
    lat: -33.45678,
    lng: -70.68652,
    severity: 'media',
    recommendedAction: 'Despeje de veredas y refuerzo de cruce semaforizado con aviso acústico.'
  },
  {
    id: 'STOP-SOC-25',
    category: 'Social',
    code: 25,
    name: 'San Francisco de Borja / Acceso Pasarela San Borja',
    description: 'Ocupación de veredas peatonales y alta congestión en acceso a andenes interurbanos y rurales.',
    lat: -33.45409,
    lng: -70.68049,
    severity: 'media',
    recommendedAction: 'Plan de despeje de pasarela, cuadrante seguro y televigilancia C4.'
  },
  {
    id: 'STOP-SEG-01',
    category: 'Siniestro',
    code: 1,
    name: 'Cruce Alameda / Exposición (Explanada Estación Central)',
    description: 'Zona de masiva afluencia en combinación Metro L1 y EFE Trenes, prevención focalizada de aglomeraciones y hurtos.',
    lat: -33.45056,
    lng: -70.67788,
    severity: 'alta',
    recommendedAction: 'Punto fijo de Carabineros y coordinación con guardias tácticos EFE/Metro.'
  },
  {
    id: 'STOP-VIAL-12',
    category: 'Vial',
    code: 12,
    name: 'Cruce 5 de Abril / Av. San Alberto Hurtado (Gral. Velásquez)',
    description: 'Acceso a autopista de alta velocidad con entrecruzamiento de buses interprovinciales y camiones.',
    lat: -33.45797,
    lng: -70.68948,
    severity: 'alta',
    recommendedAction: 'Monitoreo UOCT y cámaras de velocidad preventiva.'
  },
  {
    id: 'STOP-V-44',
    category: 'Vial',
    code: 44,
    name: 'Cruce San Francisco de Borja / Calle Arica',
    description: 'Tránsito nocturno de buses rurales vacíos hacia talleres con reducida iluminación peatonal.',
    lat: -33.45879,
    lng: -70.68080,
    severity: 'baja',
    recommendedAction: 'Patrullaje preventivo de 21ª Comisaría y luminarias viales.'
  }
];

export const INITIAL_KPIS = {
  totalDailyBuses: 5140,
  activeBusesInQuadrant: 142,
  dailyPassengersTotal: 231300,
  efePassengersToday: 48500,
  avgExitDelayMinutes: 4.2, // reduced from 22 mins thanks to UOCT coordination
  trafficFluencyIndex: 78, // %
  uoctPrioritiesGranted: 89,
  co2EmissionsSavedKg: 420
};

// Polígonos de demarcación oficial según plano "BARRIO TERMINALES":
// 1) Cuadrante Núcleo Terminales (Delimitado en verde vibrante, alineado estrictamente a Alameda, Gral. Velásquez, 5 de Abril y Jotabeche)
// 2) Sector Terminal Sur ① (cian)
// 3) Sector Terminal Alameda ② (verde esmeralda)
// 4) Gran Barrio Terminales (polígono exterior azul que abarca San Borja ③, EFE Trenes ④ y límite sur Calle Arica)
export const BARRIO_TERMINALES_ZONES: BarrioTerminalesZone[] = [
  {
    id: 'cuadrante_nucleo_verde',
    name: 'Polígono Barrio Terminales (Demarcación Oficial en Verde)',
    type: 'core_cuadrante_verde',
    coordinates: [
      [-33.45386, -70.69085], // Vértice Norponiente: Alameda con Autopista General Velásquez (San Alberto Hurtado)
      [-33.45360, -70.68922], // Eje Alameda frente a Nicasio Retamales
      [-33.45325, -70.68770], // Eje Alameda con Ruiz Tagle
      [-33.45252, -70.68507], // Vértice Nororiente: Alameda con Calle Jotabeche / Obispo Manuel Umaña
      [-33.45431, -70.68565], // Eje Jotabeche tramo medio
      [-33.45615, -70.68527], // Vértice Suroriente: Calle Jotabeche con Avenida 5 de Abril
      [-33.45678, -70.68652], // Eje 5 de Abril con Ruiz Tagle
      [-33.45737, -70.68796], // Eje 5 de Abril con Nicasio Retamales
      [-33.45797, -70.68948], // Vértice Surponiente: Avenida 5 de Abril con Autopista General Velásquez
      [-33.45685, -70.69014], // Eje General Velásquez con Coronel Souper
      [-33.45524, -70.69067], // Eje General Velásquez tramo central
      [-33.45386, -70.69085]  // Cierre en Alameda / General Velásquez
    ],
    color: '#10b981',       // Verde esmeralda de alta visibilidad
    fillColor: '#10b981',
    fillOpacity: 0.16,
    weight: 3.5,
    description: 'Cuadrante núcleo del Barrio Terminales delimitado exactamente según el plano oficial: Alameda al Norte, General Velásquez al Poniente, 5 de Abril al Sur y Jotabeche al Oriente.'
  },
  {
    id: 'terminal_sur_sector',
    name: '① Sector Terminal Sur (Santiago)',
    type: 'terminal_sur_sector',
    coordinates: [
      [-33.45386, -70.69085], // Alameda con General Velásquez
      [-33.45325, -70.68770], // Alameda con Ruiz Tagle / Federico Reich
      [-33.45550, -70.68694], // Coronel Souper con Ruiz Tagle
      [-33.45685, -70.69014], // Coronel Souper con General Velásquez
      [-33.45386, -70.69085]
    ],
    color: '#06b6d4',       // Cian idéntico al destacado ① de la imagen
    fillColor: '#06b6d4',
    fillOpacity: 0.30,
    weight: 2,
    description: 'Área interior del Terminal Sur sobre Alameda 3850 y General Velásquez.'
  },
  {
    id: 'terminal_alameda_sector',
    name: '② Sector Terminal Alameda (TurBus & Pullman)',
    type: 'terminal_alameda_sector',
    coordinates: [
      [-33.45325, -70.68770], // Alameda con Ruiz Tagle
      [-33.45252, -70.68507], // Alameda con Jotabeche
      [-33.45431, -70.68565], // Jotabeche tramo medio
      [-33.45550, -70.68694], // Coronel Souper con Ruiz Tagle
      [-33.45325, -70.68770]
    ],
    color: '#22c55e',       // Verde de contraste ②
    fillColor: '#22c55e',
    fillOpacity: 0.22,
    weight: 2,
    description: 'Área del Terminal Alameda sobre Alameda 3750 y Jotabeche.'
  },
  {
    id: 'gran_barrio_terminales',
    name: 'Gran Barrio Terminales (Área Metropolitana Extendida)',
    type: 'gran_barrio_terminales',
    coordinates: [
      [-33.45386, -70.69250], // Alameda poniente
      [-33.45252, -70.68507], // Eje Alameda frente a terminales
      [-33.45164, -70.68087], // Eje Alameda frente a San Borja (Metro Estación Central)
      [-33.45056, -70.67788], // Alameda con Exposición / Estación Central EFE
      [-33.45500, -70.67800], // Exposición / Vías férreas EFE
      [-33.45860, -70.67800], // Exposición con Calle Arica
      [-33.45879, -70.68080], // Calle Arica con San Francisco de Borja
      [-33.45898, -70.68408], // Calle Arica con Obispo Umaña
      [-33.45905, -70.68552], // Calle Arica con Jotabeche
      [-33.45916, -70.69179], // Calle Arica con General Velásquez
      [-33.45920, -70.69250], // Calle Arica poniente
      [-33.45386, -70.69250]  // Cierre en Alameda
    ],
    color: '#3b82f6',       // Azul translúcido de la imagen general
    fillColor: '#3b82f6',
    fillOpacity: 0.08,
    weight: 2,
    dashArray: '6, 6',
    description: 'Polígono completo del Gran Barrio Terminales abarcando los 4 terminales (Sur, Alameda, San Borja, EFE Trenes) hasta Calle Arica.'
  }
];

export interface StreetLabel {
  name: string;
  lat: number;
  lng: number;
  rotation?: number;
  color?: string;
}

export const BARRIO_TERMINALES_STREET_LABELS: StreetLabel[] = [
  { name: 'Av. Libertador Bernardo O\'Higgins (Alameda)', lat: -33.45310, lng: -70.68830, color: '#facc15' },
  { name: 'General Velásquez', lat: -33.45580, lng: -70.69060, color: '#38bdf8' },
  { name: '5 de abril', lat: -33.45710, lng: -70.68740, color: '#f97316' },
  { name: 'Jotabeche', lat: -33.45460, lng: -70.68565, color: '#a78bfa' },
  { name: 'Ruiz Tagle', lat: -33.45450, lng: -70.68720, color: '#94a3b8' },
  { name: 'Cnel. Souper', lat: -33.45550, lng: -70.68850, color: '#94a3b8' },
  { name: 'Nicasio Retamales', lat: -33.45550, lng: -70.68940, color: '#94a3b8' },
  { name: 'Federico Reich', lat: -33.45480, lng: -70.68820, color: '#94a3b8' },
  { name: 'Calle Arica', lat: -33.45890, lng: -70.68450, color: '#cbd5e1' },
  { name: 'San Fco. Borja', lat: -33.45550, lng: -70.68060, color: '#818cf8' },
  { name: 'Exposición', lat: -33.45250, lng: -70.67800, color: '#38bdf8' }
];
