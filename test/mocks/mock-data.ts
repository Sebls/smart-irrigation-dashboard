import type { IrrigationZone, WaterTank, Weather, SensorReading } from '@/types'

// NOTE: This file is imported by both server and client bundles in Next.js.
// Keep mock generation deterministic to avoid hydration mismatches.

const BASE_NOW = new Date('2026-01-26T12:00:00.000Z')

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

export const mockZones: IrrigationZone[] = [
  {
    id: 'zone-1',
    name: 'Front Garden',
    isActive: true,
    plantCount: 8,
    avgHumidity: 68,
    waterUsage: 45,
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
      },
      {
        id: 'plant-1-3',
        name: 'Hydrangea',
        zoneId: 'zone-1',
        humidity: 78,
        health: 'excellent',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          {
            id: 's-1-3-1',
            plantId: 'plant-1-3',
            name: 'Root Level',
            humidity: 80,
            readings: generateReadings('s-1-3-1', 80, 5),
          },
          {
            id: 's-1-3-2',
            plantId: 'plant-1-3',
            name: 'Mid Level',
            humidity: 76,
            readings: generateReadings('s-1-3-2', 76, 4),
          },
        ]
      },
      {
        id: 'plant-1-4',
        name: 'Tulips',
        zoneId: 'zone-1',
        humidity: 65,
        health: 'good',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          {
            id: 's-1-4-1',
            plantId: 'plant-1-4',
            name: 'Root Level',
            humidity: 67,
            readings: generateReadings('s-1-4-1', 67, 6),
          },
        ]
      },
    ]
  },
  {
    id: 'zone-2',
    name: 'Vegetable Patch',
    isActive: false,
    plantCount: 12,
    avgHumidity: 55,
    waterUsage: 62,
    temperature: 26,
    airHumidity: 58,
    airQuality: 88,
    lastIrrigated: new Date(BASE_NOW.getTime() - 6 * 60 * 60 * 1000),
    plants: [
      {
        id: 'plant-2-1',
        name: 'Tomatoes',
        zoneId: 'zone-2',
        humidity: 52,
        health: 'needs-attention',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          {
            id: 's-2-1-1',
            plantId: 'plant-2-1',
            name: 'Root Level',
            humidity: 48,
            readings: generateReadings('s-2-1-1', 48, 8),
          },
          {
            id: 's-2-1-2',
            plantId: 'plant-2-1',
            name: 'Mid Level',
            humidity: 56,
            readings: generateReadings('s-2-1-2', 56, 7),
          },
        ]
      },
      {
        id: 'plant-2-2',
        name: 'Peppers',
        zoneId: 'zone-2',
        humidity: 58,
        health: 'good',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          {
            id: 's-2-2-1',
            plantId: 'plant-2-2',
            name: 'Root Level',
            humidity: 60,
            readings: generateReadings('s-2-2-1', 60, 5),
          },
        ]
      },
      {
        id: 'plant-2-3',
        name: 'Cucumbers',
        zoneId: 'zone-2',
        humidity: 62,
        health: 'good',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          {
            id: 's-2-3-1',
            plantId: 'plant-2-3',
            name: 'Root Level',
            humidity: 64,
            readings: generateReadings('s-2-3-1', 64, 4),
          },
          {
            id: 's-2-3-2',
            plantId: 'plant-2-3',
            name: 'Mid Level',
            humidity: 60,
            readings: generateReadings('s-2-3-2', 60, 5),
          },
        ]
      },
    ]
  },
  {
    id: 'zone-3',
    name: 'Greenhouse',
    isActive: true,
    plantCount: 6,
    avgHumidity: 82,
    waterUsage: 28,
    temperature: 28,
    airHumidity: 75,
    airQuality: 95,
    lastIrrigated: new Date(BASE_NOW.getTime() - 1 * 60 * 60 * 1000),
    plants: [
      {
        id: 'plant-3-1',
        name: 'Orchids',
        zoneId: 'zone-3',
        humidity: 85,
        health: 'excellent',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          {
            id: 's-3-1-1',
            plantId: 'plant-3-1',
            name: 'Root Level',
            humidity: 86,
            readings: generateReadings('s-3-1-1', 86, 3),
          },
          {
            id: 's-3-1-2',
            plantId: 'plant-3-1',
            name: 'Mid Level',
            humidity: 84,
            readings: generateReadings('s-3-1-2', 84, 4),
          },
        ]
      },
      {
        id: 'plant-3-2',
        name: 'Ferns',
        zoneId: 'zone-3',
        humidity: 80,
        health: 'excellent',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          {
            id: 's-3-2-1',
            plantId: 'plant-3-2',
            name: 'Root Level',
            humidity: 82,
            readings: generateReadings('s-3-2-1', 82, 4),
          },
        ]
      },
    ]
  },
  {
    id: 'zone-4',
    name: 'Back Lawn',
    isActive: false,
    plantCount: 1,
    avgHumidity: 45,
    waterUsage: 85,
    temperature: 25,
    airHumidity: 55,
    airQuality: 90,
    lastIrrigated: new Date(BASE_NOW.getTime() - 12 * 60 * 60 * 1000),
    plants: [
      {
        id: 'plant-4-1',
        name: 'Grass',
        zoneId: 'zone-4',
        humidity: 45,
        health: 'needs-attention',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          {
            id: 's-4-1-1',
            plantId: 'plant-4-1',
            name: 'Section A',
            humidity: 42,
            readings: generateReadings('s-4-1-1', 42, 10),
          },
          {
            id: 's-4-1-2',
            plantId: 'plant-4-1',
            name: 'Section B',
            humidity: 48,
            readings: generateReadings('s-4-1-2', 48, 8),
          },
          {
            id: 's-4-1-3',
            plantId: 'plant-4-1',
            name: 'Section C',
            humidity: 45,
            readings: generateReadings('s-4-1-3', 45, 9),
          },
        ]
      },
    ]
  },
]

export const mockWaterTank: WaterTank = {
  level: 72,
  capacity: 1000,
  consumption: Array.from({ length: 7 }, (_, i) => {
    const r = randFor(`waterTank:consumption:${i}`)
    return {
      date: new Date(BASE_NOW.getTime() - (6 - i) * 24 * 60 * 60 * 1000),
      amount: 80 + r() * 60,
    }
  }),
}

export const mockWeather: Weather = {
  temperature: 24,
  humidity: 58,
  condition: 'partly-cloudy',
  forecast: [
    { date: new Date(BASE_NOW.getTime() + 24 * 60 * 60 * 1000), high: 26, low: 18, condition: 'sunny', precipitation: 0 },
    { date: new Date(BASE_NOW.getTime() + 2 * 24 * 60 * 60 * 1000), high: 28, low: 19, condition: 'sunny', precipitation: 5 },
    { date: new Date(BASE_NOW.getTime() + 3 * 24 * 60 * 60 * 1000), high: 24, low: 17, condition: 'cloudy', precipitation: 20 },
    { date: new Date(BASE_NOW.getTime() + 4 * 24 * 60 * 60 * 1000), high: 22, low: 16, condition: 'rainy', precipitation: 80 },
    { date: new Date(BASE_NOW.getTime() + 5 * 24 * 60 * 60 * 1000), high: 23, low: 15, condition: 'partly-cloudy', precipitation: 30 },
  ]
}
