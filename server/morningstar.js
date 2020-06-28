const parseCsv = require('csv-parse')
const fs = require('fs').promises

const badTitles = ['Other', 'Revenue']

const formatCsvOutput = (data, fields) => {
  const result = {}
  const [yearsRow, ...valuesRows] = data.filter((row) => row.length > 1)
  const years = yearsRow.filter((val) => val).map((val) => val.substring(0, 4))

  valuesRows
    .filter(([title]) => title && fields.length > 0 && fields.includes(title))
    .filter(([title]) => !badTitles.includes(title))
    .forEach(([title, ...values]) => {
      result[title] = values.reduce(
        (acc, curr, i) => ({
          ...acc,
          [years[i]]: parseFloat(curr.replace(/,/g, ''), 10),
        }),
        {}
      )
    })

  return result
}

const handleParse = (file) =>
  new Promise((resolve, reject) => {
    parseCsv(
      file,
      {
        relax_column_count: true,
      },
      (err, output) => {
        if (err) reject(err)
        resolve(output)
      }
    )
  })

const parse = async (ticker, fields) => {
  if (!ticker) throw new Error('Ticker is required')
  const content = await fs.readFile(`data/exports/${ticker.toUpperCase()}.csv`, 'utf-8')
  const output = await handleParse(content)
  const formattedData = formatCsvOutput(output, fields)
  return formattedData
}

module.exports = parse
