angular.module('octopotato')
    .controller('Lien1Ctrl', function($scope, $routeParams){
        $scope.trackItemPreviews = [
            {
                "title": "ut",
                "author": "dolor pariatur",
                "date": "2015-09-28T04:59:59 -02:00",
                "coverPath": "http://lorempixel.com/200/200/animals/",
                "plays": 44,
                "likes": 45,
                "comments": 40
            },
            {
                "title": "commodo",
                "author": "mollit do",
                "date": "2015-08-13T04:15:01 -02:00",
                "coverPath": "http://lorempixel.com/200/200/animals/",
                "plays": 22,
                "likes": 28,
                "comments": 91
            },
            {
                "title": "velit",
                "author": "Lorem laborum",
                "date": "2015-10-10T12:52:30 -02:00",
                "coverPath": "http://lorempixel.com/200/200/animals/",
                "plays": 13,
                "likes": 32,
                "comments": 92
            },
            {
                "title": "tempor",
                "author": "amet fugiat",
                "date": "2015-07-17T05:52:19 -02:00",
                "coverPath": "http://lorempixel.com/200/200/animals/",
                "plays": 74,
                "likes": 88,
                "comments": 99
            },
            {
                "title": "ipsum",
                "author": "consequat ad",
                "date": "2014-03-20T06:40:24 -01:00",
                "coverPath": "http://lorempixel.com/200/200/animals/",
                "plays": 37,
                "likes": 40,
                "comments": 70
            },
            {
                "title": "duis",
                "author": "elit ex",
                "date": "2015-09-23T01:36:48 -02:00",
                "coverPath": "http://lorempixel.com/200/200/animals/",
                "plays": 64,
                "likes": 65,
                "comments": 22
            },
            {
                "title": "do",
                "author": "commodo officia",
                "date": "2015-03-31T01:15:47 -02:00",
                "coverPath": "http://lorempixel.com/200/200/animals/",
                "plays": 29,
                "likes": 86,
                "comments": 82
            },
            {
                "title": "non",
                "author": "magna commodo",
                "date": "2014-09-02T05:29:11 -02:00",
                "coverPath": "http://lorempixel.com/200/200/animals/",
                "plays": 72,
                "likes": 53,
                "comments": 48
            }
        ];
        $scope.author = $routeParams.id;
    });
