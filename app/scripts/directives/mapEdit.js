'use strict';

angular.module('asbuiltsApp')
.directive('mapEdit', ['Ags', '$rootScope', '$filter', function (Ags, $rootScope, $filter) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      data: '=',
      active: '='
    },
    templateUrl: 'views/map-edit.html',
    link: function (scope, element) {


      scope.master = {};

      scope.update = function(update) {
        scope.master = angular.copy(update);
      };

      scope.reset = function(form) {
        console.log(form);
        // if (form) {
        //   form.$setPristine();
        //   form.$setUntouched();
        // }
        scope.update = angular.copy(scope.master);
      };

      scope.reset();
      //Gets correct REST endpoints form ArcGIS server
      $rootScope.pt_fs = $rootScope.mapstest.setService({
        folder:'PublicUtility',
        service: 'ProjectTracking',
        server: 'FeatureServer'
      });
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
      var datesList = ['WATERUPDATEDWHEN', 'SEWERUPDATEDWHEN', 'REUSEUPDATEDWHEN', 'ACCEPTANCEDATE', 'WARRANTYENDDATE', 'DEVPLAN_APPROVAL'];

      scope.editorList =['kellerj', 'mazanekm', 'rickerl', 'sorrellj', 'stearnsc', 'whitec'];

      function convertDate (date){
        var original = date.split('/'),
            yyyy = original[2],
            MM = original[0],
            dd = original[1];
        return new Date(yyyy, MM, dd);
      }

      scope.$watchCollection('active', function(oldVal, newVal){
        console.log(scope.active);
        if(scope.active){
          angular.element('.angular-leaflet-map').addClass('map-move-left');
        }
        else {
          angular.element('.angular-leaflet-map').removeClass('map-move-left');
        }
      });

      scope.$watchCollection('data', function(oldVal, newVal){
        if (scope.data){
          scope.reset();
          for (var e in datesList){
            scope.data.properties[datesList[e]] ? scope.data.properties[datesList[e]] = convertDate(scope.data.properties[datesList[e]]) :   console.log(scope.data.properties[datesList[e]]);
          }
          // console.log(scope.data);
          // if (scope.data.properties)
          angular.extend(scope.update, scope.data.properties);
            $rootScope.pt_fs.request(options).then(function(data){
              scope.currentMaxProjectId = data.features[0].attributes.PROJECTID;
              scope.newMaxProjectId = scope.currentMaxProjectId + 1;
              scope.update.PROJECTID = scope.update.PROJECTID || scope.newMaxProjectId;
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

      });





    }
  }
}]);
