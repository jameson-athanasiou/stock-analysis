const { parse } = require('node-html-parser')

const parseTable = (html) => {
  const table = parse(html)
  const yearHeaders = table.querySelectorAll('thead tr th')
  const formattedYears = yearHeaders
    .map((node) => {
      const { text } = node
      if (text) {
        return text.substring(0, 4)
      }
      return null
    })
    .filter((text) => text)
  console.log(formattedYears)

  // const formattedYearsSample = ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', 'TTM']

  const rows = table
    .querySelectorAll('tbody tr')
    .filter((node) => node.childNodes.length > 1)
    .map((node) => {
      const title = node.querySelector('th').text
      // const numbers = node.querySelectorAll('td').map((element) => element.text)
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

  console.log(rows)
  // STATUS: I think the rows var currentl aligns with what is coming back from the csv formatter right now
  // Need to parse the other tables on the page and try to get this bad boy hooked into the client
}

module.exports = { parseTable }
