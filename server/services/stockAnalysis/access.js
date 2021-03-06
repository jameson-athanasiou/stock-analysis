const { getWebPage } = require('../../util/webPage')
const mapResponse = require('./mapper/response')

const getStatistics = async (ticker) => {
  const url = `https://stockanalysis.com/stocks/${ticker.toLowerCase()}/statistics`

  const page = await getWebPage(url)
  await page.waitForSelector('table:nth-of-type(2)', { timeout: 5000 })

  const data = mapResponse(page)

  return data
}

module.exports = { getStatistics }
