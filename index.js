const express = require('express')
const consolidate = require('consolidate')

const app = express()
const port = 8000

app.use('/static' ,express.static( __dirname + '/public'))
app.engine('html', consolidate.mustache)
app.set('view engine', 'html')
app.set('views', __dirname + "/views")


// ------------


// ---- Page Home
app.get("/", (req, res) => {
  res.render('layout', {
    partials: {
      header : "header",
      navRight: 'nav-right',
      main: 'home',
      footer: 'footer'
    }
  })
})


// ---- Page Detail
let fakeDB = require('./helpers/fake-db.js')
const devices = require('./helpers/forex.json')

app.get("/detail/:id", (req, res) => {

  let id = req.params.id
  let getOneItem = fakeDB.getOne(id)
  let ratesJSON = devices.rates
  let rates = []

  getOneItem.then(function(value) {

    for (key in ratesJSON)
    {
      let convert = value.priceEur * ratesJSON[key]
      rates.push({"name" : key, "value": convert.toFixed(3)})
    }

    res.render('layout', {
      partials: {
        header : "header",
        navRight: 'nav-right',
        main: 'devices',
        footer: 'footer'
      },
      title: value.name,
      price: value.priceEur,
      devices: rates
    })

  })

})

app.listen(port, err => {
  if (err) {
    console.error('Failed')
  } else {
    console.info(`Listening on port : ${port}`)
  }
})
