'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('MapCtrl', ['$scope', '$http', function ($scope, $http) {

$scope.projects = null;


var count = 0;
$scope.servers = [{
  'test': {
    'FeatureServer': 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer',
    'layers': []
  }
},
{
  'WAKE': {
      'Addresses' : 'http://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query'
   }
}];


var getData = function (count, order, name){
var options = {
    f: 'json',
    outFields: '*',
    where: 'OBJECTID >' + count,
    orderByFields: order + ' ASC',
    outSR: 4326,
    returnGeometry: true
};
for (var i in $scope.servers[0].test.layers){
for (var each in $scope.servers[0].test.layers[i]){
  if ($scope.servers[0].test.layers[i][each].name === name){
    var conn = $scope.servers[0].test.FeatureServer + '/' + $scope.servers[0].test.layers[i][each].id + '/query';
    $http.get(conn, {params: options, cache: true})
      .success(function(res){
        if (name === 'RPUD.ENGINEERINGFIRM'){
          $scope.engfirms = res.features;
        }
        if (name === 'Project Tracking'){
          $scope.projects = res.features;

          console.log($scope.projects);
          $scope.projectnames = [];
           $scope.geojson = {
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
          };
          for (var each in $scope.projects){
             $scope.geojson.data.features.push({
                        "type": "Feature",
                        "geometry": {
                          "type": "Polygon",
                          "coordinates": $scope.projects[each].geometry.rings
                        },
                        "properties": $scope.projects[each].attributes
                      }
                    );
          }
          console.log($scope.geojson);




        }
        if (name === 'RPUD.PTK_DOCUMENTS'){
          $scope.fields = res.fields;
        }
        if (name === 'RPUD.SHEETTYPES'){
          $scope.sheetdisc = res.features;
        }
        if (name === 'RPUD.DOCUMENTTYPES'){
          $scope.doctypes = res.features;
        }
      });
  }
}
}
}

$http.get($scope.servers[0].test.FeatureServer, {params: {f: 'json'}, cache: true})
.success(function(res){
$scope.servers[0].test.layers.push(res.layers);
$scope.servers[0].test.layers.push(res.tables);
setTimeout(function(){
  getData(count, 'OBJECTID', 'RPUD.PTK_DOCUMENTS');
  getData(count, 'PROJECTNAME', 'Project Tracking');
  getData(count, 'SIMPLIFIEDNAME', 'RPUD.ENGINEERINGFIRM');
  getData(count, 'SHEETTYPE', 'RPUD.SHEETTYPES');
  getData(count, 'DOCUMENTTYPE', 'RPUD.DOCUMENTTYPES');
}, 1000);
});



  //
  angular.extend($scope, {
        center: {
                    lat: 35.843768,
                    lng: -78.6450559,
                    zoom: 10
                },
        defaults: {
            scrollWheelZoom: false
        }

    });

    // Get the countries geojson data from a JSON



  }]);
