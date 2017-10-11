angular.module('myApp')
.controller('EquipoFormCtrl', ['$scope', '$sce', 'rack', '$mdDialog', function($scope, $sce, rack, $mdDialog) {

	$scope.model = {
		entidad:'equipo',
		nombre:'',
		mnemonico:'',
		tipo:'',
		posicionInicio:null,
		posicionInicio:null,
		atributos:[
      {
        "caption":"id",
        "value":null
      },
      {
        "caption":"entidad",
        "value":"equipo"
      },
      {
        "caption":"nombre",
        "value":null
      },
      {
        "caption":"mnemonico",
        "value":null
      },
      {
        "caption":"tipo",
        "value":null
      },
      {
        "caption":"Posición Inicio",
        "value":null
      },
      {
        "caption":"Posición Fin",
        "value":null
      },
      {
        "caption":"Número Serie",
        "value": "0723BBC006"
      },
      {
        "caption":"Sistema Operativo",
        "value": null
      },
      {
        "caption":"Dirección IP",
        "value": "172.234.50.16"
      },
      {
        "caption":"Sistema de Gestión",
        "value": "SAP"
      },
      {
        "caption":"Backup habilitado",
        "value": (Math.random() >= 0.5) ? 1:0
      },
      {
        "caption":" Segurizado",
        "value": (Math.random() >= 0.5) ? 1:0
      },
      {
        "caption":"Grupo administrador",
        "value": "sistemas"
      }
    ],
		topologias:[]
	};

	$scope.search = {
		value:'',
		searching:false,
		results:null,
		topologias:[]
	}

	$scope.hide = function() {
	  $mdDialog.cancel();
	};

	$scope.cancel = function() {
	  $mdDialog.cancel();
	};

	$scope.save = function() {
		$scope.search.topologias.forEach(function(topology, index){
			var topology = Object.assign({label:topology.label},topology.params);
			$scope.model.topologias.push(topology);
		});
    updateModel('id', Date.now());
    updateModel('Posición Inicio', $scope.model.posicionInicio);
    updateModel('Posición Fin', $scope.model.posicionFin);
    updateModel('nombre', $scope.model.nombre);
    updateModel('mnemonico', $scope.model.mnemonico);
    updateModel('tipo', $scope.model.tipo);
	  $mdDialog.hide($scope.model);
	};

	var updateModel = function(caption,value) {
		if ($scope.model.hasOwnProperty(caption)) {
		  $scope.model[caption] = value;
		}

		$scope.model.atributos.forEach(function(atributo){
		  if (atributo.caption == caption) {
		     atributo.value = value;
		  }
		})
	}

	$scope.validate = function() {
		$scope.save();
	};

	$scope.getTipoEquipos = function() {
		$scope.$root.getEdificiosSv().getAll().then(function(data){
			$scope.tipos = data.tipoEquipos;
		});
	};
	$scope.getTipoEquipos();

	$scope.posicionesInicio = [];
	$scope.posicionesFin = [];

	$scope.createPosicionesInicio = function() {
		var posicionesInicio = [];
		var posicionesOcupadas = [];
		rack.equipos.forEach(function(equipo){
			for (var x = equipo.posicionInicio; x <= equipo.posicionFin; x++) {
				posicionesOcupadas.push(x);	
			}
		});
		for (var x = 1; x <= rack.ocupacion.disponibles; x++) {
			if (posicionesOcupadas.indexOf(x) == -1) {
				posicionesInicio.push(x);
			}
		}
		$scope.posicionesInicio = posicionesInicio.sort(function(a, b){return a - b});
		$scope.posicionesOcupadas = posicionesOcupadas.sort(function(a, b){return a - b});
	};
	$scope.createPosicionesInicio();

	$scope.createPosicionesFin = function() {
		if ($scope.model.posicionInicio === null) {
			$scope.posicionesFin = [];
			return;
		}
		var posicionesFin = [];
		for (var x = $scope.model.posicionInicio; $scope.posicionesOcupadas.indexOf(x) == -1 && x <= rack.ocupacion.disponibles;	x++) {
			posicionesFin.push(x);
		}
		$scope.posicionesFin = posicionesFin.splice(0, rack.ocupacion.libres > 4 ? 4 : rack.ocupacion.libres);
	};

	$scope.createTopologyResults = function() {
		$scope.search.results = null;

		if ($scope.search.value.length && !$scope.search.searching) {
			$scope.search.searching = true;
			$scope.$root.getEdificiosSv().searchElementsBy($scope.search.value, ['equipo']).then(function(results){
				$scope.search.results = results;
				$scope.search.searching = false;
			});

		}
	}

}]);