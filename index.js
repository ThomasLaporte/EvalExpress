const express = require('express')
const consolidate = require('consolidate')
const fs = require('fs')
const app = express()

const db      = require('./helpers/fake-db');
const devices = require('./helpers/forex.json');


app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(
  '/static',
  express.static(__dirname + '/public')
)

app.use(express.urlencoded({
  extended: true,
}))
app.use(express.json())


app.get('/items', (req, res) => {

  let ratesJSON = devices.rates
  let rates = []
  for (key in ratesJSON)
  {
    rates.push({"name" : key, "value": ratesJSON[key]})
  }

  var promise1 = Promise.resolve(db.getAll());

  promise1.then(function(value) {
        res.render('layout', {
          partials: {
            main: 'items',
          },
          title: 'Liste des enregistrements',
          items: value,
          devises:rates,
        })
  });
})

app.get('/items/:devise', (req, res) => {
  let ratesJSON = devices.rates
  let rates = []
  for (key in ratesJSON)
  {
    rates.push({"name" : key, "value": ratesJSON[key]})
  }

  var thisdeviceprice = ratesJSON[req.params.devise]
  var promise1 = Promise.resolve(db.getAll());

  promise1.then(function(value) {
    for( val in value){
      value[val].priceEur = value[val].priceEur * thisdeviceprice
      value[val].priceEur = parseFloat(value[val].priceEur).toFixed(2);
    }
    res.render('layout', {
      partials: {
        main: 'items',
      },
      title: 'Liste des enregistrements',
      items: value,
      devises:rates,
    })
  });
})


app.get('/item/:id', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Liste</title>
      </head>
      <body>
        <h1>Super Site</h1>
        <ul>
          ici item #${req.params.id}
        </ul>
      </body>
    </html>
  `)
})

app.post('/items', (req, res) => {
  const inputData = req.body
  console.log('creating', inputData)
  setTimeout(() => {
    res.redirect('/items')
  }, 500)
})

app.use('*', function respond404(req, res) {
  res.status(404).send('Page introuvable')
})

const port = 8000

app.listen(port, err => {
  if (err) {
    console.error('Failed to launch server')
  } else {
    console.info(`Listening ${port}`)
  }
})
