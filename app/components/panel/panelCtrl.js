angular.module('myApp')
.controller('CromoPanelCtrl', ['$scope','$timeout', '$mdDialog', '$interval', function($scope, $timeout, $mdDialog, $interval) {

	$scope.cromoPanelModel = {
		maximized:false,
		search:""
	};

	var originatorEv;
	$scope.openPanelMenu = function($mdMenu, ev) {
    originatorEv = ev;
    $mdMenu.open(ev);
  };

	$scope.toggle = function() {
		$scope.cromoPanelModel.maximized = !$scope.cromoPanelModel.maximized;
		if ($scope.cromoPanelModel.maximized && $scope.$ctrl.element) {
			$scope.$root.getEdificiosSv().setActiveElement($scope.$ctrl.element);
		}
	}

	$scope.close = function() {
		$scope.cromoPanelModel.maximized = false;
	}

	$scope.getCromoPanelStyle = function() {
		var width = 'auto';
		if ($scope.cromoPanelModel.maximized && $scope.$root.getEdificiosSv().panelElement().isOpen()) {
			var selector =  '[md-component-id="' + $scope.$root.getEdificiosSv().panelElementId() + '"]';
			width = 'calc(100% - '+ document.querySelector(selector).clientWidth +'px)';
		} else if ($scope.cromoPanelModel.maximized) {
			width = '100%';
		}

		return {
			width: width
		}
	}


}]);