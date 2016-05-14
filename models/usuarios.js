var mongoose = require("mongoose");

var usuarioSchema = mongoose.Schema({
    username: {type: String},
    email: {type: String},
    password: {type: String}
});

var Usuario = mongoose.model("Usuario", usuarioSchema);
module.exports = Usuario;
