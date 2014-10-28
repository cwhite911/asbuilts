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
    var test = PT;
    test.setServices('FeatureServer', 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/');
    $timeout(function (){
      console.log(test.getServices());
      console.log(test.getUrl('query', 'RPUD.ENGINEERINGFIRM'));
    }, 500);
    var testOptions = Options;
    testOptions.setOptions('json', '*', 'OBJECTID > 0', 'PROJECTID ASC', 'true' );
    testOptions.updateOptions('f', 'html');
    console.log(testOptions.getOptions());
    

  }]);
