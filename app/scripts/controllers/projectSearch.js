'use strict';

angular.module('asbuiltsApp')
    .service('ProjectSearch', ['$http', function($http){
      //Add get set to Project prototype

      return {
          autoFillProjects: function (typed, url) {
          var Projects = []
          function getSet (array){
            var temp = [];
            for (var i = 0, x = array.length; i < x; i++){
              temp.indexOf(temp[i]) ? array : temp.push(this[i]);
            }
            return temp;
          }
          status = false
          // var Projects = [];
          var options = {
            f: 'json',
            outFields: '*',
            text: typed.toUpperCase(),
            returnGeometry: false,
            orderByFields: 'PROJECTNAME ASC'
          };
          // var url = 'http://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/ProjectTracking/MapServer/2/query';
          $http.get(url, {params: options, cache: true})
            .success(function(res){
              var poly = [];
              try {
                if (res.features.length > 0){
                  for (var i = 0, x = res.features.length; i < x; i++){
                     Projects.push(res.features[i].attributes.PROJECTNAME + ':' + res.features[i].attributes.DEVPLANID + ':' + res.features[i].attributes.PROJECTID);
                  }
                  getSet(Projects);
                }
                else {
                  Projects.push("Sorry No Record Found...");
                }
              } catch (error){
                console.log('No Results found');
            }

            });
            return Projects;
        },




  }
}]);
