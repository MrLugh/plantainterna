angular.module('myApp')
.controller('RackCtrl', ['$scope', '$mdDialog', function($scope, $mdDialog) {

	$scope.positions = [];

	$scope.createPositions = function() {
		$scope.positions = [];
		for (var idxPosition = $scope.$ctrl.element.ocupacion.disponibles - 1; idxPosition >= 0; idxPosition--) {
			var equipo = $scope.$ctrl.element.equipos.find(function(equipo){
				return equipo.posicionInicio <= idxPosition && equipo.posicionFin >= idxPosition;
			});

			var position = {
				index:idxPosition,
				type: equipo ? 'Equipo': 'Libre'
			}

			if (equipo) {
				position['equipo'] = equipo;
			}

			$scope.positions.push(position);
		}
	}

	$scope.$watch('$ctrl.element',function(element){
		if ($scope.$ctrl.element) {
			$scope.createPositions();
			$scope.$root.getEdificiosSv().setActiveElement($scope.$ctrl.element);
		}
	},true);

	$scope.formCreateUi = function(ev) {
    $mdDialog.show({
      controller: 'EquipoFormCtrl',
      templateUrl: 'components/equipo/form.dialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      locals:{
      	rack: $scope.$ctrl.element
      }
    })
    .then(function(equipo) {
    	$scope.$ctrl.element.ocupacion.ocupados += (equipo.posicionFin - equipo.posicionInicio) + 1;
    	$scope.$ctrl.element.ocupacion.libres = $scope.$ctrl.element.ocupacion.disponibles - $scope.$ctrl.element.ocupacion.ocupados;
    	$scope.$ctrl.element.equipos.push(equipo);

      $scope.$root.getEdificiosSv().updateModel($scope.$ctrl.element, 'disponibles', $scope.$ctrl.element.ocupacion.disponibles);
      $scope.$root.getEdificiosSv().updateModel($scope.$ctrl.element, 'ocupados', $scope.$ctrl.element.ocupacion.ocupados);
      $scope.$root.getEdificiosSv().updateModel($scope.$ctrl.element, 'libres', $scope.$ctrl.element.ocupacion.libres);

    }, function() {
     	
    });
	}

}]);