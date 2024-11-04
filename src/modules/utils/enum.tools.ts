export const getEnumValue = <T extends Record<string, string | number>>(
  _enum: T,
  key: keyof T | undefined,
): T[keyof T] | undefined => {
  if (!key) return undefined
  return _enum[key]
}

export const getEnumInfo = <T extends Record<string, string | number>>(
  _enum: T,
): string => {
  if (!_enum) return ''
  return `Values: ${Object.keys(_enum)
    .map((key) => `"${key}"`)
    .join(', ')}`
}
