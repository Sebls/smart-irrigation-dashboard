import type {
  ActivityEvent,
  Device,
  DeviceImage,
  DeviceLog,
  DeviceLogLevel,
  IrrigationJob,
  IrrigationZone,
  PlantEntity,
  Sensor,
  SensorReading,
  SensorReadingRecord,
  TelemetryReadingIdentity,
  Zone,
} from '@/types'

// NOTE: This file is imported by both server and client bundles in Next.js.
// Keep mock generation deterministic to avoid hydration mismatches.

const BASE_NOW = new Date('2026-01-26T12:00:00.000Z')
export const MOCK_BASE_NOW = BASE_NOW

function hashStringToU32(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randFor(key: string) {
  return mulberry32(hashStringToU32(key))
}

function generateReadings(
  seedKey: string,
  baseValue: number,
  variance: number,
  count: number = 24,
): SensorReading[] {
  const readings: SensorReading[] = []
  const r = randFor(`readings:${seedKey}`)
  for (let i = count - 1; i >= 0; i--) {
    readings.push({
      timestamp: new Date(BASE_NOW.getTime() - i * 60 * 60 * 1000),
      value: baseValue + (r() - 0.5) * variance * 2,
    })
  }
  return readings
}

function minutesAgo(minutes: number) {
  return new Date(BASE_NOW.getTime() - minutes * 60 * 1000)
}

function hoursAgo(hours: number) {
  return minutesAgo(hours * 60)
}

function daysAgo(days: number) {
  return hoursAgo(days * 24)
}

function generateReadingRecords(opts: {
  sensorId: string
  seedKey: string
  baseValue: number
  variance: number
  count: number
  everyMinutes: number
  endAt?: Date
}): SensorReadingRecord[] {
  const endAt = opts.endAt ?? BASE_NOW
  const r = randFor(`readingRecords:${opts.seedKey}:${opts.sensorId}`)
  const rows: SensorReadingRecord[] = []
  for (let i = opts.count - 1; i >= 0; i--) {
    const recorded_at = new Date(endAt.getTime() - i * opts.everyMinutes * 60 * 1000)
    rows.push({
      id: `${opts.sensorId}-reading-${i + 1}`,
      sensor_id: opts.sensorId,
      recorded_at,
      value: opts.baseValue + (r() - 0.5) * opts.variance * 2,
    })
  }
  return rows
}

export const mockZones: IrrigationZone[] = [
  {
    id: 'zone-1',
    name: 'Front Garden',
    isActive: true,
    plantCount: 2,
    avgHumidity: 68,
    temperature: 24,
    airHumidity: 62,
    airQuality: 92,
    lastIrrigated: new Date(BASE_NOW.getTime() - 2 * 60 * 60 * 1000),
    plants: [
      {
        id: 'plant-1-1',
        name: 'Rose Bush',
        zoneId: 'zone-1',
        humidity: 72,
        health: 'excellent',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          {
            id: 's-1-1-1',
            plantId: 'plant-1-1',
            name: 'Root Level',
            humidity: 74,
            readings: generateReadings('s-1-1-1', 74, 5),
          },
          {
            id: 's-1-1-2',
            plantId: 'plant-1-1',
            name: 'Mid Level',
            humidity: 70,
            readings: generateReadings('s-1-1-2', 70, 6),
          },
        ]
      },
      {
        id: 'plant-1-2',
        name: 'Lavender',
        zoneId: 'zone-1',
        humidity: 58,
        health: 'good',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          {
            id: 's-1-2-1',
            plantId: 'plant-1-2',
            name: 'Root Level',
            humidity: 60,
            readings: generateReadings('s-1-2-1', 60, 4),
          },
          {
            id: 's-1-2-2',
            plantId: 'plant-1-2',
            name: 'Mid Level',
            humidity: 56,
            readings: generateReadings('s-1-2-2', 56, 5),
          },
        ]
      }
    ]
  }
]

// -----------------------------------------------------------------------------
// Requirements-driven entities (admin/data views)
// -----------------------------------------------------------------------------

export const mockZonesDb: Zone[] = [
  {
    id: '0f3c2c7a-8c8e-4aef-8a5c-2f8a2d6b2a01',
    name: 'Front Garden',
    is_active: true,
    created_at: daysAgo(90),
    updated_at: daysAgo(1),
    deleted_at: null,
  },
  {
    id: '1caa7b46-0b2a-49b6-8a93-1b8d2d9b7c02',
    name: 'Greenhouse',
    is_active: true,
    created_at: daysAgo(60),
    updated_at: hoursAgo(12),
    deleted_at: null,
  },
]

export const mockPlantsDb: PlantEntity[] = [
  {
    id: 'b0f1b907-17a8-4e9e-a539-4a3d4d1b1a11',
    name: 'Rose Bush',
    zone_id: mockZonesDb[0]!.id,
    image_url: '/placeholder.svg?height=200&width=200',
    health: 'excellent',
  },
  {
    id: 'f2b901d8-40f1-4d93-88b8-0b1f0fdc1a12',
    name: 'Lavender',
    zone_id: mockZonesDb[0]!.id,
    image_url: '/placeholder.svg?height=200&width=200',
    health: 'good',
  },
  {
    id: 'c6d6a55e-03a9-4e2d-9bb2-7a2cf6f21a13',
    name: 'Tomatoes',
    zone_id: mockZonesDb[1]!.id,
    image_url: '/placeholder.svg?height=200&width=200',
    health: 'needs-attention',
  },
]

export const mockSensorsDb: Sensor[] = [
  {
    id: '2d6d9d2a-2b85-4a91-9f1b-000000000001',
    name: 'Soil Humidity - Rose (Root)',
    type: 'soil_humidity',
    unit: '%',
    is_active: true,
    zone_id: mockPlantsDb[0]!.zone_id,
    plant_id: mockPlantsDb[0]!.id,
    created_at: daysAgo(40),
    updated_at: hoursAgo(3),
    deleted_at: null,
  },
  {
    id: '2d6d9d2a-2b85-4a91-9f1b-000000000002',
    name: 'Soil Humidity - Lavender (Root)',
    type: 'soil_humidity',
    unit: '%',
    is_active: true,
    zone_id: mockPlantsDb[1]!.zone_id,
    plant_id: mockPlantsDb[1]!.id,
    created_at: daysAgo(40),
    updated_at: hoursAgo(2),
    deleted_at: null,
  },
  {
    id: '2d6d9d2a-2b85-4a91-9f1b-000000000003',
    name: 'Air Temperature - Greenhouse',
    type: 'air_temperature',
    unit: '°C',
    is_active: true,
    zone_id: mockZonesDb[1]!.id,
    plant_id: null,
    created_at: daysAgo(25),
    updated_at: hoursAgo(1),
    deleted_at: null,
  },
  {
    id: '2d6d9d2a-2b85-4a91-9f1b-000000000004',
    name: 'Soil Humidity - Tomatoes (Root)',
    type: 'soil_humidity',
    unit: '%',
    is_active: true,
    zone_id: mockPlantsDb[2]!.zone_id,
    plant_id: mockPlantsDb[2]!.id,
    created_at: daysAgo(20),
    updated_at: minutesAgo(45),
    deleted_at: null,
  },
]

export const mockSensorReadingsDbBySensorId: Record<string, SensorReadingRecord[]> =
  Object.fromEntries(
    mockSensorsDb.map((s) => {
      const base =
        s.type === 'air_temperature'
          ? 24
          : 60
      const variance =
        s.type === 'air_temperature'
          ? 3
          : 12
      const readings = generateReadingRecords({
        sensorId: s.id,
        seedKey: s.type,
        baseValue: base,
        variance,
        count: 480, // 10 days @ 30-minute cadence
        everyMinutes: 30,
      })
      return [s.id, readings]
    }),
  )

export const mockDevicesDb: Device[] = [
  {
    id: '9a9a3d1e-9b1a-4f2f-8f70-1e2e3e4e5e01',
    name: 'Irrigation Controller #1',
    description: 'Front garden controller (valves + cameras)',
    is_active: true,
    is_online: true,
    last_seen_at: minutesAgo(3),
    uptime: 12 * 24 * 60 * 60 + 3412,
    hardware_id: 'AA:BB:CC:DD:EE:01',
    created_at: daysAgo(120),
    updated_at: minutesAgo(3),
  },
  {
    id: '9a9a3d1e-9b1a-4f2f-8f70-1e2e3e4e5e02',
    name: 'Greenhouse Gateway',
    description: 'Greenhouse sensor gateway',
    is_active: true,
    is_online: false,
    last_seen_at: hoursAgo(5),
    uptime: 6 * 24 * 60 * 60 + 912,
    hardware_id: 'SN-GH-0002',
    created_at: daysAgo(80),
    updated_at: hoursAgo(5),
  },
]

export const mockTelemetryIdentityByDeviceId: Record<string, TelemetryReadingIdentity[]> =
  {
    [mockDevicesDb[0]!.id]: [
      {
        sensor_id: mockSensorsDb[0]!.id,
        local_name: 'rose_root',
        telemetry_sensor_id: 's1',
      },
      {
        sensor_id: mockSensorsDb[1]!.id,
        local_name: 'lavender_root',
        telemetry_sensor_id: 's2',
      },
    ],
    [mockDevicesDb[1]!.id]: [
      {
        sensor_id: mockSensorsDb[2]!.id,
        local_name: 'gh_air_temp',
        telemetry_sensor_id: 't1',
      },
      {
        sensor_id: mockSensorsDb[3]!.id,
        local_name: 'tomatoes_root',
        telemetry_sensor_id: 's3',
      },
    ],
  }

export const mockDeviceImagesDb: DeviceImage[] = [
  {
    id: 'img-0001',
    device_id: mockDevicesDb[0]!.id,
    type: 'camera-front',
    image_url: '/placeholder.svg?height=720&width=1280',
    captured_at: minutesAgo(10),
    plant_id: mockPlantsDb[0]!.id,
    zone_id: mockPlantsDb[0]!.zone_id,
    metadata_json: {
      exposure_ms: 8,
      iso: 200,
      format: 'jpeg',
      resolution: '1280x720',
    },
  },
  {
    id: 'img-0002',
    device_id: mockDevicesDb[0]!.id,
    type: 'camera-front',
    image_url: '/placeholder.svg?height=720&width=1280',
    captured_at: minutesAgo(70),
    plant_id: mockPlantsDb[1]!.id,
    zone_id: mockPlantsDb[1]!.zone_id,
    metadata_json: { exposure_ms: 12, iso: 320, format: 'jpeg', resolution: '1280x720' },
  },
  {
    id: 'img-0003',
    device_id: mockDevicesDb[0]!.id,
    type: 'camera-soil',
    image_url: '/placeholder.svg?height=720&width=1280',
    captured_at: minutesAgo(20),
    plant_id: mockPlantsDb[0]!.id,
    zone_id: mockPlantsDb[0]!.zone_id,
    metadata_json: { note: 'macro lens', format: 'jpeg' },
  },
]

function makeLog(
  device_id: string,
  i: number,
  level: DeviceLogLevel,
  message: string,
  recorded_at: Date,
): DeviceLog {
  return {
    id: `${device_id}-log-${i.toString().padStart(4, '0')}`,
    device_id,
    level,
    message,
    recorded_at,
  }
}

export const mockDeviceLogsDb: DeviceLog[] = [
  makeLog(mockDevicesDb[0]!.id, 1, 'info', 'Device boot complete', daysAgo(2)),
  makeLog(mockDevicesDb[0]!.id, 2, 'info', 'Telemetry sync ok', hoursAgo(12)),
  makeLog(mockDevicesDb[0]!.id, 3, 'warn', 'Camera latency high', hoursAgo(4)),
  makeLog(mockDevicesDb[0]!.id, 4, 'error', 'Valve #2 response timeout', minutesAgo(55)),
  makeLog(mockDevicesDb[0]!.id, 5, 'info', 'Telemetry sync ok', minutesAgo(15)),
  makeLog(mockDevicesDb[1]!.id, 1, 'info', 'Device boot complete', daysAgo(7)),
  makeLog(mockDevicesDb[1]!.id, 2, 'critical', 'Lost connectivity to broker', hoursAgo(5)),
]

export const mockIrrigationJobsDb: IrrigationJob[] = [
  {
    id: 'job-0001',
    scope: 'zone',
    zone_id: mockZonesDb[0]!.id,
    plant_id: null,
    action: 'irrigate',
    duration_seconds: 600,
    status: 'succeeded',
    requested_at: hoursAgo(30),
    started_at: hoursAgo(30),
    ended_at: hoursAgo(29.8),
    error_message: null,
  },
  {
    id: 'job-0002',
    scope: 'plant',
    zone_id: mockZonesDb[1]!.id,
    plant_id: mockPlantsDb[2]!.id,
    action: 'irrigate',
    duration_seconds: 480,
    status: 'running',
    requested_at: minutesAgo(25),
    started_at: minutesAgo(20),
    ended_at: null,
    error_message: null,
  },
  {
    id: 'job-0003',
    scope: 'global',
    zone_id: null,
    plant_id: null,
    action: 'system_check',
    duration_seconds: 120,
    status: 'failed',
    requested_at: hoursAgo(10),
    started_at: hoursAgo(10),
    ended_at: hoursAgo(9.95),
    error_message: 'Device unreachable: Greenhouse Gateway',
  },
]

export const mockActivityEventsDb: ActivityEvent[] = [
  {
    id: 'evt-0001',
    type: 'irrigation.completed',
    message: 'Zone irrigation completed',
    zone_id: mockZonesDb[0]!.id,
    plant_id: null,
    sensor_id: null,
    occurred_at: hoursAgo(29.8),
  },
  {
    id: 'evt-0002',
    type: 'sensor.reading',
    message: 'New sensor reading recorded',
    zone_id: mockZonesDb[1]!.id,
    plant_id: mockPlantsDb[2]!.id,
    sensor_id: mockSensorsDb[3]!.id,
    occurred_at: minutesAgo(45),
  },
  {
    id: 'evt-0003',
    type: 'device.log.error',
    message: 'Device reported error: Valve #2 response timeout',
    zone_id: mockZonesDb[0]!.id,
    plant_id: null,
    sensor_id: null,
    occurred_at: minutesAgo(55),
  },
  {
    id: 'evt-0004',
    type: 'device.offline',
    message: 'Greenhouse Gateway went offline',
    zone_id: mockZonesDb[1]!.id,
    plant_id: null,
    sensor_id: null,
    occurred_at: hoursAgo(5),
  },
]
