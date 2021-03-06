const getProjections = (financials) => {
  const projections = Object.entries(financials).reduce((acc, [metric, valuesByYear]) => {
    console.log('')
    const yearValuePairs = Object.entries(valuesByYear).filter(([key]) => key !== 'TTM')
    const aagr =
      yearValuePairs.reduce((accumulatedValue, [, currentPeriod], index, arr) => {
        if (!index) return accumulatedValue

        const numberOfPeriods = index - 1
        const [, previousPeriod] = arr[numberOfPeriods]
        const growthInPeriod = (currentPeriod - previousPeriod) / previousPeriod

        return accumulatedValue + growthInPeriod
      }, 0) /
      (yearValuePairs.length - 1)

    const projectedYears = yearValuePairs.map(([year]) => (yearValuePairs.length + parseInt(year)).toString())
    const projectedYearValuePairs = projectedYears.reduce((builtPairs, year, i) => {
      const [, previousValue] = i ? builtPairs[i - 1] : yearValuePairs[yearValuePairs.length - 1]
      const newValue = previousValue * (1 * aagr)
      return [...builtPairs, [year, parseInt(newValue)]]
    }, [])

    debugger
    return {}
  }, {})

  return projections
}

module.exports = {
  getProjections,
}
