angular.module('myApp').
directive('restrictFullHeight', ['$timeout', function ($timeout) {
	return {
	  restrict: 'A',
	  link: function ($scope, element, attrs) {
	  	
	  	element.addClass('transparent');

	  	$scope.panelGetMaxHeight = function() {
	  		return window.innerHeight - element[0].offsetTop;
	  	}

	  	var resize = function() {
			 	element.css('height','');
			 	element.css('max-height','');
	  		element.css('max-height', $scope.panelGetMaxHeight() + 'px');
	  		element.css('height', '100%');

	  		if ($scope.panelGetMaxHeight) {
	  			element.removeClass('transparent');
	  		}
	  	}

	  	$timeout(function(){
	  		resize();
	  	},0);

	  	window.addEventListener('resize',function(){
		  	$timeout(function(){
		  		resize();	
		  	},0);
	  	});

	  }
	};
}]).
directive('mdJustified', [ function () {
  return {
    restrict : 'A',
    compile : function(element, attrs)  {
      var layoutDirection = 'layout-'+ (attrs.mdJustified || "row");

      element.removeAttr('md-justified');
      element.addClass(layoutDirection);
      element.addClass("layout-align-space-between-stretch");

      return angular.noop;
    }
  };
}]);