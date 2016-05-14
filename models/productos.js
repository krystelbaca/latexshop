var mongoose = require("mongoose");


var productoSchema = mongoose.Schema({
    productName: {type: String},
    productPrice: {type: Number},
    talla:{type: String},
    color:{type: String},
});


module.exports = mongoose.model("Producto", productoSchema);
