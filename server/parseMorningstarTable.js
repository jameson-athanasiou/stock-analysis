const { parse } = require('node-html-parser')
const { mapKeys, omit } = require('lodash')

const badFields = ['Revenue', 'Total Assets', 'Total Liabilities & Equity']
const badPatterns = [/\*/, /mil/, 'USD']

const parseTable = (html) => {
  const table = parse(html)
  const yearHeaders = table.querySelectorAll('thead tr th')
  const formattedYears = yearHeaders
    .map((node, index) => {
      const { text } = node
      if (!index) return null
      if (text) {
        return text.substring(0, 4)
      }
      return null
    })
    .filter((text) => text)

  // formattedYearsSample
  // ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', 'TTM']

  const data = table
    .querySelectorAll('tbody tr')
    .filter((node) => node.childNodes.length > 1)
    .map((node) => {
      const title = node.querySelector('th').text
      const numbers = node.querySelectorAll('td').reduce((acc, currentElement, index) => {
        const formattedString = currentElement.text.replace(/,/g, '')
        const parsedNumber = parseFloat(formattedString, 10)
        const value = Number.isNaN(parsedNumber) ? '-' : parsedNumber
        return { ...acc, [formattedYears[index]]: value }
      }, {})
      return { [title]: numbers }
    })
    .reduce(
      (acc, curr) => ({
        ...acc,
        ...curr,
      }),
      {}
    )

  const validFields = omit(data, badFields)

  const formattedData = mapKeys(validFields, (value, key) => {
    let formattedKey = key
    badPatterns.forEach((pattern) => {
      const reg = new RegExp(pattern, 'gi')
      formattedKey = formattedKey.replace(reg, '')
    })
    return formattedKey.trim()
  })

  return formattedData
}

module.exports = { parseTable }
