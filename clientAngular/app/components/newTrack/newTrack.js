/**
 * Created by tom on 07/02/16.
 */
angular.module('octopotato')
    .directive('newTrack', function($http){


        return {
            restrict: 'EA',
            replace: true,
            transclude: false,
            templateUrl: "./components/newTrack/newTrack.html",
            controller: function($scope){
                console.log($scope.track.tracks);

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
                    //var xhr = new XMLHttpRequest();
                    //xhr.open('GET', 'http://localhost:8082/uploads');
                    //
                    //xhr.onload = function (e, rep) {
                    //    var images = JSON.parse(this.response);
                        for (var i = 0; i < res.length; i++) {
                            //        var img = document.createElement("img");
                            //        img.src = "http://localhost:8082/uploads/" + images[i];
                            //        img.width = 100;
                            //        document.body.appendChild(img);
                            //    }
                            //};
                            //xhr.send();
                            console.log("http://localhost:8082/uploads/" + res[i]);
                            scope.track.tracks.push(
                                {
                                    "trackPath" : "http://localhost:8082/uploads/" + res[i]
                                }
                            );
                        }
                    scope.$apply();
                }


                var testBtn = element.find("button")[0];




            }
        };


    });