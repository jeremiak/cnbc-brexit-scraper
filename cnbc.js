#!/usr/bin/env node

const http = require("axios")
const program = require("commander")

const today = new Date()
const year = today.getFullYear()
const month = today.getMonth() + 1
const day = today.getDate() + 1
const monthStr = month < 10 ? `0${month}` : `${month}`
const dayStr = day < 10 ? `0${day}` : `${day}`
const defaultEndDate = `${year}${monthStr}${dayStr}`

program
  .option(
    "-c --currency [currency]",
    "Currency to compare against USD [GBP]",
    "GBP"
  )
  .option(
    "-e --end-date [today]",
    `Specify the end date of the query formatted as YYYYMMDD, defaults to the current day [${defaultEndDate}]`,
    defaultEndDate
  )
  .parse(process.argv)

const getApiUrl = (
  end,
  currency,
  start = "20170101000000",
  offset = "EST5EDT"
) => {
  const base = `https://ts-api.cnbc.com/harmony/app/bars/${currency}%3D/1D`
  const url = `${base}/${start}/${end}/adjusted/${offset}.json`

  return url
}

const parseDate = dateStr => {
  const d = dateStr.slice(0, 8)
  const year = +d.slice(0, 4)
  const month = +d.slice(4, 6)
  const day = +d.slice(6, 8)

  return new Date(year, month - 1, day)
}

const url = getApiUrl(`${program.endDate}000000`, program.currency)
http
  .get(url)
  .then(response => {
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
  .then(daily => {
    const json = JSON.stringify(daily, null, 2)

    process.stdout.write(json)
  })
