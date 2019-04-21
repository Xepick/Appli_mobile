var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var session=require('express-session');
var routerListe=require('./routeListe');
var dataLayerListe = require('./dataLayerListe');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json({ type : 'application/vnd.api+json' })); //type de l'application
app.use(express.static(__dirname));
app.use(session({secret: "Shh, its a secret!"}));
app.use(session({
    name :"Cookiee AppMob"
 }));

app.use(routerListe);

dataLayerListe.init(function() {
    console.log('Inited on port 8081');
    app.listen(process.env.PORT || 8081);
});
