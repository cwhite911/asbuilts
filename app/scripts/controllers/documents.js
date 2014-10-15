angular.module('asbuiltsApp')
  .controller('DocCtrl',['$scope', '$routeParams',
  function($scope, $routeParams) {
    $scope.documentid = $routeParams.documentid;
  }]);
