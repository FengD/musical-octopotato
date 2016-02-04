angular.module('octopotato')

    .controller('MixesCtrl', ['$scope', 'mixPreviews', function($scope,tracks){
        $scope.mixPreviews = tracks;

    }]);
