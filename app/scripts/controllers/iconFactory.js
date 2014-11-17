'use strict';

angular.module('asbuiltsApp')
    .factory('IconFactory', [function(){
      //Options constructor
      var Icon = function (name, message, iconUrl, iconSize, iconAnchor, popupAnchor){
        this.name = name;
        this.message = message;
        this.icon = {
          iconUrl: iconUrl,
          iconSize: iconSize,
          iconAnchor: iconAnchor,
          popupAnchor: popupAnchor
        };

        };
      var Icons = function () {
        this.list = [];
      }
        Icons.prototype = {
          addIcon: function(name, message, iconUrl, iconSize, iconAnchor, popupAnchor){
            this.list.push(new Icon(name, message, iconUrl, iconSize, iconAnchor, popupAnchor));
          }
      };
      return (Icons);
    }]);
