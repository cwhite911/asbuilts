'use strict';

angular.module('asbuiltsApp')
    .service('StreetSearch', ['serverFactory', function(serverFactory){

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
            return serverFactory.streets_ms.request(streetOptions);
          };

}]);
