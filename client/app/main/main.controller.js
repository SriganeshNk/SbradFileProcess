'use strict';

angular.module('incIndexApp')
  .controller('MainCtrl', function ($scope, $http, $log, socket, uiUploader) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.btn_remove = function(file) {
      $log.info('deleting=' + file);
      uiUploader.removeFile(file);
    };
    $scope.btn_clean = function() {
      uiUploader.removeAll();
    };
    $scope.btn_upload = function() {
      $log.info('uploading...');
      uiUploader.startUpload({
        url: 'http://realtica.org/ng-uploader/demo.html',
        concurrency: 2,
        onProgress: function(file) {
          $log.info(file.name + '=' + file.humanSize);
          $scope.$apply();
        },
        onCompleted: function(file, response) {
          $log.info(file + 'response' + response);
        }
      });
    };
    $scope.files = [];
    var element = document.getElementById('file1');
    element.addEventListener('change', function(e) {
      var files = e.target.files;
      uiUploader.addFiles(files);
      $scope.files = uiUploader.getFiles();
      $scope.$apply();
    });

  });
