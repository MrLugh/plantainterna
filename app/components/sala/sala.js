angular.module('myApp').component('sala', {
	bindings: { element: '<' },
  templateUrl:  'components/sala/sala.html',
  controller:  'SalaCtrl'
}).
directive('salaDibujo', [function () {
	return {
		templateUrl:  'components/sala/sala-dibujo.html',
	  restrict: 'E',
	  link: function ($scope, element, attrs) {

			$scope.setActiveElement = function(element) {
				$scope.$root.getEdificiosSv().setActiveElement(element);
				$scope.cromoPanelModel.maximized = false;
			}
	  }
	};
}]);