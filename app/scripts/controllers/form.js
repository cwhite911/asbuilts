'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('FormCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
    $scope.fields = null;
    $scope.projects = null;
    $scope.stat = true;
    $scope.selections = [{'name': true, 'id': 1}, {'name': false, 'id': 0}];
    var count = 0;
    $scope.servers = [{
    	'test': { 
    		'FeatureServer': 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer',
    		'layers': {
    			'id': null,
    			'name': 'Project Tracking'
    		},
    		'tables': [
          {
    			 'id': null,
    			 'name': 'RPUD.ASBUILTS'
    		  },
          {
            'id': null,
            'name': 'RPUD.EngineeringFirms'
          }
        ]
    	}
    },
    {
      'WAKE': {
          'Addresses' : 'http://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query'
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
            if (type === 'layers'){
              $scope.servers[0].test[type].id = data[type][each].id;
            }
    			   else {
                for (var t in $scope.servers[0].test.tables){
                  if ($scope.servers[0].test[type][t].name === sname){
                    $scope.servers[0].test[type][t].id = data[type][each].id;
                  }
                }
             }
    		  }
    	 }
    };

    $http.get($scope.servers[0].test.FeatureServer, {params: { f: 'json'}})
        .success(function(data){
          setId(data, 'layers', $scope.servers[0].test.layers.name);
          for (var t in $scope.servers[0].test.tables){
            setId(data, 'tables', $scope.servers[0].test.tables[t].name)
          }          
     });

    //Get Field Names for table
    setTimeout(function(){
    	$http.get($scope.servers[0].test.FeatureServer + '/' + $scope.servers[0].test.tables[0].id, {params: {f: 'json'}, cache: true})
    		.success(function(res){
          	console.log(res);
          	$scope.fields = res.fields;
     	});

    	var getProjects = function (count, order, type){
    		var options = {
            	f: 'json',
            	outFields: '*',
            	where: 'OBJECTID >' + count,
            	orderByFields: order + ' ASC',
            	returnGeometry: false
        	};
        if (type === 'layers'){
          var conn = $scope.servers[0].test.FeatureServer + '/' + $scope.servers[0].test[type].id + '/query';
        }
        else{
          var conn = $scope.servers[0].test.FeatureServer + '/' + $scope.servers[0].test[type][1].id + '/query'
          console.log(conn);
          console.log($scope.servers);
        }
        //Gets Project Details
    		$http.get(conn, {params: options})
    			.success(function(res){
          			console.log(res);
                if (type === 'layers'){
                  $scope.projects = res.features;
                }
                else{
                  $scope.engfirms = res.features;
                }
          			
     		});
    	}


    	getProjects(count, 'PROJECTNAME', 'layers');
      getProjects(count, 'SIMPLIFIEDNAME', 'tables');
    	

    }, 1000);

    function getPageNumber(pages){
      var temp = [];
      for (var n in pages){
        temp.push(pages[n].attributes.DOCID);
      }
      temp.sort(function(a, b){return b-a});
      return temp[0];
    };
    
    $scope.change = function(atts){
    	var docid = null;
    	var fromSheets = ['SEALDATE', 'SEALNUMBER', 'ENGINEERINGFIRM', 'FORMERNAME', 'ALIAS'];
      var fromProject = ['DEVPLANID', 'PROJECTID'];
    	// {{sheets[0].attributes[info.name] | date:'yyyy-MM-dd' }}
// $scope.form.SEALNUMBER = $scope.sheets[0].attributes.SEALNUMBER;
    	var options = {
            	f: 'json',
            	outFields: '*',
            	where: "DEVPLANID =  '" + atts.PROJECTNAME.attributes.DEVPLANID + "'",
            	orderByFields: 'PROJECTNAME ASC',
            	returnGeometry: false
        	};
    	$http.get($scope.servers[0].test.FeatureServer + '/' + $scope.servers[0].test.tables[0].id + '/query', {params: options})
    			.success(function(res){
          			console.log(res);
          			$scope.sheets = res.features;
          			$scope.sheetFields = res.fields;
                //Checks if other sheets exisits
          			if ($scope.sheets.length === 0){
          				$scope.sheets = false;
                  
                  for (var f in fromSheets){
                    $scope.form[fromSheets[f]] = null;
                  } 
                  $scope.form.DOCID = 1;
          			}
                //Adds values to form if other sheets exisit
                else{
                  $scope.form.DOCID = getPageNumber($scope.sheets) + 1;
                  for (var f in fromSheets){
                    $scope.form[fromSheets[f]] = $scope.sheets[0].attributes[fromSheets[f]];
                    $scope.form.SEALDATE = $filter('date')($scope.sheets[0].attributes.SEALDATE, 'yyyy-MM-dd');
                  } 
                }
     		});
        //Adds data from Project Tracking layer
        for (var p in fromProject){
          $scope.form[fromProject[p]] = atts.PROJECTNAME.attributes[fromProject[p]];
        }
    };

    $scope.autoFill = function (typed) {
      var options = {
        f: 'json',
        outFields: 'ADDRESS',
        text: typed,
        returnGeometry: false,
        orderByFields: 'ADDRESS ASC'
      };
      var url = $scope.servers[1].WAKE.Addresses;
      $http.get(url, {params: options, cache: true})
        .success(function(res){
          console.log(res);
          $scope.streets = [];
          for (var s in res.features){
            $scope.streets.push(res.features[s].attributes.ADDRESS);
          }
          
        });
    }

    $scope.submit = function (data){
      console.log('HEllo');
      console.log(data);
      var values = {
          PROJECTNAME: data.PROJECTNAME.attributes.PROJECTNAME,
          SEALDATE: data.SEALDATE,
          SEALNUMBER: data.SEALNUMBER,
          DOCTYPE: data.DOCTYPE,
          DOCID: data.DOCID,
          ENGINEERINGFIRM: data.ENGINEERINGFIRM.SIMPLIFIEDNAME,
          WATER: data.WATER.id,
          SEWER: data.SEWER.id,
          REUSE: data.REUSE.id,
          STORM: data.STORM.id,
          FORMERNAME: data.FORMERNAME || null,
          ALIAS: data.ALIAS || null,
          DEVPLANID: data.DEVPLANID,
          STREET_1: data.STREET_1 || null,
          STREET_2: data.STREET_2 || null,
          STREET_3: data.STREET_3 || null,
          STREET_4: data.STREET_4 || null,
          NOTES: data.NOTES || null,
          TAGS: data.TAGS || null,
          PROJECTID: data.PROJECTNAME.attributes.PROJECTID
      };
      if ($scope.sheets !== false){
        values.SEALDATE = $scope.sheets.SEALDATE;
      }
      $scope.stat = false;
      $scope.entry = values;
    };


        

  }]);
