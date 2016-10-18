var myapp = angular.module('myApp', ['ui']);

myapp.controller('myCtrl', function ($scope) {
    $scope.list = ["one", "two", "thre", "four", "five", "six"];
    $scope.addItem = function() {
    	$scope.list.push($scope.data);
    }
});

angular.bootstrap(document, ['myapp']);