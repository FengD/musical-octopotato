angular.module('octopotato')
    .controller('Lien1Ctrl', function($scope, track){
        //$scope.trackName = $routeParams.id;
        console.log(track);
        $scope.track = track;
    });
