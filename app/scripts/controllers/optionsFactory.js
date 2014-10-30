'use strict';

angular.module('asbuiltsApp')
    .factory('Options', [function(){
      //Options constructor
      var Options = function (f, outFields, where, orderByFields, returnGeometry){
          this.f = f || 'json';
          this.outFields = outFields || '*';
          this.where = where || 'OBJECTID > 0';
          this.orderByFields = orderByFields || null;
          this.returnGeometry = returnGeometry || 'false';
        };
        Options.prototype = {
          getOptions: function () {
            return this;
        },
        updateOptions: function (key, value){
          //Checks if the key exisits changes value if it does, does nothing if it doesn't
          Object.keys(this).indexOf(key) > -1 ?
            this[key] = value : this;
        },
        addOptions: function (key, value){
          this[key] = value;
        },
        removeOptions: function (key){
          delete this[key];
        }
      };
      return (Options);
    }]);
