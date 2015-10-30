'use strict';

angular.module('incIndexApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/transform', {
        templateUrl: 'app/transform/transform.html',
        controller: 'TransformCtrl'
      });
  });