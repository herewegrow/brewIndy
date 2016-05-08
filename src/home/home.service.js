/**
 * Created by ivan on 5/5/16.
 */
(function(){
    "use strict";
    angular
        .module('brewIndy')
        .service('homeService', homeService);

    homeService.$inject = ['geolocationService', '$http', 'NgMap', '$q'];
    function homeService(geolocationService, $http, NgMap, $q) {
        var map = {};
        var gmap;
        var userCoords;
        var places = [];
        var markers = [];

        /* default vals - TODO: need to move these into angular constants */
        var indianapolis = {latitude: 39.7790849, longitude: -86.1387615};
        var zoom = 13;
        var API_URL = 'http://localhost:8001/api';
        /* ====== */
        
        return {
            init: init,
            getMap: getMap,
            loadPlaces: loadPlaces,
            getPlaces: getPlaces,
            getMarkers: getMarkers
        };

        function init() {
            var deferred = $q.defer();

            NgMap.getMap()
                .then(function(_gmap) {
                    gmap = _gmap;
                    
                    geolocationService
                        .getCurrentPosition()
                        .then(function(loc){
                            userCoords = loc.coords;
                            map.center = [userCoords.latitude, userCoords.longitude];
                            map.zoom = zoom;

                            // TODO: can refactor this to use $q.when, so that we're not calling loadPlaces here and in the catch
                            loadPlaces()
                                .then(function(){
                                    deferred.resolve();
                                })
                                .catch(function(err){
                                    deferred.reject(err);
                                });
                        })
                        .catch(function(err){
                            //set default lat/long if unable to get user's location
                            map = {
                                center: [
                                    indianapolis.latitude,
                                    indianapolis.longitude
                                ],
                                zoom: zoom
                            };
                            loadPlaces()
                                .then(function(){
                                    deferred.resolve();
                                })
                                .catch(function(err){
                                    deferred.reject(err);
                                }); 
                        });
                });
            return deferred.promise;
        }
        function getMap() { return map; }

        function loadPlaces() {
            var params = [
                '?latitude=' + map.center[0],
                '&longitude=' + map.center[1]
            ].join('');
            
            return $http.get(API_URL + '/places/all' + params)
                .then(function(res){
                    places = res.data.results;
                    markerCoords();
                });
        }
        function getPlaces() { return places; }

        function markerCoords() {
            places.forEach(function(place) {
                var loc = place.geometry.location;
                markers.push({
                    name: place.name,
                    position: [loc.lat, loc.lng]
                });
            });
        }
        function getMarkers() { return markers; }
    }
})();
