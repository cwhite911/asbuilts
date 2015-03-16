
'use strict';

angular.module('asbuiltsApp')
  .factory('AuthService',['$http', 'Session', '$cookieStore', '$window', function ($http, Session, $cookieStore, $window) {
  var authService = {};
  authService.login = function (credentials) {
    return $http
    .post('http://localhost:8000/login', credentials)
    .then(function (res) {
      Session.create(res.data.id, res.data.user.id,
        res.data.user.role);
        $window.location.href = 'http://localhost:9000/#/map';
        return res.data.user;
      },
      function (err){
        console.log(err);
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
  }])
