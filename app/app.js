'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngAnimate',
  'ngMaterial',
  'ngSanitize',
  'ngMessages',
  'ui.router',
  'myApp.version',
  'ncy-angular-breadcrumb'
]).
config(function($urlRouterProvider,$stateProvider) {
  // An array of state definitions
  var states = [
    { 
      name: 'edificios',
      cache: false,
      url: '/edificios', 
      component: 'edificios',
      resolve: {
        data: function(EdificiosSv) {
          return EdificiosSv.getAll();
        }
      },
      ncyBreadcrumb:{
        label:'Edificios'
      }
    },
    
    { 
      name: 'edificios.edificio', 
      cache: false,
      url: '/{edificioId}', 
      component: 'edificio',
      resolve: {
        element: function(data, $stateParams) {
          var response = null;
          data.edificios.forEach(function(edificio){
            if (edificio.id == $stateParams.edificioId) {
              response = edificio;
            }
          });
          return response;
        }
      },
      ncyBreadcrumb:{
        label:'Edificio'
      }
    },

    { 
      name: 'edificios.edificio.sala', 
      cache: false,
      url: '/pisos/{pisoId}/salas/{salaId}',
      component: 'sala',
      resolve: {
        element: function(data, element, $stateParams) {
          var response = null;
          element.pisos.forEach(function(piso){
            if (piso.id == $stateParams.pisoId) {
              piso.salas.forEach(function(sala){
                if (sala.id == $stateParams.salaId) {
                  response = sala;
                }
              })
            }
          });
          return response;
        }
      },
      ncyBreadcrumb:{
        label:'Piso, Sala'
      }
    },

    { 
      name: 'edificios.edificio.sala.rack',
      cache: false,
      url: '/filas/{filaId}/racks/{rackId}',
      component: 'rack',
      resolve: {
        element: function(data, element, $stateParams) {
          var response = null;
          element.filas.forEach(function(fila){
            if (fila.id == $stateParams.filaId) {
              fila.racks.forEach(function(rack){
                if (rack.id == $stateParams.rackId) {
                  response = rack;
                }
              })
            }
          });
          return response;
        }
      },
      ncyBreadcrumb:{
        label:'Rack'
      }
    }

  ];
  
  // Loop over the state definitions and register them
  states.forEach(function(state) {
    $stateProvider.state(state);
  });

  $urlRouterProvider.otherwise('/edificios');

}).
config(function($mdIconProvider) {
  $mdIconProvider.fontSet('md', 'material-icons');
}).
config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('deep-purple')
    .warnPalette('teal');

  $mdThemingProvider.theme('dark')
    .primaryPalette('grey')
    .accentPalette('brown')
    .warnPalette('blue-grey');

  $mdThemingProvider.theme('light')
    .primaryPalette('teal')
    .accentPalette('brown')
    .warnPalette('indigo');

  
  // This is the absolutely vital part, without this, changes will not cascade down through the DOM.
  $mdThemingProvider.alwaysWatchTheme(true);
}).
config(function($breadcrumbProvider) {
  $breadcrumbProvider.setOptions({
    templateUrl: 'components/edificios/breadcrumb.html'
  });
}).
run(function($rootScope, EdificiosSv){
  $rootScope.EdificiosSv = EdificiosSv;
  $rootScope.getEdificiosSv = function() {
    return $rootScope.EdificiosSv;
  }
})
;