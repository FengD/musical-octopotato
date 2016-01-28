angular.module('octopotato')
    .controller('TrackItemCtrl', ['$scope', 'tracks', function($scope,tracks){
        $scope.trackItemPreviews = tracks;
    }]);
