const express = require('express')
const consolidate = require('consolidate')

const db = require('./helpers/fake-db.js')

const app = express()

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');

app.use(express.urlencoded({
    extended: true,
}))

app.get('/', function(req, res){
    res.send("<h1>TESTTSTS</h1>")
})


app.get('/add', (req, res) => {
    res.render('addItem')
})

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

app.post('/add', function(req, res) {

    if(req.body.nameField != "" && req.body.priceField != "" && isInt(parseInt(req.body.priceField))){
        console.log("OK")
        db.add({name:req.body.nameField, priceEur: req.body.priceField})
            .then(function(){
                res.render('addItem', {
                    text: "Ajout effectué avec succés !",
                    classInfo: "laClasseTrue",
                })
            })
    }
    else
    {
        console.log("!OK")
        res.render('addItem', {
            text: "Une erreur a été rencontrée. Merci de vérifier les valeurs que vous avez saisie",
            classInfo: "laClasseFalse",
        })
    }
})





    // if(test.nameField != "" && test.priceField != "" && (isNaN(test.priceField) == true || isFloat(test.priceField) == true)){
    //     console.log("OK")
    //      test
    //         .then(params => db.add({name:params.nameField, priceEur: params.priceField}))
    //         .then(promises => Promise.resolve(db.getAll()))
    //         .then(
    //             res.render('addItem', {
    //
    //                 text: "OK",
    //             })
    //
    //
    //
    //         )
    //         .catch(err => {
    //             return 'Erreur'
    //         })
    //
    //
    // }
    // else
    // {
    //     console.log("NOP")
    //     res.render('addItem', {
    //
    //         text: "!OK",
    //     })
    // }





    // var promise1 = Promise.resolve(req.body);
    //
    // promise1.then(function(value) {
    //     var proAdd = new Promise(function(resolve, reject){
    //
    //
    //     })
    //
    //
    //
    //     // res.send(`${value.name}`)
    // });





const port = 8000

app.listen(port, err => {
    if(err){
        console.error('Failed to launch server')
    } else {
        console.info('Listening ${port}')
}
})