const FALLBACK_VALUE = '--'

export const formatBigNumberWithComma = (number) =>
  number ? String(number).replace(/(?<=\d)(?=(\d\d\d)+(?!\d))/, ',') : FALLBACK_VALUE
