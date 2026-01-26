import type { IrrigationZone, WaterTank, Weather, SensorReading } from './types'

function generateReadings(baseValue: number, variance: number, count: number = 24): SensorReading[] {
  const readings: SensorReading[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    readings.push({
      timestamp: new Date(now.getTime() - i * 60 * 60 * 1000),
      value: baseValue + (Math.random() - 0.5) * variance * 2
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
    lastIrrigated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    plants: [
      {
        id: 'plant-1-1',
        name: 'Rose Bush',
        zoneId: 'zone-1',
        humidity: 72,
        health: 'excellent',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          { id: 's-1-1-1', plantId: 'plant-1-1', name: 'Root Level', humidity: 74, readings: generateReadings(74, 5) },
          { id: 's-1-1-2', plantId: 'plant-1-1', name: 'Mid Level', humidity: 70, readings: generateReadings(70, 6) },
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
          { id: 's-1-2-1', plantId: 'plant-1-2', name: 'Root Level', humidity: 60, readings: generateReadings(60, 4) },
          { id: 's-1-2-2', plantId: 'plant-1-2', name: 'Mid Level', humidity: 56, readings: generateReadings(56, 5) },
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
          { id: 's-1-3-1', plantId: 'plant-1-3', name: 'Root Level', humidity: 80, readings: generateReadings(80, 5) },
          { id: 's-1-3-2', plantId: 'plant-1-3', name: 'Mid Level', humidity: 76, readings: generateReadings(76, 4) },
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
          { id: 's-1-4-1', plantId: 'plant-1-4', name: 'Root Level', humidity: 67, readings: generateReadings(67, 6) },
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
    lastIrrigated: new Date(Date.now() - 6 * 60 * 60 * 1000),
    plants: [
      {
        id: 'plant-2-1',
        name: 'Tomatoes',
        zoneId: 'zone-2',
        humidity: 52,
        health: 'needs-attention',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          { id: 's-2-1-1', plantId: 'plant-2-1', name: 'Root Level', humidity: 48, readings: generateReadings(48, 8) },
          { id: 's-2-1-2', plantId: 'plant-2-1', name: 'Mid Level', humidity: 56, readings: generateReadings(56, 7) },
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
          { id: 's-2-2-1', plantId: 'plant-2-2', name: 'Root Level', humidity: 60, readings: generateReadings(60, 5) },
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
          { id: 's-2-3-1', plantId: 'plant-2-3', name: 'Root Level', humidity: 64, readings: generateReadings(64, 4) },
          { id: 's-2-3-2', plantId: 'plant-2-3', name: 'Mid Level', humidity: 60, readings: generateReadings(60, 5) },
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
    lastIrrigated: new Date(Date.now() - 1 * 60 * 60 * 1000),
    plants: [
      {
        id: 'plant-3-1',
        name: 'Orchids',
        zoneId: 'zone-3',
        humidity: 85,
        health: 'excellent',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          { id: 's-3-1-1', plantId: 'plant-3-1', name: 'Root Level', humidity: 86, readings: generateReadings(86, 3) },
          { id: 's-3-1-2', plantId: 'plant-3-1', name: 'Mid Level', humidity: 84, readings: generateReadings(84, 4) },
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
          { id: 's-3-2-1', plantId: 'plant-3-2', name: 'Root Level', humidity: 82, readings: generateReadings(82, 4) },
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
    lastIrrigated: new Date(Date.now() - 12 * 60 * 60 * 1000),
    plants: [
      {
        id: 'plant-4-1',
        name: 'Grass',
        zoneId: 'zone-4',
        humidity: 45,
        health: 'needs-attention',
        imageUrl: '/placeholder.svg?height=200&width=200',
        sensors: [
          { id: 's-4-1-1', plantId: 'plant-4-1', name: 'Section A', humidity: 42, readings: generateReadings(42, 10) },
          { id: 's-4-1-2', plantId: 'plant-4-1', name: 'Section B', humidity: 48, readings: generateReadings(48, 8) },
          { id: 's-4-1-3', plantId: 'plant-4-1', name: 'Section C', humidity: 45, readings: generateReadings(45, 9) },
        ]
      },
    ]
  },
]

export const mockWaterTank: WaterTank = {
  level: 72,
  capacity: 1000,
  consumption: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
    amount: 80 + Math.random() * 60
  }))
}

export const mockWeather: Weather = {
  temperature: 24,
  humidity: 58,
  condition: 'partly-cloudy',
  forecast: [
    { date: new Date(Date.now() + 24 * 60 * 60 * 1000), high: 26, low: 18, condition: 'sunny', precipitation: 0 },
    { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), high: 28, low: 19, condition: 'sunny', precipitation: 5 },
    { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), high: 24, low: 17, condition: 'cloudy', precipitation: 20 },
    { date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), high: 22, low: 16, condition: 'rainy', precipitation: 80 },
    { date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), high: 23, low: 15, condition: 'partly-cloudy', precipitation: 30 },
  ]
}
