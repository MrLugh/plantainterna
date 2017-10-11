angular.module('myApp')
.controller('SalaCtrl', ['$scope', function($scope) {

	$scope.halls = [];

	$scope.createPositions = function(fila) {
		var positions = [];

		var countPositions = $scope.$ctrl.element.posiciones + ($scope.$ctrl.element.pasilloVertical != -1 ? 1 : 0);

		for (var idxPosition = 1; idxPosition <= countPositions;  idxPosition++) {
			var rack = fila.racks.find(function(rack){
				return rack.posicion == idxPosition
			});

			var position = {
				index:idxPosition-1,
				type:'Hueco'
			}

			if (rack) {
				position.type = 'Rack';
				position.rack = rack;
			} else if (idxPosition == $scope.$ctrl.element.pasilloVertical) {
				position.type = 'PasilloVertical';
			}

			positions.push(position);
		}
		return positions;
	}

	$scope.createHalls = function() {
		$scope.halls = [];
		var counterFila = 1;
		var counterLibre = 1;
		var idxHall = 1;

		for (; idxHall <= $scope.$ctrl.element.filas.length * 2; idxHall++) {
			if (idxHall % 2 != 0) {
				$scope.halls.push({
					index:idxHall,
					number:counterLibre,
					type:'Pasillo'
				});
				counterLibre++;
				continue;
			}

			$scope.halls.push({
				index:idxHall,
				number:counterFila,
				type:'Fila',
				fila:$scope.$ctrl.element.filas[counterFila-1],
				positions:$scope.createPositions($scope.$ctrl.element.filas[counterFila-1])
			});

			counterFila++;
		}

		$scope.halls.push({
			index:idxHall,
			number:counterLibre,
			type:'Pasillo'
		});

	}

	$scope.getHallStyle = function() {
		if (!$scope.panelGetMaxHeight) {
			return {}
		};

		var height = $scope.panelGetMaxHeight() / ($scope.$ctrl.element.filas.length * 2 + 1);

		return {
			'height':height+'px',
			'line-height':height+'px'
		}
	}

	$scope.$watch('$ctrl.element',function(element){
		if ($scope.$ctrl.element && $scope.panelGetMaxHeight && $scope.panelGetMaxHeight()) {
			$scope.createHalls();
			$scope.$root.getEdificiosSv().setActiveElement($scope.$ctrl.element);
		}
	},true);

	$scope.$watch('panelGetMaxHeight()',function(value){
		if ($scope.$ctrl.element && $scope.panelGetMaxHeight && $scope.panelGetMaxHeight()) {
			$scope.createHalls();
		}
	});
	
}]);