'use strict';
angular.module('octopotato')
    .controller('Lien_Ctrl',  function ($scope, $http) {

        $scope.init = function () {
        };

        $scope.showSignUp = function () {
            $scope.loginForm = true;
            $scope.loginButton = false;
        };

        $scope.login = function(){

        };

        $scope.signIn = function(){
            $http({
                method: 'POST',
                url: 'http://localhost:8080/users',
                data: {
                    uid: $scope.username,
                    pwd: $scope.password
                }
            }).then(function successCallback(success) {
                console.log(success);
            }, function errorCallback(error) {
                console.log("error");
                console.log(error);
            });
        };

    });
