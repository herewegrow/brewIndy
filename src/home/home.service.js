/**
 * Created by ivan on 5/5/16.
 */
(function(){
    "use strict";
    angular
        .module('brewIndy')
        .service('homeService', homeService);

    homeService.$inject = ['geolocationService', '$http', 'NgMap', '$q', 'BI_CONST'];
    function homeService(geolocationService, $http, NgMap, $q, BI_CONST) {
        
        var gmap;
        var userCoords;
        var map = {};
        var places = [];
        var markers = [];
        
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
                            map.zoom = BI_CONST.zoom;

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
                                    BI_CONST.indianapolis.latitude,
                                    BI_CONST.indianapolis.longitude
                                ],
                                zoom: BI_CONST.zoom
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
            
            return $http.get(BI_CONST.API_URL + '/places/all' + params)
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
