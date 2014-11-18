'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('StartCtrl', ['$scope', '$http','$timeout','OptionsFactory', 'ags', 'ProjectSearch',
    function ($scope, $http, $timeout, OptionsFactory, ags, ProjectSearch) {

      $scope.autoFillProjects = function (typed) {
        //Turns on the map resulsts table
        $scope.searchStatus = false;
        $scope.project_docs = false;
        //Uses the Project Search Servies
        $scope.projects = ProjectSearch.autoFillProjects(typed);
      }

    }]);
