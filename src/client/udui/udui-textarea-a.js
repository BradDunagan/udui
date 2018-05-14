'use strict';

//  app/partials/udui/udui-textarea-a.js

//	Based on (possibly much like) udui-input-b.js.

module.exports = (function() { 

	var d3 = 		require ( 'd3' );
	var uc = 		require ( './udui-common.js' );
	var uCD = 		require ( './udui-control-data-a.js' );
	var uBoards = 	require ( './udui-boards-a.js' );

	var serviceId = 'uduiTextareaA';

	/* jshint validthis: true */

	var svc = {};


	function onInput ( d, i, ele ) {
		var sW = serviceId + ' onInput()';
		//	Called when textarea's text changes - key press, delete, paste, etc..
	//	var textareaEle = ele[i].children[0];
	//	console.log ( sW + ' eleId: ' + d.eleId + ' value: ' + textareaEle.value );
		if ( d.inputCB )
			d.inputCB ( d, i, ele );
		else {
			var textareaEle = ele[i].children[0];
			d.value = textareaEle.value;
		}
	}	//	onInput()

	function onChange ( d, i, ele ) {
		var sW = serviceId + ' onChange()';
		console.log ( sW );
		//	Called when focus is lost or when Enter key is pressed.
		var textareaEle = ele[i].children[0];
		d.value = textareaEle.value;
		if ( d.changeCB ) 
			d.changeCB ( d );
	}	//	onChange()

	function mouseOver ( d, i, ele ) {
	//	console.log ( serviceId + ' mouseOver()' );
		if ( ! d.hasBorder )
			d3.select ( '#' + d.eleId + '-textarea' )
				.classed ( 'u34-textarea', 				false )
				.classed ( 'u34-textarea-mouse-over',      true  );
	}	//	mouseOver()

	function mouseLeave ( d, i, ele ) {
	//	console.log ( serviceId + ' mouseLeave()' );
		if ( ! d.hasBorder )
			d3.select ( '#' + d.eleId + '-textarea' )
				.classed ( 'u34-textarea', 				true )
				.classed ( 'u34-textarea-mouse-over',      false  );
	}	//	mouseLeave()

	function mousedown ( d, i, ele ) {
//		var sW = serviceId + ' mousedown()';
//		console.log ( sW + ': Name: ' + d.name + '  event.altKey: ' + event.altKey );
		event.stopPropagation();
	}	//	mousedown()

	function mousemove ( d, i, ele ) {
//		var sW = serviceId + ' mousemove()';
//		console.log ( sW + ': Name: ' + d.name + '  event.altKey: ' + event.altKey );
		event.stopPropagation();
	}	//	mousemove()

	function mouseup ( d, i, ele ) {
//		var sW = serviceId + ' mouseup()';
//		console.log ( sW + ': Name: ' + d.name + '  event.altKey: ' + event.altKey );
		event.stopPropagation();
	}	//	mouseup()

	function click ( d, i, ele ) {
		var sW = serviceId + ' click()';
//		console.log ( sW + ': Name: ' + d.name + '  event.altKey: ' + event.altKey );
		event.stopPropagation();
		if ( event.shiftKey ) {
			uBoards.showPropertiesBoard ( { sC: 		sW,
											uduiId:		uc.ROOT_UDUI_ID, 
											ofCtrlD: 	d,
											title: 		'Textarea Properties' } );
			return;
		}
	}	//	click()

	//	Textarea Move
	//
	function moved ( d, i, ele, x, y ) {
		var sW = serviceId + ' moved()';
		console.log ( sW + ' d.name: ' + d.name + '   x y: ' + x + ' ' + y );
		d3.select ( ele.parentNode )
			.attr ( 'transform', function ( d, i ) { 
				return 'translate(' + (d.x = x) + ',' + (d.y = y) + ')'; 
			} );
		d.parentPanel.updateSclrs();
	}	//	moved()

	//	Textarea Size
	//
	function sized2 ( d, g, dx, dy ) {
		var sW = serviceId + ' sized2()';
	//	console.log ( sW + ' d.name: ' + d.name + '   dx y: ' + dx + ' ' + dy );
		d.w += dx;
		d.h += dy;
		g.select ( 'textarea' )
			.attr ( 'style',  function ( d, i ) { 
				return 'width:' + d.w + 'px; height:' + d.h + 'px; font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;';
			} );
		g.select ( '#' + d.eleId + '-size' )
		//	.attr ( 'x',      function ( d, i ) { return d.w - uc.SIZE_HANDLE_WIDTH;  } )
		//	.attr ( 'y',      function ( d, i ) { return d.h - uc.SIZE_HANDLE_HEIGHT; } );
			.attr ( 'x',      sizeX )
			.attr ( 'y',      sizeY );
		d3.select ( '#cp-' + d.eleId + '-rect' )
			.attr ( 'width',  function ( d, i ) { return d.w += dx; } )
			.attr ( 'height', function ( d, i ) { return d.h += dy; } );
		d.parentPanel.updateSclrs();
	}	//	sized2()

	function sized ( d, i, ele, dx, dy ) {
		var sW = serviceId + ' sized()';
	//	console.log ( sW + ' d.name: ' + d.name + '   dx y: ' + dx + ' ' + dy );
		var g = d3.select ( ele.parentNode );
		sized2 ( d, g, dx, dy );
	}	//	sized()

	function sizeX ( d ) {
		//	(4 + 2)
		//		4 		For the left and right padding (2 pixels each).
		//		2 		? 	It just works.
		return d.w - uc.SIZE_HANDLE_WIDTH + (4 + 2);
	}	//	sizeX()

	function sizeY ( d ) {
		//	2 		? 	It just works.
		return d.h - uc.SIZE_HANDLE_HEIGHT + 2;
	}	//	sizeY()

	function Textarea ( data ) {
		this.data = data;
	}

	function TextareaData ( o ) {
	//	o.x += uc.OFFS_4_1_PIX_LINE;
	//	o.y += uc.OFFS_4_1_PIX_LINE;

		//	Initialize the "base" of this object, ControlData -
		o.type      = uc.TYPE_TEXTAREA;
		o.hasBorder = uc.isBoolean ( o.hasBorder ) ? o.hasBorder : false;
		o.class     = uc.isDefined ( o.class )     ? o.class     : (o.hasBorder ? 'u34-textarea' : 'u34-textarea-no-border');
		uCD.callControlData ( this, o );


		//	Properties unique to this control -
		this.value = uc.isString ( o.value ) ? o.value : 'Text in a textarea.';

		this.inputCB  = o.inputCB  ? o.inputCB  : null;
		this.changeCB = o.changeCB ? o.changeCB : null;
		this.ff   = 'verdana';				//	font family
		this.fs   = 10;						//	font size, pixels

		this.classText = 'u34-button-text';

		//	Override some "base" properties -
		this.onSize  = sized;
		this.onSize2 = sized2;
		this.onMove  = moved;
		this.onMouseOver  = mouseOver;
		this.onMouseLeave = mouseLeave;

	}	//	TextareaData()


//	TextareaData.prototype = uCD.newControlData();
//	TextareaData.prototype.constructor = TextareaData;
//	See createTextareaData().


//	TextareaData.prototype.listProperties = function() {		//	called by showPropertiesBoard() 
	function TextareaData_listProperties() {
		var sW = serviceId + ' TextareaData.prototype.listProperties()';
		var whiteList = [ 'text', 'ff', 'fs', 'hasBorder' ];
		var value, displayName, props = uCD.listProperties ( this );
		for ( var key in this ) {
			if ( ! whiteList.includes ( key ) )
				continue;
			value = this[key];
			if ( value === undefined )
				continue;
			if ( value === null )
				continue;
		//	if ( typeof value === 'function' )
		//		continue;
			displayName = key;
			switch ( key ) {
				case 'hasBorder': 	displayName = 'has border';		break;
				case 'ff': 			displayName = 'font';			break;
				case 'fs': 			displayName = 'font size';		break;
			}
			console.log ( sW + '   key: ' + key + '  value: ' + value );
			props.push ( { property: key, value: value, displayName: displayName } );
		}
		return props;
	}	//	TextareaData.prototype.listProperties()

//	TextareaData.prototype.setProperty = function ( name, value ) {
	function TextareaData_setProperty ( name, value ) {
		var sW = serviceId + ' TextareaData.prototype.setProperty()';
		var rtn = uCD.setProperty ( this, name, value );
		if ( rtn )
			return rtn;
		var n, g = d3.select ( '#' + this.eleId );
		if ( name === 'hasBorder' ) {					//	Like udui-label-b.js
			n = Number ( value );
			if ( n !== n ) {				//	Good Grief!  ... testing for NaN ...	got'a love JS :(	
				if ( typeof value === 'string' )
					value = (value === 'true');
				else
					value = false;
			} else
				value = (n !== 0);
			this[name] = !! value;
			d3.select ( '#' + this.eleId + '-textarea' )
				.classed ( 'u34-textarea', 				 this[name] )
				.classed ( 'u34-textarea-no-border',   ! this[name] );
			return 1;
		}
		if ( name === 'text' ) {
			TextareaData_setText.call ( this, value );
			return 1;
		}
		if ( name === 'ff' ) {
			this[name] = value;
			g.select ( 'textarea' )
				.attr ( 'style',  function ( d, i ) { 
					return 'width:' + d.w + 'px; height:' + d.h + 'px; font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;';
				} );
			return 1;
		}
		if ( name === 'fs' ) {
			n = Number ( value );
			if ( n !== n ) 					//	Good Grief!  ... testing for NaN ...	got'a love JS :(	
				return;
			this[name] = n;
			g.select ( 'textarea' )
				.attr ( 'style',  function ( d, i ) { 
					return 'width:' + d.w + 'px; height:' + d.h + 'px; font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;';
				} );
			return 1;
		}
		return 0;
	}	//	TextareaData.prototype.setProperty()

	function TextareaData_setText ( text ) {
	//	var sW = serviceId + ' TextareaData_setText()';
		this.value = text;
		d3.select ( '#' + this.eleId + '-textarea' )
			.html ( text );
	}	//	TextareaData_setText()

	svc.createTextareaData = function ( o ) {

		if ( TextareaData.prototype.constructor.name === 'TextareaData' ) {
			//	Do this once, here to avoid cir ref issue
			TextareaData.prototype = uCD.newControlData();
			TextareaData.prototype.constructor = TextareaData;
			TextareaData.prototype.listProperties = TextareaData_listProperties;
			TextareaData.prototype.setText = TextareaData_setText;
			TextareaData.prototype.setProperty = TextareaData_setProperty;
		}

		return new TextareaData ( o );
	};	//	svc.createTextareaData()

	svc.defineTextarea = function ( panel ) {
		var sW = serviceId + ' defineTextarea()';
		var newTextarea = null;
		var s = panel.data.base.selectAll ( '#' + panel.data.eleId + '-base' + ' > g' );
		console.log ( sW + '  s length: ' + s._groups[0].length );

		var ctrlEles = s
			.data ( panel.data.childData.data, function ( d ) { 
					return d.id || (d.id = ++panel.data.childData.nextId); 
			} )
			.enter()
			.each ( function ( d ) { 
				console.log ( sW + ' - g - new data: ' + d.name ); 
				newTextarea  = new TextareaData ( d );
			} )
			.append ( 'g' )
			.attr ( 'id',        function ( d, i ) { return d.eleId; } )
			//	group has no x, y - must transform -
			.attr ( 'transform', function ( d, i ) { return 'translate(' + d.x + ',' + d.y + ')'; } );

		ctrlEles
			.on ( 'mouseover', uCD.mouseover )
			.on ( 'mouseout',  uCD.mouseleave )
			.on ( 'mousedown', mousedown )
			.on ( 'mousemove', mousemove )
			.on ( 'mouseup',   mouseup )
			.on ( 'click',     click );

		ctrlEles.append ( 'g' )
			.attr ( 'id',          function ( d, i ) { return d.eleId + '-foreignobject'; } )
				.attr ( 'transform', 'translate(0.5,0.5)' )
			.append ( 'foreignObject' )
				.attr ( 'id',          function ( d, i ) { return d.eleId + '-text'; } )
				.attr ( 'x', 0 )
				.attr ( 'y', 0 )
				.attr ( 'width',  function ( d, i ) { return d.w; } )
				.attr ( 'height', function ( d, i ) { return d.h; } )
				.append ( 'xhtml:body' )
					.style ( 'font', '12px "consolas"' )
					.html ( function ( d, i ) {
						return '<textarea '
								+  'id="' + d.eleId + '-textarea" '
								+  'autocapitalize="none" '
								+  'autocomplete="off" '
								+  'spellcheck="false" '
								+  'wrap="hard" '
								+  'class="' + d.class + '" '
								+  'style="width:' + d.w + 'px; height:' + d.h + 'px; font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;">'
								+  d.value 
								+ '</textarea>';
					} )
					.on ( 'input',    onInput )				//	fires on any change
					.on ( 'change',   onChange );			//	fires when focus lost or on Enter key

		ctrlEles.append ( 'rect' )				//	size handle - invisible until mouse is over
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-size'; } )
			.attr ( 'x',      sizeX ) 
			.attr ( 'y',      sizeY )
			.attr ( 'width',  uc.SIZE_HANDLE_WIDTH )
			.attr ( 'height', uc.SIZE_HANDLE_HEIGHT )
			.attr ( 'class',  'u34-size-handle-transparent' )
			.on ( 'mouseover', uCD.mouseoverSize )
			.on ( 'mouseout',  uCD.mouseleaveSize )
			.on ( 'mousedown', uCD.mousedownSize );

		ctrlEles.append ( 'rect' )		//	move handle - invisible until mouse is over
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-move'; } )
				.attr ( 'x',      1 )
				.attr ( 'y',      1 )
			.attr ( 'width',  uc.MOVE_HANDLE_WIDTH )
			.attr ( 'height', uc.MOVE_HANDLE_HEIGHT )
			.attr ( 'class',  'u34-move-handle-transparent' )
			.on ( 'mouseover', uCD.mouseoverMove )
			.on ( 'mouseout',  uCD.mouseleaveMove )
			.on ( 'mousedown', uCD.mousedownMove );

		return newTextarea;
	};	//	svc.defineTextarea()

	return svc;

})();
