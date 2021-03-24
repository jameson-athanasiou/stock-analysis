const { parse } = require('node-html-parser')

const ONE_BILLION = 1000000000
const ONE_MILLION = 1000000

const badFields = ['Ex-Dividend Date']

const removeAllButNumbersAndPeriods = (val) => val.replace(/[^.0-9]/g, '')

const formatBillions = (value) => {
  const number = Number(removeAllButNumbersAndPeriods(value))
  return (number * ONE_BILLION) / ONE_MILLION
}

const formatMillions = (value) => {
  const number = Number(removeAllButNumbersAndPeriods(value))
  return number
}

const formatPercent = (value) => Number(removeAllButNumbersAndPeriods(value))

const formatNumber = (value) => {
  if (value.includes('B')) {
    return formatBillions(value)
  }
  if (value.includes('M')) {
    return formatMillions(value)
  }
  if (value.includes('%')) {
    return formatPercent(value)
  }

  return Number(removeAllButNumbersAndPeriods(value))
}

const getTable = (tableHtml, headerHtml, { withTitles }) => {
  const table = parse(tableHtml)
  const rows = table.querySelectorAll('tr')

  const data = rows
    .map((node) => node.querySelectorAll('td').map((col) => col.text))
    .reduce(
      (acc, [metric, value]) => ({
        ...acc,
        ...(!badFields.includes(metric) && { [metric]: formatNumber(value) }),
      }),
      {}
    )

  const title = parse(headerHtml).text

  if (withTitles)
    return {
      [title]: data,
    }

  return data
}

const mapResponse = async (page, options) => {
  const allTables = (await page.$$('table')) || []
  const allHeaders = (await page.$$('h2')) || []
  const tableData = await Promise.all(
    allTables.map(async (table, index) => {
      const tableHtml = await page.evaluate((node) => node.outerHTML, table)
      const headerHtml = await page.evaluate((node) => node.outerHTML, allHeaders[index])
      return getTable(tableHtml, headerHtml, options)
    })
  )

  return tableData
}

module.exports = mapResponse
