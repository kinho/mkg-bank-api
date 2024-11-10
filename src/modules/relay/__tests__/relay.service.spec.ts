import { calculatePagination, mapToEdges } from '../relay.service'

describe('RelayService', () => {
  describe('calculatePagination', () => {
    it('should return default pagination when no arguments are provided', () => {
      const args = {}
      const totalCount = 100
      const result = calculatePagination(args, totalCount)
      expect(result).toEqual({ offset: 0, limit: 10 })
    })

    it('should calculate pagination with first argument', () => {
      const args = { first: 25 }
      const totalCount = 100
      const result = calculatePagination(args, totalCount)
      expect(result).toEqual({ offset: 0, limit: 25 })
    })

    it('should calculate pagination with last argument', () => {
      const args = { last: 25 }
      const totalCount = 100
      const result = calculatePagination(args, totalCount)
      expect(result).toEqual({ offset: 75, limit: 25 })
    })

    it('should calculate pagination with after argument', () => {
      const args = { after: Buffer.from('10').toString('base64') }
      const totalCount = 100
      const result = calculatePagination(args, totalCount)
      expect(result).toEqual({ offset: 11, limit: 10 })
    })

    it('should calculate pagination with before argument', () => {
      const args = { before: Buffer.from('30').toString('base64') }
      const totalCount = 100
      const result = calculatePagination(args, totalCount)
      expect(result).toEqual({ offset: 20, limit: 10 })
    })

    it('should calculate pagination with before and last arguments', () => {
      const args = {
        before: Buffer.from('30').toString('base64'),
        last: 15,
      }
      const totalCount = 100
      const result = calculatePagination(args, totalCount)
      expect(result).toEqual({ offset: 15, limit: 15 })
    })

    it('should handle cases where before is less than last', () => {
      const args = {
        before: Buffer.from('5').toString('base64'),
        last: 10,
      }
      const totalCount = 100
      const result = calculatePagination(args, totalCount)
      expect(result).toEqual({ offset: 0, limit: 10 })
    })
  })

  describe('mapToEdges', () => {
    it('should map entities to edges with cursor', () => {
      const entities = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const offset = 10
      const result = mapToEdges(entities, offset)
      expect(result).toEqual([
        {
          node: { id: 1 },
          cursor: Buffer.from((offset + 0).toString()).toString('base64'),
        },
        {
          node: { id: 2 },
          cursor: Buffer.from((offset + 1).toString()).toString('base64'),
        },
        {
          node: { id: 3 },
          cursor: Buffer.from((offset + 2).toString()).toString('base64'),
        },
      ])
    })
  })
})
