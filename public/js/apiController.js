angular.module('showme.controllers', []).
controller('apiController', function($scope) {
	$scope.getResponseExample = function(string){
		if(string == 'updateLeaderLocation'){
			$scope.response = "Hello";	
		}else{
			$scope.response = "Error";	
		}
	}
});