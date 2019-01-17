# CNBC Brexit price scraper

Some scripts to pull data from CNBC for various currencies (against the US dollar) and push them to a Google spreadsheet.

## Usage

Make sure to install dependencies:
```
$ nvm use
$ npm install
```

Scrape closing price of a foreign currency measured in dollars with `cnbc.js`. Data starts on January 1, 2017.

```
Usage: node cnbc.js [options]

Options:
  -c --currency [currency]  Currency to compare against USD [GBP] (default: "GBP")
  -e --end-date [today]     Specify the end date of the query formatted as YYYYMMDD, defaults to the current day [20190117] (default: "20190117")
  -h, --help                output usage information
```

For example, to get closing prices for the British Pound:

`$ node cnbc.js -c GBP`

or for the Euro:

`$ node cnbc.js -c EUR`