var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Planet = require('../model/planet');
var swapiService = require('../util/swapi');
var request = require('request');

// CREATES A NEW PLANET
router.post('/', function (req, res) {

    let nome = req.body.Nome;
    let clima = req.body.Clima;
    let terreno = req.body.Terreno;

    if (!nome)
        return res.status(406).send("Por favor, preencha o nome do planeta.");
    else if (!clima)
        return res.status(406).send("Por favor, preencha o clima do planeta.");
    else if (!terreno)
        return res.status(406).send("Por favor, preencha o terreno do planeta.");

    let planet = new Planet({
        Nome: req.body.Nome,
        Clima: req.body.Clima,
        Terreno: req.body.Terreno
    });

    Planet.create(planet,
        function (err) {
            if (err) return res.status(500).send("Erro ao criar planeta.");
            res.status(200).send();
        });
});

// RETURNS ALL THE PLANETS IN THE DATABASE
router.get('/', function (req, res) {
    Planet.find({}, async function (err, planetList) {
        if (err) return res.status(500).send("Erro ao procurar planeta.");
        let response = [];
        for(const planet of planetList){
            await swapiService.getCount(planet.Nome).then(count => {
                response.push({
                    Planet: planet,
                    Count: count
                })
            });
        }
        res.status(200).send(response);
    });
});

// GETS A SINGLE PLANET FROM THE DATABASE
router.get('/:id', function (req, res) {
    Planet.findById(req.params.id, async function (err, planet) {
        if (err) return res.status(500).send("Erro ao procurar planeta.");
        if (!planet) return res.status(404).send("Planeta não encontrado.");

        swapiService.getCount(planet.Nome).then(count => {
            res.status(200).send({
                Planet: planet,
                Count: count
            });
        });
    });
});

// DELETES A PLANET FROM THE DATABASE
router.delete('/:id', function (req, res) {
    let planetId = req.params.id;
    Planet.findById(planetId, function (err, planets) {
        if (err) return res.status(500).send("Erro ao procurar planeta.");
        if (!planets) return res.status(404).send("Planeta não encontrado.");
        Planet.findByIdAndRemove(planetId, function (err, planets) {
            if (err) return res.status(500).send("Erro ao deletar planeta.");
            res.status(200).send("Planeta: " + planets.Nome + " foi deletado.");
        });
    });
});

// UPDATES A SINGLE PLANET IN THE DATABASE
router.put('/:id', function (req, res) {
    let planetId = req.params.id;
    Planet.findById(planetId, function (err, planets) {
        if (err) return res.status(500).send("Erro ao procurar planeta.");
        if (!planets) return res.status(404).send("Planeta não encontrado.");
        Planet.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, planets) {
            if (err) return res.status(500).send("Erro ao editar planeta");
            res.status(200).send(planets);
        });
    });
});

module.exports = router;