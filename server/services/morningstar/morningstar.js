const { getPageData } = require('./access')

const getMorningstarData = async (ticker) => {
  if (!ticker) {
    const tickerMissingError = new Error('Ticker not present')
    tickerMissingError.code = 'TICKER_MISSING'
    throw tickerMissingError
  }

  const data = await getPageData(ticker)

  if (data) {
    return data
  }

  throw new Error('Data not available')
}

module.exports = { getMorningstarData }
