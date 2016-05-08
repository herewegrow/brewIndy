/**
 * Created by ivan on 5/7/16.
 */
"use strict";

var requestify = require('requestify');

let getAllPlaces = (latitude, longitude) => {
    return new Promise((resolve, reject) => {
        var placesAPI = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
        var APIkey = 'AIzaSyCxlOaPkjCo9UxL-YAR73pj2VpDyaJGGOY';
        var params = [
            '?key=' + APIkey,
            '&location=' + latitude + ',' + longitude,
            '&radius=10000',
            '&types=bar',
            '&names=brewery,brewing'
        ].join('');

        requestify.get(placesAPI+params)
            .then(function(response) {
                // Get the response body (JSON parsed - JSON response or jQuery object in case of XML response)
                response.getBody();
                // Resolve the response raw body
                resolve(response.body);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports ={
    getAllPlaces:getAllPlaces
};