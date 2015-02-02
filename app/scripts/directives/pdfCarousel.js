'use strict';

angular.module('asbuiltsApp')
  .directive('pdfCarousel', function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        docs: "="
      },
      templateUrl: 'views/pdf-carousel.html',
      link: function (scope, element, attr) {
          // scope.docs = docs;
          scope.$watchCollection('docs', function(){
            scope.moveFoward = function (){
              var first = scope.docs.shift();
              scope.docs.push(first);
            }
            scope.moveBackward = function (){
              var last = scope.docs.pop();
              scope.docs.unshift(last);
            }
          });
      
      }
    }
});
