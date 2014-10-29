'use strict';

/**
 * @ngdoc function
 * @name asbuiltsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the asbuiltsApp
 */
angular.module('asbuiltsApp')
  .controller('StatsCtrl', ['$scope', '$http','$timeout', 'PT', 'Options', function ($scope, $http, $timeout, PT, Options) {
    var service = new PT('FeatureServer', 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking'),
        projectOptions = new Options('json', '*', 'OBJECTID > 0', 'PROJECTNAME ASC', 'true' ),
        engFirmsOptions = new Options('json', '*', 'OBJECTID > 0', 'SIMPLIFIEDNAME ASC', 'false'),
        sheetTypesOptions = new Options('json', '*', 'OBJECTID > 0', 'SHEETTYPE ASC', 'false'),
        docTypesOptions = new Options('json', '*', 'OBJECTID > 0', 'DOCUMENTTYPE ASC', 'false'),
        projectDocOptions = new Options('json', '*', 'OBJECTID > 0', 'OBJECTID ASC', 'false');

    service.setServices();
    $timeout(function (){
      $scope.projects = service.getServices('Project Tracking', 'query', projectOptions);
      projectOptions.updateOptions('where', 'OBJECTID > 1000');
      // $scope.projects = service.getServices('Project Tracking', 'query', projectOptions);
      // $scope.engFirms = service.getServices('RPUD.ENGINEERINGFIRM', 'query', engFirmsOptions);
      // $scope.sheetTypes = service.getServices('RPUD.SHEETTYPES', 'query', sheetTypesOptions);
      // $scope.docTypes = service.getServices('RPUD.DOCUMENTTYPES', 'query', docTypesOptions);
      // $scope.projectDocs = service.getServices('RPUD.PTK_DOCUMENTS', 'query', projectDocOptions);
    }, 500);

$scope.chartType = 'Pie';
$scope.data = {
  series: ["Sales", "Income", "Expense"],
  data: [{
    x: "Computers",
    y: [54, 0, 879],
    tooltip: "This is a tooltip"
  }]
};
$scope.config = {
		labels: true,
		title: "Products",
		legend: {
			display: true,
			position: 'left'
		},
		innerRadius: 0
	};
  }]);
