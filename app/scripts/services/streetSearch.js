'use strict';

angular.module('asbuiltsApp')
    .service('StreetSearch', ['Ags','$filter','$cacheFactory', '$rootScope', function(Ags, $filter, $cacheFactory, $rootScope){

      var scope = $rootScope;
      scope.maps = new Ags({host: 'maps.raleighnc.gov'});
      var streetCache = $cacheFactory('streetCache');
      var streets_ms = scope.maps.setService({
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
            return scope.maps.request(streets_ms, streetOptions);
          };

}]);

// http://maps.raleighnc.gov/arcgis/rest/services/StreetsDissolved/MapServer/0
