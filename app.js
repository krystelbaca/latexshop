var express = require('express');
var bodyParser = require('body-parser');
var mongoose  = require('mongoose');
var app = express();

var port = process.env.PORT||8080;
var session = require("express-session");
var Usuario = require('./models/usuarios');
var ShippingCar = require('./models/shippingCars');
var Producto = require('./models/productos');

app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}));

app.set('view options', {layout:false});
app.use('/public', express.static(__dirname + '/public'));
app.use(session({
  secret:"455e96f6c76b60d39f549f2f7a1830f1",
  resave:false,
  saveUninitializer:false
}));

mongoose.connect('mongodb://ponchito:1995@ds023042.mlab.com:23042/latexshop');

app.get('/', function(req, res){
	res.render('index', {usuario:"5736e11b3f99d590093ddbea"});
});

app.get("/find/cart/:idUsuario", function (req, response) {
    ShippingCar.findOne({"usuario": mongoose.Types.ObjectId(req.params.idUsuario)})
        .exec(function (err, obj) {
            response.json(obj);
        });
});

app.listen(port, function(){
	console.log("Escuchando en el puerto " + port);
});
