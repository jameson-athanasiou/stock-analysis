const puppeteer = require('puppeteer')
const HtmlTableToJson = require('html-table-to-json')
const tableToJson = require('tabletojson').Tabletojson
const { parseTable } = require('./parseMorningstarTable')

const getPageData = async () => {
  const url = 'http://financials.morningstar.com/ratios/r.html?ops=clear&t=MSFT&region=usa&culture=en-US'

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)
  await page.waitForSelector('table')
  const html = await page.evaluate(() => document.body.innerHTML)
  //   console.log(html)

  const [firstTableElement] = (await page.$$('table')) || []
  const firstTableHtml = await page.evaluate((node) => node.outerHTML, firstTableElement)

  //   console.log(firstTableHtml)
  //   const jsonTables = HtmlTableToJson.parse(firstTableHtml).results
  // const jsonTables = tableToJson.convert(firstTableHtml)

  const jsonTables = parseTable(firstTableHtml)
  console.log(jsonTables)
}

module.exports = { getPageData }
