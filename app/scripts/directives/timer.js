'use strict';

angular.module('asbuiltsApp')
.directive('timer', ['$interval' , function ($interval) {
  return {
    restrict: 'E',
    transclude: true,
    // scope: {
    //   project: '='
    // },
    templateUrl: 'views/timer.html',
    link: function (scope, element) {

      scope.time = {
        hour: 0,
        min: 0,
        sec: 0,
        current: '00:00:00',
        display: function (){
          if (scope.time.hour < 10){
            scope.time.hour = 0 + scope.time.hour;
          }
          else if (scope.time.min < 10){
            scope.time.min = 0 + scope.time.min;
          }
          else if (scope.time.sec < 10){
            scope.time.sec = 0 + scope.time.sec;
          }
          return scope.time.hour + ':' + scope.time.min + ':' + scope.time.sec;
        }
      };

      //Start timer
      scope.start = function (){
        $interval(function(){
          if (scope.time.sec < 60){
            scope.time.sec++;
          }
          else if (scope.time.sec === 60){
            scope.time.min++;
            scope.time.sec = 0;
          }
          else if (scope.time.min === 60){
            scope.time.hour++;
            scope.time.min = 0;
          }
          scope.time.current = scope.time.display();
        }, 1000);
      };

      //Stop timer
      scope.stop = function (){

      };

      //Reset timer
      scope.reset = function (){

      };


    }
  }
}]);
