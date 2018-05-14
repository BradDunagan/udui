'use strict';

//  app/partials/udui/udui-label-b.js

//	For this b version -
//
//		Using ControlData to help with the mouse work.

module.exports = (function() { 

	var d3 = 		require ( 'd3' );
	var uc = 		require ( './udui-common.js' );
	var uCD = 		require ( './udui-control-data-a.js' );
	var uBoards = 	require ( './udui-boards-a.js' );

	var serviceId = 'uduiLabelB';

	/* jshint validthis: true */

	var svc = {};

	function mouseOver ( d, i, ele ) {
	//	console.log ( serviceId + ' mouseOver()' );
		if ( ! d.hasBorder )
			d3.select ( '#' + d.eleId + '-rect' )
				.classed ( 'u34-label', 				false )
				.classed ( 'u34-label-mouse-over',      true  );
	}	//	mouseOver()

	function mouseLeave ( d, i, ele ) {
	//	console.log ( serviceId + ' mouseLeave()' );
		if ( ! d.hasBorder )
			d3.select ( '#' + d.eleId + '-rect' )
				.classed ( 'u34-label', 				true )
				.classed ( 'u34-label-mouse-over',      false  );
	}	//	mouseLeave()

	function click ( d, i, ele ) {
		var sW = serviceId + ' click()';
		console.log ( sW );
		event.stopPropagation();
	//	if ( event.shiftKey ) {
	//
	//		//	display and set-focus-to properties dialog or panel of some type 
	//		//
	//		//	with 3 callbacks -
	//		//
	//		//		load 			//	called to load property name and value - for each property of LabelData
	//		//
	//		//		input			//	called when a property value changes
	//		//
	//		//		changes 		//	called when a property value loses focus or on Enter key
	//
	//		uBoards.showPropertiesBoard ( { sC: 		sW,
	//										uduiId:		uc.ROOT_UDUI_ID, 
	//									//	forPanel: 	panelData.panel } );
	//										ofCtrlD: 	d,
	//										title: 		'Edit Label' } );
	//	}
		if ( event.shiftKey && uc.isFunction ( d.shiftClickCB ) ) {
			d.shiftClickCB ( d );
			return;
		}
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

	function sized2 ( d, g, dx, dy ) {
		d.w += dx;
		d.h += dy;
		g.select ( '#' + d.eleId + '-rect' )
			.attr ( 'width',  function ( d, i ) { return d.w; } )
			.attr ( 'height', function ( d, i ) { return d.h; } );
	//	g.select ( '#' + d.eleId + '-text' )							instead, call d.align() below
	//		.attr ( 'x',      function ( d, i ) { return  d.w / 2; } )
	//		.attr ( 'y',      function ( d, i ) { return (d.h - 4 + d.fs) / 2 ; } );
		g.select ( '#' + d.eleId + '-size' )
			.attr ( 'x',      function ( d, i ) { return d.w - uc.SIZE_HANDLE_WIDTH;  } )
			.attr ( 'y',      function ( d, i ) { return d.h - uc.SIZE_HANDLE_HEIGHT; } );
		d3.select ( '#cp-' + d.eleId + '-rect' )
			.attr ( 'width',  function ( d, i ) { return d.w += dx; } )
			.attr ( 'height', function ( d, i ) { return d.h += dy; } );
		d.align();
		d.parentPanel.updateSclrs();
	}	//	sized2()

	function sized ( d, i, ele, dx, dy ) {
		var sW = serviceId + ' sized()';
	//	console.log ( sW + ' d.name: ' + d.name + '   dx y: ' + dx + ' ' + dy );
//		d.w += dx;
//		d.h += dy;
		var g = d3.select ( ele.parentNode );
//		g.select ( '#' + d.eleId + '-rect' )
//			.attr ( 'width',  function ( d, i ) { return d.w; } )
//			.attr ( 'height', function ( d, i ) { return d.h; } );
//	//	g.select ( '#' + d.eleId + '-text' )							instead, call d.align() below
//	//		.attr ( 'x',      function ( d, i ) { return  d.w / 2; } )
//	//		.attr ( 'y',      function ( d, i ) { return (d.h - 4 + d.fs) / 2 ; } );
//		g.select ( '#' + d.eleId + '-size' )
//			.attr ( 'x',      function ( d, i ) { return d.w - uc.SIZE_HANDLE_WIDTH;  } )
//			.attr ( 'y',      function ( d, i ) { return d.h - uc.SIZE_HANDLE_HEIGHT; } );
//		d3.select ( '#cp-' + d.eleId + '-rect' )
//			.attr ( 'width',  function ( d, i ) { return d.w += dx; } )
//			.attr ( 'height', function ( d, i ) { return d.h += dy; } );
//		d.align();
//		d.parentPanel.updateSclrs();
		sized2 ( d, g, dx, dy );
	}	//	sized()



	function Label ( data ) {
		this.data = data;
	}

	Label.prototype.align = function() {
		var d = this.data;
		d.align();
	};	//	Label.prototype.align()

	Label.prototype.updateProperties = function() {
		var d = this.data;
		var s = d3.select ( '#' + d.eleId + ' text' );
		s			
			.attr ( 'style',  function ( d, i ) { return 'font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;'; } )
			.text (           function ( d, i ) { return d.text; } );
		this.align();
	};	//	updateProperties()


	function LabelData ( o ) {
	//	o.x += uc.OFFS_4_1_PIX_LINE;
	//	o.y += uc.OFFS_4_1_PIX_LINE;

		//	Initialize the "base" of this object, ControlData -
		o.type      = uc.TYPE_LABEL;
		o.class     = o.class     === undefined ? 'u34-label' : o.class;
		o.hasBorder = o.hasBorder === undefined ? false       : o.hasBorder;
		uCD.callControlData ( this, o );

		//	Initialize the rest of this object -
		this.text = o.text;
		this.shiftClickCB = uc.isFunction ( o.shiftClickCB ) ? o.shiftClickCB : null;
		this.ff   = o.ff === undefined ? 'verdana' : o.ff;	//	font family
		this.fs   = o.fs === undefined ? 10        : o.fs;	//	font size, pixels
		this.classText = 'u34-label-text';

		this.filter = null;

		this.vertAlign = o.vertAlign === undefined ? 'middle' : o.vertAlign;	//	'top',  'middle' or 'bottom'
		this.horzAlign = o.horzAlign === undefined ? 'middle' : o.horzAlign;	//	'left', 'middle' or 'right'

		this.selText = null;				//	d3 selection of the text

	//	this.fill = uc.isDefined ( o.fill ) ? o.fill : null;		2017-Aug 	?

		//	Override some "base" properties -
		this.onSize  = sized;
		this.onSize2 = sized2;
		this.onMove  = moved;
		this.onMouseOver  = mouseOver;
		this.onMouseLeave = mouseLeave;

	}	//	LabelData()

//	LabelData.prototype = uCD.newControlData();
//	LabelData.prototype.constructor = LabelData;
//	See createLabelData().

//	LabelData.prototype.align = function() {
	function LabelData_align() {
		var d = this;
		var clipSpace = 2;
		d.selText
			.attr ( 'text-anchor', function ( d, i ) { 
				switch ( d.horzAlign ) {
					case 'left': 
						return 'start';
					case 'middle':
						return 'middle';
					case 'right':
						return 'end';
				}
				return 'middle'; 
			} )
			.attr ( 'x', function ( d, i ) { 
				switch ( d.horzAlign ) {
					case 'left':
						return 0   + clipSpace;
					case 'middle':
						return d.w / 2; 
					case 'right':
						return d.w - clipSpace; 
				}
				return d.w / 2; 
			} )
			.attr ( 'y', function ( d, i ) { 
				switch ( d.vertAlign ) {
					case 'top':
						return 0   + clipSpace + d.fs;
					case 'middle':
						return (d.h - 4 + d.fs) / 2 ; 
					case 'bottom':
						return d.h - clipSpace - 4;
				}
				return (d.h - 4 + d.fs) / 2 ; 
			} );
	};	//	LabelData.prototype.align()

//	LabelData.prototype.listProperties = function() {		//	called by showPropertiesBoard() 
	function LabelData_listProperties() {		//	called by showPropertiesBoard() 
		var sW = serviceId + ' LabelData.prototype.listProperties()';
	//	var whiteList = [ 'x', 'y', 'w', 'h', 'name', 'text', 'ff', 'fs', 'hasBorder', 'vertAlign', 'horzAlign' ];
		var whiteList = [                             'text', 'ff', 'fs', 'hasBorder', 'vertAlign', 'horzAlign' ];
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
				case 'hasBorder': 	displayName = 'has border';		break;
				case 'ff': 			displayName = 'font';			break;
				case 'fs': 			displayName = 'font size';		break;
				case 'vertAlign': 	displayName = 'vert align';		break;
				case 'horzAlign': 	displayName = 'horz align';		break;
			}
			console.log ( sW + '   key: ' + key + '  value: ' + value );
			props.push ( { property: key, value: value, displayName: displayName } );
		}
		return props;
	};	//	LabelData.prototype.listProperties()

//	LabelData.prototype.setProperty = function ( name, value ) {
	function LabelData_setProperty ( name, value ) {
		var sW = serviceId + ' LabelData.prototype.setProperty()';
		//	handle x, y, w, h, name properties in the "base class" ControlData
		var n, g, rtn;
		rtn = uCD.setProperty ( this, name, value );
		if ( rtn )
			return rtn;
		if ( name === 'hasBorder' ) {
			n = Number ( value );
			if ( n !== n ) {				//	Good Grief!  ... testing for NaN ...	got'a love JS :(	
				if ( typeof value === 'string' )
					value = (value === 'true');
				else
					value = false;
			} else
				value = (n !== 0);
			this[name] = !! value;
			this.class = this[name] ? 'u34-label-with-border' : 'u34-label';
			d3.select ( '#' + this.eleId + '-rect' )
				.attr ( 'class',  function ( d, i ) { return d.class; } );
		}
		if ( name === 'text' ) {
			this[name] = value;
			this.selText
				.text ( value );
		}
		if ( name === 'ff' ) {
			this[name] = value;
			this.selText
				.attr ( 'style', function ( d, i ) { return 'font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;'; } );
		}
		if ( name === 'fs' ) {
		//	this[name] = parseFloat ( value );
			n = Number ( value );
			if ( n !== n ) 					//	Good Grief!  ... testing for NaN ...	got'a love JS 
				return;
			this[name] = n;
			this.selText
				.attr ( 'style', function ( d, i ) { return 'font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;'; } );
			this.align();
		}
		if ( name === 'vertAlign' ) {
			if ( (value === 'top') || (value === 'middle') || (value === 'bottom') ) {
				this[name] = value;
				this.align();
			}
		}
		if ( name === 'horzAlign' ) {
			if ( (value === 'left') || (value === 'middle') || (value === 'right') ) {
				this[name] = value;
				this.align();
			}
		}
	};	//	LabelData.prototype.setProperty()

	svc.createLabelData = function ( o ) {

		if ( LabelData.prototype.constructor.name === 'LabelData' ) {
			//	Do this once, here to avoid cir ref issue
			LabelData.prototype = uCD.newControlData();
			LabelData.prototype.constructor = LabelData;
			LabelData.prototype.align = LabelData_align;
			LabelData.prototype.listProperties = LabelData_listProperties;
			LabelData.prototype.setProperty = LabelData_setProperty;
		}

		return new LabelData ( o );
	};	//	svc.createLabelData()

	var nextId = 0;

	svc.defineLabel = function ( panel ) {
		var sW = serviceId + ' defineLabel()';
		var labelData = null, newLabel = null;

		var s = panel.data.base.selectAll ( '#' + panel.data.eleId + '-base' + ' > g' );
//		console.log ( sW + '  s length: ' + s._groups[0].length );

		var ctrlEles = s
			.data ( panel.data.childData.data, function ( d ) { 
					return d.id || (d.id = ++panel.data.childData.nextId); 
			} )
			.enter()
			.each ( function ( d ) { 
//				console.log ( sW + ' - g - new data: ' + d.name );
				labelData = d;

				newLabel = new Label ( labelData );
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

		var rect = ctrlEles.append ( 'rect' )
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-rect'; } )
			.attr ( 'width',  function ( d, i ) { return d.w; } )
			.attr ( 'height', function ( d, i ) { return d.h; } )
		//	.attr ( 'style',  function ( d, i ) {							2017-Aug 	?
		//		var style = '';
		//		if ( d.fill ) style += ' fill: ' + d.fill + ';';
		//		return style;
		//	} )
			.attr ( 'class',  function ( d, i ) { return d.class; } );

		if ( labelData.filter )				//	e.g., dropshadow 
			rect
				.attr ( 'filter', labelData.filter );

		labelData.selText = ctrlEles.append ( 'text' )
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-text'; } )
		//	.attr ( 'text-anchor', function ( d, i ) { return 'middle'; } )
		//	.attr ( 'x',           function ( d, i ) { return d.w / 2; } )
		//	.attr ( 'y',           function ( d, i ) { return (d.h -   4 + d.fs) / 2 ; } )
			.attr ( 'style',       function ( d, i ) { return 'font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;'; } )
			.attr ( 'class',       function ( d, i ) { return d.classText; } )
			.attr ( 'clip-path',   function ( d, i ) { return 'url(#cp-' + d.eleId + ')'; } )
			.text (                function ( d, i ) { return d.text; } );

		labelData.align();

		ctrlEles.append ( 'rect' )		//	size handle - invisible until mouse is over
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-size'; } )
			.attr ( 'x',      function ( d, i ) { return d.w - uc.SIZE_HANDLE_WIDTH; } )
			.attr ( 'y',      function ( d, i ) { return d.h - uc.SIZE_HANDLE_HEIGHT; } )
			.attr ( 'width',  function ( d, i ) { return uc.SIZE_HANDLE_WIDTH; } )
			.attr ( 'height', function ( d, i ) { return uc.SIZE_HANDLE_HEIGHT; } )
			.attr ( 'class',  function ( d, i ) { return 'u34-size-handle-transparent'; } )
			.on ( 'mouseover', uCD.mouseoverSize )
			.on ( 'mouseout',  uCD.mouseleaveSize )
			.on ( 'mousedown', uCD.mousedownSize );

		ctrlEles.append ( 'rect' )		//	move handle - invisible until mouse is over
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-move'; } )
			.attr ( 'x',      0 )
			.attr ( 'y',      0 )
			.attr ( 'width',  uc.MOVE_HANDLE_WIDTH )
			.attr ( 'height', uc.MOVE_HANDLE_HEIGHT )
			.attr ( 'class',  'u34-move-handle-transparent' )
			.on ( 'mouseover', uCD.mouseoverMove )
			.on ( 'mouseout',  uCD.mouseleaveMove )
			.on ( 'mousedown', uCD.mousedownMove );

		return newLabel;
	};	//	svc.defineLabel()

	svc.measureText = function ( panel, fontFamily, fontSize, text ) {
	//	var sW = serviceId + ' measureText()';
		var ts = panel.data.base.append ( 'text' )
			.attr ( 'fill',        'transparent' )
			.attr ( 'stroke',      'transparent' )
			.attr ( 'font-family', fontFamily )
			.attr ( 'font-size',   fontSize )
			.text ( text );
		var bb = ts._groups[0][0].getBBox();
		var wh = { w: bb.width, h: bb.height };
		ts.remove();
		return wh;
	};	//	svc.measureText()

	return svc;

})();
