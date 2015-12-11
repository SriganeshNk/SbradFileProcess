'use strict';

angular.module('incIndexApp')
    .controller('IndexCtrl', function ($scope, $http, $q) {

        $scope.files = [];
        $scope.fileQueue = 0;
        $scope.isIndexing = false;

        $scope.getFiles = function() {
            $http.get('/api/files/getFiles')
                .success(
                function(result) {
                    var parsedResponse = JSON.parse(result);
                    console.log("Get Files POSITIVE RESPONSE ");
                    for (var i = 0; i < parsedResponse.length; i++) {
                        console.log("Is Success: " + parsedResponse[i].indexed + "\n" + parsedResponse[i]);
                        $scope.files.push({name: parsedResponse[i].name, size: parsedResponse[i].size, mtime: parsedResponse[i].time,
                            isTransforming: false, isSuccess: parsedResponse[i].indexed, isError: false})
                    }
                    $scope.fileQueue = $scope.files.length;
                })
                .error(
                function(result) {
                    console.log("Get Files ERROR RECEIVED " + result );
                });
        };

        $scope.index = function(item){
            item.isTransforming = true;
            console.log("Index File called");
            var deferred = $q.defer();
            $http.post('/api/files/indexFile', item)
                .success(
                function(result) {
                    item.isTransforming = false;
                    item.isSuccess = true;
                    item.isError = false;
                    deferred.resolve({
                        status : result.status
                    });
                    console.log("Indexing done!");
                })
                .error(
                function(result){
                    item.isSuccess = false;
                    item.isError = true;
                    item.isTransforming = false;
                    deferred.reject(result);
                    console.log("Error in Indexing the data: " + result);
                });
            return deferred.promise;
        };

        $scope.indexAll = function(){
            $scope.files.forEach(function(t){
                $scope.isIndexing = true;
                $scope.index(t).then(
                    function(result){
                        console.log("Indexed " + result);
                    },
                    function(error) {
                        console.log("Something went wrong with the indexing. " + error);
                    }
                );
            });
        };

        $scope.getNotIndexedItems = function(){
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
