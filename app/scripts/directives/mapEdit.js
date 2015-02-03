'use strict';

angular.module('asbuiltsApp')
.directive('mapEdit', ['Ags', '$rootScope', function (Ags, $rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      data: '=',
      active: '='
    },
    templateUrl: 'views/map-edit.html',
    link: function (scope, element) {
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
      scope.$watchCollection('active', function(oldVal, newVal){
        console.log(scope.active);
        if (scope.active){
          angular.element('.angular-leaflet-map').addClass('map-move-left');
          $rootScope.pt_fs.request(options).then(function(data){
            scope.currentMaxProjectId = data.features[0].attributes.PROJECTID;
            scope.newMaxProjectId = scope.currentMaxProjectId + 1;
            console.log(scope.currentMaxProjectId);
            console.log(scope.newMaxProjectId);
          },
          function (err){
            console.log(err);
          }); //.request()
        }
        else {
          angular.element('.angular-leaflet-map').removeClass('map-move-left');
        }
        if (scope.data){


        }
      });

      scope.master = {};

      scope.update = function(user) {
        scope.master = angular.copy(user);
      };

      scope.reset = function() {
        scope.user = angular.copy(scope.master);
      };

      scope.reset();



    }
  }
}]);
