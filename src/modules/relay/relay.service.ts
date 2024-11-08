import { ConnectionArguments } from './relay.type'

interface PaginationResult {
  offset: number
  limit: number
}

export const calculatePagination = (
  { first, last, after, before }: ConnectionArguments,
  totalCount: number,
): PaginationResult => {
  let offset = 0
  let limit = first ?? 10

  if (after) {
    offset = parseInt(Buffer.from(after, 'base64').toString('ascii')) + 1
  } else if (before) {
    const beforeIndex = parseInt(
      Buffer.from(before, 'base64').toString('ascii'),
    )
    limit = last ?? 10
    offset = Math.max(beforeIndex - limit, 0)
  } else if (last != null) {
    limit = last
    offset = Math.max(totalCount - limit, 0)
  }

  return { offset, limit }
}

export const mapToEdges = (entities, offset) => {
  return entities.map((entity, index) => ({
    node: entity,
    cursor: Buffer.from((offset + index).toString()).toString('base64'),
  }))
}
