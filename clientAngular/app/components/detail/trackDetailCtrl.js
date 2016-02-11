angular.module('octopotato')
    .controller('trackDetailCtrl', function($scope, $location, track, mixService, cfpLoadingBar){

        $scope.start = function() {
            cfpLoadingBar.start();
        };

        $scope.complete = function () {
            cfpLoadingBar.complete();
        };

        $scope.remix = function () {
            var newAuthor = $scope.nickname,
                newMix, redirectUrl;
            if (newAuthor == $scope.track.author) {
                console.error("Same author");
                return
            }

            newMix = $scope.track;
            newMix.author = $scope.nickname;

            console.log(newMix);

            mixService.postMix(newMix).then(
                function(res){
                    redirectUrl = '/mixes/'+ $scope.nickname + '/' + newMix.title;
                    console.log(redirectUrl);
                    $location.path(redirectUrl);
                }, function error(err) {
                    console.error(err);
                }
            );
        };
        $scope.track = track;

    });
