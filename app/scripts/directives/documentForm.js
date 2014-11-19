'use strict';

angular.module('asbuiltsApp')
  .directive('documentForm', ['ags', function (ags) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: 'views/document-form.html',
      link: function ($scope, element, attr) {
        var s = ags.testServer.getService().$promise.then(function(res){
           var layers = new ags.AgsLayers(res.layers.concat(res.tables));
           console.log(layers);
        });
        //Setup Boolean option for utilies options
        $scope.selectionOptions = {
          bool: [{'name': true, 'id': 1}, {'name': false, 'id': 0}],
        };
      }
    };
  }
]);
