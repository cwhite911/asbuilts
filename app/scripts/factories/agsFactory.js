//Working on an idea no used in app


'use strict';

angular.module('asbuiltsApp')
.factory('agsFactory', ['Ags', function(Ags){
  //Create Server objects
  var mapstest = new Ags({host: 'mapstest.raleighnc.gov'}),
      maps = new Ags({host: 'maps.raleighnc.gov'});

  //Create services

  //Project Tracking MapService
  var pt_ms = mapstest.setService({
    folder:'PublicUtility',
    service: 'ProjectTracking',
    server: 'MapServer'
  });

  //Project Tracking Feature Service
  var pt_fs = scope.mapstest.setService({
    folder:'PublicUtility',
    service: 'ProjectTracking',
    server: 'FeatureServer'
  });

  var streets_ms = scope.maps.setService({
    folder:'StreetsDissolved',
    service: '',
    server: 'MapServer',
  });

  var servers = [
    {
      name: 'mapstest',
      services: [pt_ms, pt_fs],
      server: mapstest
    },
    {
      name: 'maps',
      services: [streets_ms],
      server: maps
    }
  ];

  Ags.prototype = {
    addService: function (name, service){
      this[name] = service;
      return this;
    },
    getService: function (name){
      for (var i = 0, a = this.services.length; i < a; i++){
        if(this.services[i].name === name){
          return this.services[i].url;
        }
      }
    }
  };

  var Shape = function (edges) {
    this.edges = edges;
  }

  var Ball.prototype = new Shape



  return {

  }
}]);
