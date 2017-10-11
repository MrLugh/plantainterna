angular.module('myApp').component('rack', {
	bindings: { element: '<' },
  templateUrl:  'components/rack/rack.html',
  controller:  'RackCtrl'
}).
directive('rackDibujo', ['$timeout', function ($timeout) {
	return {
		templateUrl:  'components/rack/rack-dibujo.html',
	  restrict: 'E',
	  link: function ($scope, element, attrs) {

	  	var elementUi = null;
	  	var elementUiId = 'rack-draw';

			var resize = function() {
			  var realToCSSPixels = window.devicePixelRatio;

			 	elementUi.removeAttribute('width');
			 	elementUi.removeAttribute('height');
			 	angular.element(elementUi).css('width','');
			 	angular.element(elementUi).css('height','');

			  var displayWidth  = Math.floor(elementUi.clientWidth  * realToCSSPixels);
			  var displayHeight = Math.floor(elementUi.clientHeight * realToCSSPixels);

			  if (elementUi.width  !== displayWidth || elementUi.height !== displayHeight) {
			    elementUi.width  = displayWidth;
			    elementUi.height = displayHeight;
			  }
			}

	  	var init = function() {
	  		try {
	  			resize();
	  			RackDraw.setActiveElementCallback($scope.setActiveElement);
		  		RackDraw.setRack($scope.$ctrl.element);
		  		RackDraw.setElementUiId(elementUiId);
		  		RackDraw.init();
		  	} catch(e) {
		  		alert("RackDraw Error: " + e.message);
		  	}
	  	}

	  	$scope.setActiveElement = function(object) {
	  		$scope.$apply(function(){
	  			$scope.$root.getEdificiosSv().setActiveElement(object);
	  		})
	  	}

			$scope.$watch('$ctrl.element',function(){
		  	$timeout(function(){
		  		elementUi = document.getElementById(elementUiId);
		  		init();
		  	},50);
	  	},true);

	  	$scope.$watch('cromoPanelModel.maximized',function(){
		  	$timeout(function(){
		  		resize();
		  		RackDraw.resize();
		  	},80);
	  	});

	  	$scope.$watch('panelGetMaxHeight()',function(){
	  		if ($scope.panelGetMaxHeight && $scope.panelGetMaxHeight()) {
			  	$timeout(function(){
			  		resize();
			  		RackDraw.resize();
			  	},80);	  			
	  		}
	  	});

			$scope.controls = {
				isOpen:false,
				pan:false,
				zoom:false
			};

	  	$scope.toogleControl = function(key) {

	  		if (!$scope.controls.hasOwnProperty(key)) {
	  			return;
	  		}

	  		$scope.controls[key] = !$scope.controls[key];

	  		RackDraw.toogleControl(key, $scope.controls[key]);
	  	};

	  }
	};
}]);