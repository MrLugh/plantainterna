angular.module('myApp')
.controller('EdificioCtrl', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {

	$scope.selectedSala = {};

	$scope.$watch('$ctrl.element',function(element){
		if ($scope.$ctrl.element) {
	
			if ($stateParams.hasOwnProperty('pisoId') && $stateParams.hasOwnProperty('salaId')) {
	      var selected = null;
	      $scope.$ctrl.element.pisos.forEach(function(piso){
	        if (piso.id == $stateParams.pisoId) {
	          piso.salas.forEach(function(sala){
	            if (sala.id == $stateParams.salaId) {
	              selected = sala;
	            }
	          })
	        }
	      });
				$scope.selectedSala[$stateParams.pisoId] = selected;
			}
			
			$scope.$root.getEdificiosSv().setActiveElement($scope.$ctrl.element);
		}
	},true);

	$scope.getFlexSize = function() {
		return $scope.$root.getEdificiosSv().panelElement().isOpen() ? 60 : 80
	}

}]);