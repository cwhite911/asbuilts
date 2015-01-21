'use strict';


angular.module('asbuiltsApp')


.controller('uploadCtrl', ['$scope', 'FileUploader', function($scope, FileUploader) {

  $scope.loadStatus = {
    addFile: {
      status: false,
      message: 'Please check fields file name incorrect'
    }
  };

  var uploader = $scope.uploader = new FileUploader({
    url: '/upload',
    removeAfterUpload: true,
  });

  // FILTERS

//Checks for correct naming convention
  uploader.filters.push({
    name: 'checkName',
    fn: function(item, options) {
      var re = /[0-9]{6}-[A-Z]{2}-[0-9]*/;
      if(re.test(options.formData.newName)){
        console.log('Passed RegEx');
        return options.formData.newName;
      }
      else {
        $scope.loadStatus.addFile.message = 'Invalid File Name: ' + options.formData.newName;
        console.log('Failed RegEx: ' + options.formData.newName);
        return false;
      }
    }
  });

//Check for correct file type (PDF)
  uploader.filters.push({
    name: 'checkFileType',
    fn: function(item, options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      $scope.loadStatus.addFile.message = 'Invalid File Type: ' + type + ', please select a pdf.';
      return '|pdf|PDF'.indexOf(type) !== -1;
    }
  });

  // CALLBACKS

  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
    $scope.loadStatus.addFile.status = true;
  };
  uploader.onAfterAddingFile = function(fileItem) {
    console.info('onAfterAddingFile', fileItem);
  };
  uploader.onAfterAddingAll = function(addedFileItems) {
    console.info('onAfterAddingAll', addedFileItems);
  };
  uploader.onBeforeUploadItem = function(item) {
    item.file.name = item.formData.newName + '.pdf';
    console.log(item);
    return item;
  };
  uploader.onProgressItem = function(fileItem, progress) {
    console.info('onProgressItem', fileItem, progress);
  };
  uploader.onProgressAll = function(progress) {
    console.info('onProgressAll', progress);
  };
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
    console.info('onSuccessItem', fileItem, response, status, headers);
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploader.onCancelItem = function(fileItem, response, status, headers) {
    console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploader.onCompleteItem = function(fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
  };

}]);
