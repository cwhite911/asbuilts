'use strict';

angular.module('asbuiltsApp')
  .directive('documentForm', ['ags','OptionsFactory', 'DocumentFactory', 'StreetSearch', '$timeout', '$filter', '$http', function (ags, OptionsFactory, DocumentFactory, StreetSearch, $timeout, $filter, $http) {
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
                  //Sets all edit states to false
                  data.edit = false;
                  //Checks if file currently exisits
                  checkUpload(data.attributes.PROJECTID + '-' + data.attributes.DOCTYPEID + '-' + data.attributes.DOCID + '.pdf').then(function(res){
                    data.upload = res.data;
                    data.upload.isSuccess = false;
                  },
                  function (error){
                    console.log(error);
                  });
                  //Sets boolean values for utility options
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
          scope.streets = [];
          var newSearch = StreetSearch.autoFill(typed);
            newSearch.then(function(res){
              var street;

                for (var s in res.features){
                  street = res.features[s].attributes.CARTONAME;
                  if (scope.streets.indexOf(street) === -1 && scope.streets.length < 5){
                    scope.streets.push(street);
                  }
                }
                
              }, function (error){
                  console.log(error);
              });


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
          // scope.addDoc = false;
          scope.newDocument = new DocumentFactory({
            PROJECTNAME: scope.project[0].attributes.PROJECTNAME,
            PROJECTID: scope.project[0].attributes.PROJECTID,
            DEVPLANID: scope.project[0].attributes.DEVPLANID,
            DOCID: scope.project[scope.project.length - 1].attributes.DOCID + 1
          });

          //POSTS new document to AGS server
          scope.newDocument.postNewDoc();
          scope.newDoc = scope.newDocument.getData();
          scope.project.push({attributes: scope.newDoc, edit: false});
          // scope.addDoc = true;
        };


        //Post data to server
        scope.post = function(data){
          //Sets updated values
          scope.updateDocument = new DocumentFactory(data).setValue(data);
          //Updates document on server
          scope.updateDocument.updateDoc();
        };

        scope.delete = function (index, data){
          //Prepares for delete
          scope.deleteDocument = new DocumentFactory(data).setValue(data);
          //Deletes document form server
          scope.deleteDocument.deleteDoc();
          //Deletes document object from array
          scope.project.splice(index, 1);
        };

        function checkUpload (filename){
          var config = {
            params: {
              filename: filename
            }
          };
          return $http.get('http://localhost:9080/upload', config);
        }


      }
    };
  }
]);
