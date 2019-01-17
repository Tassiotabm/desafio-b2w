var mongoose = require('mongoose');  
var PlanetSchema = new mongoose.Schema({  
  Nome: String,
  Clima: String,
  Terreno: String
});
mongoose.model('Planet', PlanetSchema);

module.exports = mongoose.model('Planet');