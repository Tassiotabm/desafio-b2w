var express = require('express');
var app = express();
var db = require('./db');

var swapi = require('./util/Swapi');
var PlanetController = require('./controller/planetController');
app.use('/planet', PlanetController);

module.exports = app;
