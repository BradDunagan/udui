
'use strict';

//  app/partials/udui/udui-button-e.js

module.exports = (function() { 

	var d3 = 		require ( 'd3' );
	var uc = 		require ( './udui-common.js' );
	var uCD = 		require ( './udui-control-data-a.js' );
	var uBoards = 	require ( './udui-boards-a.js' );

	var serviceId = 'uduiButtonE';

	/* jshint validthis: true */

	var svc = {};

	function textX ( d ) {
		switch ( d.textAnchor ) {
			case 'start': 	return 2; 
			case 'middle': 	return d.w / 2; 
			case 'end': 	return d.w - 2; 
		}
		return d.w / 2;
	}	//	textX()

	function click ( d, i, ele ) {
		var sW = serviceId + ' ' + ' click()';
		event.stopPropagation();
		if ( event.altKey ) {
			console.log ( sW + ':  d.name: ' + d.name + '  altKey' );
			return;
		}
		if ( event.shiftKey && uc.isFunction ( d.shiftClickCB ) ) {
			d.shiftClickCB ( d );
			return;
		}
		if ( d.cb ) {
			console.log ( sW + ':  d.name: ' + d.name + '  callback ...' );
			d.cb();
		}
		else
			console.log ( sW + ':  d.name: ' + d.name );
	}	//	click()


	function moved ( d, i, ele, x, y ) {
		var sW = serviceId + ' moved()';
		console.log ( sW + ' d.name: ' + d.name + '   x y: ' + x + ' ' + y );
		d3.select ( ele.parentNode )
			.attr ( 'transform', function ( d, i ) { 
				return 'translate(' + (d.x = x) + ',' + (d.y = y) + ')'; 
			} );
		d.parentPanel.updateSclrs();
	}	//	moved()

	function sized ( d, i, ele, dx, dy ) {
		var sW = serviceId + ' sized()';
	//	console.log ( sW + ' d.name: ' + d.name + '   dx y: ' + dx + ' ' + dy );
		var g = d3.select ( ele.parentNode );
		sized2 ( d, g, dx, dy );
	}	//	sized()

	function sized2 ( d, g, dx, dy ) {
		d.w += dx;
		d.h += dy;
		g.select ( '#' + d.eleId + '-rect' )
			.attr ( 'width',  function ( d, i ) { return d.w; } )
			.attr ( 'height', function ( d, i ) { return d.h; } );
		g.select ( '#' + d.eleId + '-text' )
		//	.attr ( 'x',      function ( d, i ) { return  d.w / 2; } )
			.attr ( 'x',      textX )
			.attr ( 'y',      function ( d, i ) { return (d.h - 4 + d.fs) / 2 ; } );
		g.select ( '#' + d.eleId + '-size' )
			.attr ( 'x',      function ( d, i ) { return d.w - uc.SIZE_HANDLE_WIDTH;  } )
			.attr ( 'y',      function ( d, i ) { return d.h - uc.SIZE_HANDLE_HEIGHT; } );
		d3.select ( '#cp-' + d.eleId + '-rect' )
			.attr ( 'width',  function ( d, i ) { return d.w += dx; } )
			.attr ( 'height', function ( d, i ) { return d.h += dy; } );
		d.parentPanel.updateSclrs();
	}	//	sized2()

	function Button ( data ) {
		this.data = data;
	}

//	Button.prototype.showPropertiesBoard = function ( title ) {
//		var sW = serviceId + ' Button.prototype.showPropertiesBoard()';
//		uBoards.showPropertiesBoard ( { sC: 		sW,
//										uduiId: 	uc.ROOT_UDUI_ID, 
//									//	forPanel: 	panelData.panel } );
//										ofCtrlD: 	this.data,
//										title: 		title } );
//	};	//	showPropertiesBoard()

	function ButtonData ( o ) {
	//	o.x += uc.OFFS_4_1_PIX_LINE;
	//	o.y += uc.OFFS_4_1_PIX_LINE;

		//	Initialize the "base" of this object, ControlData -
		o.type      = uc.TYPE_BUTTON;
	//	o.class     = o.class     === undefined ? 'u34-button' : o.class;			2017-Aug 	obsolete?
		o.hasBorder = o.hasBorder === undefined ? true         : o.hasBorder;
		uCD.callControlData ( this, o );

		//	Initialize the rest of this object -
		this.text = o.text;
		this.cb           = uc.isFunction ( o.cb )           ? o.cb           : null;
		this.shiftClickCB = uc.isFunction ( o.shiftClickCB ) ? o.shiftClickCB : null;
		this.ff   = 'verdana';				//	font family
		this.fs   = uc.isNumber ( o.fontSize ) ? o.fontSize : 10;				//	font size, pixels
		this.classText = 'u34-button-text';

		//	2017-Aug 	These  * were *  set by the class, above, u34-button.
		this.backgroundColor = uc.isString ( o.backgroundColor ) ? o.backgroundColor : 'white';
		this.borderColor     = uc.isString ( o.borderColor ) ? o.borderColor : 'gray';
		this.borderWidth     = uc.isString ( o.borderWidth ) ? o.borderWidth : '1px';

		//	2017-Aug 	More options.
		this.bMoveRect  = uc.isBoolean ( o.bMoveRect ) ? o.bMoveRect : true;
		this.bSizeRect  = uc.isBoolean ( o.bSizeRect ) ? o.bSizeRect : true;
		this.textAnchor = 'middle';
		if ( uc.isString ( o.horzAlign ) )
			switch ( o.horzAlign ) {
				case 'left': 	this.textAnchor = 'start';		break;
				case 'middle': 	this.textAnchor = 'middle';		break;
				case 'right': 	this.textAnchor = 'end';		break;
			}

		//	Override some "base" properties -
		this.onSize  = sized;
		this.onSize2 = sized2;
		this.onMove  = moved;

	}	//	ButtonData()

//	ButtonData.prototype = uCD.newControlData();
//	ButtonData.prototype.constructor = ButtonData;
//	See svc.createButtonData().

//	ButtonData.prototype.listProperties = function() {		//	called by showPropertiesBoard() 
	function ButtonData_listProperties() {
		var sW = serviceId + ' ButtonData.prototype.listProperties()';
		var whiteList = [ 'text', 'ff', 'fs' ];
		var value, displayName, props = uCD.listProperties ( this );
		for ( var key in this ) {
			if ( ! whiteList.includes ( key ) )
				continue;
			value = this[key];
			if ( value === undefined )
				continue;
			if ( value === null )
				continue;
			displayName = key;
			switch ( key ) {
				case 'ff': 			displayName = 'font';			break;
				case 'fs': 			displayName = 'font size';		break;
			}
			console.log ( sW + '   key: ' + key + '  value: ' + value );
			props.push ( { property: key, value: value, displayName: displayName } );
		}
		return props;
	}	//	ButtonData.prototype.listProperties()

//	ButtonData.prototype.setProperty = function ( name, value ) {
	function ButtonData_setProperty ( name, value ) {
		var sW = serviceId + ' ButtonData.prototype.setProperty()';
		var n, g, rtn;
		rtn = uCD.setProperty ( this, name, value );
		if ( rtn )
			return rtn;
		if ( name === 'text' ) {
			this[name] = value;
			g = d3.select ( '#' + this.eleId + '-text' );
			g.text ( value );
		}
		if ( name === 'ff' ) {
			this[name] = value;
			g = d3.select ( '#' + this.eleId + '-text' );
			g.attr ( 'style', function ( d, i ) { return 'font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;'; } );
		}
		if ( name === 'fs' ) {
		//	this[name] = parseFloat ( value );
			n = Number ( value );
			if ( n !== n ) 					//	Good Grief!  ... testing for NaN ...	got'a love JS :(	
				return;
			this[name] = n;
			g = d3.select ( '#' + this.eleId + '-text' );
			g.attr ( 'style', function ( d, i ) { return 'font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;'; } );
		}
	}	//	ButtonData.prototype.setProperty()

	svc.createButtonData = function ( o ) {

		if ( ButtonData.prototype.constructor.name === 'ButtonData' ) {
			//	Do this once, here to avoid cir ref issue
			ButtonData.prototype = uCD.newControlData();
			ButtonData.prototype.constructor = ButtonData;
			ButtonData.prototype.listProperties = ButtonData_listProperties;
			ButtonData.prototype.setProperty = ButtonData_setProperty;
		}

		return new ButtonData ( o );
	};	//	svc.createButtonData()


	svc.defineButton = function ( panel ) {
		var sW = serviceId + ' defineButton()';
	
		var button = null;
		var s = panel.data.base.selectAll ( '#' + panel.data.eleId + '-base' + ' > g' );
	//	console.log ( sW + '  s length: ' + s._groups[0].length );

		var ctrlEles = s
			.data ( panel.data.childData.data, function ( d ) { 
					return d.id || (d.id = ++panel.data.childData.nextId); 
			} )
			.enter()
			.each ( function ( d ) { 
	//			console.log ( 'defineButton() - g - new data: ' + d.name + '  x y: ' + d.x + ' ' + d.y ); 
				button = new Button ( d );
			} )
			.append ( 'g' )
			.attr ( 'id',        function ( d, i ) { return d.eleId; } )
			//	group has no x, y - must transform -
			.attr ( 'transform', function ( d, i ) { return 'translate(' + d.x + ',' + d.y + ')'; } );

		ctrlEles
			.on ( 'mouseover', uCD.mouseover )
			.on ( 'mouseout',  uCD.mouseleave )
			.on ( 'mousemove', uCD.mousemove )
			.on ( 'mousedown', uCD.mousedown )
			.on ( 'mouseup',   uCD.mouseup )
			.on ( 'click',     click );

		ctrlEles.append ( 'rect' )
			.attr ( 'id',           function ( d, i ) { return d.eleId + '-rect'; } )
			.attr ( 'width',        function ( d, i ) { return d.w; } )
			.attr ( 'height',       function ( d, i ) { return d.h; } )
		//	.attr ( 'class',        function ( d, i ) { return d.class; } );
			.attr ( 'fill',         function ( d, i ) { return d.backgroundColor; } )
			.attr ( 'stroke',       function ( d, i ) { return d.borderColor; } )
			.attr ( 'stroke-width', function ( d, i ) { return d.borderWidth; } );

		ctrlEles.append ( 'text' )
			.attr ( 'id',          function ( d, i ) { return d.eleId + '-text'; } )
		//	.attr ( 'text-anchor', function ( d, i ) { return 'middle'; } )		2017-Aug
			.attr ( 'text-anchor', function ( d, i ) { return d.textAnchor; } )
		//	.attr ( 'x',           function ( d, i ) { 
		//		switch ( d.textAnchor ) {
		//			case 'start': 	return 2; 
		//			case 'middle': 	return d.w / 2; 
		//			case 'end': 	return d.w - 2; 
		//		}
		//	} )
			.attr ( 'x',           textX )
			.attr ( 'y',           function ( d, i ) { return (d.h -   4 + d.fs) / 2 ; } )
			.attr ( 'style',       function ( d, i ) { return 'font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;'; } )
			.attr ( 'class',       function ( d, i ) { return d.classText; } )
			.attr ( 'clip-path',   function ( d, i ) { return 'url(#cp-' + d.eleId + ')'; } )
			.text (                function ( d, i ) { return d.text; } );

	//	ctrlEles.append ( 'rect' )		//	size handle - invisible until mouse is over
		ctrlEles.each ( function ( d ) {	
			if ( ! d.bSizeRect ) 
				return;
		d3.select ( this )			
			.append ( 'rect' )			//	size handle - invisible until mouse is over
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-size'; } )
			.attr ( 'x',      function ( d, i ) { return d.w - uc.SIZE_HANDLE_WIDTH; } )
			.attr ( 'y',      function ( d, i ) { return d.h - uc.SIZE_HANDLE_HEIGHT; } )
			.attr ( 'width',  function ( d, i ) { return uc.SIZE_HANDLE_WIDTH; } )
			.attr ( 'height', function ( d, i ) { return uc.SIZE_HANDLE_HEIGHT; } )
			.attr ( 'class',  function ( d, i ) { return 'u34-size-handle-transparent'; } )
			.on ( 'mouseover', uCD.mouseoverSize )
			.on ( 'mouseout',  uCD.mouseleaveSize )
			.on ( 'mousedown', uCD.mousedownSize );
		} );

	//	ctrlEles.append ( 'rect' )		//	move handle - invisible until mouse is over
		ctrlEles.each ( function ( d ) {	
			if ( ! d.bMoveRect ) 
				return;
		d3.select ( this )			
			.append ( 'rect' )			//	move handle - invisible until mouse is over
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-move'; } )
			.attr ( 'x',      0 )
			.attr ( 'y',      0 )
			.attr ( 'width',  uc.MOVE_HANDLE_WIDTH )
			.attr ( 'height', uc.MOVE_HANDLE_HEIGHT )
			.attr ( 'class',  'u34-move-handle-transparent' )
			.on ( 'mouseover', uCD.mouseoverMove )
			.on ( 'mouseout',  uCD.mouseleaveMove )
			.on ( 'mousedown', uCD.mousedownMove );
		} );

		return button;
	};	//	svc.defineButton()

	return svc;

})();
