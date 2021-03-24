const puppeteer = require('puppeteer')
const Cache = require('./cache')

const requestCache = new Cache()

const getWebPage = async (url) => {
  const cachedRequest = requestCache.getRequest(url)
  if (cachedRequest) return cachedRequest

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.goto(url)

  if (page) requestCache.addRequest(url, page)

  return page
}

module.exports = { getWebPage }
