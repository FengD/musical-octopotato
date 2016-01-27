angular.module('octopotato')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './templates/home.html'
            })
            .when('/lien1', {
                templateUrl: './components/lien1/lien1.html',
                controller: 'Lien1Ctrl'
            })
            .when('/lien2', {
                templateUrl: './components/lien2/lien2.html',
                controller: 'Lien2Ctrl'
            })
            .when('/login', {
                templateUrl: 'components/login/lien2.html'
            })
            .when('/tracks', {
                templateUrl: './components/tracks/tracks.html',
                controller: 'TrackItemCtrl',
                resolve: {
                    tracks: ['$http', function($http){
                        return [];
                        //$http.get('./api/tracks.json')
                        //    .then(function(response){
                        //        console.log(response.data);
                        //        return response.data;
                        //    });
                    }]
                }
            }).when('/tracks/:id', {
                templateUrl: 'components/detail/lien1.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);