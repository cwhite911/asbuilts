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
          });
          var navBoxLeft = angular.element('.nav-box-left');
          console.log(navBoxLeft);
          navBoxLeft.on('click', function(){
            angular.element(this).toggleClass('nav-arrow1');
          });
      }
    }
});
