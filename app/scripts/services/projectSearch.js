'use strict';

angular.module('asbuiltsApp')
    .service('projectSearch', ['Ags', 'OptionsFactory','$filter', '$cacheFactory', '$rootScope', function(Ags, OptionsFactory, $filter, $cacheFactory, $rootScope){
      var scope = $rootScope;
      scope.mapstest = new Ags({host: 'mapstest.raleighnc.gov'});
      scope.gis = new Ags({host: 'gis.raleighnc.gov'});
      scope.pt_ms = scope.mapstest.setService({
        folder:'PublicUtility',
        service: 'ProjectTracking',
        server: 'MapServer'
      });
      //Auto fill function for street names
      this.autoFill = function (typed) {
        typed = typed.toUpperCase();


        var projectOptions = {
          layer: 'Project Tracking',
          geojson: false,
          actions: 'query',
          params: {
            f: 'json',
            outFields: 'PROJECTNAME,DEVPLANID,PROJECTID',
            text: typed,
            returnGeometry: false,
            orderByFields: 'PROJECTNAME ASC'
          }
        };
        return scope.pt_ms.request(projectOptions);
      };
      this.getSet = function (array){
        var temp = [];
        for (var i = 0, x = array.length; i < x; i++){
          temp.indexOf(temp[i]) ? array : temp.push(array[i]);
        }
        return temp;
      }

}]); //ProjectSearch
