angular.module('octopotato')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/detail', {
                templateUrl: 'components/detail/trackDetail.html',
                controller: 'Lien1Ctrl'
            })
            .when('/login', {
                templateUrl: 'components/login/login.html'
            })
            .when('/tracks', {
                templateUrl: 'components/tracks/tracks.html',
                controller: 'TrackItemCtrl',
                resolve: {
                    tracks: ['$http', function($http){
                        return $http.get('./api/tracks.json')
                            .then(function(response){
                                console.log(response.data);
                                return response.data;
                            });
                    }]
                }
            }).when('/tracks/:id', {
                templateUrl: 'components/detail/trackDetail.html',
                controller: 'Lien1Ctrl',
                resolve: {
                    track: ['$http', '$route', function($http, $route){
                        var ressourcePath = './api/track_' + $route.current.params.id + '.json';
                        console.log("Resolving " + ressourcePath);
                        return $http.get(ressourcePath)
                            .then(function(response){
                                return response.data;
                            });
                    }]
                }
            })
            .otherwise({
                redirectTo: '/tracks'
            });
    }]);