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
      $scope.project = {};
      var options = new OptionsFactory('json', '*', '', 'DOCID ASC', false );
      var s = ags.testServer.getService().$promise.then(function(res){
         var layers = new ags.AgsLayers(res.tables).getLayerId('RPUD.PTK_DOCUMENTS');
         options.addOptions('id', layers);
      });
      $scope.autoFillProjects = function (typed) {
        //Turns on the map resulsts table
        $scope.searchStatus = false;
        $scope.project_docs = false;
        //Uses the Project Search Servies
        $scope.projects = ProjectSearch.autoFillProjects(typed);
      }
      //Function handles the selection
      $scope.searchControl = function (typed){
        //Set up GET request options
        var param = 'PROJECTID = ' + typed.split(':')[2];
        options.updateOptions('where', param);
        ags.features.getAll(options).$promise.then(function(data){
          $scope.project = data.features;
        });
      }
    }]);
