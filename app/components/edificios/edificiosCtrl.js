angular.module('myApp')
.controller('EdificiosCtrl', ['$scope', '$sce','$timeout', '$mdSidenav', '$stateParams', function($scope, $sce, $timeout, $mdSidenav, $stateParams) {

	var panelFiltersId = 'busqueda';

	$scope.toggleBusqueda = function() {
    $mdSidenav(panelFiltersId).toggle();
  };
	
	$scope.openBusqueda = function() {
		$mdSidenav(panelFiltersId).open();
	}
	$scope.closeBusqueda = function() {
		$mdSidenav(panelFiltersId).close();
	}
	$scope.isOpenBusqueda = function() {
		return $mdSidenav(panelFiltersId).isOpen();
	}

	$scope.atributos = {
		search:''
	}

	$scope.search = {
		value:'',
		searching:false,
		results:null,
		entities:{
			value:'',
			results:[]
		}
	}

	$scope.$watch('$root.getEdificiosSv().getActiveElement()',function(){
		$scope.atributos.search = '';
		if ($scope.$root.getEdificiosSv().getActiveElement()) {
			$timeout(function(){
				$scope.$root.getEdificiosSv().panelElementOpen();
			},0);
		} else {
			$scope.$root.getEdificiosSv().panelElementClose();
		}
	});

	$scope.getContentStyle = function() {
		var width = '100%';
		if ($scope.$root.getEdificiosSv().panelElement().isOpen()) {
			var selector =  '[md-component-id="' + $scope.$root.getEdificiosSv().panelElementId() + '"]';
			width = 'calc(100% - '+ document.querySelector(selector).clientWidth +'px)';
		}

		return {
			width: width
		}
	}

	$scope.$watch('search.value',function(){
		$scope.search.results = null;
		$scope.search.searching = false;
	});

	$scope.createResults = function() {
		$scope.search.results = null;

		if ($scope.search.value.length && !$scope.search.searching) {
			$scope.search.searching = true;
			$scope.$root.getEdificiosSv().searchElementsBy($scope.search.value, $scope.search.entities.results).then(function(results){
				$scope.search.results = results;
				$scope.search.searching = false;
			});

		}
	}

	$scope.getResultHtml = function(value, search) {
		value = value+"";
		search = search+"";
		if (!search.length) {
			return value;
		}
		var regexL = new RegExp(search.toLowerCase(), 'g');
		var regexU = new RegExp(search.toUpperCase(), 'g');
		return $sce.trustAsHtml(value
			.replace(regexU,"<mark>"+search.toUpperCase()+"</mark>")
			.replace(regexL,"<mark>"+search.toLowerCase()+"</mark>")
		);
	}


}]);