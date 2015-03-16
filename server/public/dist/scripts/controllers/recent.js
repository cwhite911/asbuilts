'use strict';


angular.module('asbuiltsApp')
  .controller('RecentCtrl', ['$scope','$cookieStore', '$rootScope',
    function ($scope, $cookieStore, $rootScope) {
      //Gets root scope so that the change in project will trigger the watch and update $scope.recent
      var scope = $rootScope;
        $scope.recent = $cookieStore.get('projects');
        $scope.$watchCollection("myrecent", function(newVal, oldVal){
          $scope.recent = $cookieStore.get('projects');
        });

}]);
