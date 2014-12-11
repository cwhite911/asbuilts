'use strict';


angular.module('asbuiltsApp')
  .controller('RecentCtrl', ['$scope','$cookieStore', '$rootScope',
    function ($scope, $cookieStore, $rootScope) {
      var scope = $rootScope;
        $scope.recent = $cookieStore.get('projects');
        $scope.$watchCollection("myrecent", function(newVal, oldVal){
          $scope.recent = $cookieStore.get('projects');
        });

}]);
