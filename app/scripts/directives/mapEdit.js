'use strict';

angular.module('asbuiltsApp')
.directive('mapEdit', ['Ags', '$filter', function (Ags, $filter) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      project: '=',
      active: '='
    },
    templateUrl: 'views/map-edit.html',
    link: function (scope, element) {
      //Gets correct REST endpoints form ArcGIS server
      var url;
      scope.$watchCollection('active', function(oldVal, newVal){
        if (scope.project){
          

        }
      });


    }
  }
}]);
