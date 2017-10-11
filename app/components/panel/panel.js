angular.module('myApp').
directive('cromoPanel', ['$timeout', function ($timeout) {
	return {
		templateUrl:  'components/panel/panel.html',
		controller:  'CromoPanelCtrl',
	  restrict: 'E',
	  transclude: true,
	  link: function ($scope, element, attrs) {

	  	var container = angular.element(element[0].querySelector('.cromo-panel-container'));

	  	$scope.panelGetMaxHeight = function() {
	  		return window.innerHeight - container[0].offsetTop;
	  	}

	  	var resize = function() {

			 	container.css('height','');
			 	container.css('max-height','');

	  		container.css('max-height', $scope.panelGetMaxHeight() + 'px');
	  		if (attrs.hasOwnProperty('cromoPanelFullHeight')) {
	  			container.css('height', $scope.panelGetMaxHeight() + 'px');
	  		}
	  	}

	  	$scope.$watch('cromoPanelModel.maximized',function(){
		  	$timeout(function(){
		  		resize();	
		  	},50);
	  	});

	  	window.addEventListener('resize',function(){
		  	$timeout(function(){
		  		resize();	
		  	},0);
	  	});

	  }
	};
}]);