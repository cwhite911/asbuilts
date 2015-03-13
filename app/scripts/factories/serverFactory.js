//Configure all ArcGIS server and services


'use strict';

angular.module('asbuiltsApp')
.factory('serverFactory', ['Ags', function(Ags){
  //Create Server objects
  var mapstest = new Ags({host: 'mapstest.raleighnc.gov'}),
      maps = new Ags({host: 'maps.raleighnc.gov'}),
      gis = new Ags({host: 'maps.raleighnc.gov'});

  //Create services
  var services = {
    //Project Tracking MapService
    pt_ms: mapstest.setService({
      folder:'PublicUtility',
      service: 'ProjectTracking',
      server: 'MapServer'
    }),

  //Project Tracking Feature Service
    pt_fs: mapstest.setService({
      folder:'PublicUtility',
      service: 'ProjectTracking',
      server: 'FeatureServer',
      header: {'Content-Type': 'application/json'}
    }),

    //Streets Service
    streets_ms: maps.setService({
      folder:'StreetsDissolved',
      service: '',
      server: 'MapServer',
    }),

    //Reclaimed Map Server
    reclaimed_ms: gis.setService({
      folder:'PublicUtility',
      service: 'ReclaimedDistribution',
      server: 'MapServer'
    }),

    //Water Map Server
    water_ms: gis.setService({
      folder:'PublicUtility',
      service: 'WaterDistribution',
      server: 'MapServer'
    }),

    //Sewer Map Server
    sewer_ms: maps.setService({
      folder:'PublicUtility',
      service: 'SewerExternal',
      server: 'MapServer'
    }),

    //Parcels Map Server
    parcels_ms: maps.setService({
      folder:'',
      service: 'Parcels',
      server: 'MapServer'
    })

  };


  return (services);

}]);
