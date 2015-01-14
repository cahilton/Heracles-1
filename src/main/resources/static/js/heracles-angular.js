// initialize angular
(function() {
    angular.module('Heracles', []).controller('CohortExplorerCtrl', function($scope, $http) {
    	$scope.showCohort = function(datum) {
  		  $http.get('/data/sample-cohort-explorer.json')
  	       .then(function(res){
  	          $scope.cohort = res.data;                
  	        });
    	}
    });
}());