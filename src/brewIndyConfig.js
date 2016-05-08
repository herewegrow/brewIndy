/**
 * Created by ivan on 5/5/16.
 */
(function() {
    "use strict";
    angular
        .module('brewIndy')
        .constant('BI_CONST', BI_CONST())
        .config(brewIndyConfig)
        .run(brewIndyRun);

    function BI_CONST() {
        return {
            API_URL: 'http://localhost:8001/api',
            indianapolis: {latitude: 39.7790849, longitude: -86.1387615},
            zoom: 14
        };
    }

    brewIndyConfig.$inject = ['$locationProvider', '$compileProvider'];
    function brewIndyConfig($locationProvider, $compileProvider) {
        $locationProvider.html5Mode(true);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|http|https):/);
    }

    brewIndyRun.$inject = ['$rootScope'];
    function brewIndyRun($rootScope) {
        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
            console.log(unfoundState.to); // "lazy.state"
            console.log(unfoundState.toParams); // {a:1, b:2}
            console.log(unfoundState.options); // {inherit:false} + default options
        });
    }
})();