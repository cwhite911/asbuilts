'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('MapCtrl', ['$scope', '$http', '$filter', '$sce', 'leafletData', 'projectSearch', 'projectConstants', 'IconFactory', '$rootScope', 'CookieService',
    function ($scope, $http, $filter, $sce, leafletData, projectSearch, projectConstants, IconFactory, $rootScope, CookieService) {
      var scope = $rootScope;
  $scope.searchStatus = false;
  //create a map in the "map" div, set the view to a given place and zoom
  angular.extend($scope, {
      center: {
        lat: 35.77882840327371,
        lng: -78.63945007324219,
        zoom: 13
      },
      layers: {
            baselayers: {
                xyz: {
                  name: 'Death Star',
                  url: 'https://{s}.tiles.mapbox.com/v3/examples.3hqcl3di/{z}/{x}/{y}.png',
                  type: 'xyz'
                },
                osm: {
                  name: 'Open Street Map',
                  url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                  type: 'xyz'
                },
                esriImagery:{

                  name: "esri Imagery",
                  type: "dynamic",
                  url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                  visible: false,
                  layerOptions: {
                    layers: [0, 1, 2, 3],
                    opacity: 1,
                    attribution: "Copyright:© 2014 Esri, DeLorme, HERE, TomTom"
                  }
                },
                raleigh:{

                  name: "Basic Base Map",
                    type: "dynamic",
                    url: "http://maps.raleighnc.gov/arcgis/rest/services/BaseMap/MapServer",
                    visible: false,
                    layerOptions: {
                        layers: ['*'],
                          opacity: 0.5,
                          attribution: "Copyright:© 2014 City of Raleigh"
                    }
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
                },
              },
                sewer: {
                name: "Sewer Collection Network",
                  type: "dynamic",
                  url: "http://maps.raleighnc.gov/arcgis/rest/services/PublicUtility/SewerExternal/MapServer",
                  visible: false,
                  layerOptions: {
                      layers: [0,1,2,3,4],
                        opacity: 1,
                        attribution: "Copyright:© 2014 City of Raleigh"
                  }
            },
            water: {
              name: "Water Distribution Network",
                type: "dynamic",
                url: "http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/WaterDistribution/MapServer",
                visible: false,
                layerOptions: {
                    layers: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
                      opacity: 1,
                      attribution: "Copyright:© 2014 City of Raleigh"
                }
            },
            reuse: {
              name: "Reuse Distribution Network",
                type: "dynamic",
                url: "http://gis.raleighnc.gov/arcgis/rest/services/PublicUtility/ReclaimedDistribution/MapServer",
                visible: false,
                layerOptions: {
                    layers: [0,1,2,3,4,5,6,7,8,9,10,11],
                      opacity: 1,
                      attribution: "Copyright:© 2014 City of Raleigh"
                }
            }

          }


      },
      // controls: {
      // },
      legend: {
            position: 'bottomleft',
            colors: [ '#FFF', '#28c9ff', '#0000ff', '#ecf386', '#28c9ff', '#0000ff', '#FFF'],
            labels: [
                '<img src="../images/ab.png" height="20px" width="20px" /> AS-Built',
                '<img src="../images/cp.png" height="20px" width="20px" /> Construction Plan',
                '<img src="../images/al.png" height="20px" width="20px" /> Acceptance Letter',
                '<img src="../images/wl.png" height="20px" width="20px" /> Warranty Letter',
                '<img src="../images/soc.png" height="20px" width="20px" /> Statement of Cost',
                '<img src="../images/pr.png" height="20px" width="20px" /> Permits',
                '<img src="../images/pl.png" height="20px" width="20px" /> Plats' ]
        },



  });


var drawnItems = new L.FeatureGroup();
var options = {
  edit: {
    featureGroup: drawnItems
  },
  draw: {
        polygon: {
            shapeOptions: {
                color: 'blue'
            }
        }
  }
 };
 var drawControl = new L.Control.Draw(options);
 angular.extend($scope, {
   controls: {
     custom: [drawControl]
   }
 }
 );
leafletData.getMap().then(function(map) {

              // $scope.controls.draw.edit.featureGroup = new L.FeatureGroup();
              // drawnItems = $scope.controls.draw.edit.featureGroup;

              // console.log($scope.controls.draw);
              map.on('draw:created', function (e) {
                var layer = e.layer;
                drawnItems.addLayer(layer);
                  drawnItems.addTo(map);
                  console.log(drawnItems);
                console.log(JSON.stringify(layer.toGeoJSON()));
              });
              map.on('draw:edited', function (e) {
                  var layers = e.layers;

                  layers.eachLayer(function (layer) {
                    console.log(layer);
        //do whatever you want, most likely save back to db
                  });
              });
           });


angular.extend($scope, {
  markers:{},
  paths: {}
});

function action (feature, layer){
  $scope.viewData = feature;
  layer.bindPopup('<h4>PROJECT NAME:'+ feature.properties.PROJECTNAME +'</h4>');

  layer.on('mouseover', function (e) {
    $scope.viewData = feature.properties;
 });
 layer.on('mouseout', function(){
  //  layer.setStyle(styles.expiredStyle);
   //removeMarkers();
 });
}


function removeEmptyFields (data) {
    for (var a in data){
      data[a] ? data[a] : delete data[a];
    }
}


$scope.autoFillProjects = function (typed) {
  //Turns on the map resulsts table
  $scope.searchStatus = false;
  $scope.project_docs = false;
  angular.element('.angular-leaflet-map').removeClass('map-move');
  //Uses the Project Search Servies
  $scope.projects = [];
  var newProject = projectSearch.autoFill(typed);
  newProject.then(function(data){
    if (data.features){
      for (var i = 0, x = data.features.length; i < x; i++){
        if ($scope.projects.length < 5){
          $scope.projects.push(data.features[i].attributes.PROJECTNAME + ':' + data.features[i].attributes.DEVPLANID + ':' + data.features[i].attributes.PROJECTID);
        }
      }
    }

  }, function (error){
    console.log(error);
  });
  //Adds the project to the recently searched cook
  scope.myrecent = $scope.projects;
}

$scope.searchControl = function (typed){
  console.log(typed);






  //Add projects to recent projects cookie
  CookieService.addProjectCookie(typed);
  var selection = typed.split(':');

  //Set feautre service
  scope.pt_fs = scope.mapstest.setService({
    folder:'PublicUtility',
    service: 'ProjectTracking',
    server: 'FeatureServer'
  });


  var projectOptions = {
    layer: 'Project Tracking',
    geojson: true,
    actions: 'query',
    params: {
      f: 'json',
      outFields: '*',
      where: "PROJECTID =  '" + selection[2] + "'",
      outSR: 4326,
      returnGeometry: true
    }
  };

  var documentOptions = {
    layer: 'RPUD.PTK_DOCUMENTS',
    actions: 'query',
    params: {
      f: 'json',
      outFields: '*',
      where: "PROJECTID =  '" + selection[2] + "'",
    }
  }

  scope.pt_fs.request(projectOptions)
    .then(function(data){
      console.log(data);
      //Prepare Results Table
      $scope.project_info = data.features[0].properties;
      $scope.project_info.CREATEDON = $filter('date')($scope.project_info.CREATEDON, 'MM/dd/yyyy');
      $scope.project_info.DEVPLAN_APPROVAL = $filter('date')($scope.project_info.DEVPLAN_APPROVAL, 'MM/dd/yyyy');
      $scope.project_info.EDITEDON = $filter('date')($scope.project_info.EDITEDON, 'MM/dd/yyyy');
      removeEmptyFields($scope.project_info);

      //Add geojosn to map
      angular.extend($scope, {
        geojson: {
          data: data,
          style: {
              fillColor: 'rgba(253, 165, 13, 0.0)',
              weight: 3,
              opacity: 1,
              color: 'rgba(253, 165, 13, 0.71)',
              dashArray: '4'
          },
          onEachFeature: action,
          resetStyleOnMouseout: true
        }
      });
      //Turns on the map resulsts table
      $scope.searchStatus = true;

      //Empties exisiting feature group
      drawnItems = new L.FeatureGroup();
      //Get bounds from geojson
      drawnItems.addLayer(L.geoJson(data));

      leafletData.getMap().then(function(map) {
        map.fitBounds(L.featureGroup([L.geoJson(data)]).getBounds());
        map.fitBounds(drawnItems.getBounds());
        drawnItems.addTo(map);
      });

      //Get Document Information for carousel
      scope.pt_fs.request(documentOptions)
        .then(function(data){
          if (data.features.length !== 0){
                angular.element('.angular-leaflet-map').addClass('map-move');
                var _docType;
                $scope.project_docs = data.features.map(function (each){

                  each.attributes.DOCTYPEID ? _docType = each.attributes.DOCTYPEID.toLowerCase() : _docType = "";
                  var url = {
                      url : $sce.trustAsResourceUrl(projectConstants.documentBaseUrl + each.attributes.PROJECTID + "/" + each.attributes.PROJECTID + "-" + each.attributes.DOCTYPEID + "-" + each.attributes.DOCID + ".pdf"),
                      name: each.attributes.PROJECTID + "-" + each.attributes.DOCTYPEID + "-" + each.attributes.DOCID,
                      resid: each.attributes.PROJECTID + "-" + each.attributes.DOCTYPEID + "-" + each.attributes.DOCID + "res",
                      icon: "../images/" + _docType + ".png"
                  };
                  return url;
                });
                for (var a in $scope.project_docs){
                  var ele_id = "#" + $scope.project_docs[a].resid;
                  $(ele_id).resizable();
                }
              }
        });

    });



}


$scope.list1 = {title: 'AngularJS - Drag Me'};

//Setting Up Printing Service
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var printTask = 'http://mapstest.raleighnc.gov/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task/execute';
$scope.dpi = 90;
$scope.print_format = 'PDF';
$scope.exportSizes = [
  {
    size: [500, 500]
  },
  {
    size: [700, 500]
  },
  {
    size: [700, 1000]
  }
];
$scope.printFormatList = ["PDF", "PNG8", "PNG32", "JPG", "GIF", "EPS", "SVG",  "SVGZ"];
var web_map_specs = {
  "mapOptions":{ },
  "operationalLayers": [ ],
  "baseMap": [{
    title: 'Basemap',
    baseMapLayers:[
      {
          url: 'http://maps.raleighnc.gov/arcgis/rest/services/BaseMap/MapServer',
          opacity: 1
      }
    ]
  }],
  "exportOptions": {
      dpi: $scope.dpi,
      outputSize: [700, 500] || $scope.output
  }
  // "layoutOptions": { }
};

leafletData.getMap().then(function(map) {
    // web_map_specs.operationalLayers = [];
    map.on('move', function(){
      $scope.mapbounds = map.getBounds();
      web_map_specs.mapOptions.extent = {
        "xmin": $scope.mapbounds._southWest.lat,
        "ymin": $scope.mapbounds._southWest.lng,
        "xmax": $scope.mapbounds._northEast.lat,
        "ymax": $scope.mapbounds._northEast.lng
      };
      web_map_specs.operationalLayers = [];
        map.eachLayer(function (layer){
          //console.log(layer);
          //console.log(map.hasLayer(layer));

          map.hasLayer(layer) ? web_map_specs.operationalLayers.push({url: layer.url}) : console.log('No layers added to print');
        });
    });
    //Adds print control to map
    var printer = L.control({position: 'bottomright'});
    printer.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<button class="btn btn-primary btn-sm mapPrint" data-toggle="modal" data-target="#myModal">Print</button>';
        return div;
      };
printer.addTo(map);


});

$scope.print_params = {
  Web_Map_as_JSON: web_map_specs,
  format: $scope.print_format,
  Layout_Template: 'MAP_ONLY',
  f: 'json'
};

  $scope.$watch('print_params', function(newVal, oldVal){
    // console.log($scope.print_params);
}, true);

$scope.printMap = function () {
  $http.get(printTask, {
    params: $scope.print_params,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
    .success(function(res){
      console.log(res);
    });
}

  }]);
