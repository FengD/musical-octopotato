angular.module('octopotato')
    .controller('trackDetailCtrl', function($scope, track){
        //$scope.trackName = $routeParams.id;
        console.log(track);
        $scope.track = track;
    });
