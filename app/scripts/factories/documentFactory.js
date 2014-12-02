'use strict';

angular.module('asbuiltsApp')
    .factory('DocumentFactory', [function(){
      //Options constructor
      var Document = function (data){
        this.data = {
          PROJECTNAME: data.PROJECTNAME | '',
          PROJECTID: data.PROJECTNAME | '',
          DOCID: data.DOCID | '',
          WATER: data.WATER | 0,
          SEWER: data.SEWER | 0,
          REUSE: data.REUSE | 0,
          STORM: data.STORM | 0,
          FORMERNAME: data.FORMERNAME | '',
          ALIAS: data.ALIAS | '',
          DEVPLANID: data.DEVPLANID | '',
          STREET_1: data.STREET_1 | '',
          STREET_2: data.STREET_2 | '',
          STREET_3: data.STREET_3 | '',
          STREET_4: data.STREET_4 | '',
          NOTES: data.NOTES | '',
          TAGS: data.TAGS | '',
          ENGID: data.ENGID | '',
          DOCTYPEID: data.DOCTYPEID | '',
          SHEETTYPEID: data.SHEETTYPEID | ''
        }
      };
      Document.prototype = {
        setValue: function (info){
          angular.extend(this.data, info);
          return this;
        },
        getData: function (){
          return this.data;
        }
      }
      return (Document);
    }]);
