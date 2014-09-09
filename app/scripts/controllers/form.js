'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('FormCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.fields = null;
    $scope.projects = null;
    $scope.selections = [{'name': true, 'id': 1}, {'name': false, 'id': 0}];
    var count = 0;
    $scope.servers = [{
    	'test': { 
    		'FeatureServer': 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer',
    		'layers': {
    			'id': null,
    			'name': 'Project Tracking'
    		},
    		'tables': {
    			'id': null,
    			'name': 'RPUD.ASBUILTS'
    		}
    	}
    }];

    var config = {
    	params: {
    		f: 'json',
    		features: []
    	}
    };
    

    //Set ID's for tables and layers from feature service
    function setId (data, type, sname){
    	for (var each in data[type]){
    		if (data[type][each].name === sname){
    			$scope.servers[0].test[type].id = data[type][each].id;
    		}
    	}	
    };

    $http.get($scope.servers[0].test.FeatureServer, {params: { f: 'json'}})
        .success(function(data){
          console.log(data);
          setId(data, 'layers', $scope.servers[0].test.layers.name);
          setId(data, 'tables', $scope.servers[0].test.tables.name);          
     });

    //Get Field Names for table
    setTimeout(function(){
    	$http.get($scope.servers[0].test.FeatureServer + '/' + $scope.servers[0].test.tables.id, {params: {f: 'json'}, cache: true})
    		.success(function(res){
          	console.log(res);
          	$scope.fields = res.fields;
     	})

    	var getProjects = function (count){
    		var options = {
            	f: 'json',
            	outFields: '*',
            	where: 'OBJECTID >' + count,
            	orderByFields: 'PROJECTNAME ASC',
            	returnGeometry: false
        	};

    		$http.get($scope.servers[0].test.FeatureServer + '/' + $scope.servers[0].test.layers.id + '/query', {params: options})
    			.success(function(res){
          			console.log(res);
          			$scope.projects = res.features;
     		})
    	}

    	getProjects(count);
    	

    }, 500);
    
    $scope.change = function(devId){
    	for (var i in $scope.projects){
    		if ($scope.projects[i].attributes.DEVPLANID === devId){
    			// $scope.sheets = $scope.projects[i].attributes;
    		}
    	}

    	var options = {
            	f: 'json',
            	outFields: '*',
            	where: "DEVPLANID =  '" + devId + "'",
            	orderByFields: 'PROJECTNAME ASC',
            	returnGeometry: false
        	};
    	$http.get($scope.servers[0].test.FeatureServer + '/' + $scope.servers[0].test.tables.id + '/query', {params: options})
    			.success(function(res){
          			console.log(res);
          			$scope.sheets = res.features;
          			$scope.sheetFields = res.fields;
          			if ($scope.sheets.length === 0){
          				$scope.sheets = false;
          			}
     		})

    };
        

  }]);
