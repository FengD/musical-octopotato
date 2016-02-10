"use strict";

class UserService {

    constructor($http, $q){
        this._$http = $http;
        this._$q = $q
        this.serviceUrl = "http://localhost:8081/" + "users/";
    }

    getUsers(){
        let deferred = this._$q.defer();
        this._$http.get(this.serviceUrl)
            .success(data => deferred.resolve(data))
            .error(err => deferred.reject(err));
        return deferred.promise;
    }

    getUser(username) {
        let deferred = this._$q.defer();
        this._$http.get(this.serviceUrl + username)
            .success(data => deferred.resolve(data))
            .error(err => deferred.reject(err));
        return deferred.promise;
    }

    createUser(uName, uPassword) {
        let userData = {
            uid : uName,
            pwd : uPassword
        };
        let deferred = this._$q.defer();
        this._$http.post(this.serviceUrl, userData)
            .success(data => deferred.resolve(data))
            .error(err => deferred.reject(err));
        return deferred.promise;
    }

    login(username, password){
        let deferred = this._$q.defer();
        this._$http.post(this.serviceUrl + username, password)
            .success(data => deferred.resolve(data))
            .error(err => deferred.reject(err));
        return deferred.promise;
    }

    removeUser(username){
        let deferred = this._$q.defer();
        this._$http.delete(this.serviceUrl + username)
            .success(data => deferred.resolve(data))
            .error(err => deferred.reject(err));
        return deferred.promise;
    }
}

angular.module('octopotato')
    .service('userService', function($http, $q){
        return new UserService($http, $q)
    });