import type {
  ActivityEvent,
  Device,
  DeviceImage,
  DeviceLog,
  IrrigationJob,
  PlantEntity,
  Sensor,
  SensorReadingRecord,
  Zone,
} from "@/lib/types"

function joinUrl(base: string, path: string) {
  const b = base.endsWith("/") ? base.slice(0, -1) : base
  const p = path.startsWith("/") ? path : `/${path}`
  return `${b}${p}`
}

function apiBase() {
  // Call the Next.js proxy (same-origin) to avoid CORS in the browser.
  // The proxy forwards to the real backend base URL from `.env`.
  return "/api/v1"
}

function normalizePath(path: string) {
  // Backend can be inconsistent: list endpoints often use `/.../`,
  // but detail endpoints are frequently declared as `/.../{id}` (no trailing `/`).
  const p = path.startsWith("/") ? path : `/${path}`
  const last = p.split("/").filter(Boolean).at(-1) ?? ""
  if (last === "file") return p.replace(/\/+$/, "")
  const looksLikeUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(last)

  if (looksLikeUuid) return p.replace(/\/+$/, "")
  return p.endsWith("/") ? p : `${p}/`
}

function parseDate(v: unknown): Date | null {
  if (v == null) return null
  if (v instanceof Date) return v
  if (typeof v === "string" || typeof v === "number") {
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? null : d
  }
  return null
}

async function apiFetchJson<T>(
  path: string,
  init?: RequestInit & { query?: Record<string, string | number | boolean | null | undefined> }
): Promise<T> {
  const { query, ...rest } = init ?? {}
  const base = joinUrl(apiBase(), normalizePath(path))
  const search = new URLSearchParams()
  if (query) for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== null) search.set(k, String(v))
  const url = search.size ? `${base}?${search.toString()}` : base

  const headers = new Headers(rest.headers)
  if (!headers.has("Accept")) headers.set("Accept", "application/json")

  const res = await fetch(url.toString(), {
    ...rest,
    headers,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`API ${res.status} ${res.statusText}: ${text || url.toString()}`)
  }

  return (await res.json()) as T
}

function mapDevice(d: any): Device {
  return {
    ...d,
    last_seen_at: parseDate(d.last_seen_at),
    created_at: parseDate(d.created_at) ?? new Date(0),
    updated_at: parseDate(d.updated_at) ?? new Date(0),
  }
}

function mapZone(z: any): Zone {
  return {
    ...z,
    created_at: parseDate(z.created_at) ?? new Date(0),
    updated_at: parseDate(z.updated_at) ?? new Date(0),
    deleted_at: parseDate(z.deleted_at),
  }
}

function mapSensor(s: any): Sensor {
  return {
    ...s,
    created_at: parseDate(s.created_at) ?? new Date(0),
    updated_at: parseDate(s.updated_at) ?? new Date(0),
    deleted_at: parseDate(s.deleted_at),
  }
}

function mapSensorReading(r: any): SensorReadingRecord {
  return {
    ...r,
    recorded_at: parseDate(r.recorded_at) ?? new Date(0),
  }
}

function mapIrrigationJob(j: any): IrrigationJob {
  return {
    ...j,
    requested_at: parseDate(j.requested_at) ?? new Date(0),
    started_at: parseDate(j.started_at),
    ended_at: parseDate(j.ended_at),
  }
}

function mapActivityEvent(e: any): ActivityEvent {
  return {
    ...e,
    occurred_at: parseDate(e.occurred_at) ?? new Date(0),
  }
}

function mapDeviceImage(img: any): DeviceImage {
  const device_id = img.device_id ?? img.deviceId ?? img.deviceID ?? null
  const plant_id = img.plant_id ?? img.plantId ?? null
  const zone_id = img.zone_id ?? img.zoneId ?? null
  const image_url = img.image_url ?? img.imageUrl ?? img.imageURL ?? ""
  const metadata_json = img.metadata_json ?? img.metadataJson ?? null
  const captured_at = parseDate(img.captured_at ?? img.capturedAt) ?? new Date(0)
  return {
    id: img.id,
    device_id,
    type: img.type,
    image_url,
    captured_at,
    plant_id,
    zone_id,
    metadata_json,
  }
}

function mapDeviceLog(l: any): DeviceLog {
  const device_id = l.device_id ?? l.deviceId ?? l.deviceID ?? null
  const recorded_at = parseDate(l.recorded_at ?? l.recordedAt) ?? new Date(0)
  return {
    id: l.id,
    device_id,
    level: l.level,
    message: l.message,
    recorded_at,
  }
}

export const api = {
  // ---------------------------------------------------------------------------
  // Devices
  // ---------------------------------------------------------------------------
  async listDevices(): Promise<Device[]> {
    const rows = await apiFetchJson<any[]>("/devices", { cache: "no-store" })
    return rows.map(mapDevice)
  },

  async createDevice(body: {
    name: string
    description?: string | null
    is_active?: boolean
  }): Promise<Device> {
    const row = await apiFetchJson<any>("/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return mapDevice(row)
  },

  async getDevice(deviceId: string): Promise<Device> {
    const row = await apiFetchJson<any>(`/devices/${deviceId}`, { cache: "no-store" })
    return mapDevice(row)
  },

  async updateDevice(
    deviceId: string,
    body: { name?: string | null; description?: string | null; is_active?: boolean | null }
  ): Promise<Device> {
    const row = await apiFetchJson<any>(`/devices/${deviceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return mapDevice(row)
  },

  async deleteDevice(deviceId: string): Promise<Device> {
    const row = await apiFetchJson<any>(`/devices/${deviceId}`, { method: "DELETE" })
    return mapDevice(row)
  },

  async provisionDevice(body: {
    hardwareId: string
    firmware: string
    capabilities: {
      sensors: { localName: string; type: "humidity" | "temperature" | "flow" | "water-level" | "air-quality" }[]
      cameras?: string[]
    }
  }): Promise<any> {
    return await apiFetchJson<any>("/devices/provision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  },

  // ---------------------------------------------------------------------------
  // External device ingestion
  // ---------------------------------------------------------------------------
  async ingestTelemetry(
    deviceId: string,
    body: {
      sentAt: string
      readings: { sensorId: string; type: string; value: number; unit: string; readingAt?: string | null }[]
    }
  ): Promise<any> {
    return await apiFetchJson<any>(`/external-devices/${deviceId}/telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  },

  async ingestDeviceLog(
    deviceId: string,
    body: { level: string; message: string; recordedAt?: string | null }
  ): Promise<any> {
    return await apiFetchJson<any>(`/external-devices/${deviceId}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  },

  async getExternalDeviceStatus(deviceId: string): Promise<any> {
    return await apiFetchJson<any>(`/external-devices/${deviceId}/status`, { cache: "no-store" })
  },

  // NOTE: image upload is multipart; keep thin wrapper.
  async uploadDeviceImage(deviceId: string, form: FormData): Promise<any> {
    return await apiFetchJson<any>(`/external-devices/${deviceId}/images`, {
      method: "POST",
      body: form,
    })
  },

  // ---------------------------------------------------------------------------
  // Zones
  // ---------------------------------------------------------------------------
  async listZones(opts?: { skip?: number; limit?: number }): Promise<Zone[]> {
    const rows = await apiFetchJson<any[]>("/zones", {
      cache: "no-store",
      query: { skip: opts?.skip, limit: opts?.limit },
    })
    return rows.map(mapZone)
  },

  async createZone(body: { name: string; is_active?: boolean }): Promise<Zone> {
    const row = await apiFetchJson<any>("/zones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return mapZone(row)
  },

  async getZone(zoneId: string): Promise<Zone> {
    const row = await apiFetchJson<any>(`/zones/${zoneId}`, { cache: "no-store" })
    return mapZone(row)
  },

  async updateZone(zoneId: string, body: { name?: string | null; is_active?: boolean }): Promise<Zone> {
    const row = await apiFetchJson<any>(`/zones/${zoneId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return mapZone(row)
  },

  async deleteZone(zoneId: string): Promise<Zone> {
    const row = await apiFetchJson<any>(`/zones/${zoneId}`, { method: "DELETE" })
    return mapZone(row)
  },

  // ---------------------------------------------------------------------------
  // Plants
  // ---------------------------------------------------------------------------
  async listPlants(): Promise<PlantEntity[]> {
    return await apiFetchJson<PlantEntity[]>("/plants", { cache: "no-store" })
  },

  async createPlant(body: { name: string; zone_id: string; image_url?: string | null; health: string }): Promise<PlantEntity> {
    return await apiFetchJson<PlantEntity>("/plants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  },

  async getPlant(plantId: string): Promise<PlantEntity> {
    return await apiFetchJson<PlantEntity>(`/plants/${plantId}`, { cache: "no-store" })
  },

  async updatePlant(
    plantId: string,
    body: { name?: string | null; image_url?: string | null; health?: string | null }
  ): Promise<PlantEntity> {
    return await apiFetchJson<PlantEntity>(`/plants/${plantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  },

  async deletePlant(plantId: string): Promise<PlantEntity> {
    return await apiFetchJson<PlantEntity>(`/plants/${plantId}`, { method: "DELETE" })
  },

  // ---------------------------------------------------------------------------
  // Sensors
  // ---------------------------------------------------------------------------
  async listSensors(opts?: { skip?: number; limit?: number }): Promise<Sensor[]> {
    const rows = await apiFetchJson<any[]>("/sensors", {
      cache: "no-store",
      query: { skip: opts?.skip, limit: opts?.limit },
    })
    return rows.map(mapSensor)
  },

  async createSensor(body: {
    name: string
    type: string
    unit: string
    is_active?: boolean
    plant_id?: string | null
    zone_id?: string | null
  }): Promise<Sensor> {
    const row = await apiFetchJson<any>("/sensors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return mapSensor(row)
  },

  async getSensor(sensorId: string): Promise<Sensor> {
    const row = await apiFetchJson<any>(`/sensors/${sensorId}`, { cache: "no-store" })
    return mapSensor(row)
  },

  async updateSensor(sensorId: string, body: Partial<Omit<Sensor, "id">>): Promise<Sensor> {
    const row = await apiFetchJson<any>(`/sensors/${sensorId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return mapSensor(row)
  },

  async deleteSensor(sensorId: string): Promise<Sensor> {
    const row = await apiFetchJson<any>(`/sensors/${sensorId}`, { method: "DELETE" })
    return mapSensor(row)
  },

  // ---------------------------------------------------------------------------
  // Sensor readings
  // ---------------------------------------------------------------------------
  async createSensorReading(body: { sensor_id: string; value: number; recorded_at?: string | null }): Promise<SensorReadingRecord> {
    const row = await apiFetchJson<any>("/sensor-readings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return mapSensorReading(row)
  },

  async listSensorReadings(opts?: { sensor_id?: string; skip?: number; limit?: number }): Promise<SensorReadingRecord[]> {
    const rows = await apiFetchJson<any[]>("/sensor-readings", {
      cache: "no-store",
      query: { sensor_id: opts?.sensor_id, skip: opts?.skip, limit: opts?.limit },
    })
    return rows.map(mapSensorReading)
  },

  async getSensorReading(readingId: string): Promise<SensorReadingRecord> {
    const row = await apiFetchJson<any>(`/sensor-readings/${readingId}`, { cache: "no-store" })
    return mapSensorReading(row)
  },

  async deleteSensorReading(readingId: string): Promise<SensorReadingRecord> {
    const row = await apiFetchJson<any>(`/sensor-readings/${readingId}`, { method: "DELETE" })
    return mapSensorReading(row)
  },

  // ---------------------------------------------------------------------------
  // Irrigation jobs
  // ---------------------------------------------------------------------------
  async createIrrigationJob(body: {
    scope: "zone" | "plant"
    zone_id?: string | null
    plant_id?: string | null
    action: "start" | "stop"
    duration_seconds?: number | null
    status?: string
  }): Promise<IrrigationJob> {
    const row = await apiFetchJson<any>("/irrigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return mapIrrigationJob(row)
  },

  async listIrrigationJobs(opts?: {
    status?: string
    zone_id?: string
    plant_id?: string
    skip?: number
    limit?: number
  }): Promise<IrrigationJob[]> {
    const rows = await apiFetchJson<any[]>("/irrigation", {
      cache: "no-store",
      query: {
        status: opts?.status,
        zone_id: opts?.zone_id,
        plant_id: opts?.plant_id,
        skip: opts?.skip,
        limit: opts?.limit,
      },
    })
    return rows.map(mapIrrigationJob)
  },

  async getIrrigationJob(jobId: string): Promise<IrrigationJob> {
    const row = await apiFetchJson<any>(`/irrigation/${jobId}`, { cache: "no-store" })
    return mapIrrigationJob(row)
  },

  async updateIrrigationJob(
    jobId: string,
    body: { status?: string; started_at?: string | null; ended_at?: string | null; error_message?: string | null }
  ): Promise<IrrigationJob> {
    const row = await apiFetchJson<any>(`/irrigation/${jobId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return mapIrrigationJob(row)
  },

  async deleteIrrigationJob(jobId: string): Promise<IrrigationJob> {
    const row = await apiFetchJson<any>(`/irrigation/${jobId}`, { method: "DELETE" })
    return mapIrrigationJob(row)
  },

  // ---------------------------------------------------------------------------
  // Activity events
  // ---------------------------------------------------------------------------
  async createActivityEvent(body: {
    type: string
    message: string
    zone_id?: string | null
    plant_id?: string | null
    sensor_id?: string | null
    occurred_at?: string | null
  }): Promise<ActivityEvent> {
    const row = await apiFetchJson<any>("/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return mapActivityEvent(row)
  },

  async listActivityEvents(opts?: {
    type?: string
    zone_id?: string
    plant_id?: string
    sensor_id?: string
    skip?: number
    limit?: number
  }): Promise<ActivityEvent[]> {
    const rows = await apiFetchJson<any[]>("/activity", {
      cache: "no-store",
      query: {
        type: opts?.type,
        zone_id: opts?.zone_id,
        plant_id: opts?.plant_id,
        sensor_id: opts?.sensor_id,
        skip: opts?.skip,
        limit: opts?.limit,
      },
    })
    return rows.map(mapActivityEvent)
  },

  async getActivityEvent(eventId: string): Promise<ActivityEvent> {
    const row = await apiFetchJson<any>(`/activity/${eventId}`, { cache: "no-store" })
    return mapActivityEvent(row)
  },

  async deleteActivityEvent(eventId: string): Promise<ActivityEvent> {
    const row = await apiFetchJson<any>(`/activity/${eventId}`, { method: "DELETE" })
    return mapActivityEvent(row)
  },

  // ---------------------------------------------------------------------------
  // Device logs / images (visualization support)
  // ---------------------------------------------------------------------------
  async listDeviceLogs(deviceId: string): Promise<DeviceLog[]> {
    const rows = await apiFetchJson<any[]>(`/devices/${deviceId}/logs`, { cache: "no-store" })
    return rows.map(mapDeviceLog)
  },

  async listDeviceImages(deviceId: string): Promise<DeviceImage[]> {
    const rows = await apiFetchJson<any[]>(`/devices/${deviceId}/images`, { cache: "no-store" })
    return rows.map(mapDeviceImage)
  },

  async getDeviceImage(deviceId: string, imageId: string): Promise<DeviceImage> {
    const row = await apiFetchJson<any>(`/devices/${deviceId}/images/${imageId}`, { cache: "no-store" })
    return mapDeviceImage(row)
  },

  /**
   * Use this for `<img src="...">`. This hits the Next.js proxy and returns bytes.
   */
  deviceImageFileUrl(deviceId: string, imageId: string) {
    return `/api/v1/devices/${encodeURIComponent(deviceId)}/images/${encodeURIComponent(imageId)}/file`
  },

  /**
   * Use this for “latest by type” camera preview.
   */
  deviceLatestImageByTypeFileUrl(deviceId: string, imageType: string) {
    return `/api/v1/devices/${encodeURIComponent(deviceId)}/images/by-type/${encodeURIComponent(imageType)}/file`
  },
}

