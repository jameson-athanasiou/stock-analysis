const { parse } = require('node-html-parser')

const getTable = (html) => {
  const table = parse(html)
  const cols = table.querySelectorAll('td')
  const data = cols.map((node, index) => {
    const { text } = node
    if (!index) return null
    if (text) {
      return text
    }
    return null
  })

  return data
}

const mapResponse = async (page) => {
  const allTables = (await page.$$('table')) || []
  const tableData = await Promise.all(
    allTables.map(async (table) => {
      const tableHtml = await page.evaluate((node) => node.outerHTML, table)
      return getTable(tableHtml)
    })
  )

  return tableData
}

module.exports = mapResponse
