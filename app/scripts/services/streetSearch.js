'use strict';

angular.module('asbuiltsApp')
    .service('StreetSearch', ['Ags','$filter','$cacheFactory', '$rootScope', function(Ags, $filter, $cacheFactory, $rootScope){
      var scope = $rootScope;
        scope.mapsServer = new Ags({host: 'maps.raleighnc.gov'});

      var streets_ms = scope.mapsServer.setService({
        folder:'StreetsDissolved',
        service: '',
        server: 'MapServer',
      });
      
      //Auto fill function for street names
          var streets = [];
          this.autoFill = function (typed) {
            typed = typed.toUpperCase();


            var streetOptions = {
              layer: 'Streets',
              geojson: false,
              actions: 'query',
              params: {
                f: 'json',
                outFields: 'CARTONAME',
                text: typed,
                returnGeometry: false,
                orderByFields: 'CARTONAME ASC'
              }
            };
            return streets_ms.request(streetOptions);
          };

}]);

// http://maps.raleighnc.gov/arcgis/rest/services/StreetsDissolved/MapServer/0

// http://maps.raleighnc.gov/arcgis/rest/services/StreetsDissolved/MapServer?f=json
