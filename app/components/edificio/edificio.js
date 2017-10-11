angular.module('myApp').component('edificio', {
	bindings: { element: '<' },
  templateUrl:  'components/edificio/edificio.html',
  controller:  'EdificioCtrl'
}).
directive('edificioDibujo', ['$timeout', '$state', function ($timeout, $state) {
	return {
		templateUrl:  'components/edificio/edificio-dibujo.html',
	  restrict: 'E',
	  link: function ($scope, element, attrs) {

			$scope.setActive = function(piso) {

				for (var x in $scope.selectedSala) {
					if (x != piso.id) {
						delete $scope.selectedSala[x];
					}
				}

				if ($scope.selectedSala[piso.id]) {
					$scope.$root.getEdificiosSv().setActiveElement($scope.selectedSala[piso.id]);
					$scope.cromoPanelModel.maximized = false;
					$state.go(
						'edificios.edificio.sala',
						{
							'pisoId':piso.id,
							salaId:$scope.selectedSala[piso.id].id
						}
					);
				}
			}
	  }
	};
}]);