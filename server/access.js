const puppeteer = require('puppeteer')
const { parseTable } = require('./parseMorningstarTable')

const getPageData = async (ticker) => {
  const url = `http://financials.morningstar.com/ratios/r.html?ops=clear&t=${ticker}&region=usa&culture=en-US`

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)
  await page.waitForSelector('table')

  const allTables = (await page.$$('table')) || []
  const tableData = await Promise.all(
    allTables.map(async (table) => {
      const tableHtml = await page.evaluate((node) => node.outerHTML, table)
      return parseTable(tableHtml)
    })
  )

  const result = tableData.reduce((acc, curr) => ({ ...acc, ...curr }), {})
  // console.log(result)

  return result
}

module.exports = { getPageData }
