'use strict';

//  app/partials/udui/udui-input-b.js

//	For this b version -
//
//		Using ControlData to help with the mouse work.

/*
function rrInputInput ( evt ) {
	var sW = 'rrInputInput()';
	//	Called when input's value changes - key press, delete, paste, etc..
	var inputEle = evt.srcElement;
	console.log ( sW + ' eleId: ' + inputEle.id + '  value: ' + inputEle.value );
}
*/
/*
function rrInputChange ( evt ) {
	var sW = 'rrInputChange()';
	console.log ( sW );
	//	Called when input focus is lost or when Enter key is pressed.
	var inputEle = evt.srcElement;
	var bodyEle  = inputEle.parentElement;
	bodyEle.__data__.value = inputEle.value;
}
*/

module.exports = (function() { 

	var d3 = 		require ( 'd3' );
	var uc = 		require ( './udui-common.js' );
	var uCD = 		require ( './udui-control-data-a.js' );
	var uBoards = 	require ( './udui-boards-a.js' );

	var serviceId = 'uduiInputB';

	/* jshint validthis: true */

	var svc = {};

	function onInput ( d, i, ele ) {
		var sW = serviceId + ' onInput()';
		//	Called when input's value changes - key press, delete, paste, etc..
	//	var inputEle = ele[i].children[0];
	//	console.log ( sW + ' eleId: ' + d.eleId + ' value: ' + inputEle.value );
		if ( d.inputCB )
			d.inputCB ( d, i, ele );
	}	//	onInput()

	function onChange ( d, i, ele ) {
		var sW = serviceId + ' onChange()';
		console.log ( sW );
		//	Called when input focus is lost or when Enter key is pressed.
		var inputEle = ele[i].children[0];
		d.value = inputEle.value;
		if ( d.changeCB ) 
			d.changeCB ( d );
	}	//	onChange()

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
											title: 		'Input Properties' } );
			return;
		}
	}	//	click()

	//	Input Move
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

	//	Input Size
	//
	function sized2 ( d, g, dx, dy ) {
		var sW = serviceId + ' sized2()';
	//	console.log ( sW + ' d.name: ' + d.name + '   dx y: ' + dx + ' ' + dy );
		d.w += dx;
		d.h += dy;
		g.select ( 'input' )
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

	function Input ( data ) {
		this.data = data;
	}

	function InputData ( o ) {
	//	o.x += uc.OFFS_4_1_PIX_LINE;
	//	o.y += uc.OFFS_4_1_PIX_LINE;

		//	Initialize the "base" of this object, ControlData -
		o.type      = uc.TYPE_INPUT;
	//	o.class     = o.class     === undefined ? 'u34-button' : o.class;			2017-Aug
		o.class     = o.class     === undefined ? 'u34-input' : o.class;
		o.hasBorder = o.hasBorder === undefined ? false        : o.hasBorder;
		uCD.callControlData ( this, o );


		//	Properties unique to this control -
		this.value = o.value;

		this.inputCB  = o.inputCB  ? o.inputCB  : null;
		this.changeCB = o.changeCB ? o.changeCB : null;
		this.ff   = 'verdana';				//	font family
		this.fs   = 10;						//	font size, pixels

		this.inputType = uc.isString ( o.inputType ) ? o.inputType : 'text';

		this.classText = 'u34-button-text';

		//	Override some "base" properties -
		this.onSize  = sized;
		this.onSize2 = sized2;
		this.onMove  = moved;

	}	//	InputData()


//	InputData.prototype = uCD.newControlData();
//	InputData.prototype.constructor = InputData;
//	See createInputData().


//	InputData.prototype.listProperties = function() {		//	called by showPropertiesBoard() 
	function InputData_listProperties() {
		var sW = serviceId + ' InputData.prototype.listProperties()';
		var whiteList = [ 'text', 'ff', 'fs', 'inputType' ];
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
				case 'ff': 			displayName = 'font';			break;
				case 'fs': 			displayName = 'font size';		break;
				case 'intputType': 	displayName = 'input type';		break;
			}
			console.log ( sW + '   key: ' + key + '  value: ' + value );
			props.push ( { property: key, value: value, displayName: displayName } );
		}
		return props;
	}	//	InputData.prototype.listProperties()

//	InputData.prototype.setProperty = function ( name, value ) {
	function InputData_setProperty ( name, value ) {
		var sW = serviceId + ' InputData.prototype.setProperty()';
		var rtn = uCD.setProperty ( this, name, value );
		if ( rtn )
			return rtn;
		var n, g = d3.select ( '#' + this.eleId );
		if ( name === 'ff' ) {
			this[name] = value;
			g.select ( 'input' )
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
			g.select ( 'input' )
				.attr ( 'style',  function ( d, i ) { 
					return 'width:' + d.w + 'px; height:' + d.h + 'px; font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;';
				} );
			return 1;
		}
		if ( name === 'inputType' ) {
			this[name] = value;
			g.select ( 'input' )
				.attr ( 'type',  function ( d, i ) { 
					return d.inputType;
				} );
			return 1;
		}
		return 0;
	}	//	InputData.prototype.setProperty()

	function InputData_setText ( text ) {
		var sW = serviceId + ' InputData.prototype.setText()';
		this.value = text;
		d3.select ( '#' + this.eleId + '-input' )
			.attr ( 'value', text );
	}	//	InputData.prototype.setText()

	svc.createInputData = function ( o ) {

		if ( InputData.prototype.constructor.name === 'InputData' ) {
			//	Do this once, here to avoid cir ref issue
			InputData.prototype = uCD.newControlData();
			InputData.prototype.constructor = InputData;
			InputData.prototype.listProperties = InputData_listProperties;
			InputData.prototype.setText = InputData_setText;
			InputData.prototype.setProperty = InputData_setProperty;
		}

		return new InputData ( o );
	};	//	svc.createInputData()

	svc.defineInput = function ( panel ) {
		var sW = serviceId + ' defineInput()';
		var newInput = null;
		var s = panel.data.base.selectAll ( '#' + panel.data.eleId + '-base' + ' > g' );
		console.log ( sW + '  s length: ' + s._groups[0].length );

		var ctrlEles = s
			.data ( panel.data.childData.data, function ( d ) { 
					return d.id || (d.id = ++panel.data.childData.nextId); 
			} )
			.enter()
			.each ( function ( d ) { 
				console.log ( 'defineInput() - g - new data: ' + d.name ); 
				newInput  = new InputData ( d );
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
			//	.attr ( 'width',  1 )	//	function ( d, i ) { return d.w; } )
			//	.attr ( 'height', 1 ) 	//	function ( d, i ) { return d.h; } )
				//	<input> control disappears when scrolling to left - its a w, h issue with
				//	the <foreignObject>.  See project where this was debugged in -
				//		\Dign\OT\VSCode\WebPage
				.attr ( 'width',  function ( d, i ) { return d.w; } )
				.attr ( 'height', function ( d, i ) { return d.h; } )
				.append ( 'xhtml:body' )
					.style ( 'font', '12px "consolas"' )
					.html ( function ( d, i ) {
						return '<input '
								+  'id="' + d.eleId + '-input" '
								+  'type="' + d.inputType + '" '
								+  'autocorrect="off" '
								+  'spellcheck="false" '
				//				+  'oninput=rrInputInput(event) '		//	fires on any change
				//				+  'onchange="rrInputChange(event)" '	//	fires when focus lost or on Enter key
				//				+  'class="u34-input" '						2017-Aug
								+  'class="' + d.class + '" '
								+  'style="width:' + d.w + 'px; height:' + d.h + 'px; font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;" '
								+  'value="' + d.value + '"></input>';
					} )
					.on ( 'input',    onInput )				//	fires on any change
					.on ( 'change',   onChange );			//	fires when focus lost or on Enter key

		ctrlEles.append ( 'rect' )				//	size handle - invisible until mouse is over
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-size'; } )
		//	.attr ( 'x',      function ( d, i ) { return d.w - uc.SIZE_HANDLE_WIDTH  + uc.INPUT_BORDER_WIDTH + uc.OFFS_4_1_PIX_LINE + uc.INPUT_PADDING_LEFT + uc.INPUT_PADDING_RIGHT; } )
		//	.attr ( 'y',      function ( d, i ) { return d.h - uc.SIZE_HANDLE_HEIGHT + uc.INPUT_BORDER_WIDTH + uc.OFFS_4_1_PIX_LINE; } )
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

		return newInput;
	};	//	svc.defineInput()

	return svc;

})();
