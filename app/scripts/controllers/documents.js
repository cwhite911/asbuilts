angular.module('asbuiltsApp')
  .controller('DocCtrl',['$scope', '$routeParams', '$http', '$sce',
  function($scope, $routeParams, $http, $sce) {
    var document_base_url = 'http://gis.raleighnc.gov/asbuilts/PROJECT_TRACKING/';
    $scope.documentid = $routeParams.documentid;
    $scope.doc = $scope.documentid.split('-');
    $scope.url = $sce.trustAsResourceUrl(document_base_url + $scope.doc[0] + "/" + $scope.documentid + ".pdf");

    var options = {
            f: 'json',
            outFields: '*',
            where: "PROJECTID = " + $scope.doc[0] + " AND DOCTYPEID = '" + $scope.doc[1] + "' AND DOCID = " + $scope.doc[2],
        };

    var conn = 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/5/query';
    $http.get(conn, {params: options, cache: true})
      .success(function(res){
          console.log(res);
          $scope.documentDetails = res.features;
      });

    var options2 = {
            f: 'json',
            outFields: '*',
            where: "OBJECTID > 0"
        };
    var connDoc = 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/FeatureServer/9/query';
    $http.get(connDoc, {params: options2, cache: true})
      .success(function(res){
          console.log(res);
          $scope.doctypes = res.features;
      });


      function joinTables (table1, table2, joinField, addField){
        for (var r in table1){
          for (var i in table2){
            if (table1[r].attributes[joinField] === table2[i].attributes[joinField]){
              table1[r].attributes[addField] = table2[i].attributes[addField];
            }
          }
        }
      }

    joinTables($scope.documentDetails, $scope.doctypes, 'DOCTYPEID', 'DOCTYPENAMES' );

    $scope.$watch('documentDetails', function(newVal, oldVal){
        console.log($scope.documentDetails);
    }, true);

  }]);
