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
app.use(bodyParser.urlencoded({extended:false}));
app.set('view options', {layout:false});
app.use(express.static(__dirname + '/views'));
app.use(session({
  secret:"455e96f6c76b60d39f549f2f7a1830f1", //Es un hash que identifica  nuestra aplicacion de otras aplicaciones express
  resave:false,//Cada vez que se aga un request se tiene que guardar o rehacer la sesión
  saveUninitializer:false // Sirve para reinicializar la sesión cada vez que se hace un request
}));

mongoose.connect('mongodb://ponchito:1995@ds023042.mlab.com:23042/latexshop');

app.get('/', function(req, res){
	res.render('index.html');
})


app.get("/show/cart", function (req, response) {
    ShippingCar.findById({"usuario": mongoose.Types.ObjectId(req.session.usuario._id)})
        .exec(function (err, obj) {
            response.render("/shippingCar?",{carrito: obj});
        });
});

app.listen(port, function(){
	console.log("Escuchando en el puerto " + port);
})
