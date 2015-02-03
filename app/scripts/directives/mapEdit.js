'use strict';

angular.module('asbuiltsApp')
.directive('mapEdit', ['Ags', '$filter', function (Ags, $filter) {
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
      var url;
      scope.$watchCollection('active', function(oldVal, newVal){
        console.log(scope.active);
        if (scope.active){
          angular.element('.angular-leaflet-map').addClass('map-move-left');
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
