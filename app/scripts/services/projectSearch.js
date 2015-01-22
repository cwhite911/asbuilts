'use strict';

angular.module('asbuiltsApp')
    .service('projectSearch', ['Ags', 'OptionsFactory','$filter', '$cacheFactory', '$rootScope', function(Ags, OptionsFactory, $filter, $cacheFactory, $rootScope){
      var scope = $rootScope;
      scope.maps = new Ags({host: 'maps.raleighnc.gov'});
      scope.mapstest = new Ags({host: 'mapstest.raleighnc.gov'});
      //Auto fill function for street names
      this.autoFill = function (typed) {
        typed = typed.toUpperCase();


        var projectOptions = {
          folder:'PublicUtility',
          service: 'ProjectTracking',
          server: 'MapServer',
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
        return scope.mapstest.request(projectOptions);
      };
      this.getSet = function (array){
        var temp = [];
        for (var i = 0, x = array.length; i < x; i++){
          temp.indexOf(temp[i]) ? array : temp.push(array[i]);
        }
        return temp;
      }
    //   return {
    //       autoFillProjects: function (typed) {
    //         var projects = [];
    //         var typed = typed.toUpperCase();
    //         // if(typed.length < 3){
    //         //   return;
    //         // }
    //         var cache = projectCache.get(typed);
    //           if(cache){
    //             var f = $filter('filter')(cache, typed);
    //             if (f.length > 0 ){
    //               f.map(function(data){
    //                 return data.trim();
    //               });
    //               //Returns cache limited to 5 results
    //               getSet(f);
    //               return $filter('limitTo')(f, 5) || 'im from the cache';
    //             }
    //           }
    //         function getSet (array){
    //           var temp = [];
    //           for (var i = 0, x = array.length; i < x; i++){
    //             temp.indexOf(temp[i]) ? array : temp.push(this[i]);
    //           }
    //           return temp;
    //         }
    //       //Adds typed text to options
    //       options.addOptions('text', typed.toUpperCase());
    //
    //       //Search for the text form the server
    //       ags.features.getAll(options).$promise.then(function(data){
    //         try {
    //           if (data.features.length > 0){
    //             for (var i = 0, x = data.features.length; i < x; i++){
    //                projects.push(data.features[i].attributes.PROJECTNAME + ':' + data.features[i].attributes.DEVPLANID + ':' + data.features[i].attributes.PROJECTID);
    //             }
    //             getSet(projects);
    //           }
    //           else {
    //             projects.push("Sorry No Record Found...");
    //           }
    //         } catch (error){
    //           console.log('Sorry the server is not responding :(');
    //         }
    //       });
    //       projectCache.put(typed, projects);
    //     return $filter('limitTo')(projects, 5) || 'Im from the server';
    //   } //autoFill
    // } //return
}]); //ProjectSearch
