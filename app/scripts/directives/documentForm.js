'use strict';

angular.module('asbuiltsApp')
  .directive('documentForm', ['ags','OptionsFactory', 'DocumentFactory', function (ags, OptionsFactory, DocumentFactory) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        project: "="
      },
      templateUrl: 'views/document-form.html',
      link: function (scope) {
        //Gets correct REST endpoints form ArcGIS server
        var s = ags.testServer.getService().$promise.then(function(res){
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
          scope.$watch('project',function(){
            //Checks if project exisits
            if (scope.project){
              scope.supportTables.forEach(function(table){
                var name = table.name;
                var options = new OptionsFactory('json', '*', '', table.addField + ' ASC', false ).addOptions('id', table.id);
                ags.features.getAll(options).$promise.then(function(d){
                  table.data = d.features;
                  ags.addFieldFromTable(scope.project, table.data, table.joinField, table.addField);
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
                      console.log("Table not found");
                  }
                });
              });
              //Adds new key value pair to data object for edit controls and sets boolean values to text
              //Probably should make this a method of ags service
              var utils = ['WATER', 'SEWER', 'REUSE', 'STORM'];
                scope.project.forEach(function(data){
                  data.edit = false;
                  for (var _i = 0, _len = utils.length; _i < _len; _i++){
                   data.attributes[utils[_i]] ? data.attributes[utils[_i]] = 'true' : data.attributes[utils[_i]] = 'false';
                  }
                });
            }
          });
          // scope.$watch('engType',function(){
          //   scope.engType = scope.engType;
          // });
        });
        //Setup Boolean option for utilies options..could/should switch to service or provider
        scope.selectionOptions = {
          bool: [{'name': 'true', 'id': 1}, {'name': 'false', 'id': 0}],
        };
        //Starts edit session on selected table row
        scope.edit = function (doc) {
          //resets documet
          scope.project.forEach(function(data){
            data.edit = false;
          });
          //Activates editor
          doc.edit = true;
        };
        //Add new document visibility controll
        scope.addDoc = true;
        scope.add = function(){
          scope.addDoc = false;
          scope.newDoc = {
            PROJECTNAME: scope.project[0].attributes.PROJECTNAME,
            PROJECTID: scope.project[0].attributes.PROJECTID,
            DEVPLANID: scope.project[0].attributes.DEVPLANID,
            DOCID: scope.project.length + 1
          };

          scope.newDocument = new DocumentFactory({
            PROJECTNAME: scope.project[0].attributes.PROJECTNAME,
            PROJECTID: scope.project[0].attributes.PROJECTID,
            DEVPLANID: scope.project[0].attributes.DEVPLANID,
            DOCID: scope.project.length + 1
          });
          //POSTS new document to AGS server
          scope.newDocument.postNewDoc();
          console.log(scope.newDocument);
        };
        //Post data to server
        scope.post = function(data){
          scope.updateDocument = new DocumentFactory(data).setValue(data);
          //Updates document on server
          scope.updateDocument.updateDoc()
          console.log(scope.updateDocument);

        };
      }
    };
  }
]);
