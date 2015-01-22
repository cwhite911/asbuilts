'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('StartCtrl', ['$scope','$cookieStore', 'OptionsFactory', 'ags', 'projectSearch', '$rootScope','Ags',
    function ($scope, $cookieStore, OptionsFactory, ags, projectSearch, $rootScope, Ags) {
      //Set root scope as scope
      var scope = $rootScope;

      //Added in test of new module angular-arcgis-server
      ////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////




      ////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////


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
        $scope.projects = projectSearch.autoFillProjects(typed);
        //Adds the project to the recently searched cook
        scope.myrecent = $scope.projects;
      }
      //Function handles the selection
      $scope.searchControl = function (typed){

        function addProjectCookie (typed) {
          var current = $cookieStore.get('projects');
          if (current !== undefined && current.length > 0 && current.indexOf(typed) === -1){
            console.log('Add to Cookie');
            current.unshift(typed);
            current.length > 5 ? current.pop() : current;
            $cookieStore.put('projects', current);
          }
          else if (!current){
            console.log('new cookie');
            $cookieStore.put('projects', [typed])
          }
          // current ? current.indexOf(typed) ? current : $cookieStore.put('projects', current.push(typed)) : $cookieStore.put('projects', [typed]);
        }
        addProjectCookie(typed);
        //Set up GET request options
        var param = 'PROJECTID = ' + typed.split(':')[2];
        options.updateOptions('where', param);
        ags.features.getAll(options).$promise.then(function(data){
          $scope.project = data.features;
          //Activates table view
          $scope.searchStatus = true;
          $scope.project_docs = true;
        });
        // $scope.$watchCollection("project", function(newVal, oldVal){
        //   console.log("The project data changed");
        //   ags.features.getAll(options).$promise.then(function(data){
        //     $scope.project = data.features;
        //   });
        // });
      }
    }]);
