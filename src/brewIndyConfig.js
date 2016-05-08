/**
 * Created by ivan on 5/5/16.
 */
(function() {
    "use strict";
    angular
        .module('brewIndy')
        .config(brewIndyConfig)
        // .config(uiGmapGoogleMapApi)
        .run(brewIndyRun);

    brewIndyConfig.$inject = ['$locationProvider', '$httpProvider'];
    function brewIndyConfig($locationProvider, $httpProvider) {
        $locationProvider.html5Mode(true);
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
        $httpProvider.defaults.headers.common["Accept"] = "application/json";
        $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    }

    // uiGmapGoogleMapApi.$inject = ['uiGmapGoogleMapApiProvider'];
    // function uiGmapGoogleMapApi(uiGmapGoogleMapApiProvider) {
    //     uiGmapGoogleMapApiProvider.configure({
    //         key: 'AIzaSyDbRnxqCfp5q_8Tfn-SzVhG38JQBAvOjSw'
    //     });
    // }

    brewIndyRun.$inject = ['$rootScope'];
    function brewIndyRun($rootScope) {
        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
            console.log(unfoundState.to); // "lazy.state"
            console.log(unfoundState.toParams); // {a:1, b:2}
            console.log(unfoundState.options); // {inherit:false} + default options
        });
    }
})();