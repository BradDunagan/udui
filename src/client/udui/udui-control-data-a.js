
'use strict';

//  app/udui/udui-control-data-a.js

module.exports = (function() { 

	var d3 = 		require ( 'd3' );
	var uc = 		require ( './udui-common.js' );
	var uBoards = 	require ( './udui-boards-a.js' );

	var serviceId = 'uduiControlDataA';

	/* jshint validthis: true */

	var svc = {};

	uc.uCD = svc;			//	2018-May-07

	svc.screenPanel = null;

	svc.mouseover = function( d, i, ele ) {
		var sW = serviceId + ' mouseover()';
		var baseD = null;						//	panel base data
		if ( d.type === uc.TYPE_PANEL_BASE ) { baseD = d;  d = d.panelData; }
	//	console.log ( sW + ':  d.name: ' + d.name + '  event.altKey: ' + event.altKey );
		event.stopPropagation();
		if ( d.onMouseOver ) {
			if ( baseD ) {
				d.onMouseOver ( baseD, i, ele );
				return;
			}
			d.onMouseOver ( d, i, ele );
		}
		if ( (! d.hasBorder) && (! baseD) )		//	panels don't/shouldn't have borders when split 
			d3.select ( '#' + this.getAttribute ( 'id' ) + '-rect' )
				.classed ( 'u34-light-border', true );
	};	//	mouseover()

	svc.mouseleave = function( d, i, ele ) {
		var sW = serviceId + ' mouseleave()';
		var baseD = null;						//	panel base data
		if ( d.type === uc.TYPE_PANEL_BASE ) { baseD = d;  d = d.panelData; }
//		console.log ( sW + ':  d.name: ' + d.name + '  event.altKey: ' + event.altKey );
		event.stopPropagation();
		if ( d.onMouseLeave ) {
			if ( baseD ) {
				d.onMouseLeave ( baseD, i, ele );
				return;
			}
			d.onMouseLeave ( d, i, ele );
		}
		if (  uc.mouseOp && (uc.mouseOp.downData.eleId === d.eleId) )
			return;
		if ( (! d.hasBorder) && (! baseD) )		//	panels don't/shouldn't have borders when split 
			d3.select ( '#' + this.getAttribute ( 'id' ) + '-rect' )
				.classed ( 'u34-light-border', false );
	};	//	mouseleave()

	svc.mousedown = function ( d, i, ele ) {
		var sW = serviceId + ' mousedown()';
		var baseD = null;						//	panel base data
		if ( d.type === uc.TYPE_PANEL_BASE ) { baseD = d;  d = d.panelData; }
//		console.log ( sW + ':  d.name: ' + d.name + '  event.altKey: ' + event.altKey );
		if ( ! d.fillsPanel )
			event.stopPropagation();
	//	if ( event.altKey ) {
	//
	//		//	If altKey then possibly drag this to a different parent element.
	//		
	//		//	To get the current position of this as a child in the parent element -
	//		//
	//		//		Converting a NodeList to an Array
	//		//		https://developer.mozilla.org/en-US/docs/Web/API/NodeList
	//		//
	//		//		a =  Array.prototype.slice.call ( this.parentElement.childNodes );
	//		//
	//		//		i = a.indexOf ( this );
	//	}
		var ebcr = ele[i].getBoundingClientRect();
		uc.mouseOp = {							//	mouse operation
			downData: 		d,					//	on what data the mouse operation started
			sizing: 		false,
			moving: 		false,
			dragDrop: 		false,
			splitting: 		false,
			scrolling: 		false,
			selecting: 		false,
			x0: 			event.pageX,		//	first event
			y0: 			event.pageY,
			x: 				event.pageX,		//	current position
			y: 				event.pageY,
			dx: 			0,					//	change in position
			dy: 			0,
			eleX: 			event.pageX - ebcr.left,
			eleY: 			event.pageY - ebcr.top,

			updateXY: 		function  ( x, y ) {
				this.dx = x - this.x;		this.x = x;
				this.dy = y - this.y;		this.y = y;
			}	
		};

		d.clickDisabled = false;

		if ( d.onMouseDown ) {
			if ( baseD ) {
				d.onMouseDown ( baseD, i, ele );
				return;
			}
			d.onMouseDown ( d, i, ele );
		}
	};	//	mousedown()

	svc.mousemove = function( d, i, ele ) {
		var sW = serviceId + ' mousemove()';
		var baseD = null, 				//	panel base data
			pd    = null;				//	panel data of control that fill panel

		if ( event.ctrlKey ) {				//	2017-Jun-23		possibly a semi-transparent menu ...
			console.log ( sW + ' ctrlKey' );
		}

		if ( d.type === uc.TYPE_PANEL_BASE ) { 
			baseD = d;  d = d.panelData; 
		}
		else
		if ( ! d.fillsPanel )
			event.stopPropagation();
		if ( ! uc.mouseOp )
			return;
		if ( uc.mouseOp.sizing )
			return;
		if ( uc.mouseOp.moving )
			return;
		if ( d.onMouseMove ) {
			if ( baseD ) {
				d.onMouseMove ( baseD, i, ele );
				return;
			}
			d.onMouseMove ( d, i, ele );
		}
		else
		if ( d.fillsPanel && d.parentPanel && uc.mouseOp.dragDrop ) {
			pd = d.parentPanel.data;
			if ( pd.onMouseMove )
				pd.onMouseMove ( pd.baseData[0], null, null );
		}
//		console.log ( sW + ':  d.name: ' + d.name + '  event.altKey: ' + event.altKey );
	};	//	mousemove()

	svc.mouseup = function( d, i, ele ) {
		var sW = serviceId + ' mouseup()';
		var baseD = null;						//	panel base data
		if ( d.type === uc.TYPE_PANEL_BASE ) { baseD = d;  d = d.panelData; }
//		console.log ( sW + ':  d.name: ' + d.name + '  event.altKey: ' + event.altKey );
		if ( uc.mouseOp && uc.mouseOp.sizing )
			console.log ( sW + ' sizing: ' + d.name + ' w h ' + d.w + ' ' + d.h );
		if ( d.onMouseUp ) {
			if ( baseD ) {
				d.onMouseUp ( baseD, i, ele );
				return;
			}
			d.onMouseUp ( d, i, ele );
		}
		event.stopPropagation();
		uc.mouseOp = null;
	};	//	mouseup()

	function rootXY ( d ) {
		var x = d.x;
		var y = d.y;
		if ( d.parentPanel ) {
			var cd = d.parentPanel.data;
		//	while ( cd.name !== uc.APP_CLIENT_ROOT_PANEL_NAME ) {
			while ( cd.parent || cd.parentPanel ) {
				if ( cd.type === uc.TYPE_PANEL ) {
					var bd = cd.baseData[0];
					x += cd.x + bd.x;
					y += cd.y + bd.y;
				} else {
					x += cd.x;
					y += cd.y;
				}
				cd = cd.parent ? cd.parent.data : cd.parentPanel.data;
			}
		}
		return { x: x, y: y };
	}	//	rootXY()

	svc.mouseoverMove = function ( d, i, ele ) {
		var sW = serviceId + ' mouseoverMove()';
//		console.log ( sW + ':  Name: ' + d.name + '  event.altKey: ' + event.altKey );
		if ( uc.mouseOp )
			return;
		d3.select ( this )		//	select move rect
			.classed ( 'u34-move-handle-transparent', false )
			.classed ( 'u34-move-handle',             true  );
		var xy = rootXY ( d );
		uc.rootPanel.showFlyoverInfo ( xy.x, xy.y, 'move' );
	};	//	mouseoverMove()

	svc.mouseleaveMove = function ( d, i, ele ) {
		var sW = serviceId + ' mouseleaveMove()';
//		console.log ( sW + ':  Name: ' + d.name + '  event.altKey: ' + event.altKey );
		if ( uc.mouseOp && uc.mouseOp.moving )
			return;
		d3.select ( this )		//	select move rect
			.classed ( 'u34-move-handle-transparent', true )
			.classed ( 'u34-move-handle',             false  );
		uc.rootPanel.hideFlyoverInfo();
	};	//	mouseleaveMove()

	svc.mousedownMove = function ( d, i, ele ) {
		var sW = serviceId + ' mousedownMove()';
		console.log ( sW + ':  Name: ' + d.name + '  event.altKey: ' + event.altKey );
		event.stopPropagation();

		if ( uc.mouseOp )
			return;

		uc.mouseOp = {							//	mouse operation
			downData: 		d,					//	on what data the mouse operation started
			downEle: 		ele[i],
			sizing: 		false,
			moving: 		true,
			dragDrop: 		false,
			splitting: 		false,
			x0: 			event.pageX,		//	where
			y0: 			event.pageY,
			x: 				event.pageX,		//	current position
			y: 				event.pageY,
			dx: 			0,					//	change in position
			dy: 			0,

			grid: {
				x: 		event.pageX,
				y: 		event.pageY
			},

			updateXY: 		function  ( x, y ) {
				this.dx = x - this.x;		this.x = x;
				this.dy = y - this.y;		this.y = y;
			}	
		};

		d.clickDisabled = true;

		window.addEventListener ( 'mousemove', windowMouseMove, true );
		window.addEventListener ( 'mouseup',   windowMouseUp,   true );
		window.addEventListener ( 'click',     windowClick,     true );
		uc.rootPanel.hideFlyoverInfo();
	};	//	mousedownMove()

	svc.mouseoverSize = function ( d, i, ele ) {
		var sW = serviceId + ' mouseoverSize()';
//		console.log ( sW + ':  Name: ' + d.name + '  event.altKey: ' + event.altKey );
		if ( uc.mouseOp )
			return;
		if ( d.type !== uc.TYPE_PANEL )		//	panel's size box is always visible
			d3.select ( this )		//	select size rect
				.classed ( 'u34-size-handle-transparent', false )
				.classed ( 'u34-size-handle',             true  );
		var xy = rootXY ( d );
		uc.rootPanel.showFlyoverInfo ( xy.x + d.w - 30, xy.y + d.h + 18, 'size' );
	};	//	mouseoverSize()

	svc.mouseleaveSize = function ( d, i, ele ) {
		var sW = serviceId + ' mouseleaveSize()';
//		console.log ( sW + ':  Name: ' + d.name + '  event.altKey: ' + event.altKey );
		if ( uc.mouseOp && uc.mouseOp.sizing )
			return;
		if ( d.type !== uc.TYPE_PANEL )		//	panel's size box is always visible
			d3.select ( this )		//	select rect
				.classed ( 'u34-size-handle-transparent', true )
				.classed ( 'u34-size-handle',             false  );
		uc.rootPanel.hideFlyoverInfo();
	};	//	mouseleaveSize()

	svc.mousedownSize = function ( d, i, ele ) {
		var sW = serviceId + ' mousedownSize()';
//		console.log ( sW + ':  Name: ' + d.name + '  event.altKey: ' + event.altKey );
		event.stopPropagation();

		if ( uc.mouseOp )
			return;

		uc.mouseOp = {							//	mouse operation
			downData: 		d,					//	on what data the mouse operation started
			downEle: 		ele[i],
			sizing: 		true,
			moving: 		false,
			dragDrop: 		false,
			splitting: 		false,
			x0: 			event.pageX,		//	where
			y0: 			event.pageY,
			x: 				event.pageX,		//	current position
			y: 				event.pageY,
			dx: 			0,					//	change in position
			dy: 			0,

			updateXY: 		function  ( x, y ) {
				this.dx = x - this.x;		this.x = x;
				this.dy = y - this.y;		this.y = y;
			}	
		};

		d.clickDisabled = true;

		if ( d.onSizeStart )
			d.onSizeStart ( d, i, ele );

		window.addEventListener ( 'mousemove', windowMouseMove, true );
		window.addEventListener ( 'mouseup',   windowMouseUp,   true );
		window.addEventListener ( 'click',     windowClick,     true );
		uc.rootPanel.hideFlyoverInfo();
	};	//	mousedownSize()

//	svc.mousemoveSize = function( d, i, ele ) {
//		var sW = serviceId + ' mousemoveSize()';
//		console.log ( sW + ':  Name: ' + d.name + '  event.altKey: ' + event.altKey );
//	//	event.stopPropagation();
//	};	//	mousemoveSize()


	svc.mouseoverSave = function ( d, i, ele ) {
	//	var sW = serviceId + ' mouseoverSave()';
	//	console.log ( sW );
	//	if ( d.isDragMoving )
		if ( uc.mouseOp && uc.mouseOp.moving )
			return;
		d3.select ( this )		//	select rect
			.classed ( 'u34-save-handle-transparent', false )
			.classed ( 'u34-save-handle',             true  );
		uc.rootPanel.showFlyoverInfo ( d.x, d.y,      'save layout' );
	};	//	mouseoverSave()

	svc.mouseleaveSave = function ( d, i, ele ) {
	//	var sW = serviceId + ' mouseleaveSave()';
	//	console.log ( sW );
		d3.select ( this )		//	select rect
			.classed ( 'u34-save-handle-transparent', true )
			.classed ( 'u34-save-handle',             false  );
		uc.rootPanel.hideFlyoverInfo();
	};	//	mouseleaveSave()


	svc.mouseoverClose = function ( d, i, ele ) {
	//	var sW = serviceId + ' mouseoverClose()';
	//	console.log ( sW );
	//	if ( d.isDragMoving )
		var x;
		if ( uc.mouseOp && uc.mouseOp.moving )
			return;
		d3.select ( this )		//	select rect
			.classed ( 'u34-close-handle-transparent', false )
			.classed ( 'u34-close-handle',             true  );
		x = d.x;
		if ( d.constructor.name === 'PanelData' )
			x += d.baseData[0].w;
		else
			x += d.w;
		uc.rootPanel.showFlyoverInfo ( x, d.y,      'close' );
	};	//	mouseoverClose()

	svc.mouseleaveClose = function ( d, i, ele ) {
	//	var sW = serviceId + ' mouseleaveClose()';
	//	console.log ( sW );
		d3.select ( this )		//	select rect
			.classed ( 'u34-close-handle-transparent', true )
			.classed ( 'u34-close-handle',             false  );
		uc.rootPanel.hideFlyoverInfo();
	};	//	mouseleaveClose()


	svc.mousedownSplitter = function ( d, i, ele ) {
		var sW  = serviceId + ' mousedownSplitter()';
		console.log ( sW + ':  Name: ' + d.name + '  event.altKey: ' + event.altKey );
		var svc = this;
		event.stopPropagation();

		if ( uc.mouseOp )
			return;

		uc.mouseOp = {							//	mouse operation
			downData: 		d,					//	on what data the mouse operation started
			downEle: 		ele[i],
			sizing: 		false,
			moving: 		false,
			dragDrop: 		false,
			splitting: 		true,
			x0: 			event.pageX,		//	where
			y0: 			event.pageY,
			x: 				event.pageX,		//	current position
			y: 				event.pageY,
			dx: 			0,					//	change in position
			dy: 			0,

			updateXY: 		function  ( x, y ) {
				this.dx = x - this.x;		this.x = x;
				this.dy = y - this.y;		this.y = y;
			}	
		};

		window.addEventListener ( 'mousemove', windowMouseMove, true );
		window.addEventListener ( 'mouseup',   windowMouseUp,   true );
		window.addEventListener ( 'click',     windowClick,     true );


		svc.screenPanel = uc.upAppScreen ( { sc: 			sW,
											 clickCB: 		null,
											 baseClass: 	'u34-horz-splitter-screen' } );
	};	//	mousedownSplitter()

	function windowMouseMove() {
		var sW = serviceId + ' windowMouseMove()';
	//	console.log ( sW );
		var op = uc.mouseOp;
		if ( ! op )
			return;
		var d = op.downData;
		op.updateXY ( event.pageX, event.pageY );
		if ( op.sizing ) {
			if ( ! op.downData.onSize )
				return;
			d.onSize ( d, -1, op.downEle, op.dx, op.dy );
			event.preventDefault();		//	prevents highlighting/flashing selections of input controls
			if ( d.propCB ) {			//	update the properties board?
				d.propCB ( 'w', d.w );
				d.propCB ( 'h', d.h );
			}
		}
		if ( op.moving ) {
			if ( ! op.downData.onMove )
				return;
			if ( ! d.parentPanel )
				return;
			var dx = op.x - op.grid.x;
			var dy = op.y - op.grid.y;
			console.log ( sW + ': dx y: ' + dx + ' ' + dy );
			var e = d.parentPanel.gridMove ( d, { x: d.x + dx, y: d.y + dy } );
			if ( e === null )
				return;
			if ( e.x !== d.x )
				op.grid.x += (e.x - d.x);
			if ( e.y !== d.y )
				op.grid.y += (e.y - d.y);
			d.onMove ( d, -1, op.downEle, e.x, e.y );
			event.preventDefault();		//	prevents highlighting/flashing selections of input controls
			if ( d.propCB ) {			//	update the properties board?
				d.propCB ( 'x', d.x );
				d.propCB ( 'y', d.y );
			}
		}
		if ( op.splitting ) {
			if ( ! op.downData.onSplit )
				return;
			op.downData.onSplit ( op.downData, -1, op.downEle, op.dx, op.dy );
			event.preventDefault();		//	prevents highlighting/flashing selections of input controls
		}
	}	//	windowMouseMove

	function windowMouseUp() {
		var sW = serviceId + ' windowMouseUp()';
//		console.log ( sW );
		window.removeEventListener ( 'mousemove', windowMouseMove, true );
		window.removeEventListener ( 'mouseup',   windowMouseUp,   true );
		var op = uc.mouseOp;
		if ( ! op )
			return;
		if ( op.sizing ) {
			if ( op.downData.type !== uc.TYPE_PANEL )
				d3.select ( op.downEle )	//	select size rect
					.classed ( 'u34-size-handle-transparent', true )
					.classed ( 'u34-size-handle',             false  );
			return;		//	Do not set uc.mouseOp = null here when sizing.  See svc.mouseup().
		}
		if ( op.moving ) {
			d3.select ( op.downEle )	//	select move rect
				.classed ( 'u34-move-handle-transparent', true )
				.classed ( 'u34-move-handle',             false  );
		}
		if ( op.splitting ) {
			uc.downAppScreen();		svc.screenPanel = null;
			window.removeEventListener ( 'click', windowClick, true );
		}
		if ( ! op.downData.hasBorder ) 							//	in case this mouseup event happens 
			d3.select ( '#' + op.downData.eleId + '-rect' )		//	outside the app and the control does 
				.classed ( 'u34-light-border', false );					//	not get a mouseleave event
		uc.mouseOp = null;
	}	//	windowMouseUp

	function windowClick() {
		var sW = serviceId + ' windowClick()';
		console.log ( sW );
		event.stopPropagation();
		window.removeEventListener ( 'click', windowClick, true );
	}	//	windowClick()

//	svc.mouseupSize = function( d, i, ele ) {
//		var sW = serviceId + ' mouseupSize()';
//		console.log ( sW + ':  Name: ' + d.name + '  event.altKey: ' + event.altKey );
//		event.stopPropagation();
//		uc.mouseOp = null;
//	};	//	mouseupSize()



	function ControlData ( o ) {
		this.id = 0;						//	set by the control when it is defined
		if ( ! o ) 
			return;
		this.type = o.type;					//	'panel', 'button', etc..
		this.x = o.x;
		this.y = o.y;
		this.w = o.w;
		this.h = o.h;
		this.name  = o.name;
		this.panel       = null;			//	set by the panel the control is on
		this.parentPanel = null;			//	or it may be parentPanel

		//	if not specified then set by the panel the control is on
		this.eleId = o.eleId === undefined ? null : o.eleId;	

		this.class     = o.class;			//	these work together - when class.stroke is not visible
		this.hasBorder = o.hasBorder;		//	then hasBorder should be false

		this.clickDisabled = false;

		this.fillsPanel = false;			//	control position, size to fill a panel - table,
											//	tabs controls for examples

		this.propCB = null;					//	Properties Board sets this to get updates when, for
											//	examples, the user moves or sizes the control with the mouse

		this.onMouseOver  = null;			//	when the mouse enters the control
		this.onMouseLeave = null;			//	and exits the control
		this.onMouseDown  = null;			//	when the mouse button is pressed while inside the control
		this.onMouseMove  = null;			//	when the mouse moves inside the control
		this.onMouseUp    = null;			//	when the mouse button is released while inside the control
		this.onSizeStart  = null;			//	when the control is about to be sized
		this.onSize       = null;			//	when the control is sized
		this.onSize2      = null;  			//	passes <g>, has no callbacks
		this.onMove       = null;			//	when the control moves

	}	//	ControlData()

	ControlData.prototype.showPropertiesBoard = function ( title ) {
			var sW = serviceId + ' ControlData.prototype.showPropertiesBoard()';
			uBoards.showPropertiesBoard ( { sC: 		sW,
										  	uduiId: 	uc.ROOT_UDUI_ID, 
									//		forPanel: 	panelData.panel } );
											ofCtrlD: 	this,
											title: 		title } );
	};	//	showPropertiesBoard()

	ControlData.prototype.listProperties = function() {
		var sW = serviceId + ' ControlData.prototype.listProperties()';
		var whiteList = [ 'x', 'y', 'w', 'h', 'name' ];
		var value, props = [], displayName;
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
				case 'w': 			displayName = 'width';		break;
				case 'h': 			displayName = 'height';		break;
			}
			console.log ( sW + '   key: ' + key + '  value: ' + value );
			props.push ( { property: key, value: value, displayName: displayName } );
		}
		return props;
	};

	ControlData.prototype.setProperty = function ( name, value ) {
		var sW = serviceId + ' ControlData.prototype.setProperty()';
		var n, g, dx, dy;
		if ( typeof value !== 'string' )
			return -1;
		if ( (name === 'x') || (name === 'y') ) {
			n = Number ( value );
			if ( n !== n ) 					//	Good Grief!  ... testing for NaN ...	got'a love JS :(	
				return;
			this[name] = n;
			d3.select ( '#' + this.eleId )
				.attr ( 'transform', function ( d, i ) { 
					return 'translate(' + d.x + ',' + d.y + ')'; 
				} );
			this.parentPanel.updateSclrs();
			return 1;
		}
		if ( (name === 'w') || (name === 'h') ) {
			if ( ! this.onSize2 )
				return;
			if ( value.length === 0 )
				return;
			n = Number ( value );
			if ( n !== n ) 					//	Good Grief!  ... testing for NaN ...	got'a love JS :(	
				return;
			g = d3.select ( '#' + this.eleId );
			dx = name === 'w' ? n - this.w : 0;
			dy = name === 'h' ? n - this.h : 0;
			this.onSize2 ( this, g, dx, dy );
			return 1;
		}
		if ( name === 'name' ) {
			this[name] = value;
			return 1;
		}
		return 0;
	};	//	ControlData.prototype.setProperty()

	svc.newControlData = function() {
		return new ControlData ( null );
	};

	svc.callControlData = function ( it, o ) {
		return ControlData.call ( it, o );
	};

	svc.setProperty = function ( it, name, value ) {
		return ControlData.prototype.setProperty.call ( it, name, value );
	};

	svc.listProperties = function ( it, props ) {
		return ControlData.prototype.listProperties.call ( it );
	};

	return svc;

})();
