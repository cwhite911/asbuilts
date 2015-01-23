'use strict';


angular.module('asbuiltsApp')
.controller('projectCtrl', ['$scope','$cookieStore', '$rootScope', '$routeParams',
function ($scope, $cookieStore, $rootScope, $routeParams) {
  $scope.projectid = $routeParams.projectid;
}]);
