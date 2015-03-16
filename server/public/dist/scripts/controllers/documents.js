'use strict';
angular.module('asbuiltsApp')
  .controller('DocCtrl',['$scope', '$routeParams', '$http', '$sce',
  function($scope, $routeParams, $http, $sce) {
    var documentBaseUrl = 'http://gis.raleighnc.gov/asbuilts/PROJECT_TRACKING/';
    $scope.documentid = $routeParams.documentid;
    $scope.doc = $scope.documentid.split('-');
    $scope.url = $sce.trustAsResourceUrl(documentBaseUrl + $scope.doc[0] + "/" + $scope.documentid + ".pdf");

    var options = {
            f: 'json',
            outFields: '*',
            where: "PROJECTID = " + $scope.doc[0] + " AND DOCTYPEID = '" + $scope.doc[1] + "' AND DOCID = " + $scope.doc[2],
        };

    var options2 = {
            f: 'json',
            outFields: '*',
            where: "OBJECTID > 0"
        };

    var conn = 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/5/query';
    $http.get(conn, {params: options, cache: true})
      .success(function(res){
          console.log(res);
          $scope.documentDetails = res.features;
          removeEmptyFields($scope.documentDetails);
          var connDoc = 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/9/query';
          $http.get(connDoc, {params: options2, cache: true})
            .success(function(res){
                console.log(res);
                $scope.doctypes = res.features;
                joinTables($scope.documentDetails, $scope.doctypes, 'DOCTYPEID', 'DOCUMENTTYPE' );
            });
      });



      function removeEmptyFields (data) {
          for (var a in data[0].attributes){
            data[0].attributes[a] ? data[0].attributes[a] : delete data[0].attributes[a];
          }
      }

      function joinTables (table1, table2, joinField, addField){
        for (var r in table1){
          for (var i in table2){
            if (table1[r].attributes[joinField] === table2[i].attributes[joinField]){
              console.log("Join Fields Match");
              table1[r].attributes[addField] = table2[i].attributes[addField];
              delete table1[r].attributes[joinField];
            }
          }
        }
      }



    $scope.$watch('documentDetails', function(newVal, oldVal){
        console.log($scope.documentDetails);
    }, true);

  }]);
