import { describe, expect, it } from 'vitest'
import { mockZones } from '@/test/mocks/mock-data'

describe('mock data', () => {
  it('provides at least one zone', () => {
    expect(mockZones.length).toBeGreaterThan(0)
  })

  it('zones have plants', () => {
    expect(mockZones[0]?.plants?.length).toBeGreaterThan(0)
  })
})

