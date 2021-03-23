const { parseTable } = require('./parseTable')
const { getWebPage } = require('../../util/webPage')

const getPageData = async (ticker) => {
  const url = `http://financials.morningstar.com/ratios/r.html?ops=clear&t=${ticker}&region=usa&culture=en-US`

  const page = await getWebPage(url)
  await page.waitForSelector('table:nth-of-type(2)', { timeout: 5000 })

  const allTables = (await page.$$('table')) || []
  const tableData = await Promise.all(
    allTables.map(async (table) => {
      const tableHtml = await page.evaluate((node) => node.outerHTML, table)
      return parseTable(tableHtml)
    })
  )

  const result = tableData.reduce((acc, curr) => ({ ...acc, ...curr }), {})
  return result
}

module.exports = { getPageData }
