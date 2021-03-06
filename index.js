const express = require('express')
const consolidate = require('consolidate')

const fs = require('fs')
const app = express()
const port = 8000

const db      = require('./helpers/fake-db');
const devices = require('./helpers/forex.json');

app.engine('html', consolidate.mustache);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');



app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/static',  express.static(__dirname + '/public'));

app.use(express.urlencoded({extended: true}));

app.use(express.json())

app.get('*', function checkHour(req, res, next) {
    var nextDate = new Date();

    if (nextDate.getMinutes() > 25 && nextDate.getMinutes() <= 30) {
        res.status(429);
        res.send("<h1>Ce site est trop populaire ! Réessayez plus tard</h1>");
    } else {
        next();
    }
});

app.use('/private*', function checkPrivate(req, res) {
    res.status(403);
    res.send("<h1>Vous n'avez pas le droit d'accèder à cette page</h1>");
});



app.get("/detail/:id", (req, res) => {

  let idItems = req.params.id
  let getOneItem = db.getOne(idItems)
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
        main: 'devices'
      },
      title: value.name,
      price: value.priceEur,
      devices: rates
    })

  })

})

app.get('/items', (req, res) => {

  let ratesJSON = devices.rates
  let rates = []
  for (key in ratesJSON)
  {
    rates.push({"name" : key, "value": ratesJSON[key]})
  }

  var promise1 = Promise.resolve(db.getAll());

  promise1.then(function(value) {

    if(req.query.d !== undefined){
      var thisdeviceprice = ratesJSON[req.query.d]
      for( val in value){
        value[val].priceEur = value[val].priceEur * thisdeviceprice
        value[val].priceEur = parseFloat(value[val].priceEur).toFixed(2);
      }
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

app.post('/items', (req, res) => {
  const inputData = req.body
  console.log('creating', inputData)
  setTimeout(() => {
    res.redirect('/items')
  }, 500)
})

app.get('/add', (req, res) => {
    res.render('layout', {
      partials: {
        main: 'addItem',
      },
      title: 'Ajouter un item'
    })
})

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

app.post('/add', function(req, res) {

    if(req.body.nameField != "" && req.body.priceField != "" && isInt(parseInt(req.body.priceField))){
        console.log("OK")
        db.add({name:req.body.nameField, priceEur: req.body.priceField})
            .then(function(){

              res.render('layout', {
                partials: {
                  main: 'addItem',
                },
                text: "Ajout effectué avec succés !",
                classInfo: "success"
              })

            })
    }
    else
    {
        console.log("!OK")
        res.render('layout', {
          partials: {
            main: 'addItem',
          },
          text: "Une erreur a été rencontrée. Merci de vérifier les valeurs que vous avez saisie",
          classInfo: "alert",
        })

    }
})

app.use('/', function(req, res) {;
    res.render('layout', {
      partials: {
        main: 'welcome'
      },
      title: 'bienvenue'
    })
});

app.use('*', function respond404(req, res) {
  res.status(404).send('Page introuvable')
})



app.listen(port, err => {
  if (err) {
    console.error('Failed to launch server')
  } else {
    console.info(`Listening ${port}`)
  }
})
