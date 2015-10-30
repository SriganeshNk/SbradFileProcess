'use strict';

angular.module('incIndexApp')
    .controller('NavbarCtrl', function ($scope, $location) {
        $scope.menu = [
            {
                'title': 'Upload',
                'link': '/upload'
            },
            {
                'title':'Transform',
                'link': '/transform'
            },
            {
                'title':'Index',
                'link':'/index'
            }
        ];

        $scope.isCollapsed = true;

        $scope.isActive = function(route) {
            return route === $location.path();
        };
    });