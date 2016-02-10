angular.module('octopotato')
    .directive('newMix', function (mixService) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: false,
            templateUrl: "./components/newMix/newMix.html",
            controller: function ($scope) {

            },

            link: function (scope, element, attrs, ctrl) {

                var mixNameInput = element.find("input")[0],
                    submitBtn = element.find("button")[0];

                mixNameInput.onchange = function (e) {
                    console.log("new Name : " + e.target.value);
                };

                submitBtn.onclick = function (e) {
                    var newMix = {
                        "title": mixNameInput.value,
                        "author": scope.nickname,
                        "date": Date.now(),
                        "coverPath": "http://lorempixel.com/200/200/animals/",
                        "tracks": [],
                        "plays": 0,
                        "likes": 0
                    };
                    mixService.postMix(newMix)
                        .then(function (smtg) {
                            scope.mixPreviews.push(newMix)
                        },function (smtg) {
                            console.log("Fail : ");
                            console.log(smtg);
                        }
                    )
                };


            }
        };


    });