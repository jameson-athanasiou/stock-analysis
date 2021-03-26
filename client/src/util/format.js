const FALLBACK_VALUE = '--'

export const formatToTwoDecimalPlaces = (number) => Number(number).toFixed(2).replace(/\.00/, '')

export const formatBigNumberWithComma = (number) => {
  if (!number) return FALLBACK_VALUE
  const roundedNumber = formatToTwoDecimalPlaces(number)
  return String(roundedNumber).replace(/(?<=\d)(?=(\d\d\d)+(?!\d))/, ',')
}
