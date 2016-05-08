/**
 * Created by ivan on 5/5/16.
 */
(function() {
    "use strict";
    angular
        .module('brewIndy')
        .config(modConfig);

    modConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function modConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise('/');
        
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'vm',
                data: {}
            });
    }
})();