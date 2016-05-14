var express = require('express');
var bodyParser = require('body-parser');
var mongoose  = require('mongoose');




var app = express();

var port = process.env.PORT||8080;
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}));

app.use('/public', express.static(__dirname + '/public'));
app.use('/views', express.static(__dirname + '/views'));

app.get('/', function(req, res){
	res.render('index');
});

app.listen(port, function(){
	console.log("Escuchando en el puerto " + port);
});

