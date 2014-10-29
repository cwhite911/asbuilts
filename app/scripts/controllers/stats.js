'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('StatsCtrl', ['$scope', '$http','$timeout', 'PT', 'Options', function ($scope, $http, $timeout, PT, Options) {
    var test = new PT('FeatureServer', 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking');
    var engOptions = new Options('json', '*', 'OBJECTID > 0', 'SIMPLIFIEDNAME ASC', 'true' );
    console.log(test);
    console.log(engOptions);
    test.setServices();
    $timeout(function (){
      $scope.engFirm = test.getServices('RPUD.ENGINEERINGFIRM', 'query', engOptions);
    }, 500);


  }]);
