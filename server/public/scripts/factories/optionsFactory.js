'use strict';
var app = angular.module('asbuiltsApp');

    app.factory('OptionsFactory', [function(){
      //Options constructor
      var QueryOptions = function (f, outFields, where, orderByFields, returnGeometry){
          this.f = f || 'json';
          this.outFields = outFields || '*';
          this.where = where || 'OBJECTID > 0';
          this.orderByFields = orderByFields || null;
          this.returnGeometry = returnGeometry || 'false';
          return this;
        };
        //TODO fix options to take object that extends original verses key value
        QueryOptions.prototype = {
          getOptions: function () {
            return this;
        },
        updateOptions: function (key, value){
          //Checks if the key exisits changes value if it does, does nothing if it doesn't
          Object.keys(this).indexOf(key) > -1 ?
            this[key] = value : this;
            return this;
        },
        addOptions: function (key, value){
          this[key] = value;
          return this;
        },
        removeOptions: function (key){
          delete this[key];
          return this;
        }
      };
      return (QueryOptions);
    }]);


  app.factory('AddFeatureOptionsFactory', [function(){
      //Options constructor
      var AddOptions = function (options){
        this.options = {
          f: options.f || 'json',
          features: options.features || [{atttributes: {}}]
        }
        return this;
      };
      AddOptions.prototype = {
        addOptions: function (option){
          angular.extend(this.options, option);
          return this;
        },
        getOptions: function (){
          return this.options;
        }
    };

      return (AddOptions);
    }]);

app.factory('DeleteOptionsFactory', [function(){
    //Options constructor
    var DeleteOptions = function (options){
      this.options = {
        f: options.f || 'json',
        objectIds: options.objectIds || null
      }
      return this;
    };
    DeleteOptions.prototype = {
      deleteOptions: function (option){
        angular.extend(this.options, option);
        return this;
      },
      getOptions: function (){
        return this.options;
      }
  };

    return (DeleteOptions);
  }]);
