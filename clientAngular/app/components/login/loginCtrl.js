'use strict';
angular.module('octopotato')
    .controller('Lien_Ctrl',  ['$scope',  function ($scope) {

        $scope.init = function () {
        };

        $scope.showSignUp = function () {
            $scope.loginForm = true;
            $scope.loginButton = false;
        };

        $scope.signUp = function () {

        };

        $scope.signIn = function(){
            console.log("signed in !");
        };

    }]);
