'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('addDocCtrl', ['$scope','CookieService', 'OptionsFactory', 'ags', 'projectSearch', '$rootScope','Ags',
    function ($scope, CookieService, OptionsFactory, ags, projectSearch, $rootScope, Ags) {
      //Set root scope as scope
      var scope = $rootScope;

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
        $scope.projects = [];
        var newProject = projectSearch.autoFill(typed);
        newProject.then(function(data){
              console.log(data);
              for (var i = 0, x = data.features.length; i < x; i++){
                  if ($scope.projects.length < 5){
                    $scope.projects.push(data.features[i].attributes.PROJECTNAME + ':' + data.features[i].attributes.DEVPLANID + ':' + data.features[i].attributes.PROJECTID);
                  }
              }
              // $scope.projects = projectSearch.getSet($scope.projects);


          }, function (error){
            console.log(error);
        });
        //Adds the project to the recently searched cook
        scope.myrecent = $scope.projects;
      }
      //Function handles the selection
      $scope.searchControl = function (typed){
        //Add projects to recent projects cookie
        CookieService.addProjectCookie(typed);
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
