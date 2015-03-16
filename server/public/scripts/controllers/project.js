'use strict';


angular.module('asbuiltsApp')
.controller('projectCtrl', ['$scope','$cookieStore', '$rootScope', '$routeParams', 'Ags', 'leafletData',
function ($scope, $cookieStore, $rootScope, $routeParams, Ags, leafletData) {
  function removeEmptyFields (data) {
    for (var a in data){
      data[a] === 'Null' ? delete data[a] : data[a];
    }
    console.log(data);
    return data;
  }
  var scope = $rootScope;
  var mapServer = new Ags({host: 'mapstest.raleighnc.gov'});
  $scope.projectid = $routeParams.projectid

  //Project Tracking Map Server
  var projectService = mapServer.setService({
    folder:'PublicUtility',
    service: 'ProjectTracking',
    server: 'MapServer'
  });
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

  //Get Project Documents
  projectService.request(documentOptions).then(function(res){
    console.log(res);
    $scope.projectDocuments = res.features;
  });

  //Sets the basemap
  leafletData.getMap('project-map').then(function(map) {
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.3hqcl3di/{z}/{x}/{y}.png').addTo(map);
  });

  //Sets up pie chart
  // var ctx = document.getElementById("myChart").getContext("2d");

  //Get project data from server
  projectService.request(searchOptions).then(function(res){
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


function generatePieData (data) {
    var output = []
    switch (data.type){
      case AB:
        output.push()
    }
  };
  var data = [
{
  value: 300,
  color:"#38962E",
  highlight: "#24CE12",
  label: "Red"
},
{
  value: 50,
  color: "#31407D",
  highlight: "#223DAB",
  label: "Green"
},
{
  value: 100,
  color: "#B6383B",
  highlight: "#F9161C ",
  label: '<img src="../../images/pr.png"/>'
}
];


var options = {
  //Boolean - Whether we should show a stroke on each segment
  segmentShowStroke : true,

  //String - The colour of each segment stroke
  segmentStrokeColor : "#fff",

  //Number - The width of each segment stroke
  segmentStrokeWidth : 2,

  //Number - The percentage of the chart that we cut out of the middle
  percentageInnerCutout : 50, // This is 0 for Pie charts

  //Number - Amount of animation steps
  animationSteps : 100,

  //String - Animation easing effect
  animationEasing : "easeOutBounce",

  //Boolean - Whether we animate the rotation of the Doughnut
  animateRotate : true,

  //Boolean - Whether we animate scaling the Doughnut from the centre
  animateScale : false,

  //String - A legend template
  legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

};
// var myPieChart = new Chart(ctx).Pie(data,options);

}]);
