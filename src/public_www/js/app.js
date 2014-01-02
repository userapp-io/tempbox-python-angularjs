'use strict';

var app = angular.module('tempbox', [
	'ngRoute',
	'tempbox.filters',
	'tempbox.services',
	'tempbox.directives',
	'tempbox.controllers',
	'UserApp',
	'md5',
	'ui-gravatar'
]).
config(function($routeProvider) {
	$routeProvider.when('/login', {templateUrl: 'partials/login.html', public: true, login: true});
	$routeProvider.when('/signup', {templateUrl: 'partials/signup.html', public: true});
	$routeProvider.when('/upload', {templateUrl: 'partials/upload.html', controller: UploadController});
	$routeProvider.otherwise({redirectTo: '/upload'});
})
.run(function($rootScope, user) {
	user.init({ appId: 'YOUR_APP_ID' });
});