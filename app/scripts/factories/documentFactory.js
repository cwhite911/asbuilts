'use strict';

angular.module('asbuiltsApp')
    .factory('DocumentFactory', ['ags', 'AddFeatureOptionsFactory', '$cacheFactory', function(ags, AddFeatureOptionsFactory, $cacheFactory){
      //Creates cache to store touch documents
      var cache = $cacheFactory('docId');

      //TODO move out of factory make all layer ids shared resources
      var layerId = 5;
      function cleanForPost (dirty){
        var dirtyData = [{attributes: dirty}];
        var clean = angular.toJson(dirtyData);
        return clean;
      }
      //Options constructor
      var Document = function (data){
        this.data = {
          PROJECTNAME: data.PROJECTNAME || '',
          PROJECTID: data.PROJECTID || '',
          DOCID: data.DOCID || 0,
          WATER: data.WATER || 0,
          SEWER: data.SEWER || 0,
          REUSE: data.REUSE || 0,
          STORM: data.STORM || 0,
          FORMERNAME: data.FORMERNAME || '',
          ALIAS: data.ALIAS || '',
          DEVPLANID: data.DEVPLANID,
          STREET_1: data.STREET_1 || '',
          STREET_2: data.STREET_2 || '',
          STREET_3: data.STREET_3 || '',
          STREET_4: data.STREET_4 || '',
          NOTES: data.NOTES || '',
          TAGS: data.TAGS || '',
          ENGID: data.ENGID || '',
          DOCTYPEID: data.DOCTYPEID || '',
          SHEETTYPEID: data.SHEETTYPEID || ''
        };
        return this;
      };
      Document.prototype = {
        setValue: function (info){
          angular.extend(this.data, info);
          return this;
        },
        getData: function (){
          return this.data;
        },
        postNewDoc: function (){
          var options = new AddFeatureOptionsFactory({features: cleanForPost(this.data)});
          ags.testActions.actions.newDocument.params = options.getOptions();
          ags.addDocument.newDocument().$promise.then(function(data){
            // console.log(data.addResults[0].objectId);
            cache.put('newId', data.addResults[0].objectId);
            console.log(cache.get('newId'));
          });
        },
        updateDoc: function (){
          var options = new AddFeatureOptionsFactory({features: cleanForPost(this.data)});
          ags.testActions.actions.newDocument.params = options.getOptions();
          ags.updateDocument.update().$promise.then(function(data){
            console.log(data);
            // cache.put('updateId', data.addResults[0].objectId);
          });
        }
      }
      return (Document);
    }]);
