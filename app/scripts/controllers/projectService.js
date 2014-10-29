'use strict';

angular.module('asbuiltsApp')
    .service('PT', ['$http', function($http){
      //Private stuff
      var temp = [];
      function getLayers (item, url){
        for (var i = 0, x = item.length; i < x; i++){
          temp.push(item[i]);
          temp[i].url = url + '/' + temp[i].id + '/';
        }
      }
      //Service constructor
      var Services = function(type, url){
        this.serviceType = type;
        this.url = url + '/' + this.serviceType;
        this.servicelayers = [];
      };

      Services.prototype = {
        //Adds all the avaliable layer and table services to the layers array
        setServices: function (){
          var url = this.url;
          $http.get(this.url, {params: {f: 'json'}, cache: true})
            .success(function(res){
              //Send Layers to get endpoints generated
              getLayers(res.layers.concat(res.tables), url);
          })
          .error(function(data, status, headers, config) {
            console.log(status);
          });
          this.servicelayers = temp;

        },
        getServices: function (name, type, options){
          var serviceLayers = this.servicelayers,
              myData = {};
          for (var i = 0, x = serviceLayers.length; i < x; i++){
            if (serviceLayers[i].name === name){
              //Set url with CRUD operation
              var url = serviceLayers[i].url + type;
              $http.get(url, {params: options , cache: true})
                .success(function(res){
                  myData.features = res.features;
                  myData.fields = res.fields;
                  myData.options = options;
              })
              .error(function(data, status, headers, config) {
                console.log(status);
              });
              this.servicelayers[i].data = myData;
            }
          }
          return myData;
        }
      };
      return (Services);
  }]);
