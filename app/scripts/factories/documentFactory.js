'use strict';

angular.module('asbuiltsApp')
    .factory('DocumentFactory', ['ags', 'serverFactory', 'AddFeatureOptionsFactory', 'DeleteOptionsFactory', '$cacheFactory', function(ags, serverFactory, AddFeatureOptionsFactory, DeleteOptionsFactory, $cacheFactory){
      //Creates cache to store touch documents
      var cache = $cacheFactory('docId');
      var utils = ['WATER', 'SEWER', 'REUSE', 'STORM'];
      //TODO move out of factory make all layer ids shared resources
      var layerId = 4;
      function cleanForPost (dirty){
        var dirtyData = [{attributes: dirty}];
        var clean = angular.toJson(dirtyData);
        return clean;
      }

      function removeEmptyFields (data) {
          for (var a in data){
            if(data[a] ===  undefined){
              delete data[a];
            }
            data[a] = data[a] === 'false' ? 0 : data[a] === 'true' ? 1 : data[a];
          }
          return data
      }
      //Options constructor
      var Document = function (data){
        this.data = {
          PROJECTNAME: data.PROJECTNAME,
          PROJECTID: data.PROJECTID,
          DOCID: data.DOCID || 0,
          WATER: data.WATER || 0,
          SEWER: data.SEWER || 0,
          REUSE: data.REUSE || 0,
          STORM: data.STORM || 0,
          FORMERNAME: data.FORMERNAME || undefined,
          ALIAS: data.ALIAS || undefined,
          DEVPLANID: data.DEVPLANID,
          STREET_1: data.STREET_1 || undefined,
          STREET_2: data.STREET_2 || undefined,
          STREET_3: data.STREET_3 || undefined,
          STREET_4: data.STREET_4 || undefined,
          NOTES: data.NOTES || undefined,
          TAGS: data.TAGS || undefined,
          ENGID: data.ENGID || undefined,
          DOCTYPEID: data.DOCTYPEID || undefined,
          SHEETTYPEID: data.SHEETTYPEID || undefined
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
          var that = this;
          var copy = {};
          angular.copy(that.data, copy);
          copy = removeEmptyFields(copy);
            var options = {
                layer: 'RPUD.PTK_DOCUMENTS',
                actions: 'addFeatures',
                params: {
                  f: 'json',
                  features: [{attributes: copy}]
                }
              };

          serverFactory.pt_fs.request(options)
            .then(function(data){
              if (data.error){
                console.log(data.error);
              }
              else{
                cache.put('newId', data.addResults[0].objectId);
                that.setValue({OBJECTID: data.addResults[0].objectId});
                console.log(cache.get('newId'));
              }
            },
            function(err){
              console.log(err);
            })
        },
        updateDoc: function (){
          //Removes faslsy values
          for (var _k in this.data){
            this.data[_k] ? this.data : delete this.data[_k];
          }
          console.log('Updated: ' + this.data.OBJECTID);
          var options = new AddFeatureOptionsFactory({features: cleanForPost(this.data)});
          ags.testActions.actions.update.params = options.getOptions();
          ags.updateDocument.update().$promise.then(function(data){
            console.log(data);
            // cache.put('updateId', data.updateResults[0].objectId);
          });
        },
        deleteDoc: function (){
          var options = new DeleteOptionsFactory(this.data);
          console.log('Deleted: ' + this.data.objectIds);
          ags.testActions.actions.delete.params = options.getOptions();
          ags.deleteFeatures.delete().$promise.then(function(data){
            console.log(data);
          });
        }
      }
      return (Document);
    }]);
