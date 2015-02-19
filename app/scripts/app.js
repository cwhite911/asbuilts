'use strict';

/**
 * @ngdoc overview
 * @name asbuiltsApp
 * @description
 * # asbuiltsApp
 *
 * Main module of the application.
 */
angular
  .module('asbuiltsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'autocomplete',
    'agsserver',
    'leaflet-directive',
    'ngDragDrop',
    'angularFileUpload',
    'ngActivityIndicator'
  ])
  .value('projectConstants', {
    version: 0.1,
    documentBaseUrl: 'http://gis.raleighnc.gov/asbuilts/PROJECT_TRACKING/'
  })
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
  })
  .config(['$routeProvider', '$httpProvider', '$activityIndicatorProvider', function ($routeProvider, $httpProvider, $activityIndicatorProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/map'
      })
      .when('/addDocument', {
        templateUrl: 'views/addDoc.html',
        controller: 'addDocCtrl'
      })
      .when('/instructions', {
        templateUrl: 'views/instructions.html'
      })
      .when('/form', {
        templateUrl: 'views/form.html',
        controller: 'FormCtrl'
      })
      .when('/stats', {
        templateUrl: 'views/stats.html',
        controller: 'StatsCtrl'
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl'
      })
      .when('/project/:projectid', {
        templateUrl: 'views/project.html',
        controller: 'projectCtrl'
      })
      .when('/document/:documentid', {
        templateUrl: 'views/documents.html',
        controller: 'DocCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/error', {
        templateUrl: '404.html'
      })
      .otherwise({
        redirectTo: '/error'
      });

      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      $activityIndicatorProvider.setActivityIndicatorStyle('CircledWhite');
  }]);
