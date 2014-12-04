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
          },
          addFeature: {
            name: 'mapstest',
            id: '5',
            folder: 'ProjectTracking',
            serviceType: 'FeatureServer',
          }
        };

        //Constructor Class and prototypes for setting up $resource options
        this.ServerActions = function (){
          this.actions = {};
        };
        this.ServerActions.prototype = {
          Type: function (method, timeout, params, cache, headers) {
            this.method = method || 'GET';
            this.timeout = timeout || 5000;
            this.params = params || {};
            this.cache = cache || false;
            this.headers = headers || {'Content-Type': 'application/json'};
          },
          setAction: function (name, method, timeout, params, cache, headers){
            var action = new this.Type(method, timeout, params, cache, headers);
            this.actions[name] = action;
          },
          changeParams: function (name, params){
            angular.extends(this.actions[name], params);
            return this;
          }
        };

        //Created new Action and setting action types
        this.testActions = new this.ServerActions ();
        this.testActions.setAction('getService','GET', 5000, {f: 'json'}, true);
        this.testActions.setAction('getAll','GET', 5000, {f: 'json', outFields: '*', where: 'OBJECTID > 0', returnGeometry: false}, true);
        this.testActions.setAction('deleteFeature','POST', 5000, {f: 'json', objectIds: null}, false);
        this.testActions.setAction('newDocument', 'POST', 5000, {f:'json'}, false, {'Content-Type': 'text/plain'});
        this.testActions.setAction('update', 'POST', 5000, {f:'json'}, false, {'Content-Type': 'text/plain'});


        //Sets Up different Resources
        this.testServer = $resource(baseUrl,
         this.paramDefaults.test, this.testActions.actions);


        this.features = $resource(baseUrl + '/:id/query',
          this.paramDefaults.fs, this.testActions.actions);

        this.deleteFeatures = $resource(baseUrl + '/:id/deleteFeatures',
          this.paramDefaults.fs, this.testActions.actions);

        this.addDocument = $resource(baseUrl + '/:id/addFeatures',
          this.paramDefaults.addFeature, this.testActions.actions);

        this.updateDocument = $resource(baseUrl + '/:id/updateFeatures',
          this.paramDefaults.addFeature, this.testActions.actions);



        //Joins tables together based on field
        //addFieldFromTable(table1, table2, joinField, addFiedl);
        this.addFieldFromTable = function (t1, t2, joinField, addField){
         t1.map(function(t1Data){
           t2.forEach(function(t2Data){
             t1Data.attributes[joinField] === t2Data.attributes[joinField] ? t1Data.attributes[addField] = t2Data.attributes[addField] : t1Data;
           });
         });
         return t1;
        }

    }]);
