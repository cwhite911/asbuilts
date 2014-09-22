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
    $scope.formSuccess = false;
    $scope.selections = [{'name': true, 'id': 1}, {'name': false, 'id': 0}];
    $scope.selectionOptions = {
      project: '--Please Select Project--',
      doctype: '--Please Select Document Type--',
      engineer: '--Please Select Engineering Firm--',
      tf: '--Please Select--',
      sheet: '--Please Select Sheet--'
    };
    var count = 0;
    $scope.servers = [{
    	'test': {
    		'FeatureServer': 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer',
    		'layers': []
    	}
    },
    {
      'WAKE': {
          'Addresses' : 'http://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query'
       }
  }];


var getData = function (count, order, name){
  var options = {
        f: 'json',
        outFields: '*',
        where: 'OBJECTID >' + count,
        orderByFields: order + ' ASC',
        returnGeometry: false
    };
  for (var i in $scope.servers[0].test.layers){
    for (var each in $scope.servers[0].test.layers[i]){
      if ($scope.servers[0].test.layers[i][each].name === name){
        var conn = $scope.servers[0].test.FeatureServer + '/' + $scope.servers[0].test.layers[i][each].id + '/query';
        $http.get(conn, {params: options})
          .success(function(res){
            if (name === 'RPUD.ENGINEERINGFIRM'){
              $scope.engfirms = res.features;
            }
            if (name === 'Project Tracking'){
              $scope.projects = res.features;
            }
            if (name === 'RPUD.PTK_DOCUMENTS'){
              $scope.fields = res.fields;
            }
            if (name === 'RPUD.SHEETTYPES'){
              $scope.sheetdisc = res.features;
            }
            if (name === 'RPUD.DOCUMENTTYPES'){
              $scope.doctypes = res.features;
            }
          });
      }
    }
  }
}

$http.get($scope.servers[0].test.FeatureServer, {params: {f: 'json'}, cache: true})
  .success(function(res){
    $scope.servers[0].test.layers.push(res.layers);
    $scope.servers[0].test.layers.push(res.tables);
    setTimeout(function(){
      getData(count, 'OBJECTID', 'RPUD.PTK_DOCUMENTS');
      getData(count, 'PROJECTNAME', 'Project Tracking');
      getData(count, 'SIMPLIFIEDNAME', 'RPUD.ENGINEERINGFIRM');
      getData(count, 'SHEETTYPE', 'RPUD.SHEETTYPES');
      getData(count, 'DOCUMENTTYPE', 'RPUD.DOCUMENTTYPES');
    }, 1000);
});

console.log($scope.projects);

    //Alphabetically orders options in selection
    $scope.sheetdisc = $filter('orderBy')($scope.sheetdisc, 'type');
    $scope.doctypes = $filter('orderBy')($scope.doctypes, 'type');

    //Gets the connection string for any table of layer form server
    function getConnection (dataset, type) {
    for (var i in $scope.servers[0].test.layers){
      for (var each in $scope.servers[0].test.layers[i]){
        if ($scope.servers[0].test.layers[i][each].name === dataset){
          var conn = $scope.servers[0].test.FeatureServer + '/' + $scope.servers[0].test.layers[i][each].id + '/' + type;
          return conn;
        }
      }
    }
  }

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
    	var fromSheets = ['SEALDATE', 'SEALNUMBER', 'ENGID', 'FORMERNAME', 'ALIAS'];
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

      var conn = getConnection('RPUD.PTK_DOCUMENTS', 'query');

    	$http.get(conn, {params: options})
    			.success(function(res){
          			console.log(res);
          			$scope.sheets = res.features;
                //Adds leading zeros in front of IDs for sorting
                for (var i in $scope.sheets){
                  if ($scope.sheets[i].attributes.DOCID < 10){
                    var temp = '0' + $scope.sheets[i].attributes.DOCID.toString();
                    $scope.sheets[i].attributes.DOCID = parseInt(temp);
                    // console.log($scope.sheets[i].attributes.DOCID);
                  }
                }
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
                    $scope.selectionOptions.engineer = $scope.sheets[0].attributes.ENGID;
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

    $scope.nextSheet = function (){
      $scope.selectionOptions.project = $scope.entry.PROJECTNAME;
      $scope.selectionOptions.engineer = $scope.entry.ENGID;

      $scope.form = {
        PROJECTNAME: $scope.entry.PROJECTNAME,
        SEALDATE:  $scope.lastDate,
        SEALNUMBER: $scope.entry.SEALNUMBER,
        DOCID: $scope.entry.DOCID + 1,
        ENGINEERINGFIRM: $scope.entry.ENGID,
        DEVPLANID: $scope.entry.DEVPLANID,
        JURISDICTION: $scope.entry.JURISDICTION,
        PROJECTID: $scope.entry.PROJECTID
      };
      // $scope.form.PROJECTNAME.$setTouched();
    };

    $scope.delete= function (objectid){
      var conn = getConnection('RPUD.PTK_DOCUMENTS', 'deleteFeatures');
      $http.post(conn,
        $scope.postResults, {params: { f: 'json', objectIds: $scope.postResults.objectId}, headers: {
          'Content-Type': 'text/plain'
        }  })
        .success(function(res){
          console.log(res);
          //Checks if user already clicked continue project button and sets DOCID back to original state
          if ($scope.form.DOCID === $scope.entry.DOCID + 1){
            $scope.form.DOCID = $scope.entry.DOCID;
          }
          $scope.sheets.pop();
        });
    };

    $scope.submit = function (data){
      console.log(data);
      $scope.lastDate = data.SEALDATE;
      var date = data.SEALDATE.split('-');
      var newDate = date[1] + '/' + date[2] + '/' + date[0];
      console.log(newDate);
      var values = {
          PROJECTNAME: data.PROJECTNAME.attributes.PROJECTNAME,
          SEALDATE: newDate,
          SEALNUMBER: data.SEALNUMBER,
          DOCTYPEID: data.DOCTYPEID.attributes.DOCTYPEID,
          DOCID: data.DOCID,
          ENGID: data.ENGID.attributes.ENGID,
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
          PROJECTID: data.PROJECTNAME.attributes.PROJECTID,
          SHEETTYPEID: data.SHEETTYPEID.attributes.SHEETTYPEID
      };
      if ($scope.sheets !== false){
        values.SEALDATE = $scope.sheets.SEALDATE;
      }
      $scope.stat = false;
      $scope.entry = values;

//Prepares Data For Post
    var dirtyData = [{attributes: values}];
    var readyData = angular.toJson(dirtyData);
    var config = {
      params: {
        f: 'json',
        features: readyData
      },
      headers: {
        'Content-Type': 'text/plain'
      }
    };

    //POST's form data to ArcGIS server
    var conn = getConnection('RPUD.PTK_DOCUMENTS', 'addFeatures');
    $http.post(conn, values, config)
      .success(function(res){
        console.log(res);
        $scope.form.$setPristine();
        $scope.formSuccess = true;
        $scope.form = {};
        $scope.postResults = res.addResults[0];
        $scope.sheets.push({attributes: values});
      });

    };

//Edit table values
  $scope.over;
  $scope.tableEdits = {
    edit: {
        cell: function (id, field){
          var data = {};
          data.OBJECTID = id;
          data[field] = $scope.table[field];
          var dirtyData = [{attributes: data}];
          var readyData = angular.toJson(dirtyData);
          var config = {
            params: {
              f: 'json',
              features: readyData
            },
            headers: {
              'Content-Type': 'text/plain'
            }
          };
          $http.post($scope.servers[0].test.FeatureServer + '/' + $scope.servers[0].test.tables[0].id + '/updateFeatures', data, config)
            .success(function(res){
              console.log(res);
            });
        }
    },
    delete: {
      row: function (id){
        var conn = getConnection('RPUD.PTK_DOCUMENTS', 'deleteFeatures');
          $http.post(conn,
            $scope.postResults, {params: {
              f: 'json',
              objectIds: id
            }, headers: {
              'Content-Type': 'text/plain'
            }
          })
            .success(function(res){
              console.log(res);
              for (var i in $scope.sheets){
                if ($scope.sheets[i].attributes.OBJECTID === id){
                  console.log(i);
                  // var index = $scope.sheet.indexOf($scope.sheets[i]);
                  $scope.sheets.splice(i, 1);
                }
              }
        });
      }
    }
  };




  }]);
