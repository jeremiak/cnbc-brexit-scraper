const http = require("axios")

const today = new Date()
const year = today.getFullYear()
const month = today.getMonth() + 1
const day = today.getDate() + 1
const monthStr = month < 10 ? `0${month}` : `${month}`
const dayStr = day < 10 ? `0${day}` : `${day}`
const defaultEndDate = `${year}${monthStr}${dayStr}`

function getApiUrl (start, end, currency, offset = "EST5EDT") {
  const base = `https://ts-api.cnbc.com/harmony/app/bars/${currency}%3D/1D`
  const url = `${base}/${start}/${end}/adjusted/${offset}.json`

  return url
}

function parseDate (dateStr) {
  const d = dateStr.slice(0, 8)
  const year = +d.slice(2, 4)
  const month = +d.slice(4, 6)
  const day = +d.slice(6, 8)

  return `${month}/${day}/${year}`
}

const scrape = () => {
  const currency = 'GBP'
  const startDate = "20160101000000"
  const endDate = `${defaultEndDate}000000`

  const url = getApiUrl(startDate, endDate, currency)
  return http.get(url).then(response => {
    const daily = response.data.barData.priceBars

    return daily
      .filter(d => {
        return d.volume === 0
      })
      .map(d => {
        const date = parseDate(d.tradeTime)
        const close = +d.close

        return { close, date }
      })
  })
}

module.exports = scrape
