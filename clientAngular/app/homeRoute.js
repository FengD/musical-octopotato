angular.module('octopotato')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/detail', {
                templateUrl: 'components/detail/trackDetail.html',
                controller: 'trackDetailCtrl'
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
                controller: 'trackDetailCtrl',
                resolve: {
                    track: ['$http', '$route', function($http, $route){
                        return $http.get('./api/track_' + $route.current.params.id + '.json')
                            .then(function(response){
                                console.log(response.data);
                                return response.data;
                            });
                    }]
                }
            })
            .otherwise({
                redirectTo: '/tracks'
            });
    }]);