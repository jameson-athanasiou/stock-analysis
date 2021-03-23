const puppeteer = require('puppeteer')

const getWebPage = async (url) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.goto(url)

  return page
}

module.exports = { getWebPage }
