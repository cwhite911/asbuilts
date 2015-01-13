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
    url: 'http://localhost:9080/upload',
    removeAfterUpload: true,
  });

  // FILTERS

  uploader.filters.push({
    name: 'customFilter',
    fn: function(item, options) {
      var re = /[0-9]{6}-[A-Z]{2}-[0-9]*/;
      if(re.test(options.formData.newName)){
        console.log('Passed RegEx');
        return options.formData.newName;
      }
      else {
        console.log('Failed RegEx: ' + options.formData.newName);
        return false;
      }

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
    item.file.name = item.formData.newName + '.png';
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
