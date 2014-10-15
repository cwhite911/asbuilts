'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('MapCtrl', ['$scope', '$http', '$filter', '$sce', 'leafletData', function ($scope, $http, $filter, $sce, leafletData) {
  var document_base_url = 'http://gis.raleighnc.gov/asbuilts/PROJECT_TRACKING/';
  //create a map in the "map" div, set the view to a given place and zoom
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
                }
            },
            overlays: {
              projects:{
              name: "Project Tracking",
                type: "dynamic",
                url: "http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/MapServer",
                visible: false,
                layerOptions: {
                    layers: [2],
                      opacity: 0.5,
                      attribution: "Copyright:© 2014 City of Raleigh"
                }
            }
          },

      },
      legend: {
            position: 'bottomleft',
            colors: [ '#FFF', '#28c9ff', '#0000ff', '#ecf386', '#28c9ff', '#0000ff', '#FFF'],
            labels: [
                '<img src="../images/ab.png" height="20px" width="20px" /> AS-Built',
                '<img src="../images/cp.png" height="20px" width="20px" /> Construction Plan',
                '<img src="../images/al.png" height="20px" width="20px" /> Acceptance Letter',
                '<img src="../images/wl.png" height="20px" width="20px" /> Warranty Letter',
                '<img src="../images/soc.png" height="20px" width="20px" /> Statement of Cost',
                '<img src="../images/p.png" height="20px" width="20px" /> Permits',
                '<img src="../images/plat.png" height="20px" width="20px" /> Plats' ]
        },



  });
//   $scope.$watch('geojson', function(newVal, oldVal){
//     console.log($scope.geojson);
// }, true);
// console.log($scope.layers.overlays.projects);

  $scope.projects = [];



var styles = {
        paidStyle: {
            fillColor: '#aa3939',
            radius: 5,
            color: '#550000',
            weight: 1,
            fillOpacity: 0.7
        },
        expiredStyle :{
            fillColor: 'rgba(247,247,247, 0.1)',
            weight: 5,
            opacity: 1,
            color: 'rgb(252,141,89)',
            dashArray: '3',
            fillOpacity: 0.7
        },
        hoverStyle: {
            fillColor: '#0ab25d',
            radius: 5,
            color: '#0ab25d',
            weight: 1,
            fillOpacity: 0.7
        }
    };



function getCentroid (arr) {
    return arr.reduce(function (x,y) {
        return [x[0] + y[0]/arr.length, x[1] + y[1]/arr.length]
    }, [0,0])
}


function removeMarkers(){
  $scope.markers = {};
}

var document_types = [
        {
          name: 'ASBUILTS',
          message: 'As-Built',
          icon : {
            iconUrl: '../images/ab.png',
            iconSize:     [38, 38], // size of the icon
            iconAnchor:   [0,0], // point of the icon which will correspond to marker's location
            popupAnchor:  [5, 5] // point from which the popup should open relative to the iconAnchor
          }
        },
        {
          name: 'CONSTUCTION_PLAN',
          message: 'Construction Plan',
            icon: {
              iconUrl: '../images/cp.png',
              iconSize:     [38, 38], // size of the icon
              iconAnchor:   [0,0], // point of the icon which will correspond to marker's location
              popupAnchor:  [5, 0] // point from which the popup should open relative to the iconAnchor
            }
          },
          {
            name: 'ACCEPTANCE_LETTER',
            message: 'Acceptance Letter',
            icon: {
              iconUrl: '../images/al.png',
              iconSize:     [38, 38], // size of the icon
              iconAnchor:   [0,0], // point of the icon which will correspond to marker's location
              popupAnchor:  [-5, 5] // point from which the popup should open relative to the iconAnchor
            }
          },
          {
            name: 'WARRANTY_LETTER',
            message: 'Warranty Letter',
            icon: {
              iconUrl: '../images/wl.png',
              iconSize:     [38, 38], // size of the icon
              iconAnchor:   [0,0], // point of the icon which will correspond to marker's location
              popupAnchor:  [5, -5] // point from which the popup should open relative to the iconAnchor
            }
          },
          {
            name: 'STATEMENT_OF_COST',
            message: 'Statement of Cost',
            icon: {
              iconUrl: '../images/soc.png',
              iconSize:     [38, 38], // size of the icon
              iconAnchor:   [0,0], // point of the icon which will correspond to marker's location
              popupAnchor:  [-5, 0] // point from which the popup should open relative to the iconAnchor
            }
          },
          {
            name: 'PERMITS',
            message: 'Permit',
            icon: {
              iconUrl: '../images/p.png',
              iconSize:     [38, 38], // size of the icon
              iconAnchor:   [0,0], // point of the icon which will correspond to marker's location
              popupAnchor:  [-5, -5] // point from which the popup should open relative to the iconAnchor
            }
          },
          {
            name: 'Plat',
            message: 'Plat',
            icon: {
              iconUrl: '../images/plat.png',
              iconSize:     [38, 38], // size of the icon
              iconAnchor:   [0,0], // point of the icon which will correspond to marker's location
              popupAnchor:  [-5, -5] // point from which the popup should open relative to the iconAnchor
            }
          }
        ];

var document_fx = function (latlng){
  latlng = {lat: latlng[0], lng: latlng[1]};
  var docs = [
          {
            lat: latlng.lat + 0.001,
            lng: latlng.lng + 0.001
          },
          {
            lat: latlng.lat,
            lng: latlng.lng + 0.002
          },
          {
            lat: latlng.lat + 0.001,
            lng: latlng.lng - 0.001
          },
          {
            lat: latlng.lat - 0.001,
            lng: latlng.lng + 0.001
          },
          {
            lat: latlng.lat,
            lng: latlng.lng - 0.002
          },
          {
            lat: latlng.lat - 0.001,
            lng: latlng.lng - 0.001
          },
          {
            lat: latlng.lat + 0.001,
            lng: latlng.lng - 0.0015
          }
    ];

angular.extend($scope, {
  markers:{},
  paths: {}
});



// function myStopFunction(stop) {
//     clearInterval(stop);
// }

for (var i in document_types){
  var tempName = document_types[i].name;

  $scope.markers[tempName] = docs[i];
  $scope.markers[tempName].draggable = true;
  $scope.markers[tempName].icon = document_types[i].icon;
  $scope.markers[tempName].message = document_types[i].message;
}



};


function action (feature, layer){
  $scope.viewData = feature;
  layer.bindPopup('<h4>PROJECT NAME:'+ feature.properties.PROJECTNAME +'</h4>');

  layer.on('mouseover', function (e) {
    $scope.viewData = feature.properties;
    layer.setStyle(styles.paidStyle);
    document_fx($scope.centroid);
 });
 layer.on('mouseout', function(){
   layer.setStyle(styles.expiredStyle);
   //removeMarkers();
 });
}


var options = {
    f: 'json',
    outFields: '*',
    where: 'OBJECTID > 0',
    orderByFields:  'PROJECTNAME ASC',
    returnGeometry: false
};

var conn = 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/2/query';
$http.get(conn, {params: options, cache: true})
  .success(function(res){
    for (var i in res.features){
      var poly = [];
      $scope.projects.push(res.features[i].attributes.PROJECTNAME + ':' + res.features[i].attributes.DEVPLANID + ':' + res.features[i].attributes.PROJECTID);
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

  var conn = 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/2/query';
  var ptk_conn = 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/5/query';
  $http.get(conn, {params: options, cache: true})
    .success(function(res){
      leafletData.getMap().then(function(map) {
          $scope.project_info = res.features[0].attributes;
          $scope.project_info.CREATEDON = $filter('date')($scope.project_info.CREATEDON, 'MM/dd/yyyy');
          $scope.project_info.DEVPLAN_APPROVAL = $filter('date')($scope.project_info.DEVPLAN_APPROVAL, 'MM/dd/yyyy');
          $scope.project_info.EDITEDON = $filter('date')($scope.project_info.EDITEDON, 'MM/dd/yyyy');
                var latlngs = [];
                $scope.poly = [];
                $scope.bound = [];
                for (var i in res.features[0].geometry.rings[0]) {
                    var coord = res.features[0].geometry.rings[0][i];
                    var geo = res.features[0].geometry.rings;
                    for (var j in coord) {
                      latlngs.push([coord[1], coord[0]]);
                      $scope.poly.push(geo);
                      $scope.bound.push({lat: coord[1], lng: coord[0]});
                    }
                }
                $scope.mygeojson ={
                  "type": "FeatureCollection",
                  "features":[{
                    "type": "Feature",
                    "id": res.features[0].attributes.PROJECTID,
                    "properties": res.features[0].attributes,
                    "geometry": {
                      "type": "MultiPolygon",
                      "coordinates": $scope.poly
                    }
                  }]
                };
                console.log($scope.mygeojson);
                angular.extend($scope, {
                    geojson: {
                        data: $scope.mygeojson,
                        style: {
                            fillColor: 'rgba(252,141,0, 0.1)',
                            weight: 2,
                            opacity: 1,
                            color: 'rgb(252,141,89)',
                            dashArray: '4',
                            fillOpacity: 0.7
                        },
                        onEachFeature: action,
                       resetStyleOnMouseout: true
                    }
                });

                //Do not erase save for paths
                  // $scope.paths.p1.latlngs = $scope.bound;
                $scope.centroid = getCentroid(latlngs);

                map.fitBounds(latlngs);
            });
    });

    $http.get(ptk_conn, {params: options, cache: true})
      .success(function(res){
        console.log(res.features);

        $scope.project_docs = res.features.map(function (each){
          var url = {
              url : $sce.trustAsResourceUrl(document_base_url + each.attributes.PROJECTID + "/" + each.attributes.PROJECTID + "-" + each.attributes.DOCTYPEID + "-" + each.attributes.DOCID + ".pdf"),
              name: each.attributes.PROJECTID + "-" + each.attributes.DOCTYPEID + "-" + each.attributes.DOCID,
              resid: each.attributes.PROJECTID + "-" + each.attributes.DOCTYPEID + "-" + each.attributes.DOCID + "res",
              icon: "../images/" + each.attributes.DOCTYPEID.toLowerCase() + ".png"
          };
          return url;
        });
        for (var a in $scope.project_docs){
          var ele_id = "#" + $scope.project_docs[a].resid;
          $(ele_id).resizable();
        }
      });

}


$scope.list1 = {title: 'AngularJS - Drag Me'};






  }]);
