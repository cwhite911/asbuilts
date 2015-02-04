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
        if(scope.active){
          angular.element('.angular-leaflet-map').addClass('map-move-left');
        }
        else {
          angular.element('.angular-leaflet-map').removeClass('map-move-left');
        }
      });

      scope.$watchCollection('data', function(oldVal, newVal){
        if (scope.data){
          console.log(scope.data);
          angular.extend(scope.update, scope.data.properties);
            $rootScope.pt_fs.request(options).then(function(data){
              scope.currentMaxProjectId = data.features[0].attributes.PROJECTID;
              scope.newMaxProjectId = scope.currentMaxProjectId + 1;
              scope.update.PROJECTID = scope.newMaxProjectId;
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

      scope.master = {};

      scope.update = function(user) {
        scope.master = angular.copy(update);
      };

      scope.reset = function() {
        scope.update = angular.copy(scope.master);
      };

      scope.reset();



    }
  }
}]);
