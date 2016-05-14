var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Usuario = mongoose.model('Usuario');

var shippingCarSchema = mongoose.Schema({
    usuario:{type: Schema.ObjectId, ref: "Usuario", required: true},
    productos:{type: Array, "default":[]},
    total: {type: Number}
});


var ShippingCar = mongoose.model("ShippingCar", shippingCarSchema);
module.exports = ShippingCar;
