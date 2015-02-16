'use strict';

angular.module('asbuiltsApp')
.directive('mapEdit', ['Ags', '$rootScope', '$filter', 'leafletData', '$activityIndicator', '$timeout', function (Ags, $rootScope, $filter, leafletData, $activityIndicator, $timeout) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      data: '=',
      active: '='
    },
    templateUrl: 'views/map-edit.html',
    link: function (scope, element) {

      $rootScope.pt_fs = $rootScope.mapstest.setService({
        folder:'PublicUtility',
        service: 'ProjectTracking',
        server: 'FeatureServer'
      });

      scope.master = {};
      var postOptions = {
        params: {

        }
      };

      // $activityIndicator.startAnimating();
      // $timeout(function () {
      //   console.log($activityIndicator);
      //   $activityIndicator.stopAnimating();
      // }, 3000);

      var options = {
        actions: 'query',
        layer: 'Project Tracking',
        params: {
          f: 'json',
          outFields: 'PROJECTID',
          orderByFields: 'PROJECTID DESC',
          returnGeometry: false,
          where: 'PROJECTID IS NOT NULL',
          // groupByFieldsForStatistics: 'PROJECTID',
          // outStatistics: {
          //     "statisticType": "max",
          //     "onStatisticField": "PROJECTID",
          //     "outStatisticFieldName": "maxid"
          // }

        }

      };

      scope.saveToMaster = function(update) {
        for (var i in update){
          update[i] = typeof update[i] === 'string' ? update[i].toUpperCase() : update[i];
        }
        // $rootScope.pt_fs.request();
        console.log(postOptions);
        scope.master = angular.copy(update);
        scope.active = false;
      };

      scope.reset = function(form) {
        if (form) {
          form.$setPristine();
          form.$setUntouched();
        }
        scope.update = angular.copy(scope.master);

      };
      scope.cancel = function(form) {
        if (form) {
          form.$setPristine();
          form.$setUntouched();
        }
        scope.update = angular.copy(scope.master);
        scope.active = false;
      };

      scope.generateProjectId = function () {
        $rootScope.pt_fs.request(options).then(function(data){
          scope.currentMaxProjectId = data.features[0].attributes.PROJECTID;
          scope.newMaxProjectId = scope.currentMaxProjectId + 1;
          scope.update.PROJECTID = parseInt(scope.update.PROJECTID, 10) || parseInt(scope.newMaxProjectId, 10);
          postOptions.actions = scope.update.OBJECTID ? 'updateFeatures' : 'addFeatures';
          console.log(data);
          scope.newProject = {
            "geometry" : scope.data.geometry,
            "attributes" : scope.update
          };
          console.log(scope.newProject);

        },
        function (err){
          console.log(err);


        });
      }
      scope.reset(scope.form);
      //Gets correct REST endpoints form ArcGIS server


      var datesList = ['WATERUPDATEDWHEN', 'SEWERUPDATEDWHEN', 'REUSEUPDATEDWHEN', 'ACCEPTANCEDATE', 'WARRANTYENDDATE', 'DEVPLAN_APPROVAL'];

      scope.editorList =['kellerj', 'mazanekm', 'rickerl', 'sorrellj', 'stearnsc', 'whitec'];

      leafletData.getMap('mini-map').then(function(map) {
        L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.3hqcl3di/{z}/{x}/{y}.png').addTo(map);
      });



      function convertDate (date){
        console.log(date);
        var original = date.split('/'),
            yyyy = original[2],
            MM = original[0],
            dd = original[1];
        return new Date(yyyy, MM, dd);
      }

      scope.$watchCollection('active', function(){
        if(scope.active){
          angular.element('.angular-leaflet-map').addClass('map-move-left');
          // $activityIndicator.startAnimating();
        }
        else {
          angular.element('.angular-leaflet-map').removeClass('map-move-left');
        }
      });

      //Update mini map with edited data
      scope.$watchCollection('data', function(){
        // $activityIndicator.startAnimating();
        // scope.spinner = $rootScope.AILoading;
        // console.log($rootScope);
        scope.master = {};
        if (scope.data){
          scope.reset(scope.form);
          //Add geojosn to map
          angular.extend(scope, {
            geojson: {
              data: scope.data,
              style: {
                  fillColor: 'rgba(253, 165, 13)',
                  weight: 3,
                  opacity: 1,
                  color: 'rgba(253, 165, 13, 0.71)',
                  dashArray: '4'
              },
              onEachFeature: function (feature, layer){
                leafletData.getMap('mini-map').then(function(map) {
                  map.fitBounds(layer.getBounds());
                });
              }
            }
          });
          // scope.reset(scope.form);
          for (var e in datesList){
            if (scope.data.properties[datesList[e]]){
              scope.data.properties[datesList[e]] = convertDate(scope.data.properties[datesList[e]]);
            }
          }
          // console.log(scope.data);
          // if (scope.data.properties)

          angular.extend(scope.update, scope.data.properties);
            $rootScope.pt_fs.request(options).then(function(data){
              scope.currentMaxProjectId = data.features[0].attributes.PROJECTID;
              scope.newMaxProjectId = scope.currentMaxProjectId + 1;
              scope.update.PROJECTID = parseInt(scope.update.PROJECTID, 10) || parseInt(scope.newMaxProjectId, 10);
              postOptions.actions = scope.update.OBJECTID ? 'updateFeatures' : 'addFeatures';
              console.log(data);
              scope.newProject = {
                "geometry" : Terraformer.ArcGIS.convert(scope.data.geometry),
                "attributes" : scope.update
              };
              console.log(scope.newProject);

            },
            function (err){
              console.log(err);
            });
        }

      });





    }
  };
}]);
