
'use strict';

//  app/partials/udui/udui-checkbox-b.js

//	For this b version -
//
//		Using ControlData to help with the mouse work.

module.exports = (function() { 

	var d3   = 			require ( 'd3' );
	var uc = 			require ( './udui-common.js' );
	var uCD = 			require ( './udui-control-data-a.js' );
	var uBoards = 		require ( './udui-boards-a.js' );

	var serviceId = 'uduiCheckBoxB';

	/* jshint validthis: true */

	var svc = {};
	
	function checkBoxClick ( d, i, ele ) {
		var sW = serviceId + ' checkBoxClick()';
		event.stopPropagation();
		if ( event.shiftKey ) {
			uBoards.showPropertiesBoard ( { sC: 		sW,
											uduiId:		uc.ROOT_UDUI_ID, 
											ofCtrlD: 	d,
											title: 		'Edit Checkbox' } );
			return;
		}
		if ( d.value ) {
			d.value = false;
			d3.selectAll ( '#' + d.eleId + ' line' )				//	hide the X - i.e., not checked
				.classed ( 'u34-checkbox-checked', 		false )
				.classed ( 'u34-checkbox-checked-not', 	true  );
		}
		else {
			d.value = true;
			d3.selectAll ( '#' + d.eleId + ' line' )				//	show the X - i.e., checked
				.classed ( 'u34-checkbox-checked', 		true  )
				.classed ( 'u34-checkbox-checked-not', 	false );
		}
	}	//	checkBoxClick()


	//	CheckBox Move
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

	//	CheckBox Size
	//
	function sized ( d, i, ele, dx, dy ) {
		var sW = serviceId + ' sized()';
	//	console.log ( sW + ' d.name: ' + d.name + '   dx y: ' + dx + ' ' + dy );
		var g = d3.select ( ele.parentNode );
		sized2 ( d, g, dx, dy );
	}	//	sized()

	function sized2 ( d, g, dx, dy ) {
		var sW = serviceId + ' sized2()';
	//	console.log ( sW + ' d.name: ' + d.name + '   dx y: ' + dx + ' ' + dy );
		d.w += dx;
		d.h += dy;
		g.select ( '#' + d.eleId + '-rect' )
			.attr ( 'width',  function ( d, i ) { return d.w; } )
			.attr ( 'height', function ( d, i ) { return d.h; } );
		g.select ( '#' + d.eleId + '-box' )
			.attr ( 'transform', function ( d, i ) { 
			//	return 'translate(' + (2 + uc.OFFS_4_1_PIX_LINE) + ',' + (Math.floor ( (d.h - uc.CHECKBOX_BOX_HEIGHT) / 2 ) + uc.OFFS_4_1_PIX_LINE) + ')'; 
				return 'translate(' + (3                       ) + ',' + (Math.floor ( (d.h - uc.CHECKBOX_BOX_HEIGHT) / 2 )                       ) + ')'; 
			} );
		g.select ( '#' + d.eleId + '-text' )
			.attr ( 'x',      function ( d, i ) { return 2 + uc.CHECKBOX_BOX_WIDTH + 3; } )
			.attr ( 'y',      function ( d, i ) { return (d.h - 4 + d.fs) / 2 ; } );
		g.select ( '#' + d.eleId + '-size' )
			.attr ( 'x',      function ( d, i ) { return d.w - uc.SIZE_HANDLE_WIDTH;  } )
			.attr ( 'y',      function ( d, i ) { return d.h - uc.SIZE_HANDLE_HEIGHT; } );
		d3.select ( '#cp-' + d.eleId + '-rect' )
			.attr ( 'width',  function ( d, i ) { return d.w += dx; } )
			.attr ( 'height', function ( d, i ) { return d.h += dy; } );
		d.parentPanel.updateSclrs();
	}	//	sized()


	function CheckBox ( data ) {
		this.data = data;
	}

//	CheckBox.prototype.showPropertiesBoard = function ( title ) {
//		var sW = serviceId + ' CheckBox.prototype.showPropertiesBoard()';
//		uBoards.showPropertiesBoard ( { sC: 		sW,
//										uduiId: 	uc.ROOT_UDUI_ID, 
//									//	forPanel: 	panelData.panel } );
//										ofCtrlD: 	this.data,
//										title: 		title } );
//	};	//	showPropertiesBoard()

	CheckBox.prototype.updateProperties = function() {
		var d = this.data;
		var s = d3.select ( '#' + d.eleId + ' text' );
		s			
			.attr ( 'style',       function ( d, i ) { return 'font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;'; } )
			.text (                function ( d, i ) { return d.text; } );
	};	//	updateProperties()


	function CheckBoxData ( o ) {

		//	Initialize the "base" of this object, ControlData -
		o.type      = uc.TYPE_CHECKBOX;
		o.class     = o.class     === undefined ? 'u34-checkbox' : o.class;
		o.hasBorder = o.hasBorder === undefined ? false          : o.hasBorder;
		uCD.callControlData ( this, o );

		this.text  = o.text;
		this.value = o.value ? true : false;		//	true (checked) or false (not checked)

		this.ff   = 'verdana';				//	font family
		this.fs   = 10;						//	font size, pixels
		this.classText = 'u34-checkbox-text';
		this.classBox  = 'u34-checkbox-box';

		//	Override some "base" properties -
		this.onSize  = sized;
		this.onSize2 = sized2;
		this.onMove  = moved;

	}	//	CheckBoxData()


//	CheckBoxData.prototype = uCD.newControlData();
//	CheckBoxData.prototype.constructor = CheckBoxData;
//	See createCheckBoxData().

//	CheckBoxData.prototype.listProperties = function() {		//	called by showPropertiesBoard() 
	function CheckBoxData_listProperties() {			//	called by showPropertiesBoard() 
		var sW = serviceId + ' CheckBoxData.prototype.listProperties()';
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
		//	if ( typeof value === 'function' )
		//		continue;
			displayName = key;
			switch ( key ) {
				case 'ff': 	displayName = 'font';			break;
				case 'fs': 	displayName = 'font size';		break;
			}
			console.log ( sW + '   key: ' + key + '  value: ' + value );
			props.push ( { property: key, value: value, displayName: displayName } );
		}
		return props;
	};	//	CheckBoxData.prototype.listProperties()

//	CheckBoxData.prototype.setProperty = function ( name, value ) {
	function CheckBoxData_setProperty ( name, value ) {
		var sW = serviceId + ' CheckBoxData.prototype.setProperty()';
		var n, g, rtn;
		rtn = uCD.setProperty ( this, name, value );
		if ( rtn )
			return rtn;
		if ( name === 'text' ) {
			this[name] = value;
			g = d3.select ( '#' + this.eleId + '-text' );
			g.text ( value );
			return 1;
		}
		if ( name === 'ff' ) {
			this[name] = value;
			g = d3.select ( '#' + this.eleId + '-text' );
			g.attr ( 'style', function ( d, i ) { return 'font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;'; } );
			return 1;
		}
		if ( name === 'fs' ) {
			n = Number ( value );
			if ( n !== n ) 					//	Good Grief!  ... testing for NaN ...	got'a love JS :(	
				return;
			this[name] = n;
			g = d3.select ( '#' + this.eleId + '-text' );
			g.attr ( 'style', function ( d, i ) { return 'font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;'; } );
			return 1;
		}
		return 0;
	};	//	CheckBoxData.prototype.setProperty()

	svc.createCheckBoxData = function ( o ) {

		if ( CheckBoxData.prototype.constructor.name === 'CheckBoxData' ) {
			//	Do this once, here to avoid cir ref issue
			CheckBoxData.prototype = uCD.newControlData();
			CheckBoxData.prototype.constructor = CheckBoxData;
			CheckBoxData.prototype.listProperties = CheckBoxData_listProperties;
			CheckBoxData.prototype.setProperty = CheckBoxData_setProperty;
		}

		return new CheckBoxData ( o );
	};	//	svc.createCheckBoxData()


	svc.defineCheckBox = function ( panel ) {
		var sW = serviceId + ' defineCheckBox()';
		var newCheckBox = null, checked = false;

		var s = panel.data.base.selectAll ( '#' + panel.data.eleId + '-base' + ' > g' );
		console.log ( sW + '  s length: ' + s._groups[0].length );

		var ctrlEles = s
			.data ( panel.data.childData.data, function ( d ) { 
					return d.id || (d.id = ++panel.data.childData.nextId); 
			} )
			.enter()
			.each ( function ( d ) { 
				console.log ( sW + ' - g - new data: ' + d.name );
				newCheckBox  = new CheckBox ( d );
				checked      = d.value;
			} )
			.append ( 'g' )
			.attr ( 'id',        function ( d, i ) { return d.eleId; } )
			//	group has no x, y - must transform -
			.attr ( 'transform', function ( d, i ) { return 'translate(' + d.x + ',' + d.y + ')'; } );

		ctrlEles
			.on ( 'mouseover', uCD.mouseover )
			.on ( 'mouseout',  uCD.mouseleave )
			.on ( 'click', checkBoxClick );

		ctrlEles.append ( 'rect' )
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-rect'; } )
			.attr ( 'width',  function ( d, i ) { return d.w; } )
			.attr ( 'height', function ( d, i ) { return d.h; } )
			.attr ( 'class',  function ( d, i ) { return d.class; } );

		var box = ctrlEles.append ( 'g' )
			.attr ( 'id',        function ( d, i ) { return d.eleId + '-box'; } )
			.attr ( 'transform', function ( d, i ) { 
	//			return 'translate(' + (2 + uc.OFFS_4_1_PIX_LINE) + ',' + (Math.floor ( (d.h - uc.CHECKBOX_BOX_HEIGHT) / 2 ) + uc.OFFS_4_1_PIX_LINE) + ')'; 
				return 'translate(' + (3                       ) + ',' + (Math.floor ( (d.h - uc.CHECKBOX_BOX_HEIGHT) / 2 )                       ) + ')'; 
			} );

		box.append ( 'rect' )
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-box-rect'; } )
			.attr ( 'x',      0 )
			.attr ( 'y',      0 )
			.attr ( 'width',  uc.CHECKBOX_BOX_WIDTH )
			.attr ( 'height', uc.CHECKBOX_BOX_HEIGHT )
			.attr ( 'class',  function ( d, i ) { return d.classBox; } );
//			.on ( 'click', checkBoxClick );		on entire control

		box.append ( 'line' )		//	part of the X in the checkbox box - like a backslash
			.attr ( 'id',    function ( d, i ) { return d.eleId + '-box-x-b'; } )
			.attr ( 'x1',    0 )
			.attr ( 'y1',    0 )
			.attr ( 'x2',    uc.CHECKBOX_BOX_WIDTH )
			.attr ( 'y2',    uc.CHECKBOX_BOX_HEIGHT )
			.attr ( 'class', function ( d, i ) { return d.value ? 'u34-checkbox-checked' : 'u34-checkbox-checked-not'; } );

		box.append ( 'line' )		//	other part of the X in the checkbox box - like a forward slash
			.attr ( 'id',    function ( d, i ) { return d.eleId + '-box-x-f'; } )
			.attr ( 'x1',    uc.CHECKBOX_BOX_WIDTH )
			.attr ( 'y1',    0 )
			.attr ( 'x2',    0 )
			.attr ( 'y2',    uc.CHECKBOX_BOX_HEIGHT )
			.attr ( 'class', function ( d, i ) { return d.value ? 'u34-checkbox-checked' : 'u34-checkbox-checked-not'; } );

		ctrlEles.append ( 'text' )
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-text'; } )
			.attr ( 'text-anchor', function ( d, i ) { return 'start'; } )
			.attr ( 'x',           function ( d, i ) { return 2 + uc.CHECKBOX_BOX_WIDTH + 3; } )
			.attr ( 'y',           function ( d, i ) { return (d.h -   4 + d.fs) / 2 ; } )
			.attr ( 'style',       function ( d, i ) { return 'font-family: ' + d.ff + '; font-size: ' + d.fs + 'px;'; } )
			.attr ( 'class',       function ( d, i ) { return d.classText; } )
			.attr ( 'clip-path',   function ( d, i ) { return 'url(#cp-' + d.eleId + ')'; } )
			.text (                function ( d, i ) { return d.text; } );

//		ctrlEles.append ( 'rect' )		//	size handle - invisible until mouse is over
//			.attr ( 'id',     function ( d, i ) { return d.eleId + '-size'; } )
//			.attr ( 'x',      function ( d, i ) { return d.w - uc.SIZE_HANDLE_WIDTH; } )
//			.attr ( 'y',      function ( d, i ) { return d.h - uc.SIZE_HANDLE_HEIGHT; } )
//			.attr ( 'width',  function ( d, i ) { return uc.SIZE_HANDLE_WIDTH; } )
//			.attr ( 'height', function ( d, i ) { return uc.SIZE_HANDLE_HEIGHT; } )
//			.attr ( 'class',  function ( d, i ) { return 'u34-size-handle-transparent'; } )
//			.on ( 'mouseover', mouseOverSize )
//			.on ( 'mouseout',  mouseLeaveSize )
//			.call ( d3.drag()
//				.on ( 'start', dragSizeStarted )
//				.on ( 'drag',  dragSized )
//				.on ( 'end',   dragSizeEnded ) );

		ctrlEles.append ( 'rect' )				//	size handle - invisible until mouse is over
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-size'; } )
			.attr ( 'x',      function ( d, i ) { return d.w - uc.SIZE_HANDLE_WIDTH; } )
			.attr ( 'y',      function ( d, i ) { return d.h - uc.SIZE_HANDLE_HEIGHT; } )
			.attr ( 'width',  uc.SIZE_HANDLE_WIDTH )
			.attr ( 'height', uc.SIZE_HANDLE_HEIGHT )
			.attr ( 'class',  'u34-size-handle-transparent' )
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

		return newCheckBox;
	};	//	svc.defineCheckBox()

	return svc;

})();
