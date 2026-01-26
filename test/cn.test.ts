import { describe, expect, it } from 'vitest'
import { cn } from '@/utils'

describe('cn()', () => {
  it('merges classnames', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })
})

