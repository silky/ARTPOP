'use strict';

angular.module('artpopApp')
  .controller('TodosCtrl', function ($scope,$rootScope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $rootScope.needStats = true;
  });