var mongoose = require("mongoose");


var productoSchema = mongoose.Schema({
    productName: {type: String},
    productPrice: {type: Number},
    talla:{type: String},
    celular:{type: String},
    color:{type: String},
    img:{type:String},
    cantidad:{type: Number},
    categoria:{type:String}
});


module.exports = mongoose.model("Producto", productoSchema);
