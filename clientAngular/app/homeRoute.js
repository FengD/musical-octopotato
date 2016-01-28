angular.module('octopotato')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/detail', {
                templateUrl: 'components/detail/lien1.html',
                controller: 'Lien1Ctrl'
            })
            .when('/login', {
                templateUrl: 'components/login/lien2.html'
            })
            .when('/tracks', {
                templateUrl: 'components/tracks/tracks.html',
                controller: 'TrackItemCtrl'
            })
            .otherwise({
                redirectTo: '/tracks'
            });
    }]);