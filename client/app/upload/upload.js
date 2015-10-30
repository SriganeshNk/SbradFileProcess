'use strict';

angular.module('incIndexApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/upload', {
        templateUrl: 'app/upload/upload.html',
        controller: 'UploadCtrl'
      });
  });