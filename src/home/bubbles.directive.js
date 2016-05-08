/**
 * Created by ivan on 5/7/16.
 */
(function(){
    "use strict";
    angular
        .module('brewIndy')
        .directive('biBubbles', biBubbles);

    function biBubbles() {

        return {
            restrict: 'A',
            link: link
        };

        function link($scope, $element) {
            var bubbleCount = ($element.prop('offsetWidth') / 50) * 10;
            for (var i=0; i <= bubbleCount; i++) {
                var size = (rand(40,80) / 10);
                var bubble = angular.element(
                    '<span class="particle" style="top: ' + rand(20,80) + '%; left:'
                    + rand(0,100) + '%; width:' + size + 'px; height:' + size + 'px;'
                    + 'animation-delay:' + (rand(0,30)/10) + 's;"></span>'
                );
                $element.append(bubble);
            }
            function rand(m,n) {
                m = parseInt(m);
                n = parseInt(n);
                return Math.floor(Math.random() * (n-m+1)) + m;
            }
        }
    }
})();