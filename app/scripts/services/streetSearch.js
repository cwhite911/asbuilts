'use strict';

angular.module('asbuiltsApp')
    .service('StreetSearch', ['Ags','$filter','$cacheFactory', '$rootScope', function(Ags, $filter, $cacheFactory, $rootScope){

      var scope = $rootScope;
      scope.maps = new Ags({host: 'maps.raleighnc.gov'});
      //Set up custom cache for search
      var streetCache = $cacheFactory('streetCache');
      //Auto fill function for street names
          var streets = [];
          this.autoFill = function (typed) {
            typed = typed.toUpperCase();
            //Checks cache for searched value uses cache if its cached
            var cache = streetCache.get(typed);
              if(cache){
                var f = $filter('filter')(cache, typed);
                if (f.length > 0 ){
                  f.map(function(data){
                    return data.trim();
                  });
                  //Returns cache limited to 5 results
                  return $filter('limitTo')(f, 5);
                }
              }
            
            var streetOptions = {
              folder:'StreetsDissolved',
              service: '',
              server: 'MapServer',
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
            scope.maps.request(streetOptions).then(function(res){
              console.log(res);
              var street;
                for (var s in res.features){
                  street = res.features[s].attributes.CARTONAME
                  if (streets.indexOf(street) === -1){
                    streets.push(street);
                  }
                }
                //Adds results to cache
                streetCache.put(typed, streets);
              });

              return $filter('limitTo')(streets, 5);
          };


}]);

// http://maps.raleighnc.gov/arcgis/rest/services/StreetsDissolved/MapServer/0
