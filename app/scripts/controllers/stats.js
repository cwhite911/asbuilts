'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('StatsCtrl', function ($scope) {
    $scope.xAxisTickFormatFunction = function(){
    return function(d){
        return d3.time.format('%b')(new Date(d));
    }
}

var colorCategory = d3.scale.category20b()
$scope.colorFunction = function() {
    return function(d, i) {
        return colorCategory(i);
    };
}

$scope.xFunction = function(){
	return function(d){
		return d[0];
	};
}

$scope.yFunction = function(){
	return function(d){
		return d[1];
	};
}

    $scope.exampleData = [
                {
                    "key": "Series 1",
                    "values": [
                        [ 1025409600000 , 0] ,
                        [ 1028088000000 , -6.3382185140371] ,
                        [ 1030766400000 , -5.9507873460847] ,
                        [ 1033358400000 , -11.569146943813] ,
                        [ 1036040400000 , -5.4767332317425] ,
                        [ 1038632400000 , 0.50794682203014] ,
                        [ 1041310800000 , -5.5310285460542] ,
                        [ 1043989200000 , -5.7838296963382] ,
                        [ 1046408400000 , -7.3249341615649] ,
                        [ 1049086800000 , -6.7078630712489] ,
                        [ 1051675200000 , 0.44227126150934] ,
                        [ 1054353600000 , 7.2481659343222],
                        [ 1056945600000 , 9.2512381306992]
                      ]
                },
                {
                  "key": "Series 2",
                  "values": [
                        [ 1025409600000 , 0] ,
                        [ 1028088000000 , 0] ,
                        [ 1030766400000 , 0] ,
                        [ 1033358400000 , 0] ,
                        [ 1036040400000 , 0] ,
                        [ 1038632400000 , 0] ,
                        [ 1041310800000 , 0] ,
                        [ 1043989200000 , 0] ,
                        [ 1046408400000 , 0] ,
                        [ 1049086800000 , 0] ,
                        [ 1051675200000 , 0] ,
                        [ 1054353600000 , 0] ,
                        [ 1056945600000 , 0] ,
                        [ 1059624000000 , 0] ,
                        [ 1062302400000 , 0] ,
                        [ 1064894400000 , 0] ,
                        [ 1067576400000 , 0] ,
                        [ 1070168400000 , 0] ,
                        [ 1072846800000 , 0] ,
                        [ 1075525200000 , -0.049184266875945]
                      ]
                },
            ];
  });
