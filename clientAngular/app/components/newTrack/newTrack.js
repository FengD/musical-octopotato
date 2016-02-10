angular.module('octopotato')
    .directive('newTrack', function($http){


        return {
            restrict: 'EA',
            replace: true,
            transclude: false,
            templateUrl: "./components/newTrack/newTrack.html",
            controller: function($scope){

            },

            link: function (scope, element, attrs, ctrl) {

                var fileInput = element.find("input")[0];
                var progress = element.find("progress")[0];

                fileInput.onchange = function() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', 'http://localhost:8082/api/file');

                    xhr.upload.onprogress = function(e) {
                        progress.value = e.loaded;
                        progress.max = e.total;
                    };

                    xhr.onload = function(res){

                        var res = JSON.parse(this.response);
                        handleNewFiles(res);
                    };

                    var form = new FormData();
                    for(var i=0; i < fileInput.files.length; i++)
                        form.append('file', fileInput.files[i]);

                    xhr.send(form);

                };



                function handleNewFiles(res) {
                        for (var i = 0; i < res.length; i++) {
                            var name = "http://localhost:8082/uploads/" + res[i];
                            scope.track.tracks.push(
                                {
                                    "name" : name,
                                    "trackPath" : name
                                }
                            );
                        }
                    scope.$apply();
                }
            }
        };


    });