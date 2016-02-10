'use strict';
angular.module('octopotato')
    .controller('loginCtrl',  function ($scope, $cookies, $http, $window, $location, $rootScope) {
        $scope.panel = true;

        $scope.init = function () {
        };

        $scope.signUp = function(){
            $http({
                method: 'POST',
                url: 'http://localhost:8080/users',
                data: {
                    "uid": $scope.nickname,
                    "pwd": $scope.password
                }
            }).then(function successCallback(success) {
                    //coucou soloe
                console.log(success);
                $scope.panel = true;
            }, function errorCallback(error) {
                console.log("error");
                console.log(error);
            });
        };

       $scope.signIn = function(){
            $http({
                method: 'POST',
                url: 'http://localhost:8080/users/' + $scope.nickname,
                data: {
                    pwd: $scope.password
                }
            }).then(function successCallback(success) {
                console.log(success);
                var now = new $window.Date(),
                // this will set the expiration to 6 months
                exp = new $window.Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
                $cookies.put('nickname', $scope.nickname, {expires: exp});
                $cookies.put('password', $scope.password, {expires: exp});
                $rootScope.nickname = $scope.nickname;
                $rootScope.password = $scope.password;
                $location.path('/track');

            }, function errorCallback(error) {
                console.log("error");
                console.log(error);
            });
        };

        $scope.signOut = function(){
            $http({
                method: 'POST',
                url: 'http://localhost:8080/users/' + $scope.nickname,
                data: {
                    pwd: $scope.password
                }
            }).then(function successCallback(success) {
                console.log(success);
                var now = new $window.Date(),
                // this will set the expiration to 6 months
                exp = new $window.Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
                $cookies.put('nickname', $scope.nickname, {expires: exp});
                $cookies.put('password', $scope.password, {expires: exp});
            }, function errorCallback(error) {
                console.log("error");
                console.log(error);
            });
        };
    });
