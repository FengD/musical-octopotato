'use strict';
angular.module('octopotato')
    .controller('Lien_Ctrl',  ['$scope',  function ($scope) {

        $scope.init = function () {
            $scope.logout = false;
            $scope.login = true;
            $scope.register = true;
            $scope.loginForm = false;
            $scope.loginButton = false;
        }

        $scope.showSignUp = function () {
            $scope.loginForm = true;
            $scope.loginButton = false;
        }

        $scope.signUp = function () {

        }

    }]);
