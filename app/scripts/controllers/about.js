'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
