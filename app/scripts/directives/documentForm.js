'use strict';

angular.module('asbuiltsApp')
  .directive('documentForm', ['ags', function (ags) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        project: "="
      },
      templateUrl: 'views/document-form.html',
      link: function (scope, element, attr) {
        //Watch for change of project
        scope.project = '';
        scope.$watch('project',function(){
          if (scope.project){
              console.log(scope.project);
              scope.project.forEach(function(data){
                data.edit = false;
              });
          }
        });
        //Gets correct REST endpoints form ArcGIS server
        var s = ags.testServer.getService().$promise.then(function(res){
           var layers = new ags.AgsLayers(res.layers.concat(res.tables));
           console.log(layers);
        });
        //Setup Boolean option for utilies options..could/should switch to service or provider
        scope.selectionOptions = {
          bool: [{'name': true, 'id': 1}, {'name': false, 'id': 0}],
        };
        //TODO update fields with human readale values

        scope.edit = function (doc) {
          //resets documet
          scope.project.forEach(function(data){
            data.edit = false;
          });
          //Activates editor
          doc.edit = true;
        }
      }
    };
  }
]);
