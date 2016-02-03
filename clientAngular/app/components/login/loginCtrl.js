'use strict';
angular.module('octopotato')
    .controller('loginCtrl',  function ($scope, $http) {
        $scope.panel = false;

        $scope.init = function () {
        };

    /*    $scope.showSignUp = function () {
            $scope.signUpForm = true;
            $scope.loginButton = false;
        };  */

        $scope.login = function(){

        };

        $scope.signUp = function(){
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

        $scope.signIn = function(){

        };
    });
