
'use strict';

angular.module('asbuiltsApp')
  .factory('AuthService', function ($http, Session, $cookieStore) {
  var authService = {};
  authService.login = function (credentials) {
    return $http
    .post('http://localhost:8000/login', credentials)
    .then(function (res) {
      console.log(res);
      Session.create(res.data.id, res.data.user.id,
        res.data.user.role);
        return res.data.user;
      });
    };

    authService.isAuthenticated = function () {
      return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    return authService;
  })
