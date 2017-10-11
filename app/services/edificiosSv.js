angular.module('myApp').service('EdificiosSv', ['$http', '$filter', '$mdSidenav', function($http, $filter, $mdSidenav) {
  var service = {
    activeElement:null,
    panelElementId: function() {
      return 'elemento'
    },
    panelElement: function() {
      return $mdSidenav(service.panelElementId());
    },
    panelElementOpen: function() {
      $mdSidenav(service.panelElementId()).open()
    },
    panelElementClose: function() {
      $mdSidenav(service.panelElementId()).close();
      service.setActiveElement(null);
    },
    panelElementToggle: function() {
      $mdSidenav(service.panelElementId()).toggle()
    },
    panelElementShowBy: function(element) {
      service.panelElementOpen();
      service.setActiveElement(element);
    },

    getAll: function() {
      return $http.get('data/data.json', { cache: false }).then(function(resp) {
        return resp.data;
      });
    },

    setActiveElement: function(element) {
      service.activeElement = element;
    },
    getActiveElement: function() {
      return service.activeElement;
    },

    entities: ['edificio', 'piso', 'sala', 'fila', 'rack', 'equipo'],
    getEntities: function() {
      return service.entities;
    },
    searchElementsBy: function(pattern, entityNames) {

      var match = function(keys, element, input) {
        for (var x = 0; x < keys.length ; x++) {
          var value = (''+element[keys[x]]).toLowerCase();
          var filter = (''+input).toLowerCase();
          if (value.indexOf(filter) != -1) {
            return true;
          }
        }
        return false;
      };

      var canMatch = function(entidad) {
        return !entityNames.length || entityNames.indexOf(entidad) != -1
      }

      return service.getAll().then(function(resp){
        var results = [];
        entityNames = entityNames || [];

        var edificioKeys = ['nombre','direccion'];
        resp.edificios.forEach(function(edificio){

          if (canMatch('edificio') && match(edificioKeys, edificio, pattern)) {
            results.push({
              label:'Edificio: '
                +edificio.nombre,
              route:'edificios.edificio',
              params:{edificioId:edificio.id},
              sref:'edificios.edificio({edificioId: '
                +edificio.id+'})'
            });
          }

          var pisoKeys = ['nombre'];
          edificio.pisos.forEach(function(piso){

            if (canMatch('piso') && match(pisoKeys, piso, pattern)) {
              results.push({
                label:'Edificio: '
                  +edificio.nombre+', Piso: '
                  +piso.nombre,
                route:'edificios.edificio',
                params:{edificioId:edificio.id},
                sref:'edificios.edificio({edificioId: '
                  +edificio.id+'})'
              });

            }

            var salaKeys = ['nombre'];
            piso.salas.forEach(function(sala){

              if (canMatch('sala') && match(salaKeys, sala, pattern)) {
                results.push({
                  label:'Edificio: '
                    +edificio.nombre+', Piso: '
                    +piso.nombre+', Sala: '
                    +sala.nombre,
                  route:'edificios.edificio.sala',
                  params:{
                    edificioId:edificio.id,
                    pisoId:piso.id,
                    salaId:sala.id
                  },
                  sref:'edificios.edificio.sala({edificioId: '
                    +edificio.id+', pisoId: '
                    +piso.id+', salaId: '
                    +sala.id+'})'
                });
              }

              var filakeys = ['nombre'];
              sala.filas.forEach(function(fila){

                if (canMatch('fila') && match(filakeys, fila, pattern)) {
                  results.push({
                    label:'Edificio: '
                      +edificio.nombre+', Piso: '
                      +piso.nombre+', Sala: '
                      +sala.nombre+', Fila: '
                      +fila.nombre,
                    route:'edificios.edificio.sala',
                    params:{
                      edificioId:edificio.id,
                      pisoId:piso.id,
                      salaId:sala.id
                    },
                    sref:'edificios.edificio.sala({edificioId: '
                      +edificio.id+', pisoId: '
                      +piso.id+', salaId: '
                      +sala.id+'})'
                  });
                }

                var rackKeys = ['nombre', 'marca', 'modelo'];
                fila.racks.forEach(function(rack){

                  if (canMatch('rack') && match(rackKeys, rack, pattern)) {
                    results.push({
                      label:'Edificio: '
                        +edificio.nombre+', Piso: '
                        +piso.nombre+', Sala: '
                        +sala.nombre+', Fila: '
                        +fila.nombre+', Rack: '
                        +rack.nombre,
                      route:'edificios.edificio.sala.rack',
                      params:{
                        edificioId:edificio.id,
                        pisoId:piso.id,
                        salaId:sala.id,
                        filaId:fila.id,
                        rackId:rack.id
                      },
                      sref:'edificios.edificio.sala.rack({edificioId: '
                        +edificio.id+', pisoId: '
                        +piso.id+', salaId: '
                        +sala.id+', filaId: '
                        +fila.id+', rackId: '
                        +rack.id+'})'
                    });
                  }

                  var equipoKeys = ['nombre', 'mnemonico', 'tipo'];
                  rack.equipos.forEach(function(equipo){

                    if (canMatch('equipo') && match(equipoKeys, equipo, pattern)) {
                      results.push({
                      
                        label:'Edificio: '
                          +edificio.nombre+', Piso: '
                          +piso.nombre+', Sala: '
                          +sala.nombre+', Fila: '
                          +fila.nombre+', Rack: '
                          +rack.nombre+' Equipo: '
                          +equipo.mnemonico,
                        route:'edificios.edificio.sala.rack',
                        params:{
                          edificioId:edificio.id,
                          pisoId:piso.id,
                          salaId:sala.id,
                          filaId:fila.id,
                          rackId:rack.id,
                          equipoId:equipo.id
                        },
                        sref:'edificios.edificio.sala.rack({edificioId: '
                          +edificio.id+', pisoId: '
                          +piso.id+', salaId: '
                          +sala.id+', filaId: '
                          +fila.id+', rackId: '
                          +rack.id+'})'
                      });
                    }

                  });

                });

              });

            });

          });

        });

        return results;
      });      
    },

    updateModel: function(model,caption,value) {
      if (model.hasOwnProperty(caption)) {
        model[caption] = value;
      }

      model.atributos.forEach(function(atributo){
        if (atributo.caption == caption) {
          atributo.value = value;
        }
      });
    },

    theme:'dark',
    themes:['default', 'dark', 'light'],
    getActiveTheme: function() {
      return service.theme;
    },
    toggleTheme: function() {
      var index = service.themes.indexOf(service.theme);
      index++;
      if (index >= service.themes.length) {
        index = 0;
      }
      service.theme = service.themes[index];
    },

  }
  
  return service;
}])