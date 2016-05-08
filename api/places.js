/**
 * Created by ivan on 5/7/16.
 */
"use strict";
var router = require('express').Router();
var controller = require('./placesController.js');

router.get('/all', function(req, res){
    let latitude = req.query.latitude,
        longitude = req.query.longitude;
    
    controller.getAllPlaces(latitude, longitude).then((returnObj) => {
        res.status(200).send(returnObj);
    }).catch((err) => {
        res.status(500).json({err: err.toString()});
    });
});

module.exports = router;
