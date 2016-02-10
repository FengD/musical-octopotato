"use strict";

class FileService {

    constructor($http, $q){
        this._$http = $http;
        this._$q = $q;
        this.serviceUrl = "http://localhost:8082/";
    }

    getFile(fileName){
        let deferred = this._$q.defer();
        this._$http.get(this.serviceUrl + 'uploads/' + fileName)
            .success(data => deferred.resolve(data))
            .error(err => deferred.reject(err));
        return deferred.promise;
    }


    uploadFile(file) {

        let deferred = this._$q.defer();
        this._$http.post(this.serviceUrl, file)
            .success(data => deferred.resolve(data))
            .error(err => deferred.reject(err));
        return deferred.promise;
    }

}

angular.module('octopotato')
    .service('fileService', function($http, $q){
        return new FileService($http, $q)
    });