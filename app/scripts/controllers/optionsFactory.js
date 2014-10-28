'use strict';

angular.module('asbuiltsApp')
    .factory('Options', [function(){
      var options = {};
      return {
        setOptions: function (f, outFields, where, orderByFields, returnGeometry){
          options.f = f || 'json';
          options.outFields = outFields || '*';
          options.where = where || 'OBJECTID > 0';
          options.orderByFields = orderByFields || null;
          options.returnGeometry = returnGeometry || 'false';
        },
        getOptions: function () {
          return options;
        },
        updateOptions: function (key, value){
          //Checks if the key exisits changes value if it does, does nothing if it doesn't
          Object.keys(options).indexOf(key) > -1 ?
            options[key] = value : options;
        }
      };
    }]);
