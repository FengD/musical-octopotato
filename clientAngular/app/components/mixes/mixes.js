angular.module('octopotato')

    .controller('MixesCtrl', ['$scope', '$location', 'mixPreviews', 'mixService', function ($scope, $location, tracks, mixService) {
        $scope.mixPreviews = tracks;

        $scope.like = function(mix){
            mix.likes++;
            mixService.updateMix(mix).then(
                function(){
                    console.log("like");
                },function(){
                    console.error("Can't like");
                    mix.likes -= 1;
                }
            )
        };

        $scope.play = function(mix){
            mix.plays++;
            mixService.updateMix(mix).then(
                function(){
                    console.log("like");
                },function(){
                    console.error("Can't play");
                    mix.plays -= 1;
                }
            )
        };

        $scope.remix = function (mix) {
            mix.author = $scope.nickname;
            mixService.postMix(mix).then(
                function (res) {
                    $location.path('/mixes/' + mix.author + '/' + mix.title);
                }, function (err) {
                    console.error(err);
                    alert(JSON.stringify(err));
                }
            );
        };

        $scope.deleteMix = function deleteMix(mix) {
            mixService.deleteMix(mix.author, mix.title);
            console.log($scope).then(
                function (result) {
                    for (var i = 0; i < $scope.mixPreviews.length; ++i) {
                        if ($scope.mixPreviews[i] == mix) {
                            $scope.mixPreviews.splice(i, 1);
                            return
                        }
                    }
                }, function (err) {
                    console.error(err);
                    alert(JSON.stringify(err));
                });

        }


    }]);
