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
            .when('/mixes', {
                templateUrl: 'components/mixes/mixes.html',
                controller: 'MixesCtrl',
                resolve: {
                    mixPreviews: ['$http', function($http){
                        return $http.get('./api/mixes.json')
                            .then(function(response){
                                return response.data;
                            });
                    }]
                }
            }).when('/mixes/:userId', {
                templateUrl: 'components/mixes/mixes.html',
                controller: 'MixesCtrl',
                resolve: {
                    mixPreviews: ['$http', function($http){
                        return $http.get('./api/user/mixes.json')
                            .then(function(response){
                                return response.data;
                            });
                    }]
                }
            }).when('/tracks/:id', {
                templateUrl: 'components/detail/trackDetail.html',
                controller: 'trackDetailCtrl',
                resolve: {
                    track: ['$http', '$route', function($http, $route){
                        var ressourcePath = './api/mix_' + $route.current.params.id + '.json';
                        return $http.get(ressourcePath)
                            .then(function(response){
                                return response.data;
                            });
                    }]
                }
            })
            .otherwise({
                redirectTo: '/mixes'
            });
    }])
.run(['$rootScope', '$location', '$cookies',
    function ($rootScope, $location, $cookies) {
      // keep user logged in after page refresh

      $rootScope.nickname = $cookies.get('nickname') || null;
      $rootScope.password = $cookies.get('password') || null;


     /* $rootScope.$on('$locationChangeStart', function () {

        // redirect to login page if not logged in
        if ($location.path() !== '/login' && $rootScope.nickname === null) {
          $location.path('/login');
        }

      });
    */
    }
  ]);
