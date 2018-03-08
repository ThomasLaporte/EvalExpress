const express = require('express')
const consolidate = require('consolidate')
const app = express()
const port = 8000;
const fs = require('fs')

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');

app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/helpers', express.static(__dirname + '/helpers'));



/*
app.use('*', function checkHour(req, res, next) {
    var nextDate = new Date();

    if (nextDate.getMinutes() > 49 && nextDate.getMinutes() <= 59) {
        res.status(429);
        res.send("<h1>Ce site est trop populaire ! Réessayez plus tard</h1>");
    } else {
        next();
    }
});
*/

app.use('/private*', function checkPrivate(req, res) {
    res.status(403);
    res.send("<h1>Vous n'avez pas le droit d'accèder à cette page</h1>");
});


app.use('/', function(req, res) {
    res.render('welcome.html');
});

app.listen(port, function(err){
    if (err){
        console.log("Failed to lauch server");
    }
    else{
        console.log("Listening"+ port);
    }
});


/////////////////// FUNCTIONS /////////////////

function readJSON() {
    console.log('reading ...');
    fs.readFile(
        'helpers/forex.json',
        {encoding: 'utf-8'},
        function(err, contents) {
            if (err) {
                console.error(err)
            } else {
                console.log(JSON.parse(contents));
            }
        }
    )
}
