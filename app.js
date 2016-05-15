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
app.use('/views', express.static(__dirname + '/views'));
app.use(session({
  secret:"455e96f6c76b60d39f549f2f7a1830f1",
  resave:false,
  saveUninitializer:false
}));
var as ={};
mongoose.connect('mongodb://ponchito:1995@ds023042.mlab.com:23042/latexshop');
//mongoose.connect('mongodb://localhost/latexshop');

app.get('/', function(req, res){
	if(as.user){
		req.session = as;
		res.render('index', {usuario:req.session.user._id});
	} else {
		res.render('index', {usuario:""});
	}

});

app.get("/find/cart/:idUsuario", function (req, response) {
    ShippingCar.findOne({"usuario": mongoose.Types.ObjectId(req.params.idUsuario)})
        .exec(function (err, obj) {
					if(!obj.productos){
						obj.productos=[];
					}
            response.json(obj);
        });
});

app.get("/find/productos/playeras", function (req, response) {
    Producto.find({categoria:"playeras"})
        .exec(function (err, obj) {
            response.json(obj);
        });
});

app.get("/find/productos", function (req, response) {
    Producto.find()
        .exec(function (err, obj) {
            response.json(obj);
        });
});

app.get("/find/productos/gorras", function (req, response) {
    Producto.find({categoria:"gorra"})
        .exec(function (err, obj) {
            response.json(obj);
        });
});

app.get("/find/productos/cases", function (req, response) {
    Producto.find({categoria:"case"})
        .exec(function (err, obj) {
            response.json(obj);
        });
});

app.post("/iniciarSesion", function(req, response){
	Usuario.findOne({"email": req.body.email, "password":req.body.password})
		.exec(function(err, obj){
			if(err){
				response.redirect("/");
			} else {
				req.session.user = obj;
				as=req.session;
				response.redirect("/");
			}
		});
});

app.post("/agregarObjeto", function (req, response) {
	var producto = Producto.findOne({_id:req.body.idProducto})
			.exec(function (err, obj) {
				ShippingCar.update({"usuario": req.body.idUsuario}, {$push: {productos: {$each: [obj]}}}, {upsert: true}, function (err) {
						if (err) {
								console.log(err);
						}
						return response.send("Algo");
				});
			});
});

app.post("/removerObjeto", function (req, response) {
	ShippingCar.findOne({"usuario": mongoose.Types.ObjectId(req.body.idUsuario)})
			.exec(function (err, obj) {
				if(obj.productos){
					for(var i = 0; i<obj.productos.length; i++){
						if(obj.productos[i]._id == req.body.idProducto){
							obj.productos.splice(i,1);
							break;
						}
					}
				}
				obj.save(function (err, user) {
                if (err) {
                } else {
                    return response.send("Algo");
                }
            }
        );
			});
	});

app.listen(port, function(){
	console.log("Escuchando en el puerto " + port);
});
