"use strict";

class MixService {

    constructor($http, $q){
        this._$http = $http;
        this._$q = $q;
        this.serviceUrl = "http://localhost:8081/" + "mixes/";
    }

    getMixes() {
        let deferred = this._$q.defer();
        this._$http.get(this.serviceUrl)
            .success(data => deferred.resolve(data))
            .error(err => deferred.reject(err));
        return deferred.promise;
    }

    getMixesByAuthor(author) {
        let deferred = this._$q.defer();
        this._$http.get(this.serviceUrl + author)
            .success(data => deferred.resolve(data))
            .error(err => deferred.reject(err));
        return deferred.promise;
    }


    getMix(author, mixName) {
        let requestUrl = this.serviceUrl + author + '/' + mixName,
            deferred = this._$q.defer();

        this._$http.get(requestUrl)
            .success(data => deferred.resolve(data[0]))
            .error(err => deferred.reject(err));

        return deferred.promise;
    }

    postMix(mixData) {
        let deferred = this._$q.defer();
        this._$http.post(this.serviceUrl, mixData )
            .success(data => deferred.resolve(data))
            .error(err => deferred.reject(err));
        return deferred.promise;
    }

    deleteMix(author, mixName) {
        let deferred = this._$q.defer();
        this._$http.delete(this.serviceUrl + author + '/' + mixName)
            .success(data => deferred.resolve(data))
            .error(err => deferred.reject(err));
        return deferred.promise;
    }
}

angular.module('octopotato')
    .service('mixService', function($http, $q){
        return new MixService($http, $q)
    });