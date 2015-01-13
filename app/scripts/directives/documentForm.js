'use strict';

angular.module('asbuiltsApp')
  .directive('documentForm', ['ags','OptionsFactory', 'DocumentFactory', 'StreetSearch', '$timeout', function (ags, OptionsFactory, DocumentFactory, StreetSearch, $timeout) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        project: '='
      },
      templateUrl: 'views/document-form.html',
      link: function (scope) {
        //Gets correct REST endpoints form ArcGIS server
        ags.testServer.getService().$promise.then(function(res){
           var layers = new ags.AgsLayers(res.layers.concat(res.tables));
           //Get Layer Ids
           var engLayerId = layers.getLayerId('RPUD.ENGINEERINGFIRM');
           var sheetLayerId = layers.getLayerId('RPUD.SHEETTYPES');
           var documentLayerId = layers.getLayerId('RPUD.DOCUMENTTYPES');
           //Get table details
           scope.supportTables = [
             {
                 name: 'engTypes',
                 id: engLayerId,
                 joinField: 'ENGID',
                 addField: 'SIMPLIFIEDNAME',
             },
             {
                 name: 'sheetTypes',
                 id: sheetLayerId,
                 joinField: 'SHEETTYPEID',
                 addField: 'SHEETTYPE',
             },
             {
                 name: 'docTypes',
                 id: documentLayerId,
                 joinField: 'DOCTYPEID',
                 addField: 'DOCUMENTTYPE',
             }
            ];

           //Watch for change of project
          scope.project = '';
          scope.refresh = function (project){
            if (project){
              scope.supportTables.forEach(function(table){
                var name = table.name;
                var options = new OptionsFactory('json', '*', '', table.addField + ' ASC', false ).addOptions('id', table.id);
                ags.features.getAll(options).$promise.then(function(d){
                  table.data = d.features;
                  ags.addFieldFromTable(project, table.data, table.joinField, table.addField);
                  switch (name){
                    case 'engTypes':
                      scope.engTypes = table.data;
                      break;
                    case 'sheetTypes':
                      scope.sheetTypes = table.data;
                      break;
                    case 'docTypes':
                      scope.docTypes = table.data;
                      break;
                    default:
                      console.log('Table not found');
                  }
                });
              });
              //Adds new key value pair to data object for edit controls and sets boolean values to text
              //Probably should make this a method of ags service
              var utils = ['WATER', 'SEWER', 'REUSE', 'STORM'];
                project.forEach(function(data){
                  data.edit = false;
                  for (var _i = 0, _len = utils.length; _i < _len; _i++){
                   data.attributes[utils[_i]] ? data.attributes[utils[_i]] = 'true' : data.attributes[utils[_i]] = 'false';
                  }
                });
            }
          };

          scope.$watchCollection('project',function(){
            //Checks if project exisits
            scope.refresh(scope.project);
            // scope.project = newVal;
          });
        });
        //Setup Boolean option for utilies options..could/should switch to service or provider
        scope.selectionOptions = {
          bool: [{'name': 'true', 'id': 1}, {'name': 'false', 'id': 0}],
        };

        //Auto fill function for street names
            scope.autoFill = function (typed) {
              scope.streets = StreetSearch.autoFill(typed);
            };
        //Starts edit session on selected table row
        scope.edit = function (doc) {
          //resets documet
          scope.project.forEach(function(data){
            data.edit = false;
          });
          //Activates editor
          doc.edit = true;
          //Turns off editor after 10 seconds
          $timeout(function(){
            doc.edit = false;
          }, 60000);
        };
        //Add new document visibility controll
        scope.addDoc = true;
        scope.add = function(){
          scope.addDoc = false;

          scope.newDocument = new DocumentFactory({
            PROJECTNAME: scope.project[0].attributes.PROJECTNAME,
            PROJECTID: scope.project[0].attributes.PROJECTID,
            DEVPLANID: scope.project[0].attributes.DEVPLANID,
            DOCID: scope.project.length + 1
          });

          //POSTS new document to AGS server
          scope.newDocument.postNewDoc();
          scope.newDoc = scope.newDocument.getData();
          console.log(scope.newDoc);
        };


        //Post data to server
        scope.post = function(data){
          //Sets updated values
          scope.updateDocument = new DocumentFactory(data).setValue(data);
          //Updates document on server
          scope.updateDocument.updateDoc();
        };

        scope.delete = function (doc, data){
          //Prepares for delete
          scope.deleteDocument = new DocumentFactory(data).setValue(data);
          //Deletes document form server
          scope.deleteDocument.deleteDoc();
          //Deletes document object from array
          console.log(scope.project);
          delete scope.project[doc];
          console.log(scope.project);
        };


        //TESTING typehead.js
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // var url = 'http://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query?text=%QUERY'
        // function getSet (array){
        //   var temp = [];
        //   for (var i = 0, x = array.length; i < x; i++){
        //     temp.indexOf(array[i]) !== -1 ? array : temp.push(array[i]);
        //   }
        //   return temp;
        // }
        // var bestPictures = new Bloodhound({
        //   datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        //   queryTokenizer: Bloodhound.tokenizers.whitespace,
        //   // prefetch: '../data/films/post_1960.json',
        //   remote: {
        //     url: url,
        //     ajax: {
        //       url: 'http://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query',
        //       dataType: 'json',
        //       data: {
        //         f: 'json',
        //         outFields: 'ADDRESS',
        //         returnGeometry: false,
        //         orderByFields: 'ADDRESS ASC'
        //       }
        //     },
        //     filter: function (res){
        //       console.log("FILTER");
        //       var streets = [];
        //       for (var s in res.features){
        //         var withNoDigits = res.features[s].attributes.ADDRESS.replace(/[0-9]/g, '');
        //         if (streets.indexOf({value: withNoDigits.trim()}) === -1){
        //           // console.log(withNoDigits);
        //           streets.push({value: withNoDigits.trim()});
        //         }
        //         else {
        //           console.log(withNoDigits.trim());
        //         }
        //       }
        //       console.log(getSet(streets));
        //       return getSet(streets);
        //     }
        //   }
        // });
        //
        // bestPictures.initialize();
        //
        // angular.element('#remote').typeahead(null, {
        //   name: 'best-pictures',
        //   displayKey: 'value',
        //   source: bestPictures.ttAdapter()
        // });
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      }
    };
  }
]);
