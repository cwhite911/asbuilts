'use strict';
angular.module('asbuiltsApp')
  .controller('DocCtrl',['$scope', '$routeParams', 'serverFactory', '$sce',
  function($scope, $routeParams, serverFactory, $sce) {
    var documentBaseUrl = 'http://gis.raleighnc.gov/asbuilts/PROJECT_TRACKING/';
    $scope.documentid = $routeParams.documentid;
    $scope.doc = $scope.documentid.split('-');
    $scope.url = $sce.trustAsResourceUrl(documentBaseUrl + $scope.doc[0] + "/" + $scope.documentid + ".pdf");

    var options = {
      layer: 'RPUD.PTK_DOCUMENTS',
      actions: 'query',
      params: {
          f: 'json',
          outFields: '*',
          where: "PROJECTID = " + $scope.doc[0] + " AND DOCTYPEID = '" + $scope.doc[1] + "' AND DOCID = " + $scope.doc[2]
        }
      };

    var options2 = {
        layer: 'RPUD.DOCUMENTTYPES',
        actions: 'query',
        params: {
            f: 'json',
            outFields: '*',
            where: "OBJECTID > 0"
          }
        };


//Welcoem to some ugly code...
    serverFactory.pt_fs.request(options)
      .then(function(res){
        $scope.documentDetails = res.features;
        removeEmptyFields($scope.documentDetails);
        return $scope.documentDetails;
      }, function(err){
          console.log(err);
      }).then(function(data){
        serverFactory.pt_fs.request(options2)
          .then(function(res){
              $scope.doctypes = res.features;
              joinTables(data, $scope.doctypes, 'DOCTYPEID', 'DOCUMENTTYPE' );
          }, function(err){
              console.log(err);
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

              table1[r].attributes[addField] = table2[i].attributes[addField];
              delete table1[r].attributes[joinField];
            }
          }
        }
      }



    $scope.$watch('documentDetails', function(newVal, oldVal){

    }, true);

  }]);
