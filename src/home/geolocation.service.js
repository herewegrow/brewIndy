/**
 * Created by ivan on 5/7/16.
 */
(function() {
    "use strict";
    angular
        .module('brewIndy')
        .service('geolocationService', geolocationService);

    geolocationService.$inject = ['$q', '$window'];
    function geolocationService($q, $window) {

        return {
            getCurrentPosition: getCurrentPosition
        };

        function getCurrentPosition() {
            var deferred = $q.defer();

            // PositionOptions object
            var options = {
                enableHighAccuracy: false,
                // cache the location for 10 mins
                maximumAge: 600000,
                // fail if lookup takes > 7s
                timeout: 8000
            };

            if (!$window.navigator.geolocation) {
                deferred.reject('Geolocation not supported.');
            } else {
                $window.navigator.geolocation.getCurrentPosition(
                    function (position) {
                        deferred.resolve(position);
                    },
                    function (err) {
                        deferred.reject(err);
                    }, options);
            }
            return deferred.promise;
        }
    }
})();