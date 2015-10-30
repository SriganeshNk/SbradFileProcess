'use strict';

angular.module('incIndexApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/index', {
        templateUrl: 'app/index/index.html',
        controller: 'IndexCtrl'
      });
  });