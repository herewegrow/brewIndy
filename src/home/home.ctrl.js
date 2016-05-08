/**
 * Created by ivan on 5/5/16.
 */
(function(){
    "use strict";
    angular
        .module('brewIndy')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['homeService'];
    function HomeCtrl(homeService) {
        var vm = this;

        // ctrl properties
        vm.map = undefined;
        vm.places = undefined;
        vm.markers = undefined;
        
        vm.loading = false;
        
        (function activate() {
            vm.loading = true;
            homeService
                .init()
                .then(function() {
                    bindValues();
                    vm.loading = false;
                });
        })();
        
        function bindValues() {
            vm.map = homeService.getMap();
            vm.places = homeService.getPlaces();
            vm.markers = homeService.getMarkers();
        }
    }
})();