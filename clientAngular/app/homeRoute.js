angular.module('octopotato')
    .config(['$routeProvider',  function($routeProvider) {
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
                    mixPreviews: ['mixService', function(mixService){
                        return mixService.getMixes();
                    }]
                }
            }).when('/mixes/:userId', {
                templateUrl: 'components/mixes/mixes.html',
                controller: 'MixesCtrl',
                resolve: {
                    mixPreviews: ['$route', 'mixService', function($route,mixService){
                        var user = $route.current.params.userId;
                        return mixService.getMixesByAuthor(user);
                    }]
                }
            }).when('/mixes/:authorId/:mixName', {
                templateUrl: 'components/detail/trackDetail.html',
                controller: 'trackDetailCtrl',
                resolve: {
                    track: ['$http', '$route','mixService', function($http, $route,mixService){
                        var authorId = $route.current.params.authorId,
                            mixName = $route.current.params.mixName;
                        console.log(authorId + ' - ' + mixName);
                        console.log(mixService.getMix(authorId, mixName).value);
                        return mixService.getMix(authorId,mixName);
                        //var ressourcePath = './api/mix_' + $route.current.params.id + '.json';
                        //return $http.get(ressourcePath)
                        //    .then(function(response){
                        //        return response.data;
                        //    });
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
