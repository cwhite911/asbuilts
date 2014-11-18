'use strict';

angular.module('asbuiltsApp')
    .service('ags', ['$resource', function($resource){
      var baseUrl = 'http://:name.raleighnc.gov/arcgis/rest/services/PublicUtility/:folder/:serviceType';

      //Layers constructor that creates a resource for identifying layer ids to their name
      this.AgsLayers = function (layers){
        this.items = layers;
        return this;
      };
      //method that gets the layer id
      this.AgsLayers.prototype.getLayerId = function (name){
        for (var i = 0, x = this.items.length; i < x; i++){
          if (this.items[i].name === name){
              return this.items[i].id;
          }
        }
      };

      //Defualt parameters for the $resources
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

        //Constructor Class and prototypes for setting up $resource options
        var ServerActions = function (){
          this.actions = {};
        };
        ServerActions.prototype = {
          Type: function (method, timeout, params, cache) {
            this.method = method;
            this.timeout = timeout || 5000;
            this.params = params;
            this.cache = cache || false;
          },
          setAction: function (name, method, timeout, params, cache){
            var action = new this.Type(method, timeout, params, cache);
            this.actions[name] = action;
          }
        };

        //Created new Action and setting action types
        var testActions = new ServerActions ();
        testActions.setAction('getService','GET', 5000, {f: 'json'}, true);
        testActions.setAction('getAll','GET', 5000, {f: 'json', outFields: '*', where: 'OBJECTID > 0', returnGeometry: false}, true);
        testActions.setAction('deleteFeature','POST', 5000, {f: 'json', objectIds: null}, false);


        //Sets Up different Resources
        this.testServer = $resource(baseUrl,
         this.paramDefaults.test, testActions.actions);


        this.features = $resource(baseUrl + '/:id/query',
          this.paramDefaults.fs, testActions.actions);

        this.deleteFeatures = $resource(baseUrl + '/deleteFeatures',
          this.paramDefaults.fs, testActions.actions);

    }]);
