const scrape = require("./cnbc")
const update = require("./google")

scrape()
  .then(priceData => {
    const data = priceData.map(p => {
      return {
        ...p,
        gbpusd: p.close
      }
    })
    return update(data)
  })
  .then(priceData => {
    console.log("done")
  })
  .catch(err => {
    console.error('err', err)
  })
