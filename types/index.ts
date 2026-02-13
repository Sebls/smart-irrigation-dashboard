export interface IrrigationZone {
  id: string
  name: string
  isActive: boolean
  plantCount: number
  avgHumidity: number
  temperature: number
  airHumidity: number
  airQuality: number
  lastIrrigated: Date
  plants: Plant[]
}

export interface Plant {
  id: string
  name: string
  zoneId: string
  humidity: number
  sensors: SoilSensor[]
  imageUrl: string
  health: 'excellent' | 'good' | 'needs-attention' | 'critical'
}

export interface SoilSensor {
  id: string
  plantId: string
  name: string
  humidity: number
  readings: SensorReading[]
}

export interface SensorReading {
  timestamp: Date
  value: number
}

export type ViewType = 'overview' | 'zone' | 'plant' | 'sensors'

// -----------------------------------------------------------------------------
// Backend-ish entity shapes (requirements-driven)
// Keep these separate from the UI-demo types above to avoid breaking existing
// charts/cards while still supporting data-first admin views.
// -----------------------------------------------------------------------------

export type DeviceLogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical'

export interface Device {
  id: string
  name: string
  description: string | null
  is_active: boolean
  is_online: boolean
  last_seen_at: Date | null
  uptime: number | null
  hardware_id: string | null
  created_at: Date
  updated_at: Date
}

export interface Zone {
  id: string
  name: string
  is_active: boolean
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface PlantEntity {
  id: string
  name: string
  zone_id: string
  image_url: string | null
  health: string | null
}

export interface Sensor {
  id: string
  name: string
  type: string
  unit: string | null
  is_active: boolean
  zone_id: string | null
  plant_id: string | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface SensorReadingRecord {
  id: string
  sensor_id: string
  recorded_at: Date
  value: number
}

export interface DeviceImage {
  id: string
  device_id: string
  type: string
  image_url: string
  captured_at: Date
  plant_id: string | null
  zone_id: string | null
  metadata_json: unknown | null
}

export interface DeviceLog {
  id: string
  device_id: string
  level: DeviceLogLevel
  message: string
  recorded_at: Date
}

export type IrrigationJobScope = 'global' | 'zone' | 'plant'
export type IrrigationJobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled'

export interface IrrigationJob {
  id: string
  scope: IrrigationJobScope
  zone_id: string | null
  plant_id: string | null
  action: string
  duration_seconds: number
  status: IrrigationJobStatus
  requested_at: Date
  started_at: Date | null
  ended_at: Date | null
  error_message: string | null
}

export interface ActivityEvent {
  id: string
  type: string
  message: string
  zone_id: string | null
  plant_id: string | null
  sensor_id: string | null
  occurred_at: Date
}

export interface TelemetryReadingIdentity {
  /**
   * The sensor UUID / database id we know about.
   * (Labelled as "sensor UUIDs" in requirements; keep generic.)
   */
  sensor_id: string
  /** Local/user-friendly name if known on the device */
  local_name: string | null
  /**
   * The identifier used by telemetry payloads, e.g. `TelemetryRequest.readings[].sensorId`.
   */
  telemetry_sensor_id: string
}
