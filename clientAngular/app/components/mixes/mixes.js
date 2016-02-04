angular.module('octopotato')
    .controller('MixesCtrl', ['$scope', 'mixPreviews', function($scope,previews){
        $scope.mixPreviews = previews;
    }]);
