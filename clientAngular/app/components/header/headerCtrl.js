'use strict';
angular.module('octopotato')
    .controller('headerCtrl',  function ($scope, $rootScope, $cookies) {

        $scope.signOut = function(){
            $rootScope.nickname = null;
            $rootScope.password = null;
            $cookies.remove('nickname');
            $cookies.remove('password');
        };
    });
