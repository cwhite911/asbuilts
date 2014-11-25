'use strict';

angular.module('asbuiltsApp')
    .factory('OptionsFactory', [function(){
      //Options constructor
      var QueryOptions = function (f, outFields, where, orderByFields, returnGeometry){
          this.f = f || 'json';
          this.outFields = outFields || '*';
          this.where = where || 'OBJECTID > 0';
          this.orderByFields = orderByFields || null;
          this.returnGeometry = returnGeometry || 'false';
          return this;
        };
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
