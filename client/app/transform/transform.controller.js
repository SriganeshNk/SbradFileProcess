'use strict';

angular.module('incIndexApp')
    .controller('TransformCtrl', function ($scope, $http, $q, $log, socket) {

        $scope.files = [];
        $scope.fileQueue = 0;
        $scope.isTransforming = false;

        $scope.getFiles = function() {
            $http.get('/api/files/getFiles')
                .success(
                function(result) {
                    var parsedResponse = JSON.parse(result);
                    console.log("Get Files POSITIVE RESPONSE ");
                    for (var i = 0; i < parsedResponse.length; i++) {
                        $scope.files.push({name: parsedResponse[i].name, size: parsedResponse[i].size,
                            isTransforming: false, isSuccess: false, isError: false})
                    }
                    $scope.fileQueue = $scope.files.length;
                })
                .error(
                function(result) {
                    console.log("Get Files ERROR RECEIVED " + result );
                });
        };

        $scope.transform = function(item){
            item.isTransforming = true;
            console.log("Transform File called");
            var deferred = $q.defer();
            $http.post('/api/files/transformFile', item)
                .success(
                function(result) {
                    item.isTransforming = false;
                    item.isSuccess = true;
                    item.isError = false;
                    deferred.resolve({
                        status : result.status
                    });
                    console.log("Transformation done!");
                })
                .error(
                function(result){
                    item.isSuccess = false;
                    item.isError = true;
                    item.isTransforming = false;
                    deferred.reject(result);
                    console.log("Error in transforming the data: " + result);
                });
            return deferred.promise;
        };

        $scope.remove = function(item){
            $http.post('/api/files/deleteFile', item.name)
                .success(
                function(result){
                    var parsedResponse = JSON.parse(result);
                    if (parsedResponse.status == 'OK') {
                        $scope.getFiles();
                    }
                })
                .error(
                function(result){
                    console.log("Error while removing file " + result);
                });
        };

        $scope.transformAll = function(){
            $scope.files.forEach(function(t){
                var deferred = $q.defer();
                $scope.isTransforming = true;
                $scope.transform(t);
            }).then(function(result){
                $scope.isTransforming = false;
                console.log("Finished Transforming all the files " + result);
            });
        };

        $scope.removeAll = function() {
            $scope.files.forEach($scope.remove(t));
        };

        $scope.getNotTransformedItems = function(){
            var temp =[];
            $scope.files.forEach(function(t){
                if (!t.isSuccess){
                    temp.push(t);
                }
            });
            return temp;
        };

        $scope.$watch('files',
            function watchQueue(newVal, oldVal){
                console.log("WATCH CALLED" + newVal);
               $scope.fileQueue = newVal.length;
            }
        );

        $scope.getFiles();

    });
