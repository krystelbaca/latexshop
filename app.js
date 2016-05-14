var express = require('express');
var bodyParser = require('body-parser');
var mongoose  = require('mongoose');

var app = express();
var port = process.env.PORT||8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.set('view options', {layout:false});
app.use(express.static(__dirname + '/views'));
app.get('/', function(req, res){
	res.render('index.html');
})


app.listen(port, function(){
	console.log("Escuchando en el puerto " + port);
})