'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('MapCtrl', ['$scope', '$http', 'leafletEvents', 'leafletData', function ($scope, $http, leafletEvents, leafletData) {



  //create a map in the "map" div, set the view to a given place and zoom
  // var map = L.map('map').setView([35.843768, -78.6450559], 13);
  angular.extend($scope, {
      center: {
        lat: 35.843768,
        lng: -78.6450559,
        zoom: 13
      },
      layers: {
            baselayers: {
                xyz: {
                    name: 'OpenStreetMap (XYZ)',
                    url: 'https://{s}.tiles.mapbox.com/v3/examples.3hqcl3di/{z}/{x}/{y}.png',
                    type: 'xyz'
                },
                world: {
					    	name: "Imagery",
					        type: "dynamic",
					        url: "http://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer",
					        visible: false,
					        layerOptions: {
					            layers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
				                opacity: 1,
				                attribution: "Copyright:© 2014 2014 City of Raleigh"
					        }
				    	}
            },
            overlays: {
              projects:{
              name: "Project Tracking",
                type: "dynamic",
                url: "http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/MapServer",
                visible: true,
                layerOptions: {
                    layers: [2],
                      opacity: 0.5,
                      attribution: "Copyright:© 2014 City of Raleigh"
                }
            }
            }
      }



  });
  $scope.$watch('geojson', function(newVal, oldVal){
    console.log($scope.geojson);
}, true);
// console.log($scope.layers.overlays.projects);

  $scope.projects = [];

var options = {
    f: 'json',
    outFields: '*',
    where: 'OBJECTID > 0',
    orderByFields:  'PROJECTNAME ASC',
    returnGeometry: false
};

$scope.mygeojson = {
   data: {
     "type": "FeatureCollection",
     "features": []
   }

};
var conn = 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/2/query';
$http.get(conn, {params: options, cache: true})
  .success(function(res){
    for (var i in res.features){
      var poly = [];
      $scope.projects.push(res.features[i].attributes.PROJECTNAME + ':' + res.features[i].attributes.DEVPLANID + ':' + res.features[i].attributes.PROJECTID)
    }
});

$scope.searchControl = function (typed){
  console.log(typed);
  var selection = typed.split(':');
  var options = {
          f: 'json',
          outFields: '*',
          where: "PROJECTID =  '" + selection[2] + "'",
          outSR: 4326,
          returnGeometry: true
      };
  var conn = 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/1/query';
  $http.get(conn, {params: options, cache: true})
    .success(function(res){
      console.log(res);
      leafletData.getMap().then(function(map) {
                var latlngs = [];
                $scope.poly = [];
                $scope.bound = [];
                for (var i in res.features[0].geometry.rings[0]) {
                    var coord = res.features[0].geometry.rings[0][i];
                    for (var j in coord) {
                      latlngs.push([coord[1], coord[0]]);
                      $scope.poly.push([coord[0], coord[1]]);
                      $scope.bound.push({lat: coord[1], lng: coord[0]});
                    }
                }
                $scope.mygeojson.data.features.push({
                    "type": "Feature",
                    "id": res.features[0].attributes.PROJECTID,
                    "properties": res.features[0].attributes,
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [$scope.poly]
                    }
                  });
                  $scope.geojson.data.features = $scope.mygeojson.data.features;

                  $scope.paths.p1.latlngs = $scope.bound;


                map.fitBounds(latlngs);
            });
    });


angular.extend($scope, {
    geojson: {
        data: {
          "type": "FeatureCollection",
          "features": []
        },
        style: {
            fillColor: "green",
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        }
    }
});

}



  angular.extend($scope, {
    paths: {
      p1:{
        latlngs:[],
      type:"polygon"
      }
    }
  }
  );


  }]);
