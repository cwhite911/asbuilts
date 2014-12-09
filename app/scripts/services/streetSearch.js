'use strict';

angular.module('asbuiltsApp')
    .service('StreetSearch', ['$http','$filter','$cacheFactory', function($http, $filter, $cacheFactory){
      var streetCache = $cacheFactory('streetCache');
      //Auto fill function for street names
          var streets = [];
          this.autoFill = function (typed) {
            var cache = streetCache.get(typed);
              if(cache){
                var f = $filter('filter')(cache, typed);
                if (f.length > 0 ){
                  f.map(function(data){
                    return data.trim();
                  });
                  console.log(f);
                  return $filter('limitTo')(f, 5);
                }
              }
            var options = {
              f: 'json',
              outFields: 'ADDRESS',
              text: typed,
              returnGeometry: false,
              orderByFields: 'ADDRESS ASC'
            };
            var url = 'http://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query'
            $http.get(url, {params: options, cache: true})
              .success(function(res){
                for (var s in res.features){
                  var withNoDigits = res.features[s].attributes.ADDRESS.replace(/[0-9]/g, '');
                  if (streets.indexOf(withNoDigits) === -1){
                    streets.push(withNoDigits);
                  }
                }

                streetCache.put(typed, streets);
              });

              return $filter('limitTo')(streets, 5);
          }

}]); //ProjectSearch
