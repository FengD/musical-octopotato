angular.module('octopotato')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/lien1', {
                templateUrl: 'components/lien1/lien1.html',
                controller: 'Lien1Ctrl'
            })
            .when('/lien2', {
                templateUrl: 'components/lien2/lien2.html',
                controller: 'Lien2trl'
            })
            .when('/tracks', {
                templateUrl: 'components/tracks/tracks.html',
                controller: 'TrackItemCtrl'
            })
            .otherwise({
                redirectTo: '/tracks'
            });
    }]);