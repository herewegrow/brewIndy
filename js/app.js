var map;
var service;
var pos;
var infowindow;


$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').focus()
})

function initialize() {

    if (navigator.geolocation) {

        function error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
        }

        function success(pos){
            userCords = pos.coords;

            //return userCords;
        }

        // Get the user's current position
        navigator.geolocation.getCurrentPosition(success, error);
        //console.log(pos.latitude + " " + pos.longitude);
    } else {
        alert('Geolocation is not supported in your browser');
    }

    var indianapolis = new google.maps.LatLng(39.7790849, -86.1387615);

    map = new google.maps.Map(document.getElementById('map'), {
        center: indianapolis,
        zoom: 12
    });


    var request = {
        location: indianapolis,
        radius: '10000',
        types: ['bar'],
        name: ['brewery, brewing'],
        //types: ['brewery'],
        //keyword: ['brewery']
    };

    //console.log(request);

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

console.log("check 1");


function callback(results, status) {

    //console.log(results, status);

    var $breweryContainer = $('#breweryContainer');

    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];

            console.log(place);

            var brewery = '<div class="breweries"><div class="brewPic col-lg-3 col-md-3 col-sm-3"><img src="';
                brewery += place.photos[0].getUrl({'maxWidth': 80, 'maxHeight': 80});
                brewery += '"></div> <div class="brewName col-lg-3 col-md-3 col-sm-3">';
                brewery += place.name;
                brewery += '</div><div class="brewLocation col-lg-3 col-md-3 col-sm-3">';
                brewery += place.vicinity;
                brewery += '</div><div class="brewRating col-lg-3 col-md-3 col-sm-3">';
                brewery += place.rating;
                brewery += '</div></div>';

            $breweryContainer.append(brewery);

            //createMarker(results[i]);
        }


    }



    //$.ajax({
    //    type : 'GET',
    //    dataType:'json',
    //    //url : "https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key=AIzaSyDbRnxqCfp5q_8Tfn-SzVhG38JQBAvOjSw&libraries=places",
    //    success : function(data) {
    //
    //        $('#map')append('.text(data)', "testing");
    //
    //    }
    //});

    //here is the bubbles funciton

    function initparticles() {
        bubbles();
    }

    /*The measurements are ... whack (so to say), for more general text usage I would generate different sized particles for the size of text; consider this pen a POC*/

    function bubbles() {
        $.each($(".particletext.bubbles"), function(){
            var bubblecount = ($(this).width()/50)*10;
            for(var i = 0; i <= bubblecount; i++) {
                var size = ($.rnd(40,80)/10);
                $(this).append('<span class="particle" style="top:' + $.rnd(20,80) + '%; left:' + $.rnd(0,95) + '%;width:' + size + 'px; height:' + size + 'px;animation-delay: ' + ($.rnd(0,30)/10) + 's;"></span>');
            }
        });
    }


    jQuery.rnd = function(m,n) {
        m = parseInt(m);
        n = parseInt(n);
        return Math.floor( Math.random() * (n - m + 1) ) + m;
    }

    initparticles();

    console.log("fuck it i'm done");


}



