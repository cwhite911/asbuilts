'use strict';


angular.module('asbuiltsApp')
.controller('projectCtrl', ['$scope','$cookieStore', '$routeParams', 'serverFactory', 'leafletData',
function ($scope, $cookieStore, $routeParams, serverFactory, leafletData) {
  function removeEmptyFields (data) {
    for (var a in data){
      data[a] === 'Null' ? delete data[a] : data[a];
    }
    console.log(data);
    return data;
  }

  $scope.projectid = $routeParams.projectid


  //Options for search
  var searchOptions = {
    params: {
      f: 'json',
      searchText: $scope.projectid,
      searchFields: 'PROJECTID',
      layers: 'Project Tracking, RPUD.PTK_DOCUMENTS', //Use layer names or layer ids
      sr: 4326
    },
    actions: 'find',
    geojson: true
  };
  //Document Search Options
  var documentOptions = {
    layer: 'RPUD.PTK_DOCUMENTS',
    actions: 'query',
    params: {
      f: 'json',
      outFields: '*',
      where: "PROJECTID =  '" + $scope.projectid + "'",
    }
  };
  serverFactory.getDocCounts($scope.projectid).then(function(res){
    console.log(res);
  });
  //Get Project Documents
  serverFactory.pt_ms.request(documentOptions).then(function(res){
    console.log(res);
    $scope.docTypeCount = [];
    res.features.forEach(function(each){
      $scope.docTypeCount.push({type: each.attributes.DOCTYPEID, count: 1})
    });
    $scope.projectDocuments = res.features;
  });

  //Sets the basemap
  leafletData.getMap('project-map').then(function(map) {
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.3hqcl3di/{z}/{x}/{y}.png').addTo(map);
  });

  //Sets up pie chart
  // var ctx = document.getElementById("myChart").getContext("2d");

  //Get project data from server
  serverFactory.pt_ms.request(searchOptions).then(function(res){
    console.log(res);

    $scope.projectInfo = res.features[0].properties;
    $scope.projectInfo = removeEmptyFields($scope.projectInfo)
    leafletData.getMap('project-map').then(function(map) {
      L.geoJson(res, {
        onEachFeature: function (feature, layer) {
          map.fitBounds(layer.getBounds());
        }
      }).addTo(map);
    });
  },
  function (err){
      console.log(err);
  });



}]);
