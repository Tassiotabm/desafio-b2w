var express = require('express');
var app = express();
var db = require('./db');
var helmet = require('helmet');

var PlanetController = require('./controller/planetController');
app.use('/planet', PlanetController);
app.use(helmet());

module.exports = app;
