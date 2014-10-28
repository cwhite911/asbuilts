'use strict';

angular.module('asbuiltsApp')
    .service('PT', ['$http', '$q','$timeout', function($http, $q, $timeout){
        var _url;
        var services = [];
        var getLayers = function (item){
          for (var i = 0, x = item.length; i < x; i++){
            services.push(item[i]);
          }
        };
        return {
      //Sets serives avaliable from the server
        setServices: function (type, url){
          _url = url + '/' + type;
          $http.get(_url, {params: {f: 'json'}, cache: true}).success(function(res){
            getLayers(res.layers);
            getLayers(res.tables);
          })
          .error(function(data, status, headers, config) {
            console.log(status);
          });
        },
        //Gets the avaiable services
        getServices: function (){
            return {
              'url': _url,
              'services': services
            };
        },
        //Generates RESTful endpoint
        getUrl: function (type, fname){
          var layerUrl = _url;
          for (var i = 0, x = services.length; i < x; i++){
            services[i].name === fname ? layerUrl = layerUrl + services[i].id + '/' + type : layerUrl;
          }
          return layerUrl;
        },
        getData: function (url, options){
          $http.get(url, {params: options , cache: true})
            .success(function(res){
              return res.features;
          })
          .error(function(data, status, headers, config) {
            console.log(status);
          });
        }
      }
  }]);
