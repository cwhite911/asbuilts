'use strict';

angular.module('asbuiltsApp')
    .service('ags', ['$resource', function($resource){
      var baseUrl = 'http://:name.raleighnc.gov/arcgis/rest/services/PublicUtility/:folder/:serviceType';
      this.Layers = function (layers){
        this.layers = layers;
      }
      this.Layers.prototype.getLayerId = function (name){
        for (var i = 0, x = this.layers.length; i < x; i++){
          if (this.layers[i].name === name){
              return this.layers[i].id;
          }
        }
      };

      this.paramDefaults = {
          test: {
            name: 'mapstest',
            folder: 'ProjectTracking',
            serviceType: 'FeatureServer'
          },
          fs: {
            name: 'mapstest',
            id: '0',
            folder: 'ProjectTracking',
            serviceType: 'FeatureServer',
          }
        };
        this.testActions = {
            getService: {
              method: 'GET',
              params: {f: 'json'}
            },
            getAll: {
              method: 'GET',
              timeout: 5000,
              params: {
                f: 'json',
                outFields: '*',
                where: 'OBJECTID > 0',
                returnGeometry: false
              }
            },
            deleteFeature: {
              method: 'POST',
              headers: {'Content-Type': 'text/plain'},
              params: {
                f: 'json',
                objectIds: null
              }
            }
        };

        //Sets Up different Resources
        this.testServer = $resource(baseUrl,
         this.paramDefaults.test, this.testActions);


        this.features = $resource(baseUrl + '/:id/query',
          this.paramDefaults.fs, this.testActions);

        this.deleteFeatures = $resource(baseUrl + '/deleteFeatures',
          this.paramDefaults.fs, this.testActions);

    }]);
