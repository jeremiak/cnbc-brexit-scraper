require("dotenv").config()

const GoogleSpreadsheet = require("google-spreadsheet")

const { queue } = require("d3-queue")

function authSheet(key) {
  const doc = new GoogleSpreadsheet(key)
  const creds = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  }

  return new Promise((resolve, reject) => {
    doc.useServiceAccountAuth(creds, err => {
      if (err) return reject(err)

      resolve(doc)
    })
  })
}

function getRows(doc, sheetIndex) {
  return new Promise((resolve, reject) => {
    doc.getRows(sheetIndex, (err, rows) => {
      if (err) return reject(err)

      resolve(rows)
    })
  })
}

function insertMissingRows(doc, sheetIndex, json) {
  function addRow(row, cb) {
    doc.addRow(sheetIndex, row, err => {
      console.log("done saving", row)
      cb(err, row)
    })
  }
  return getRows(doc, sheetIndex).then(rows => {
    const q = queue(10)
    const toBeCreated = []
    json.forEach(jRow => {
      const exists = rows.find(r => r.date === jRow.date)

      if (!exists) {
        q.defer(addRow, jRow)
      }
    })

    return new Promise((resolve, reject) => {
      q.await((err, results) => {
        if (err) return reject(err)
      })
    })
  })
}

function updateSheetWithJSON(json) {
  const sheetKey = "1LVggak0r4CcacfIwTew_onWXioYDJNpBe_latKJkhYo"
  const sheetIndex = 2

  return authSheet(sheetKey).then(doc =>
    insertMissingRows(doc, sheetIndex, json)
  )
}

module.exports = updateSheetWithJSON
