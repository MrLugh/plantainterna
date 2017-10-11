var RackDraw = (function () {

	var rack;
	var elementUiId;
	var scale;
	var elementUi;
	var container, width, height;
	var side = 1; // 1:Front, 0:Back
	var activeElementCallback;

	var config = {
		'server':{
			width:1824
		},
		'position':{
			width:1824,
			height:168
		},
		'platform':{
			size:60,
			radius:24
		}
	};

	var zoom = true;

	toogleControl = function(key, value) {

		if (key == 'pan') {
			if (value) {
				elementUi.panZoom({zoomMin:0.01});
			} else {
				elementUi.panZoom(false);
			}
		}
	}

	setActiveElementCallback = function(callback) {
		activeElementCallback = callback;
	}

	setRack = function(rackObj) {
		rack = rackObj;
	}

	setElementUiId = function(id) {
		elementUiId = id;
		container = document.getElementById(elementUiId);
	}

	resize = function() {
		elementUi.size(container.clientWidth, container.clientHeight);
		elementUi.viewbox(0, 0, width, height);
	}

	init = function() {

		if (!rack) {
			throw new Error("RackDraw necesita un objeto rack!");
			return;
		}

		if (!elementUiId) {
			throw new Error("RackDraw necesita un id elemento contenedor!");
			return;
		}

		if (!container) {
			throw new Error("RackDraw necesita un elemento contenedor!");
			return;
		}		

		width = config.server.width;
		height = config.position.height * rack.ocupacion.disponibles;

		elementUi = SVG(elementUiId)
			.size(container.clientWidth, container.clientHeight)
		elementUi.viewbox(0, 0, width, height)
		elementUi.clear();

		draw();
	}

	/* Drawing */

	draw = function() {

		var cabinet = elementUi.group();

		elementUi.viewbox(0, 0, width, height);

		cabinet
			.rect(width, height)
			.fill('none')
			.stroke({width:1, color:'#000'});

		var i = 1;
		while(i <= rack.ocupacion.disponibles) {

			var machine = rack.equipos.find(function(equipo){
				return equipo.posicionInicio == i
			});

			var group = cabinet.group()
				.stroke({width:1, color:'#000'});

			if (machine) {
				drawMachine(group,machine);
				i = machine.posicionFin + 1;
				if (typeof activeElementCallback == 'function') {
					group.attr({cursor:'pointer'});
					group.click((function(machine){
						return function() {
							activeElementCallback(machine);
						}
					})(machine));
				}
			} else {
				drawEmptyPosition(group,i);
				i++;
			}
			cabinet.add(group);
			
		}

		elementUi.add(cabinet);
	}

	drawPositionIndicator = function(group, index, x, y) {
		var size = config.platform.size * 2;

		group.plain('U ' + index )
			.font({
				size:size,
				fill:'grey',
				stroke:'none'
			})
			.move(x, y - size * 0.5);
	}

	drawRailEmpty = function(group,x,y) {
		group
			.rect(config.platform.size, config.position.height)
			.move(x, y)
			.fill('#e3e3e3');

		var cx = x + config.platform.size * 0.5 - config.platform.radius * 0.5;

		var circleTop = group
			.circle(config.platform.radius)
			.move(cx, y + config.platform.radius * 0.5)
			.fill('#fff');

		var circleMiddle = circleTop
			.clone()
			.move(
				cx,
				y + config.position.height * 0.5 - config.platform.radius * 0.5
			);
		var circleBottom = circleTop
			.clone()
			.move(
				cx,
				y + config.position.height - config.platform.radius * 1.5
			);
	}

	drawRailBusy = function(group,x,y) {
		var cx = x + config.platform.size * 0.5 - config.platform.radius * 0.5;

		var containerTop = group
			.rect(config.platform.radius * 1.5, config.platform.radius * 1.5)
			.radius(4)
			.move(
				cx - config.platform.radius * 0.25,
				y + config.position.height * 0.5 - config.platform.radius * 0.75
			)
			.fill('#e3e3e3')
			.stroke({width:3, color:'grey', linecap:'round'});
		var circleTop = group
			.circle(config.platform.radius)
			.move(
				cx,
				y + config.position.height * 0.5 - config.platform.radius * 0.5
			)
			.fill('none')
			.stroke({width:3, color:'grey'});
		var lineHTop = group
			.line(
				cx + config.platform.radius * 0.5,
				y + config.position.height * 0.5 - config.platform.radius * 0.25,
				cx + config.platform.radius * 0.5,
				y + config.position.height * 0.5 + config.platform.radius * 0.25
			)
			.stroke({width:3, color:'grey', linecap:'round'});
		var lineVTop = group
			.line(
				cx + config.platform.radius * 0.25,
				y + config.position.height * 0.5,
				cx + config.platform.radius * 0.75,
				y + config.position.height * 0.5
			)
			.stroke({width:3, color:'grey', linecap:'round'});
	}


	drawEmptyPosition = function(group, index) {
		var y = index * config.position.height;
		var h = config.position.height;

		drawRailEmpty(group, 0, y);

		group
			.rect(config.position.width - config.platform.size * 2, h)
			.move(config.platform.size, y)
			.fill('#f1f1f1');

		drawRailEmpty(group, config.server.width - config.platform.size, y);

		drawPositionIndicator(
			group,
			index,
			config.platform.size,
			index * config.position.height + config.position.height * 0.5
		);
	}

	/* Machine types */

	drawMachineServer = function(group, machine, y, h) {

	}

	drawMachineDbms = function(group, machine, y, h) {


	}

	drawMachineStorage = function(group, machine, y, h) {

	}

	drawMachineArray = function(group, machine, y, h) {

	}

	drawMachineKvm = function(group, machine, y, h) {

	}

	drawMachinePdu = function(group, machine, y, h) {

	}

	drawMachineSwitch = function(group, machine, y, h) {

	}

	drawMachineType = function(group, machine, y, h) {

		var fontColor = '';

		switch(machine.tipo) {
			case 'server':
				drawMachineServer(group, machine, y, h);
				fontColor = '#e91e63';
				break;
			case 'dbms':
				drawMachineDbms(group, machine, y, h);
				fontColor = 'orange';
				break;
			case 'storage':
				drawMachineStorage(group, machine, y, h);
				fontColor = '#03a9f4';
				break;
			case 'array':
				drawMachineArray(group, machine, y, h);
				fontColor = '#ffeb3b';
				break;
			case 'kvm':
				drawMachineKvm(group, machine, y, h);
				fontColor = '#4caf50';
				break;
			case 'pdu':
				drawMachinePdu(group, machine, y, h);
				fontColor = 'red';
				break;
			case 'switch':
				drawMachineSwitch(group, machine, y, h);
				fontColor = '#9e9e9e';
				break;
			default:
				throw new Error('No hay dibujo disponible para el tipo de equipo '+machine.tipo);
		}

		var name = machine.tipo + ' ' + machine.mnemonico;
		var pW = config.position.width;
		var pH = h;

		group
			.rect(pW, pH)
			.move(0, y)
			.fill('#374046')
			.stroke('white');

		var size = 120;

		group
			.plain(name.toUpperCase())
			.font({
				size:size,
				anchor:'middle',
				fill:fontColor,
				stroke:'none'
			})
			.move(
				config.position.width * 0.5,
				y + h * 0.5 - size * 0.5
			);
			
	}

	drawMachine = function(group,machine) {
		var y = machine.posicionInicio * config.position.height;
		var positions =  machine.posicionFin - machine.posicionInicio;
		var h = (positions ? positions + 1 :1) * config.position.height;

		drawMachineType(group, machine, y, h);

		for (var i = machine.posicionInicio; i <= machine.posicionFin; i++) {
			drawPositionIndicator(group, i, config.platform.size, i * config.position.height + config.position.height * 0.5);
			drawRailBusy(group, 0, i * config.position.height);
			drawRailBusy(group, config.server.width - config.platform.size, i * config.position.height);
		}			
	}

	/* Closure exposed methods */

	return {
		init:init,
		setActiveElementCallback:setActiveElementCallback,
		setRack:setRack,
		setElementUiId:setElementUiId,
		resize:resize,
		toogleControl:toogleControl
	}

})();