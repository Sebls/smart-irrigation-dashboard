export interface IrrigationZone {
  id: string
  name: string
  isActive: boolean
  plantCount: number
  avgHumidity: number
  waterUsage: number
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

export interface WaterTank {
  level: number
  capacity: number
  consumption: WaterConsumption[]
}

export interface WaterConsumption {
  date: Date
  amount: number
}

export interface Weather {
  temperature: number
  humidity: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy'
  forecast: WeatherForecast[]
}

export interface WeatherForecast {
  date: Date
  high: number
  low: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy'
  precipitation: number
}

export interface IrrigationZone {
  id: string
  name: string
  isActive: boolean
  plantCount: number
  avgHumidity: number
  waterUsage: number
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

export interface WaterTank {
  level: number
  capacity: number
  consumption: WaterConsumption[]
}

export interface WaterConsumption {
  date: Date
  amount: number
}

export interface Weather {
  temperature: number
  humidity: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy'
  forecast: WeatherForecast[]
}

export interface WeatherForecast {
  date: Date
  high: number
  low: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy'
  precipitation: number
}

export type ViewType = 'overview' | 'zone' | 'plant' | 'sensors' | 'water' | 'weather'
