
//  src/client/udui-panel-f.js

//	To use ControlData.

'use strict';

module.exports = (function() {

	var d3   = 			require ( 'd3' );
	var userAuth = 		require ( './udui-user-auth.js' );
	var uc = 			require ( './udui-common.js' );
	var uSL = 			require ( './udui-store-load-a.js' );
	var uCD = 			require ( './udui-control-data-a.js' );
	var uButton = 		require ( './udui-button-e.js' );
	var uSplitter = 	require ( './udui-splitter-b.js' );
	var uList = 		require ( './udui-list-b.js' );
	var uInput = 		require ( './udui-input-b.js' );
	var uLabel = 		require ( './udui-label-b.js' );
	var uCheckbox = 	require ( './udui-checkbox-b.js' );
	var uTabs = 		require ( './udui-tabs-a.js' );
	var uTable = 		require ( './udui-table-a.js' );
	var uTextarea = 	require ( './udui-textarea-a.js' );
	
	/* global $timeout */

	var serviceId = 'uduiPanelF';

	/* jshint validthis: true */

	var svc = {};

	uc.panelSvc = svc;

	function ClipPath ( eleId, x, y, w, h ) {
		this.eleId = eleId;
		this.x = x + uc.OFFS_4_1_PIX_LINE;
		this.y = y + uc.OFFS_4_1_PIX_LINE;
		this.w = w;
		this.h = h;
	}	//	ClipPath()

	function FilterData ( o ) {
		this.eleId        = o.eleId;
		this.inBlur       = o.inBlur;
		this.stdDev       = o.stdDev;
		this.dx           = o.dx;
		this.dy           = o.dy;
		this.inMergeNode2 = o.inMergeNode2;
	}	//	FilterData()

	function BaseData ( x, y, w, h, name, panelData, panelEleId ) {
		this.type = uc.TYPE_PANEL_BASE;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.name = name;
		this.panelData  = panelData;
		this.panelEleId = panelEleId;
	}	//	BaseData()


	function mouseOver ( d, i, ele ) {
		var sW = serviceId + ' mouseOver()';
		var pd = d.panelData;
//		console.log ( sW + '  panel: ' + pd.name );
		event.stopPropagation();

		//	Drag & Drop: Step 3 -
		//
		//		indicate targetable screen and target(s)

		if ( ! uc.isDragging )
			return;

		var dcd = uc.dragee.dragCtrlData;

		if ( dcd.eleId === pd.eleId ) {						//	it is this panel?
			return;
		}

	//	if ( dcd.parentPanel.data.eleId === pd.eleId  )		//	or is already a child of this panel
	//		return;
	//	determine elligibility on a target bases

//		if ( angular.isDefined ( d.dragTarget ) && (d.dragTarget !== null) ) {
		if ( uc.isDefined ( d.dragTarget ) && (d.dragTarget !== null) ) {
			d.dragTarget.over = true;
			uc.dragee.rootPanel.dragInfoLine1 ( 'target panel: ' + pd.name );
			return;
		}

	//	console.log ( sW, ': creating d.dragTarget' );

		d.dragTarget = { over: true };

		//	in the root panel - 
		//
		//		-	append the screen above everything else
		//
		//			but screen does not appear unless the mouse is over the root panel
		//
		//		-	insert the transparent zone polygons before the child panels so
		//			that the mouse event over the child panels will be detected
		//			and child panel screens will be shown instead the root's.

		d.dragTarget.screen = d3.select ( '#' + d.eleId )
			.append ( 'g' )
			.attr ( 'id',     d.eleId + '-drag-target-screen' )
			.attr ( 'transform', 'translate(' + (-d.x + uc.OFFS_4_1_PIX_LINE) + ',' 
											  + (-d.y + uc.OFFS_4_1_PIX_LINE) + ')' );
		d.dragTarget.screen
			.append ( 'rect' ) 
			.attr ( 'id',     d.eleId + '-drag-target-screen-rect' )
			.attr ( 'x',      0 )
			.attr ( 'y',      0 )
			.attr ( 'width',  function ( d ) { 
				return d.w - uc.PANEL_BORDER_WIDTH; 
			} )
			.attr ( 'height', function ( d ) { 
				return d.h - uc.PANEL_BORDER_WIDTH; 
			} )
			.attr ( 'class',  'u34-drag-target-screen' );

		//	Five targets - 
		//
		//		center - dragee becomes a child in this panel (if not already so)
		//
		//		left, top, right, bottom - dock - this panel is split
		//
		//	How to represent (draw) a target without looking crowded or busy? -

		//	Try dashed lines to indicate target zones.
		//
		var xul  = 0;										//	upper left 
		var yul  = 0; 
		var xul4 = xul + (d.w / 4);							//	upper left inner by 1/4
		var yul4 = yul + (d.h / 4);
		var xur  = xul + d.w;								//	upper right
		var yur  = yul;
		var xur4 = xur - (d.w / 4);
		var yur4 = yul4;
		var xlr  = xur;										//	lower right
		var ylr  = yul + d.h;
		var xlr4 = xur4;
		var ylr4 = ylr - (d.h / 4);
		var xll  = xul;										//	lower left
		var yll  = ylr;
		var xll4 = xul4;
		var yll4 = ylr4;
		d.dragTarget.screen
			.append ( 'line')
			.attr ( 'x1', xul ).attr ( 'y1', yul ).attr ( 'x2', xul4 ).attr ( 'y2', yul4 )
			.attr ( 'stroke-dasharray', '5,3' )
			.attr ( 'class', 'u34-test-line-drop-target' );
		d.dragTarget.screen
			.append ( 'line')
			.attr ( 'x1', xur ).attr ( 'y1', yur ).attr ( 'x2', xur4 ).attr ( 'y2', yur4 )
			.attr ( 'stroke-dasharray', '5,3' )
			.attr ( 'class', 'u34-test-line-drop-target' );
		d.dragTarget.screen
			.append ( 'line')
			.attr ( 'x1', xlr ).attr ( 'y1', ylr ).attr ( 'x2', xlr4 ).attr ( 'y2', ylr4 )
			.attr ( 'stroke-dasharray', '5,3' )
			.attr ( 'class', 'u34-test-line-drop-target' );
		d.dragTarget.screen
			.append ( 'line')
			.attr ( 'x1', xll ).attr ( 'y1', yll ).attr ( 'x2', xll4 ).attr ( 'y2', yll4 )
			.attr ( 'stroke-dasharray', '5,3' )
			.attr ( 'class', 'u34-test-line-drop-target' );
		d.dragTarget.screen
			.append ( 'line')
			.attr ( 'x1', xul4 ).attr ( 'y1', yul4 ).attr ( 'x2', xur4 ).attr ( 'y2', yur4 )
			.attr ( 'stroke-dasharray', '5,3' )
			.attr ( 'class', 'u34-test-line-drop-target' );
		d.dragTarget.screen
			.append ( 'line')
			.attr ( 'x1', xur4 ).attr ( 'y1', yur4 ).attr ( 'x2', xlr4 ).attr ( 'y2', ylr4 )
			.attr ( 'stroke-dasharray', '5,3' )
			.attr ( 'class', 'u34-test-line-drop-target' );
		d.dragTarget.screen
			.append ( 'line')
			.attr ( 'x1', xlr4 ).attr ( 'y1', ylr4 ).attr ( 'x2', xll4 ).attr ( 'y2', yll4 )
			.attr ( 'stroke-dasharray', '5,3' )
			.attr ( 'class', 'u34-test-line-drop-target' );
		d.dragTarget.screen
			.append ( 'line')
			.attr ( 'x1', xll4 ).attr ( 'y1', yll4 ).attr ( 'x2', xul4 ).attr ( 'y2', yul4 )
			.attr ( 'stroke-dasharray', '5,3' )
			.attr ( 'class', 'u34-test-line-drop-target' );


		//	Transparent polygon for each zone to get drag-over events.
		//
		//	in the root panel -
		//
		//		-	insert in the root's base <g> after the base rect but before 
		//			any controls in that <g>
		//
		var selection;
		if ( pd.name === uc.APP_CLIENT_ROOT_PANEL_NAME )
			selection = d.dragTarget.zones = d3.select ( '#' + d.eleId )
				.insert ( 'g', ':nth-child(0n+2)' )
				.attr ( 'id', 'root-panel-drop-zones' )
				.attr ( 'transform', 'translate(0,0)' );
		else
			selection = d.dragTarget.screen;

		selection
			.append ( 'g' )
			.attr ( 'id', 		function ( d, i ) { return d.panelEleId + '-' + d.name + '-droptargetleft'; } )
			.attr ( 'transform', 'translate(0,0)' )
			.on ( 'mouseover', mouseOverDropTargetLeft )
			.on ( 'mouseout',  mouseLeaveDropTargetLeft )
				.append ( 'polygon' )
				.attr ( 'id', 		function ( d, i ) { return d.panelEleId + '-' + d.name + '-droptargetleft-rect'; } )
				.attr ( 'points',   function ( d, i ) {
					var pts  = '';
					pts += xul  + ' ' + yul  + ',';
					pts += xul4 + ' ' + yul4 + ',';
					pts += xll4 + ' ' + yll4 + ',';
					pts += xll  + ' ' + yll;
					return pts;
				} )
				.attr ( 'class', 'u34-test-polygon-drop-target' );
		selection
			.append ( 'polygon' )
			.attr ( 'id', 		function ( d, i ) { return d.panelEleId + '-' + d.name + '-droptargettop'; } )
			.attr ( 'points',   function ( d, i ) {
				var pts  = '';
				pts += xul  + ' ' + yul  + ',';
				pts += xur  + ' ' + yur  + ',';
				pts += xur4 + ' ' + yur4 + ',';
				pts += xul4 + ' ' + yul4;
				return pts;
			} )
			.attr ( 'class', 'u34-test-polygon-drop-target' )
			.on ( 'mouseover', mouseOverDropTargetTop )
			.on ( 'mouseout',  mouseLeaveDropTargetTop );
		selection
			.append ( 'polygon' )
			.attr ( 'id', 		function ( d, i ) { return d.panelEleId + '-' + d.name + '-droptargetright'; } )
			.attr ( 'points',   function ( d, i ) {
				var pts  = '';
				pts += xur  + ' ' + yur  + ',';
				pts += xlr  + ' ' + ylr  + ',';
				pts += xlr4 + ' ' + ylr4 + ',';
				pts += xur4 + ' ' + yur4;
				return pts;
			} )
			.attr ( 'class', 'u34-test-polygon-drop-target' )
			.on ( 'mouseover', mouseOverDropTargetRight )
			.on ( 'mouseout',  mouseLeaveDropTargetRight );
		selection
			.append ( 'polygon' )
			.attr ( 'id', 		function ( d, i ) { return d.panelEleId + '-' + d.name + '-droptargetbottom'; } )
			.attr ( 'points',   function ( d, i ) {
				var pts  = '';
				pts += xll4 + ' ' + yll4 + ',';
				pts += xlr4 + ' ' + ylr4 + ',';
				pts += xlr  + ' ' + ylr  + ',';
				pts += xll  + ' ' + yll;
				return pts;
			} )
			.attr ( 'class', 'u34-test-polygon-drop-target' )
			.on ( 'mouseover', mouseOverDropTargetBottom )
			.on ( 'mouseout',  mouseLeaveDropTargetBottom );
		selection
			.append ( 'g' )
			.attr ( 'id', function ( d, i ) { return d.panelEleId + '-' + d.name + '-droptargetcenter'; } )
			.attr ( 'transform', 'translate(0,0)' )
			.on ( 'mouseover', mouseOverDropTargetCenter )
			.on ( 'mouseout',  mouseLeaveDropTargetCenter )
				.append ( 'polygon' )
				.attr ( 'id', 		function ( d, i ) { return d.panelEleId + '-' + d.name + '-droptargetcenter-rect'; } )
				.attr ( 'points',   function ( d, i ) {
					var pts  = '';
					pts += xul4 + ' ' + yul4 + ',';
					pts += xur4 + ' ' + yur4 + ',';
					pts += xlr4 + ' ' + ylr4 + ',';
					pts += xll4 + ' ' + yll4;
					return pts;
				} )
				.attr ( 'class', 'u34-test-polygon-drop-target' );

		//	Some info about the target.
		//
		uc.dragee.rootPanel.dragInfoLine1 ( 'target panel: ' + pd.name );

	}	//	mouseOver()

	function mouseLeave ( d, i, ele ) {
		var sW = serviceId + ' mouseLeave()';
		var pd = d.panelData;
	//	console.log ( sW + '  panel: ' + pd.name );
		sW += '  panel: ' + pd.name;
		event.stopPropagation();

		if ( uc.isDefined ( d.dragTarget ) && (d.dragTarget !== null) ) {
			d.dragTarget.over = false;
		//	d.dragTarget.leavePromise = $timeout ( function () {
		//	//	NoNg
			//	What was the promise for?  Can not find any other reference to it.
			//	https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
			window.setTimeout ( function () {
				if ( ! d.dragTarget )
					return;
				if ( d.dragTarget.over )
					return;
			//	console.log ( sW + ': leave timeout - inCircle?' );
				if ( ! d.dragTarget.inCircle ) {
			//		console.log ( sW + ': no - removing target screen' );
					d.dragTarget.screen.remove();
					if ( pd.name === uc.APP_CLIENT_ROOT_PANEL_NAME )
						d.dragTarget.zones.remove();
			//		console.log ( sW + '   clearing info - pd.name: ' + pd.name );
					uc.dragee.rootPanel.dragInfoLine1 ( '' );
					uc.dragee.rootPanel.dragInfoLine2 ( '' );
					d.dragTarget = null;
				} 
			//	else
			//		console.log ( sW + ': yes - continue showing target screen' );
			}, 1 );
		}
	}	//	mouseLeave()

	function mouseDown ( d, i, ele ) {
		var sW = serviceId + ' mouseDown()';
//		console.log ( sW + '  panel: ' + d.panelData.name );

		event.stopPropagation();
		event.preventDefault();					//	prevents text cursor

	//	uc.mouseOp = {							//	mouse operation
	//		downData: 		d.panelData,		//	on what data the mouse operation started
	//		x0: 			event.pageX,		//	where
	//		y0: 			event.pageY,
	//		x: 				event.pageX,		//	current position
	//		y: 				event.pageY,
	//		dx: 			0,					//	change in position
	//		dy: 			0,
	//
	//		updateXY: 		function  ( x, y ) {
	//			this.dx = x - this.x;		this.x = x;
	//			this.dy = y - this.y;		this.y = y;
	//		}	
	//	};
	//
	//	d.clickDisabled = false;
	//
	//	set by ControlData

		if ( event.altKey ) {
			//	Drag & Drop: Step 1 -
			//
			//		called by mouseDown()
			//
			//		pick up - drag - drop  -  i.e., moving the panel to another parent panel
			//		i.e., floating, docking, etc..
			//
			uc.mouseOp.dragDrop = true;
			uc.initiateDrag ( d.panelData, d.w, d.h );
		} else
		if ( event.shiftKey ) {

		} else {
		//	dragSclrStarted2.call ( this, d, i, ele, uc.mouseOp );
		}

	}	//	mouseDown()

	function mouseMove ( d, i, ele ) {
		var sW = serviceId + ' mouseMove()';
		var pd = d.panelData;
	//	var baseX = d.x - uc.OFFS_4_1_PIX_LINE;
	//	var baseY = d.y - uc.OFFS_4_1_PIX_LINE;
	//	var lcl   = uc.localXY ( d.panelData, event.clientX, event.clientY, baseX, baseY );
	//	console.log ( sW + '  panel eleId: ' + pd.eleId + '  X Y: ' + lcl.x + '  ' + lcl.y );

		if ( ! uc.mouseOp )
			return;

		if ( pd.name === uc.APP_CLIENT_ROOT_PANEL_NAME )
			uc.mouseOp.updateXY ( event.pageX, event.pageY );

		if ( uc.isDragging ) {
	//		console.log ( sW + ': mouse x y ' + uc.mouseOp.x + ' ' + uc.mouseOp.y );
			pd.clickDisabled = true;
			if ( pd.name !== uc.APP_CLIENT_ROOT_PANEL_NAME )
				return;
			uc.dragee.dx = uc.mouseOp.dx;
			uc.dragee.dy = uc.mouseOp.dy;
			uc.dragee.rootPanel.drag ( uc.dragee );		//	Drag & Drop: Step 2
			return;
		}

		if ( uc.mouseOp.downData.eleId === d.panelData.eleId ) {
			if ( pd.name !== uc.APP_CLIENT_ROOT_PANEL_NAME )
				uc.mouseOp.updateXY ( event.pageX, event.pageY );
			if ( uc.mouseOp.scrolling ) 
				dragSclred2.call ( this, d, i, ele, uc.mouseOp );
			else
			if ( uc.mouseOp.selecting ) 
				selectUpdate.call ( this, d, i, ele );
			else {
				var dx = uc.mouseOp.x0 - uc.mouseOp.x;
				var dy = uc.mouseOp.y0 - uc.mouseOp.y;
				if ( (Math.abs ( dx ) >= 2) || (Math.abs ( dy ) >= 2) ) {
					if ( event.shiftKey ) {
						uc.mouseOp.selecting = true;
						selectStart.call ( this, d, i, ele );
						pd.clickDisabled = true;
					} else {
						uc.mouseOp.scrolling = true;
						dragSclrStarted2.call ( this, d, i, ele );
						dragSclred2.call ( this, d, i, ele, uc.mouseOp );
						pd.clickDisabled = true;
					}
				}
			}
			event.stopPropagation();
		}
	}	//	mouseMove()

	function mouseUp ( d, i, ele ) {
		var sW = serviceId + ' mouseUp()';
		var x, y, newPanelData, newPanel, pd = d.type === uc.TYPE_PANEL_BASE ? d.panelData : d;
//		console.log ( sW + '  panel: ' + pd.name );

		event.stopPropagation();

		if ( uc.mouseOp && (uc.mouseOp.downData.eleId !== pd.eleId) ) 
			pd.clickDisabled = true;

		var mouseOp = uc.mouseOp;		
					  uc.mouseOp = null;

		if ( mouseOp && mouseOp.scrolling ) {
			dragSclrEnded.call ( this, d );
			return;
		}

		if ( mouseOp && mouseOp.selecting ) {
			selectEnd.call ( this, d, mouseOp );
			return;
		}

		//	Drag & Drop: Finally -
		if ( uc.isDragging ) {
			var dt   = uc.dragee.dropTarget;
			var drop = uc.dragee.dragCtrlData.panel;

			var ebcr = dt.targetEle.getBoundingClientRect();		//	for e2e test development
			var eleX = event.pageX - ebcr.left;						//
			var eleY = event.pageY - ebcr.top;						//
			console.log ( sW + ': mouse x y ' + mouseOp.x + ' ' + mouseOp.y + '  ele ID ' + dt.targetEle.id + '  ele x y ' + eleX + ' ' + eleY );

			//	target panel (dt) Is the parent of what is being dragged and dropped (SrcParent)?
			var dtIsSrcParent = false;
			if ( drop.data.parentPanel && (drop.data.parentPanel.data.eleId === dt.panel.data.eleId) )
				dtIsSrcParent = true;

			uc.dragee.rootPanel.dragEnd ( uc.dragee );

			if ( dt ) {
				var bd = dt.panel.data.baseData[0];
				if ( bd.dragTarget ) {
					bd.dragTarget.screen.remove();
					if ( dt.panel.data.name === uc.APP_CLIENT_ROOT_PANEL_NAME )
						bd.dragTarget.zones.remove();
				}

				var parentPanel = uc.dragee.dragCtrlData.parentPanel;	//	set before the dock because it will change

				//	2017-Apr-09
				//
				//	If the drop target is not the source parent -
				//
				//		A new panel will be created.
				//
				//		Destroy the old panel  * first *.
				//
				//		But not its contents.
				//
				//		Get references to the old panel's contents, remove those references from the old
				//		panel's data, then destroy the old panel (along with it's clippath). I.e., create
				//		a new array of data from the old panel.
				//
				//		So, drop, as it is passed here, will no longer exist.  But we will have the data 
				//		of what were its contents.
				//
				//		Do not pass  drop  to  dock...()  or whatever.  Instead pass the array of content 
				//		data from the panel just destroyed.
				//
				//		Will that work?  In general?

				var bDestroyDrop = true;

				var remainingPanel = getRemainingPanel ( parentPanel, drop );	//	2017-May-28

				switch ( dt.where ) {
					case 'left':
					//	dt.panel.dockSplitLeft  ( drop, uc.appPanelClick, dtIsSrcParent );
						dt.panel.dockSplitLeft2 ( drop, uc.appPanelClick, dtIsSrcParent );
						bDestroyDrop = false;		//	done in dockSplitLeft2().
						break;
					case 'top':
					//	dt.panel.dockSplitTop  ( drop, uc.appPanelClick, dtIsSrcParent );
						dt.panel.dockSplitTop2 ( drop, uc.appPanelClick, dtIsSrcParent );
						bDestroyDrop = false;		//	done in dockSplitTop2().
						break;
					case 'right':
					//	dt.panel.dockSplitRight  ( drop, uc.appPanelClick, dtIsSrcParent );
						dt.panel.dockSplitRight2 ( drop, uc.appPanelClick, dtIsSrcParent );
						bDestroyDrop = false;		//	done in dockSplitRight2().
						break;
					case 'bottom':
					//	dt.panel.dockSplitBottom  ( drop, uc.appPanelClick, dtIsSrcParent );
						dt.panel.dockSplitBottom2 ( drop, uc.appPanelClick, dtIsSrcParent );
						bDestroyDrop = false;		//	done in dockSplitBottom2().
						break;
					case 'center':
						var lcl = uc.localXY ( pd, event.clientX, event.clientY, 
											   d.x - uc.OFFS_4_1_PIX_LINE, 
											   d.y - uc.OFFS_4_1_PIX_LINE );
						newPanelData = svc.createPanelData (  { x: 			lcl.x + uc.OFFS_4_1_PIX_LINE, 
															  	y: 			lcl.y + uc.OFFS_4_1_PIX_LINE, 
															  	w: 			drop.data.w, 
															  	h: 			drop.data.h,
															  	name: 		drop.data.name,
															  	clickCB: 	drop.data.clickCB } );
						newPanel = dt.panel.addControl ( newPanelData );
						svc.addCtrls ( newPanel, drop.data.childData );
						break;
					default:
						console.log ( sW + ' ERROR: bad/unrecognized dt.where (' + dt.where + ')' );
						return;
				}
				if ( ! dtIsSrcParent )
				//	uc.dragee.dragCtrlData.parentPanel.rmvControl ( drop, { bKeepChildClipPaths: true } );
				//	uc.dragee.dragCtrlData.parentPanel.rmvControl ( drop, { bKeepChildClipPaths: false } );
					//	Note that the data of what was just docked/floated might (should?) be the 
					//	same instance as that of the drop - to preserve references the to or from that
					//	data.  But the DOM elements docked/floated are probably new (duplicated from 
					//	those of the drop).  So - here we want to be certain we delete the DOM elements 
					//	of what was dragged and not those that were just created.
					if ( bDestroyDrop )
						parentPanel.rmvControl ( drop, { bKeepChildClipPaths: false } );
					//	2017-May-28		I think we need here -
					else
						if ( remainingPanel )
							parentPanel.unsplit ( remainingPanel );
			}
		}

	}	//	mouseUp()

	function click ( d, i, ele ) {
		var sW = serviceId + ' click()';
		var pd = d.panelData;
		console.log ( sW + '  panel: ' + pd.name + '  clientX Y: ' + event.clientX + '  ' + event.clientY );
		event.stopPropagation();
		if ( pd.clickDisabled ) {
			pd.clickDisabled = false;
			return;
		}
		if ( pd.clickCB )
			pd.clickCB ( pd, d.x - uc.OFFS_4_1_PIX_LINE, d.y - uc.OFFS_4_1_PIX_LINE );
	}	//	click()

	function inSelectRect ( g, s /* selection */ ) {
		s.minX = s.minY = Number.POSITIVE_INFINITY;
		s.maxX = s.maxY = Number.NEGATIVE_INFINITY;
		//	https://www.w3.org/TR/selectors-api/
		//	https://drafts.csswg.org/selectors-4/#child-combinators
		var ge = g._groups[0][0];
		d3.selectAll ( '#' + ge.id + '> g' )		//	just the child g and not descendents of those
			.each ( function ( d ) { 
				var x, y;
				if ( ! d.w )
					return;
				if ( (d.x > s.xs) && (d.x + d.w < s.xe) && (d.y > s.ys) && (d.y + d.h < s.ye) ) {
					s.ctrls.push ( d );

					if ( d.x < s.minX )  s.minX = d.x;
					x = d.x + d.w;
					if ( x > s.maxX )  s.maxX = x;

					if ( d.y < s.minY )  s.minY = d.y;
					y = d.y + d.h;
					if ( y > s.maxY )  s.maxY = y;
				}
			} );
		s.eX = s.maxX - s.minX;
		s.eY = s.maxY - s.minY;
	}	//	inSelectRect()

	function xMinMax ( g, o ) {
		o.minX = Number.POSITIVE_INFINITY;
		o.maxX = Number.NEGATIVE_INFINITY;
	//	g.selectAll ( 'g' )
		//	https://www.w3.org/TR/selectors-api/
		//	https://drafts.csswg.org/selectors-4/#child-combinators
		var ge = g._groups[0][0];
		d3.selectAll ( '#' + ge.id + '> g' )		//	just the child g and not descendents of those
			.each ( function ( d ) { 
	//			if ( (! d.x) || (! d.w) )  return;
				if (             ! d.w  )  return;
				if ( d.x < o.minX )  o.minX = d.x;
				var x = d.x + d.w;
				if ( x > o.maxX )  o.maxX = x;
			} );
		o.eX = o.maxX - o.minX;
	}	//	xMinMax()

	function yMinMax ( g, o ) {
		o.minY = Number.POSITIVE_INFINITY;
		o.maxY = Number.NEGATIVE_INFINITY;
	//	g.selectAll ( 'g' )
		//	https://www.w3.org/TR/selectors-api/
		//	https://drafts.csswg.org/selectors-4/#child-combinators
		var ge = g._groups[0][0];
		d3.selectAll ( '#' + ge.id + '> g' )		//	just the child g and not descendents of those
			.each ( function ( d ) { 
	//			if ( (! d.y) || (! d.h) )  return;
				if (             ! d.h  )  return;
				if ( d.y < o.minY )  o.minY = d.y;
				var y = d.y + d.h;
				if ( y > o.maxY )  o.maxY = y;
			} );
		o.eY = o.maxY - o.minY;
	}	//	yMinMax()

	function updateHsclr0 ( panelEleId ) {
		//	Update horizontal scroller.
		var o = {}, g = d3.select ( '#' + panelEleId + '-' + 'base' );
		g.each ( function ( d ) { 
			xMinMax ( g, o );
			updateHsclr ( g, d, o ); 
		} );
	}	//	updateHsclr0()

	function updateHsclr ( g,			//	that of id="base"
						   d, 			//	the base's data
						   ox ) {		//	extents of controls horizontally
	//	var iX =                          uc.PANEL_BORDER_WIDTH      + uc.OFFS_4_1_PIX_LINE;	//	indicator position
		var iX = (d.panelData.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) + uc.OFFS_4_1_PIX_LINE;	//	indicator position
		var iW = d.w - uc.PANEL_BORDER_WIDTH;					//	indicator Height
		if ( d.x + ox.minX < 0 ) {
			iX += parseInt ( (((-ox.minX - d.x) * d.w) / ox.eX).toFixed ( 0 ) );
			iW  = parseInt ( ((d.w * d.w) / ox.eX).toFixed ( 0 ) ) - uc.PANEL_BORDER_WIDTH;
			if ( Math.round ( (-d.x) + d.w ) >= ox.maxX ) 
				iW = d.w - iX + uc.OFFS_4_1_PIX_LINE;
		} else {
			var r = Math.round ( (-d.x) + d.w );
			if ( ox.maxX > r ) 
				iW = d.w - parseInt ( (((ox.maxX - r) * d.w) / ox.eX).toFixed ( 0 ) );
		}
		d3.select ( '#' + d.panelEleId + '-' + 'hsclr' )			//	for now, just use the "thumb" on the right
			.attr ( 'x',     function ( d, i ) { return iX; } )
			.attr ( 'width', function ( d, i ) { return iW; } );
	}	//	updateHsclr()

	function updateVsclr0 ( panelEleId ) {
		//	Update vertical scroller.
		var o = {}, g = d3.select ( '#' + panelEleId + '-' + 'base' );
		g.each ( function ( d ) { 
			yMinMax ( g, o );
			updateVsclr ( g, d, o ); 
		} );
	}	//	updateVsclr0()

	function updateVsclr ( g,			//	that of id="base"
						   d, 			//	the base's data
						   oy ) {		//	extents of controls vertically
		//	Set indicators - maybe a lightgray piece on the border. Get extents of 
		//	the controls.  Use selection.each(function) -
		//		https://github.com/d3/d3-selection#selection_each
		//
		//	Height (lightgray length) of indicator on right border might be proportional 
		//	to height-of-panel / eY.  So the greater the extent of the controls the smaller 
		//	the indicator - which gives it more room to move and show the amount of  
		//	scrolling that can be done.
		//
		//		d.h: 	height of the "viewport"
		//
		//		eY: 	total height of the controls - i.e., their vertical extents, the size
		//				of the "subject"
		//
		//		scrolling is useful when -
		//
		//			(d.h / eY)  <  1  
		//
		//		i.e., when either controls extents top or bottom is beyond the "viewport" top 
		//		or bottom
		//
		//		So, for now, (d.h / eY) -
		//
		//			is always < 1 
		//
		//			gets smaller as the control's extents get farther apart - i.e, as the 
		//			"subject" gets larger.
		//
	//	var iY =                          uc.PANEL_BORDER_WIDTH      + uc.OFFS_4_1_PIX_LINE;	//	indicator position
		var iY = (d.panelData.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) + uc.OFFS_4_1_PIX_LINE;	//	indicator position
		var iH = d.h - uc.PANEL_BORDER_WIDTH;					//	indicator Height
	//	if (                   d.y + oy.minY <  0   ) {	
	//	if ( (oy.eY > d.h) && (d.y + oy.minY <  0)  ) {			//	2017-May-04
		if (                   d.y + oy.minY < -0.5 ) {			//	2017-May-07
			iY += parseInt ( (((-oy.minY - d.y) * d.h) / oy.eY).toFixed ( 0 ) );
			iH  = parseInt ( ((d.h * d.h) / oy.eY).toFixed ( 0 ) ) - uc.PANEL_BORDER_WIDTH;
			if ( Math.round ( (-d.y) + d.h ) >= oy.maxY ) 
				iH = d.h - iY + uc.OFFS_4_1_PIX_LINE;
		} else {
			var r = Math.round ( (-d.y) + d.h );
			if ( oy.maxY > r ) 
				iH = d.h - parseInt ( (((oy.maxY - r) * d.h) / oy.eY).toFixed ( 0 ) );
		}
	//	if ( d.eleId === 'rr-11-base' )
	//		console.log ( 'updateVsclr()  d.h: ' + d.h 
	//							   + '   minY: ' + oy.minY 
	//							   + '   maxY: ' + oy.maxY
	//							     + '   eY: ' + oy.eY 
	//							     + '   iH: ' + iH  
	//							    + '   d.y: ' + d.y 
	//							     + '   iY: ' + iY );
		d3.select ( '#' + d.panelEleId + '-' + 'vsclr' )		//	for now, just use the "thumb" on the right
			.attr ( 'y',      function ( d, i ) { return iY; } )
			.attr ( 'height', function ( d, i ) { return iH; } );
	}	//	updateVsclr()

//		function dragSclrFilter ( d ) {
//			var sW = serviceId + ' dragSclrFilter()';
//			console.log ( sW + '  panel name: ' + d.panelData.name + '  event.altKey: ' + event.altKey );
//			if ( d3.event.button !== 0 )
//				return false;
//			if ( event.altKey )
//				return false;
//			return true;
//		}

	function dragSclrStarted2 ( d, i, ele ) {
		var sW = serviceId + ' dragSclrStarted2()';
//		console.log ( sW + '  panel name: ' + d.panelData.name + '  event.altKey: ' + event.altKey );

		//	scrolling/panning

		d3.select ( '#' + d.panelEleId + '-' + 'vsclr' )
			.classed ( 'u34-scroll-thumb',           false )
			.classed ( 'u34-scroll-thumb-scrolling', true  );
		d3.select ( '#' + d.panelEleId + '-' + 'hsclr' )
			.classed ( 'u34-scroll-thumb',           false )
			.classed ( 'u34-scroll-thumb-scrolling', true  );

	}	//	dragSclrStarted2()

	function dragSclred2 ( d, i, ele, myEvt ) {
		var sW = serviceId + ' dragSclred2()';
		console.log ( sW + '  panel name: ' + d.panelData.name + '  dxy: ' + myEvt.dx + ' ' + myEvt.dy );
		var x, xo, y, yo;

		var g = d3.select ( ele[i] )
	//	var g = d3.select ( this )
	//	var g = d3.select ( this.parentElement )
			.attr ( 'transform', function ( d, i ) { 
				var pd = d.panelData;
				if ( pd.filledBy ) 
					pd.filledBy.parentScrolled ( myEvt );
				return 'translate(' + (d.x += myEvt.dx) + ',' + (d.y += myEvt.dy) + ')'; 
			} );
		x  = d.panelData.sclrX = d.x;
		y  = d.panelData.sclrY = d.y;
		xo = (d.panelData.hasBorder ? uc.PANEL_BORDER_WIDTH : 0);
		yo = (d.panelData.hasBorder ? uc.PANEL_BORDER_WIDTH : 0);
		d3.select ( '#cp-' + d.panelEleId + '-' + d.name + '-rect' )
		//	.attr ( 'x', function ( d, i ) { return   -x + uc.PANEL_BORDER_WIDTH; } )
		//	.attr ( 'y', function ( d, i ) { return   -y + uc.PANEL_BORDER_WIDTH; } );
			.attr ( 'x', -x + xo )
			.attr ( 'y', -y + yo );
		g.select ( '#' + d.panelEleId + '-' + d.name + '-rect' )
		//	.attr ( 'x', function ( d, i ) { return -d.x +                          uc.PANEL_BORDER_WIDTH; } )
		//	.attr ( 'y', function ( d, i ) { return -d.y +                          uc.PANEL_BORDER_WIDTH; } );
			.attr ( 'x', function ( d, i ) { return -d.x + (d.panelData.hasBorder ? uc.PANEL_BORDER_WIDTH : 0); } )
			.attr ( 'y', function ( d, i ) { return -d.y + (d.panelData.hasBorder ? uc.PANEL_BORDER_WIDTH : 0); } );

		var ox = {};	xMinMax ( g, ox );
		updateHsclr ( g, d, ox );
		var oy = {};	yMinMax ( g, oy );
		updateVsclr ( g, d, oy );
	}	//	dragSclred2()

	function dragSclrEnded ( d, i, ele ) {
		var sW = serviceId + ' dragSclrEnded()';
//		console.log ( sW + '  panel name: ' + d.panelData.name  );
		
	//	if ( d.dragee ) {
	//		d.dragee.rootPanel.dragEnd ( d.dragee );
	//		d.dragee = null;
	//	} else {
			d3.select ( '#' + d.panelEleId + '-' + 'vsclr' )
				.classed ( 'u34-scroll-thumb',           true  )
				.classed ( 'u34-scroll-thumb-scrolling', false );
			d3.select ( '#' + d.panelEleId + '-' + 'hsclr' )
				.classed ( 'u34-scroll-thumb',           true  )
				.classed ( 'u34-scroll-thumb-scrolling', false );
	//	}
	}	//	dragSclrEnded()

	//	Selecting (possibly multiple controls) with the mouse.
	//
	function selectStart ( bd, i, ele ) {
		var sW = serviceId + ' selectStart()';
		var pd = bd.panelData;
		var mo = uc.mouseOp;
//		console.log ( sW + '  panel name: ' + pd.name + '  event.altKey: ' + event.altKey );

		//	draw a dashed-line rectangle

		console.log ( sW + '  panel name: ' + pd.name + ' eleX Y: ' + mo.eleX + ' ' + mo.eleY + ' bd.x y ' + bd.x + ' ' + bd.y );

		mo.select = {
			xs: mo.eleX - bd.x - 0.5,
			ys: mo.eleY - bd.y - 0.5
		};

		var dx = mo.x - mo.x0;
		var dy = mo.y - mo.y0;

		d3.select ( '#' + pd.eleId + '-base' )
			.append ( 'rect' ) 
			.attr ( 'id',     pd.eleId + '-control-select' )
			.attr ( 'x',      mo.select.xs )
			.attr ( 'y',      mo.select.ys )
			.attr ( 'width',  dx )
			.attr ( 'height', dy )
			.attr ( 'class',  'u34-control-select-rect' );

	}	//	selectStart()

	function selectUpdate ( bd, i, ele ) {
		var sW = serviceId + ' selectUpdate()';
		var pd = bd.panelData;
		var mo = uc.mouseOp;
//		console.log ( sW + '  panel name: ' + pd.name + '  event.altKey: ' + event.altKey );

		var dx = mo.x - mo.x0;
		var dy = mo.y - mo.y0;

		console.log ( sW + '  panel name: ' + pd.name + ' eleX Y: ' + mo.eleX + ' ' + mo.eleY + '  dx y: ' + dx + ' ' + dy );

		d3.select ( '#' + pd.eleId + '-control-select' )
			.attr ( 'width',  dx )
			.attr ( 'height', dy );

	}	//	selectUpdate()

	function selectEnd ( bd, mo /* mouseOp */ ) {
		var sW = serviceId + ' selectEnd()';
		var pd = bd.panelData;
//		console.log ( sW + '  panel name: ' + pd.name + '  event.altKey: ' + event.altKey );

		var dx = mo.x - mo.x0;
		var dy = mo.y - mo.y0;

		mo.select.xe = mo.select.xs + dx;
		mo.select.ye = mo.select.ys + dy;

		//	Remove the selection rectangle.
		d3.select ( '#' + pd.eleId + '-control-select' )
			.remove();

		//	Append a new rectangle that is filled semitransparent over the selected  controls.
		//	First, iterate over the controls.
		mo.select.ctrls = [];
		var g = d3.select ( '#' + pd.eleId + '-' + 'base' );
		g.each ( function ( d ) { inSelectRect ( g, mo.select ); } );

		//	The results of inSelectRect() -
		//	mo.select.xs, ys, xe, ye, 						start, end of selection rect and 
		//			  minX, minY, maxX, maxY, eX, eY 		extents of controls selected and
		//			  ctrls[] 								the controls selected. 

		//	Create a screen over the app.  Clicking outside the selection and onto the screen 
		//	will cancel any operation on the selection.
		function clickScreen ( d, i, ele ) {
			var sW = serviceId + ' selectEnd()  clickScreen()';
			console.log ( sW );
			uc.downAppScreen();		//	The menu is removed because it is a child of the screen.
		}	//	clickScreen()

		function mousemoveScreen ( d, i, ele ) {
			var sW = serviceId + ' selectEnd()  mousemoveScreen()';
			var ebcr = ele[i].getBoundingClientRect();
			//	x0: 			event.pageX,		//	first event
			//	y0: 			event.pageY,
			//	x: 				event.pageX,		//	current position
			//	y: 				event.pageY,
			//	dx: 			0,					//	change in position
			//	dy: 			0,
			var	eleX = 			event.pageX - ebcr.left;
			var	eleY =			event.pageY - ebcr.top;
			console.log ( sW + ' eleX Y: ' + eleX + ' ' + eleY );
		}	//	mousemoveScreen()

		function mousedown ( d, i, ele ) {
			var sW = serviceId + ' selectEnd()  mousedown()';
			console.log ( sW );

		}	//	mousedown()
		
		function mouseup ( d, i, ele ) {
			var sW = serviceId + ' selectEnd()  mouseup()';
			console.log ( sW );

		}	//	mouseup()
		
		var screenPanel = uc.upAppScreen ( { sc: 			sW,
											 clickCB: 		clickScreen,
											 baseClass: 	'u34-popupmenu-screen' } );
		var spd = screenPanel.data;
		spd.onMouseMove  = mousemoveScreen;
		d3.select ( '#' + spd.eleId + '-base' )
			.append ( 'rect' )
			.attr ( 'id',     spd.eleId + '-controls-selected' )
			.attr ( 'x',      mo.select.minX )
			.attr ( 'y',      mo.select.minY )
			.attr ( 'width',  mo.select.eX )
			.attr ( 'height', mo.select.eY )
			.attr ( 'class',  'u34-controls-selected-rect' )
			.on ( 'mousedown', mousedown )
		//	.on ( 'mousemove', mousemove )
			.on ( 'mouseup',   mouseup );

	}	//	selectEnd()






	//	Panel Move
	//
//	function mouseOverMove ( d, i, ele ) {
//	//	console.log ( 'mouseOverMove()' );
//		d3.select ( this )		//	select rect
//			.classed ( 'u34-move-handle-transparent', false )
//			.classed ( 'u34-move-handle',             true  );
//
//		if ( ! d.isDragMoving )
//		//	uc.rootPanel.showFlyoverInfo ( event.clientX, event.clientY - 20,     'move panel' );
//			uc.rootPanel.showFlyoverInfo ( d.x,           d.y,                    'move' );
//	}

//	function mouseLeaveMove ( d, i, ele ) {
//	//	console.log ( 'mouseLeaveMove()' );
//		d3.select ( this )		//	select rect
//			.classed ( 'u34-move-handle-transparent', true )
//			.classed ( 'u34-move-handle',             false  );
//
//		uc.rootPanel.hideFlyoverInfo();
//	}

//	function dragMoveStarted ( d, i, ele ) {
//	//	console.log ( 'dragMoveStarted()' );
//		d.isDragMoving = true;
//		uc.rootPanel.hideFlyoverInfo();
//	}	//	dagMoveStarted()

//	function dragMoved ( d, i, ele ) {
//	//	console.log ( 'dragMoved() d.x: ' + d.x + '   d3.event.x: ' + d3.event.x + '   d3.event.dx: ' + d3.event.dx );
//		if ( ! d.parentPanel )
//			return;
//		//	The move handle/rect (this) and the panel g are siblings.  Otherwise, 
//		//	when the move handle is a child of the panel g, there is jerkyness.
//		var e = d.parentPanel.gridMove ( d );
//		if ( e === null )
//			return;
//		d3.select ( this )
//	//		.attr ( 'x',  (d.x += d3.event.dx) + uc.OFFS_4_1_PIX_LINE )
//	//		.attr ( 'y',  (d.y += d3.event.dy) + uc.OFFS_4_1_PIX_LINE );
//			.attr ( 'x',   d.x  = e.x )
//			.attr ( 'y',   d.y  = e.y );
//		d3.select ( '#' + d.eleId )
//			.attr ( 'transform', function ( d, i ) { 
//	//			return 'translate(' + d.x + ',' + d.y + ')'; 
//				return 'translate(' + (d.x -= uc.OFFS_4_1_PIX_LINE) + ',' + (d.y -= uc.OFFS_4_1_PIX_LINE) + ')'; 
//			} );
//	//	console.log ( 'dragMoved() d.y: ' + d.y );
//	//	if ( d.parentPanel )
//	//		d.parentPanel.updateSclrs();
//		d.parentPanel.updateSclrs();
//	}	//	dragMoved()

//	function dragMoveEnded ( d, i, ele ) {
//	//	console.log ( 'dragMoveEnded()' );
//		d.isDragMoving = false;
//	}	//	dragMoveEnded()

	function moved ( d, i, ele, x, y ) {
		var sW = serviceId + ' moved()';
		console.log ( sW + ' d.name: ' + d.name + '   x y: ' + x + ' ' + y );
		d3.select ( ele.parentNode )
			.attr ( 'transform', function ( d, i ) { 
				return 'translate(' + (d.x = x) + ',' + (d.y = y) + ')'; 
			} );
		d.parentPanel.updateSclrs();
	}	//	moved()


	//	Panel Save (for, e.g., built in dialogs)
	//
//	function mouseOverSave ( d, i, ele ) {				using uCD.mouseoverSave()
//	//	var sW = serviceId + ' mouseOverSave()';
//	//	console.log ( sW );
//	//	if ( d.isDragMoving )
//		if ( uc.mouseOp && uc.mouseOp.moving )
//			return;
//		d3.select ( this )		//	select rect
//			.classed ( 'u34-save-handle-transparent', false )
//			.classed ( 'u34-save-handle',             true  );
//		uc.rootPanel.showFlyoverInfo ( d.x, d.y,      'save layout' );
//	}	//	mouseOverSave()

//	function mouseLeaveSave ( d, i, ele ) {				using uCD.mouseleaveSave()
//	//	var sW = serviceId + ' mouseLeaveSave()';
//	//	console.log ( sW );
//		d3.select ( this )		//	select rect
//			.classed ( 'u34-save-handle-transparent', true )
//			.classed ( 'u34-save-handle',             false  );
//		uc.rootPanel.hideFlyoverInfo();
//	}	//	mouseLeaveSave()

	function clickSave ( d, i, ele ) {		//	for, e.g., built in dialogs
		var sW = serviceId + ' clickSave()';
	//	console.log ( sW );
		event.stopPropagation();
		uc.rootPanel.hideFlyoverInfo();
		uSL.storePanel ( sW, uc.ROOT_UDUI_ID, d );
	}	//	clickSave()

	function clickClose ( d, i, ele ) {			
		var sW = serviceId + ' clickClose()';
	//	console.log ( sW );
		event.stopPropagation();
		uc.rootPanel.hideFlyoverInfo();

		uc.rootPanel.rmvControl ( d.panel );

		if ( d.closeCB )
			d.closeCB();
	}	//	clickClose()

	//	Panel Size
	//
//	function mouseOverSize ( d, i, ele ) {
//	//	console.log ( 'mouseOverSize()' );
//		d3.select ( this )		//	select rect
//			.classed ( 'u34-size-handle-transparent', false )
//			.classed ( 'u34-size-handle',             true  );
//	}
//	The size rect is always visible in intersection of the scrollers.

//	function mouseLeaveSize ( d, i, ele ) {
//	//	console.log ( 'mouseLeaveSize()' );
//		d3.select ( this )		//	select rect
//			.classed ( 'u34-size-handle-transparent', true )
//			.classed ( 'u34-size-handle',             false  );
//	}
//	The size rect is always visible in intersection of the scrollers.

//	function dragSizeStarted ( d, i, ele ) {
//	//	console.log ( 'dragSizeStarted()' );
//	//	d3.select ( this )		//	select size rect from group
//	//		.classed ( 'u34-size-handle-transparent', false  )
//	//		.classed ( 'u34-size-handle',             true );
//	//	always visible
//		if ( d.horzSplitter ) 
//			d.lpwf = d.leftPanel.data.w / d.w;		//	Left Panel Width Factor
//		if ( d.vertSplitter ) 
//			d.tphf = d.topPanel.data.h / d.h;		//	Top Panel Height Factor
//	}	//	dragSizeStarted()

	function closeHandleX ( d ) {		//	d is of the panel g
		return d.baseData[0].w - uc.CLOSE_HANDLE_WIDTH + uc.OFFS_4_1_PIX_LINE;
	}

	function sizeStart ( d, i, ele ) {
		if ( d.horzSplitter ) {
			d.lpwf = d.leftPanel.data.w / d.w;		//	Left Panel Width Factor
			sizeStart ( d.leftPanel.data );
			sizeStart ( d.rightPanel.data );
		}
		if ( d.vertSplitter ) {
			d.tphf = d.topPanel.data.h / d.h;		//	Top Panel Height Factor
			sizeStart ( d.topPanel.data );
			sizeStart ( d.bottomPanel.data );
		}
	}	//	sizeStart()

	function sizeHandleX ( d ) {		//	d is of the panel g
	//	return d.w - uc.SIZE_HANDLE_WIDTH  - uc.OFFS_4_1_PIX_LINE;			
	//	return d.w - uc.PANEL_BORDER_WIDTH                     - uc.VERT_SCROLL_WIDTH  - 1 - uc.OFFS_4_1_PIX_LINE;			

	//	return d.w - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH      - uc.OFFS_4_1_PIX_LINE;			
		return d.w - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH      - uc.OFFS_4_1_PIX_LINE - (d.hasBorder ? 0 : 1);
	}

	function sizeHandleY ( d ) {		//	d is of the panel g
	//	return d.h - uc.SIZE_HANDLE_HEIGHT - uc.OFFS_4_1_PIX_LINE;
	//	return d.h - uc.PANEL_BORDER_WIDTH                     - uc.HORZ_SCROLL_HEIGHT - 1 - uc.OFFS_4_1_PIX_LINE;

	//	return d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.HORZ_SCROLL_HEIGHT     - uc.OFFS_4_1_PIX_LINE;
		return d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.HORZ_SCROLL_HEIGHT     - uc.OFFS_4_1_PIX_LINE - (d.hasBorder ? 0 : 1);
	}

	function widthSizeHandle ( d ) {
	//	return uc.SCROLL_BORDER_WIDTH + uc.VERT_SCROLL_WIDTH  + (d.hasBorder ? uc.PANEL_BORDER_WIDTH :    -uc.OFFS_4_1_PIX_LINE);
		return uc.SCROLL_BORDER_WIDTH + uc.VERT_SCROLL_WIDTH  + (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 1 - uc.OFFS_4_1_PIX_LINE);
	}

	function heightSizeHandle( d ) {
	//	return uc.SCROLL_BORDER_WIDTH + uc.VERT_SCROLL_WIDTH  + (d.hasBorder ? uc.PANEL_BORDER_WIDTH :    -uc.OFFS_4_1_PIX_LINE);
		return uc.SCROLL_BORDER_WIDTH + uc.VERT_SCROLL_WIDTH  + (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 1 - uc.OFFS_4_1_PIX_LINE);
	}

	//	Extending d3 -
	//		http://blogs.atlassian.com/2014/06/extending-d3-js/
	//		http://stackoverflow.com/questions/32675769/how-can-i-extend-d3
	//		https://github.com/wbkd/d3-extended
	d3.selection.prototype.placeSizeHandleRect = function() {
		this
			.attr ( 'x', function ( d, i ) { return sizeHandleX ( d ); } )
			.attr ( 'y', function ( d, i ) { return sizeHandleY ( d ); } );
		return this;		
	};

	d3.selection.prototype.placeSizeHandleLeftBorder = function() {
		this
			.attr ( 'x1', function ( d, i ) { return sizeHandleX ( d ); } )
			.attr ( 'y1', function ( d, i ) { return sizeHandleY ( d ); } )
			.attr ( 'x2', function ( d, i ) { return sizeHandleX ( d ); } )
			.attr ( 'y2', function ( d, i ) {
			//	return sizeHandleY ( d ) + uc.HORZ_SCROLL_HEIGHT + (d.hasBorder ? 1 + uc.OFFS_4_1_PIX_LINE : 0);
				return sizeHandleY ( d ) + uc.HORZ_SCROLL_HEIGHT + (d.hasBorder ? 1 + uc.OFFS_4_1_PIX_LINE : 1);
			} );
		return this;		
	};

	d3.selection.prototype.placeSizeHandleTopBorder = function() {
		this
			.attr ( 'x1', function ( d, i ) { return sizeHandleX ( d ); } )
			.attr ( 'y1', function ( d, i ) { return sizeHandleY ( d ); } )
			.attr ( 'x2', function ( d, i ) {
			//	return sizeHandleX ( d ) + uc.VERT_SCROLL_WIDTH + (d.hasBorder ? 1 + uc.OFFS_4_1_PIX_LINE : 0);
				return sizeHandleX ( d ) + uc.VERT_SCROLL_WIDTH + (d.hasBorder ? 1 + uc.OFFS_4_1_PIX_LINE : 1);
			} )
			.attr ( 'y2', function ( d, i ) { return sizeHandleY ( d ); } );
		return this;
	};

	function sizeBaseRectX ( d, bd, bRootPanel ) {
		//	Same/Used for both the panel base rect and panel clip path rect.
		if ( ! uc.isBoolean ( bRootPanel ) )
			bRootPanel = (d.parentPanel == null) && ! (d.parent && d.parent.constructor.name === 'Tabs');
		if ( bRootPanel )				//	if caller says it is the root panel 
		//	bd.w = d.bW100Pct ? '100%' : d.w;
			//	2018-May-07
		//	bd.w = d.bW100Pct ? '100%' : d.w - (uc.container ? uc.containerBorderWidth * 2 : 0);
			//	2018-May-10		If d.w of the even the root panels does not consider the container
			//					things will be messed up when, for example, splitting the root panel.
			//	So, d.w of the root panels should be set to the width of the interior of the container.
			bd.w = d.bW100Pct ? '100%' : d.w;
		else
		if ( d.bSplitPanel ) {			//	if the panel is split
			if ( ! d.parentPanel ) 		//		and it is the root panel
				bd.w = d.w;
			else
			//	bd.w = d.w - (2 * uc.PANEL_BORDER_WIDTH);
				bd.w = d.w -      uc.PANEL_BORDER_WIDTH;
		}
		else
		if ( d.bParentSplitAndRoot ) 
		//	bd.w = d.w - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH;
			bd.w = d.w - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH - uc.PANEL_BORDER_WIDTH;
		else
		//	bd.w = d.w - uc.VERT_SCROLL_WIDTH  - (2 * uc.OFFS_4_1_PIX_LINE) - (2 * uc.PANEL_BORDER_WIDTH)                   - uc.SCROLL_BORDER_WIDTH;

		//	bd.w = d.w - uc.VERT_SCROLL_WIDTH                               - (d.hasBorder ? 2 * uc.PANEL_BORDER_WIDTH : 0                        ) - uc.SCROLL_BORDER_WIDTH;
			bd.w = d.w - uc.VERT_SCROLL_WIDTH                               - (d.hasBorder ? 2 * uc.PANEL_BORDER_WIDTH : 1 * uc.PANEL_BORDER_WIDTH) - uc.SCROLL_BORDER_WIDTH;
		return bd.w;
	}

	function sizeBaseRectY ( d, bd, bRootPanel ) {
		//	Same/Used for both the panel base rect and panel clip path rect.
		if ( ! uc.isBoolean ( bRootPanel ) )
			bRootPanel = (d.parentPanel == null) && ! (d.parent && d.parent.constructor.name === 'Tabs');
		if ( bRootPanel )				//	if caller says it is the root panel 
		//	bd.h = d.bH100Pct ? '100%' : d.h;
			//	2018-May-07
		//	bd.h = d.bH100Pct ? '100%' : d.h -  (uc.container 
		//										 && (d.eleId != ('rr-' + uc.APP_HEADER_ROOT_PANEL_ELE_ID)) 
		//										? uc.containerBorderWidth * 2 
		//										: 0);
			//	2018-May-10		If d.h of the even the root panels does not consider the container
			//					things will be messed up when, for example, splitting the root panel.
			//	So, d.h of the root panels should be set to the width of the interior of the container.
			bd.h = d.bH100Pct ? '100%' : d.h;
		else
		if ( d.bSplitPanel ) {			//	if the panel is split
			if ( ! d.parentPanel )		//		and it is the root panel
				bd.h = d.h;
			else
			//	bd.h = d.h - (2 * uc.PANEL_BORDER_WIDTH);
				bd.h = d.h -      uc.PANEL_BORDER_WIDTH;
		}
		else
		if ( d.bParentSplitAndRoot ) 
		//	bd.h = d.h - uc.HORZ_SCROLL_HEIGHT - uc.SCROLL_BORDER_WIDTH;
			bd.h = d.h - uc.HORZ_SCROLL_HEIGHT - uc.SCROLL_BORDER_WIDTH - uc.PANEL_BORDER_WIDTH;
		else
		//	bd.h = d.h - uc.HORZ_SCROLL_HEIGHT - (2 * uc.OFFS_4_1_PIX_LINE) - (2 * uc.PANEL_BORDER_WIDTH)                   - uc.SCROLL_BORDER_WIDTH;

		//	bd.h = d.h - uc.HORZ_SCROLL_HEIGHT                              - (d.hasBorder ? 2 * uc.PANEL_BORDER_WIDTH : 0                        ) - uc.SCROLL_BORDER_WIDTH;
			bd.h = d.h - uc.HORZ_SCROLL_HEIGHT                              - (d.hasBorder ? 2 * uc.PANEL_BORDER_WIDTH : 1 * uc.PANEL_BORDER_WIDTH) - uc.SCROLL_BORDER_WIDTH;
		return bd.h;
	}

	function vsclrX ( d ) {
	//	return d.w  - uc.PANEL_BORDER_WIDTH                     - uc.VERT_SCROLL_WIDTH - uc.OFFS_4_1_PIX_LINE; 
	//	return d.w  - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH - uc.OFFS_4_1_PIX_LINE; 
	//	return d.w  - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH + uc.OFFS_4_1_PIX_LINE; 
		return d.w  - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH + (d.hasBorder ? uc.OFFS_4_1_PIX_LINE : -uc.OFFS_4_1_PIX_LINE); 
	}

	function vsclrLeftBorderX ( d ) {
	//	if ( d.bParentSplitAndRoot ) 
	//		return d.w                         - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH + uc.OFFS_4_1_PIX_LINE; 
	//	return     d.w - uc.PANEL_BORDER_WIDTH - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH - uc.OFFS_4_1_PIX_LINE; 

	//	return d.w - uc.PANEL_BORDER_WIDTH                     - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH - uc.OFFS_4_1_PIX_LINE;
	//	return d.w - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH                          - uc.OFFS_4_1_PIX_LINE;
		return d.w                                             - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH - uc.OFFS_4_1_PIX_LINE;
	}

	function vsclrLeftBorderY1 ( d ) {
		return (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0); 
	}
	
	function vsclrLeftBorderY2 ( d ) {
	//	return d.h - uc.PANEL_BORDER_WIDTH - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH; 
	//	return d.h - uc.PANEL_BORDER_WIDTH                     - uc.VERT_SCROLL_WIDTH  - uc.SCROLL_BORDER_WIDTH + uc.OFFS_4_1_PIX_LINE; 

	//	return d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.HORZ_SCROLL_HEIGHT - uc.SCROLL_BORDER_WIDTH                + uc.OFFS_4_1_PIX_LINE; 
		return d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.HORZ_SCROLL_HEIGHT - uc.SCROLL_BORDER_WIDTH + (d.hasBorder ? uc.OFFS_4_1_PIX_LINE : -uc.OFFS_4_1_PIX_LINE); 
	}
	
	function hsclrY ( d ) {
	//	return d.h  - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH  - uc.OFFS_4_1_PIX_LINE; 
	//	return d.h  - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.HORZ_SCROLL_HEIGHT + uc.OFFS_4_1_PIX_LINE; 
		return d.h  - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.HORZ_SCROLL_HEIGHT + (d.hasBorder ? uc.OFFS_4_1_PIX_LINE : -uc.OFFS_4_1_PIX_LINE); 
	}

	function hsclrTopBorderX1 ( d ) {
		return (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0); 
	//	//	test test (verify error)
	//	return 2;	//	bad
	}

	function hsclrTopBorderX2 ( d ) {
	//	return d.w - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH; 

	//	return d.w - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH                + uc.OFFS_4_1_PIX_LINE; 
		return d.w - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH + (d.hasBorder ? uc.OFFS_4_1_PIX_LINE : -uc.OFFS_4_1_PIX_LINE);
	}

	function hsclrTopBorderY ( d ) {
	//	return d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH  - uc.SCROLL_BORDER_WIDTH - uc.OFFS_4_1_PIX_LINE; 
	//	return d.h;
	
	//	return d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.HORZ_SCROLL_HEIGHT                          - uc.OFFS_4_1_PIX_LINE; 

		return d.h                                             - uc.HORZ_SCROLL_HEIGHT - uc.SCROLL_BORDER_WIDTH - uc.OFFS_4_1_PIX_LINE; 
	//	//	test test
	//	return d.h                                             - uc.HORZ_SCROLL_HEIGHT - uc.SCROLL_BORDER_WIDTH; 	//	bad
	}

	function sized3 ( d, w, h, g, hasBorder ) {
		var sW = serviceId + ' sized3()';
		var dx = w - d.w;
		var dy = h - d.h;
		d.w = w;
		d.h = h;
		if ( (typeof hasBorder === 'undefined') || hasBorder )
			g.select ( '#' + d.eleId + '-panel-border' )
			//	.attr ( 'width',  function ( d ) { return d.w - uc.PANEL_BORDER_WIDTH; } )
			//	.attr ( 'height', function ( d ) { return d.h - uc.PANEL_BORDER_WIDTH; } );
				.attr ( 'width',  function ( d ) { return d.w;                         } )
				.attr ( 'height', function ( d ) { return d.h;                         } );

		if ( d.eleId !== ('rr-' + uc.APP_CLIENT_ROOT_PANEL_ELE_ID) ) {		//	do not size root base because it is always '100%'.
			if ( d.eleId === 'rr-ralph' )
				console.log ( 'debug this' );
			g.select ( '#' + d.eleId + '-base-rect' )
				.data ( d.baseData )
			//	.attr ( 'width',  function ( d, i ) { return d.w += dx; } )
			//	.attr ( 'height', function ( d, i ) { return d.h += dy; } );
				.attr ( 'width',  function ( bd ) { 
					return sizeBaseRectX ( d, bd ); 
				} )
				.attr ( 'height', function ( bd ) { 
					return sizeBaseRectY ( d, bd ); 
				} );
			}
		else {
			var bd   = d.baseData[0];							//	do set the root panel's base data w, h
				bd.w = d.w;
				bd.h = d.h;
		}


		if ( d.filledBy ) 
			d.filledBy.parentSizedAbsolute ( d.baseData[0].w, d.baseData[0].h );

		g.select ( '#' + d.eleId + '-vsclr' )
		//	.attr ( 'x',      function ( d, i ) { 
		//		if ( d.bParentSplitAndRoot ) 
		//			return d.w - uc.VERT_SCROLL_WIDTH + uc.OFFS_4_1_PIX_LINE; 
		//		return d.w  - uc.PANEL_BORDER_WIDTH - uc.VERT_SCROLL_WIDTH - uc.OFFS_4_1_PIX_LINE; 
		//	} )
			.attr ( 'x',      vsclrX ) 
			.attr ( 'y',      function ( d, i ) { 
				var y = (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) + uc.OFFS_4_1_PIX_LINE;  
				return y;
			} )
			.attr ( 'width',  function ( d, i ) { return uc.VERT_SCROLL_WIDTH; } );
		//	.attr ( 'height', function ( d, i ) { return 0; } );	see updateSclrs()
		g.select ( '#' + d.eleId + '-vsclr-left-border' )
		//	.attr ( 'x1',    function ( d, i ) { 
		//		if ( d.bParentSplitAndRoot ) 
		//			return d.w                         - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH + uc.OFFS_4_1_PIX_LINE; 
		//		return     d.w - uc.PANEL_BORDER_WIDTH - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH - uc.OFFS_4_1_PIX_LINE; 
		//	} )
			.attr ( 'x1',    vsclrLeftBorderX )
		//	.attr ( 'y1',    function ( d, i ) { return uc.PANEL_BORDER_WIDTH; } )
			.attr ( 'y1',    vsclrLeftBorderY1 )
		//	.attr ( 'x2',    function ( d, i ) { 
		//		if ( d.bParentSplitAndRoot ) 
		//			return d.w                         - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH + uc.OFFS_4_1_PIX_LINE; 
		//		return     d.w - uc.PANEL_BORDER_WIDTH - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH - uc.OFFS_4_1_PIX_LINE; 
		//	} )
			.attr ( 'x2',    vsclrLeftBorderX )
		//	.attr ( 'y2',    function ( d, i ) { 
		//		if ( d.bParentSplitAndRoot ) 
		//			return d.h - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH; 
		//		return d.h - uc.PANEL_BORDER_WIDTH - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH; 
		//	} );
			.attr ( 'y2',     vsclrLeftBorderY2 );
		g.select ( '#' + d.eleId + '-hsclr' )
			.attr ( 'x',      function ( d, i ) { 
				return (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) + uc.OFFS_4_1_PIX_LINE; 
			} )
		//	.attr ( 'y',      function ( d, i ) { 
		//		if ( d.bParentSplitAndRoot ) 
		//			return d.h - uc.HORZ_SCROLL_HEIGHT + uc.OFFS_4_1_PIX_LINE; 
		//		return d.h - uc.PANEL_BORDER_WIDTH - uc.HORZ_SCROLL_HEIGHT - uc.OFFS_4_1_PIX_LINE; 
		//	} )
			.attr ( 'y',      hsclrY )
		//	.attr ( 'width',  function ( d, i ) { return 0; } )		see updateSclrs()
			.attr ( 'height', function ( d, i ) { return uc.VERT_SCROLL_WIDTH; } );
		g.select ( '#' + d.eleId + '-hsclr-top-border' )
			.attr ( 'x1',    hsclrTopBorderX1 )
			.attr ( 'y1',    hsclrTopBorderY )
			.attr ( 'x2',    hsclrTopBorderX2 )
			.attr ( 'y2',    hsclrTopBorderY );
		g.select ( '#' + d.eleId + '-size' )
		//	.attr ( 'x',      sizeHandleX )
		//	.attr ( 'y',      sizeHandleY );
			.placeSizeHandleRect();
		g.select ( '#' + d.eleId + '-size-left-border' )
			.placeSizeHandleLeftBorder();
		g.select ( '#' + d.eleId + '-size-top-border' )
			.placeSizeHandleTopBorder();
		g.select ( '#' + d.eleId + '-close' )
			.attr ( 'x',      closeHandleX );

		d3.select ( '#cp-' + d.eleId + '-base-rect' )
			.attr ( 'width',  function ( cpd ) { 
			//	return sizeBaseRectX ( d, cpd, d.parentPanel == null ); 
				//	2017-May-28
			//	return sizeBaseRectX ( d, cpd, (d.parentPanel == null) && (! (d.parent && d.parent.constructor.name === 'Tabs')) );
				//	2017-Aug 		sizeBaseRectX() makes the root panel decision
				return sizeBaseRectX ( d, cpd );
			} )
			.attr ( 'height', function ( cpd ) { 
			//	return sizeBaseRectY ( d, cpd, d.parentPanel == null ); 
				//	2017-May-28
			//	return sizeBaseRectY ( d, cpd, (d.parentPanel == null) && (! (d.parent && d.parent.constructor.name === 'Tabs')) );
				//	2017-Aug 		sizeBaseRectY() makes the root panel decision
				return sizeBaseRectY ( d, cpd );
			} );

		d.panel.updateSclrs();
	}	//	sized3()

	function sized2 ( d, g, dx, dy, hasBorder ) {
		var sW = serviceId + ' sized2()';
		var g2;
		d.w += dx;
		d.h += dy;
	//	if ( hasBorder )		done with szied2() at bottom here
	//		g.select ( '#' + d.eleId + '-panel-border' )
	//			.attr ( 'width',  function ( d ) { return d.w - uc.PANEL_BORDER_WIDTH; } )
	//			.attr ( 'height', function ( d ) { return d.h - uc.PANEL_BORDER_WIDTH; } );
		if ( d.horzSplitter ) {		//	If  * this  panel *  is split horizontally
			//	Move this panel's size rect.
			g.select ( '#' + d.eleId + '-size' )
				.placeSizeHandleRect();
			g.select ( '#' + d.eleId + '-size-left-border' )
				.placeSizeHandleLeftBorder();
			g.select ( '#' + d.eleId + '-size-top-border' )
				.placeSizeHandleTopBorder();

			var	lpd = d.leftPanel.data, lpw, lph, 
				sx, sw, 
				rpd = d.rightPanel.data, rpw, rph;
			
			//	Size the left panel.
			g2  = d3.select ( '#' + lpd.eleId );
			lpw = Math.round ( d.w * d.lpwf );
			lph = lpd.h + dy;
		//	sized3 ( lpd, lpw, lph, g2, false );
			sized2 ( lpd, g2, lpw - lpd.w, lph - lpd.h, false );

			//	Move, Size the splitter.
			g2 = d.horzSplitter.g;
		//	sx = lpw + uc.SPLITTER_BORDER_W - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH);
			sx = lpw + uc.SPLITTER_BORDER_W;		//	2017-May-26
			g2.attr ( 'transform', function ( d ) { 
			//	return 'translate(' + (d.x = sx) + ',' + (uc.OFFS_4_1_PIX_LINE - (d.hasBorder                  ? 0 : uc.PANEL_BORDER_WIDTH)) + ')'; 
			//	return 'translate(' + (d.x = sx) + ',' + (uc.OFFS_4_1_PIX_LINE - (d.parentPanel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH)) + ')'; 
				return 'translate(' + (d.x = sx) + ',' +  uc.OFFS_4_1_PIX_LINE + ')'; 		//	2017-May-26
			} );
			g2.select ( 'rect' )
				.attr ( 'height', function ( d ) { 
					return d.h += dy; 
				} );
			g2.selectAll ( 'line' )
				.attr ( 'y2', function ( d ) { 
					return d.h; 
				} );

			//	Move, Size the right panel.
			g2 = d3.select ( '#' + rpd.eleId );
			g2.attr ( 'transform', function ( d ) { 
			//	return 'translate(' + (d.x = lpw + uc.SPLITTER_WH + (1 * uc.SPLITTER_BORDER_W) + 0.5) + ',' + uc.OFFS_4_1_PIX_LINE + ')'; 
			//	var x =                d.x = lpw + uc.SPLITTER_WH + (1 * uc.SPLITTER_BORDER_W) + 0.5 - (d.hasBorder                                 ? 0 : uc.PANEL_BORDER_WIDTH);
			//	var x =                d.x = lpw + uc.SPLITTER_WH + (1 * uc.SPLITTER_BORDER_W) + 0.5 - (d.hasBorder || d.parentPanel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH);
				var x =                d.x = lpw + uc.SPLITTER_WH + (1 * uc.SPLITTER_BORDER_W) + 0.5;	//	2017-May-26
				var y = d.y;
				return 'translate(' + x + ',' + y + ')'; 

			//	return 'translate(' + uc.OFFS_4_1_PIX_LINE + ',' + (d.y = tph + uc.SPLITTER_WH + (1 * uc.SPLITTER_BORDER_W) + 0.5) + ')'; 
			} );
			sw  = uc.SPLITTER_WH;
			rpw = d.w - (lpw + sw  + uc.SPLITTER_BORDER_W) - (d.hasBorder ? 1 : 0);
		//	rpw = d.w - (lpw + sw  + uc.SPLITTER_BORDER_W) - (d.hasBorder ? 1 : 0) + (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH);	//	2017-May-26
			rph = rpd.h + dy;
		//	sized3 ( rpd, rpw, rph, g2, false );
			sized2 ( rpd, g2, rpw - rpd.w, rph - rpd.h, false );
		}
		else
		if ( d.vertSplitter ) {		//	If  * this  panel *  is split vertically
			//	Move this panel's size rect.
			g.select ( '#' + d.eleId + '-size' )
				.placeSizeHandleRect();
			g.select ( '#' + d.eleId + '-size-left-border' )
				.placeSizeHandleLeftBorder();
			g.select ( '#' + d.eleId + '-size-top-border' )
				.placeSizeHandleTopBorder();

			var tpd = d.topPanel.data, tpw, tph, 
				sy, sh, 
				bpd = d.bottomPanel.data, bpw, bph;
			
			//	Size the top panel.
			g2  = d3.select ( '#' + tpd.eleId );
			tpw = tpd.w + dx;
			tph = Math.round ( d.h * d.tphf );
		//	console.log ( sW + '  tph: ' + tph );
		//	sized3 ( tpd, tpw, tph, g2, false );
			sized2 ( tpd, g2, tpw - tpd.w, tph - tpd.h, false );

			//	Move, Size the splitter.
			g2  = d.vertSplitter.g;
			sy  = tph + uc.SPLITTER_BORDER_W;
			g2.attr ( 'transform', function ( d ) { 
				return 'translate(' + uc.OFFS_4_1_PIX_LINE + ',' + (d.y = sy) + ')'; 
			} );
			g2.select ( 'rect' )
				.attr ( 'width', function ( d ) { 
					return d.w += dx; 
				} );
			g2.selectAll ( 'line' )
				.attr ( 'x2', function ( d ) { 
					return d.w; 
				} );

			//	Move, Size the bottom panel.
			g2  = d3.select ( '#' + bpd.eleId );
			g2.attr ( 'transform', function ( d ) { 
				return 'translate(' + uc.OFFS_4_1_PIX_LINE + ',' + (d.y = tph + uc.SPLITTER_WH + (1 * uc.SPLITTER_BORDER_W) + 0.5) + ')'; 
			} );
			sh  = uc.SPLITTER_WH;
			bpw = bpd.w + dx;
		//	bph = d.h - (tph + sh + uc.SPLITTER_BORDER_W) - 1;
			bph = d.h - (tph + sh + uc.SPLITTER_BORDER_W) - 1 + (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH);	//	2017-May-26
		//	sized3 ( bpd, bpw, bph, g2, false );
			sized2 ( bpd, g2, bpw - bpd.w, bph - bpd.h, false );
		}
		else {
			sized3 ( d, d.w, d.h, g, hasBorder );
		}

		d.panel.updateSclrs();
	}	//	sized2()

	function sized ( d, i, ele, dx, dy, hasBorder ) {	//	called by ControlData
		var sW = 'sized()';
	//	console.log ( sW + ' w: ' + d.w + '   h: ' + d.h );
		var g;
	//	if ( ele )		//	ele, when specified, is expected to be the size rect
	//		g = d3.select ( ele.parentNode );
	//	else
	//	2017-May-21
	//	Specifying the parent node in the select() call does not set the selection's
	//	_parents. That is what happens when this is called by windowMouseMove() of
	//	udui-control-data.js.  The result is a reference exception in d3.
	//	So, for now, see if we can always select with d.eleId.
			g = d3.select ( '#' + d.eleId );
		sized2 ( d, g, dx, dy, uc.isDefined ( hasBorder ) ? hasBorder : true );

		if ( d.bSplitPanel ) 
			//	note that d.w, h are adjusted in size1()
			sized3 ( d, d.w, d.h, g, uc.isDefined ( hasBorder ) ? hasBorder : true );	

		if ( d.parentPanel )
			d.parentPanel.updateSclrs();
	}	//	sized()

//	function dragSized ( d, i, ele ) {
//		var sW = 'dragSized()';
//	//	console.log ( sW + ' w: ' + d.w + '   h: ' + d.h );
//		var g = d3.select ( this.parentNode );
//		sized2 ( d, g, d3.event.dx, d3.event.dy, true );
//		if ( d.parentPanel )
//			d.parentPanel.updateSclrs();
//	}	//	dragSized()


//	function dragSizeEnded ( d, i, ele ) {
//	//	console.log ( 'dragSizeEnded()' );
//	//	d3.select ( this )
//	//		.classed ( 'u34-size-handle-transparent', true  )
//	//		.classed ( 'u34-size-handle',             false );
//	//	always visible
//	}	//	dragSizeEnded()



	var filtersData = [];
	var nextFilterId = 0;

	var clipPathsData = [];
	var nextClipPathId = 0;


	function pushPanelClipPathData ( d ) {
		//	Will need clipPath defs.  See -
		//		http://bl.ocks.org/anonymous/2b1d992dfb66542ec1e2
		//		https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text 
		//		https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath
		//	Clip everything to not draw outside the panel. Match base rect.
	//	var bRootPanel = ! d.parentPanel;
	//	var bRootPanel = (! d.parentPanel) && (! (d.parent && d.parent.constructor.name === 'Tabs'));	//	2017-May-28
		var cpd = new ClipPath ( 'cp-' + d.eleId + '-base', 
								 0, 				//	x
						   		 0, 				//	y
								 0,					//	w, see sizeBaseRectX() below
								 0 );				//	h, see sizeBaseRectY() below

		
		if ( (d.type === 'panel') && (! d.hasBorder) ) {	//	2017-May-08
			cpd.x -= uc.PANEL_BORDER_WIDTH;
			cpd.y -= uc.PANEL_BORDER_WIDTH;
		}

		sizeBaseRectX ( d, cpd );		//	sizeBaseRectX() makes the root panel decision
		sizeBaseRectY ( d, cpd );		//	sizeBaseRectY() makes the root panel decision
		clipPathsData.push ( cpd );
	}	//	pushPanelClipPathData()

	function Panel ( data ) {
		this.data = data;
	}

	function PanelData ( o ) { 

		//	Initialize the "base" of this object, ControlData -
		o.type      = uc.TYPE_PANEL;
		o.class     = o.class     === undefined ? 'u34-table' : o.class;
		o.hasBorder = o.hasBorder === undefined ? true        : o.hasBorder;
		uCD.callControlData ( this, o );

		//	Initialize the rest of this object -
		this.scale = 1;

		this.bMoveRect = uc.isBoolean ( o.bMoveRect ) ? o.bMoveRect : true;
		this.bSizeRect = uc.isBoolean ( o.bSizeRect ) ? o.bSizeRect : true;
		this.bVertSB   = uc.isBoolean ( o.bVertSB ) ? o.bVertSB : true;
		this.bHorzSB   = uc.isBoolean ( o.bHorzSB ) ? o.bHorzSB : true;

		this.parentPanel = null;		//	set by the parent panel
		this.panel = null;

		if ( ! uc.isDefined ( o.eleId ) )
			this.eleId = null;				//	set by the parent panel

		this.parent = null;				//	set by parent if parent is not a panel 

		this.baseData = [];
		this.base = null;				//	base rect of the panel - what controls are added to

		this.childData = { 				//	data of the child elements on the base rect
			nextId: 	0,
			data: 		[]
		};

		this.baseClass   = o.baseClass   === undefined ? 'u34-panel-rect'   : o.baseClass;
		this.borderClass = o.borderClass === undefined ? 'u34-panel-border' : o.borderClass;

		this.clickCB = o.clickCB;

		this.foInfoLabel = null;
		this.dragTarget   = null;
	//	this.isDragMoving = false;

		this.bSaveRect = false;			//	true when, for example, the panel is an application
										//	dialog panel - a built-in vs a user-defined panel

		//	like bSaveRect - clickable, normally hidden, hover over to find - rect at upper right
		this.hasCloseBox = o.hasCloseBox ? o.hasCloseBox : false;		

		this.grid = {
			isEnabled: 	true,
			isVisible: 	true,
			spaceX: 	4,
			spaceY: 	4
		};

		//	To maintain the panel in storage (IndexedDB and/or Share) -
		//
		this.createdInSysId  = 0;		//	For now.
		this.createdByUserId = userAuth.userID;

		//	Storage - parts of the item name.  storeId is common for all versions of the panel.
		//	storeName is unique for each version of the panel saved.
		this.storeId   =   o.bStore 
						 ? uSL.allocPanelStore ( uc.ROOT_UDUI_ID, o.storeId ) //	later, udui may be that of a PE
						 : 0;
		this.storeName = o.storeName;		//	Unique name for the panel when the user does a Save As ...

		//	Sometimes a single control may fill the entire panel by itself.  For examples,
		//	tables and tabs.  
		this.filledBy = null;

		this.bSplitPanel = false;

		this.closeCB = o.closeCB ? o.closeCB : null;

		this.docked = o.docked ? o.docked : false;		//	when this panel is docked then 'left', 'top', 'right' or 
														//	'bottom'

		this.bParentSplitAndRoot = false;				//	true when this panel is docked to the root panel

		this.bW100Pct = uc.isBoolean ( o.bW100Pct ) ? o.bW100Pct : false;
		this.bH100Pct = uc.isBoolean ( o.bH100Pct ) ? o.bH100Pct : false;

		//	Override some "base" properties -
		this.onMouseOver  = mouseOver;
		this.onMouseLeave = mouseLeave;
		this.onMouseDown  = mouseDown;
		this.onMouseMove  = mouseMove;
		this.onMouseUp    = mouseUp;
		this.onSizeStart  = sizeStart;
		this.onSize       = sized;
		this.onSize2      = sized2;
		this.onMove       = moved;
	}	//	PanelData()

//	PanelData.prototype = uCD.newControlData();
//	PanelData.prototype.constructor = PanelData;
//	See createPanelData().

//	PanelData.prototype.getControl = function ( type, name ) {
	function PanelData_getControl ( type, name ) {
		var sW   = serviceId + ' PanelData.prototype.getControl()';
		var i, data = this.childData.data, cd;
		for ( i = 0; i < data.length; i++ ) {
			cd = data[i];
			if ( (cd.type === type) && (cd.name === name) )
				return cd;
		}
		return null;
	}	//	PanelData.prototype.getControl()

//	svc.createPanelData = function ( x, y, w, h, name, clickCB  ) {
//		return new PanelData ( x, y, w, h, name, clickCB, true, 0, null );
	svc.createPanelData = function ( o ) {

		if ( PanelData.prototype.constructor.name === 'PanelData' ) {
			//	Do this once, here to avoid cir ref issue
			PanelData.prototype = uCD.newControlData();
			PanelData.prototype.constructor = PanelData;
			PanelData.prototype.getControl = PanelData_getControl;
		}

	//	o.bStore    = true;
	//	o.storeId   = 0;
	//	o.storeName = null;
		if ( ! uc.isDefined ( o.bStore ) )
			o.bStore    = true;
		if ( ! uc.isDefined ( o.storeId ) )
			o.storeId   = 0;
		if ( ! uc.isDefined ( o.storeName ) )
			o.storeName = null;
		return new PanelData ( o );
	};	//	svc.createPanelData()

	svc.restorePanelData = function ( o ) {
		return svc.createPanelData ( o );
	};	//	svc.restorePanelData()

	//	root panel, maybe app dialog panels, etc.. any panel that is not created by
	//	the user
//	svc.createAppPanelData = function ( x, y, w, h, name, clickCB, storeId, storeName ) {
//		return new PanelData ( x, y, w, h, name, clickCB, true, storeId, storeName );
	svc.createAppPanelData = function ( o ) { 
		o.bStore = true;
	//	return new PanelData ( o );
		return svc.createPanelData ( o );
	};	//	svc.createAppPanelData()

	//	panels that are not stored
//	svc.createTemporaryPanelData = function ( x, y, w, h, name, clickCB  ) {
//		return new PanelData ( x, y, w, h, name, clickCB, false, 0, null );
	svc.createTemporaryPanelData = function ( o ) {
	//	return new PanelData ( o );
		o.bStore = false;
		return svc.createPanelData ( o );
	};	//	svc.createTemporaryPanelData()


	Panel.prototype.updateSclrs = function() {
		var pd = this.data;
		if ( pd.bSplitPanel )
			return;
		updateVsclr0 ( pd.eleId );
		updateHsclr0 ( pd.eleId );
	};	//	Panel.prototype.updateSclrs()


	Panel.prototype.addClipPath = function ( ctrlData ) {
		if ( ctrlData.constructor.name === 'PanelData' )
			pushPanelClipPathData ( ctrlData );
		else
		if ( 	(ctrlData.constructor.name === 'ButtonData')
			 || (ctrlData.constructor.name === 'CheckBoxData') 
			 || (ctrlData.constructor.name === 'LabelData') 
			 || (ctrlData.constructor.name === 'InputData') )
			//	Clip path - Offset by 2 from group/rect x and y, -4 on group/rect w and h.
			//	This should probably be the "root" panel - where all the <defs> data goes.
			clipPathsData.push ( new ClipPath ( 'cp-' + ctrlData.eleId, 2,  2, ctrlData.w - 5, 
																			   ctrlData.h - 5 ) );
		else
		if ( 	(ctrlData.constructor.name === 'ListData') 
			 || (ctrlData.constructor.name === 'TabData')  )
			clipPathsData.push ( new ClipPath ( 'cp-' + ctrlData.eleId, -uc.OFFS_4_1_PIX_LINE,
																		-uc.OFFS_4_1_PIX_LINE,
																		ctrlData.w, 
																		ctrlData.h - 1 ) );

		//	Evidently having multiple <defs> messes things up.  Putting all the clip paths 
		//	under one <defs>.
		d3.select ( 'defs' )
			.selectAll ( 'clipPath' )
			.data ( clipPathsData, function ( d ) { 
				return d.id || (d.id = ++nextClipPathId); 
			} )
			.enter()
			.append ( 'clipPath' )
			.attr ( 'id', function ( d, i ) { return d.eleId; } )					//	e.g., 'cp-base' and/or 'cp-btnA'
			.append ( 'rect' )
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-rect'; } )		//	e.g., 'cp-base-rect' and/or 'cp-btnA-rect'
			.attr ( 'x',      function ( d, i ) { return d.x; } )
			.attr ( 'y',      function ( d, i ) { return d.y; } )
		//	//	2017-May-08
		//	.attr ( 'x',      function ( d, i ) { 
		//		return d.x + ((ctrlData.type === 'panel') && (! ctrlData.hasBorder) ? uc.PANEL_BORDER_WIDTH : 0); 
		//	} )
		//	.attr ( 'y',      function ( d, i ) { 
		//		return d.y + ((ctrlData.type === 'panel') && (! ctrlData.hasBorder) ? uc.PANEL_BORDER_WIDTH : 0); 
		//	} )
			.attr ( 'width',  function ( d, i ) { return d.w; } )
			.attr ( 'height', function ( d, i ) { return d.h; } );
	};	//	Panel.prototype.addClipPath()

//	Panel.prototype.adjustClipPath = function ( ctrlData ) {
	svc.adjustClipPath = function ( ctrlData ) {
		if ( ctrlData.constructor.name !== 'ListData' ) 			//	only for lists, for now
			return;
		var cpEleId = 'cp-' + ctrlData.eleId;
		var cpd = clipPathsData.find ( function ( cpd ) { return cpd.eleId === cpEleId; } );
		if ( ! cpd )
			return;
		cpd.h = ctrlData.h - 1;
		d3.select ( '#' + cpEleId + '-rect' )
			.attr ( 'height', function ( d, i ) { 
				return d.h > 0 ? d.h - 1 : 0;
			} );
//	};	//	Panel.prototype.adjustClipPath()
	};	//	svc.adjustClipPath()

	svc.nextEleId = 0;

	Panel.prototype.addControl = function ( ctrlData ) {
		var panel = this, child = null;

		ctrlData.parentPanel = panel;
	//	ctrlData.eleId       = panel.data.eleId + '-' + ctrlData.name;
	//	ctrlData.eleId       = panel.data.eleId + '-' + (++svc.nextEleId);
		if ( ! ctrlData.eleId )		//	for e2e tests, eleId may already be set to something fixed, known
		//	ctrlData.eleId = panel.data.eleId + '-' + (++svc.nextEleId);
			ctrlData.eleId = 'rr-'                  + (++svc.nextEleId);

		panel.addClipPath ( ctrlData );

		panel.data.childData.data.push ( ctrlData );


		if ( ctrlData.constructor.name === 'ButtonData' )
		//	uButton.defineButton ( panel.data.base, panel.data.childData );
			child = uButton.defineButton ( panel );

		if ( ctrlData.constructor.name === 'InputData' )
			child = uInput.defineInput ( panel );

		if ( ctrlData.constructor.name === 'LabelData' )
			child = uLabel.defineLabel ( panel );

		if ( ctrlData.constructor.name === 'TextareaData' )
			child = uTextarea.defineTextarea ( panel );

		if ( ctrlData.constructor.name === 'CheckBoxData' )
			child = uCheckbox.defineCheckBox ( panel );

		if ( ctrlData.constructor.name === 'TabsData' )
			child = uTabs.defineTabs ( panel );

		if ( ctrlData.constructor.name === 'TableData' )
			child = uTable.defineTable ( panel );

		if ( ctrlData.constructor.name === 'PanelData' )
			child = svc.createPanel ( panel.data.base, panel.data.childData, false );

		if ( ctrlData.constructor.name === 'SplitterData' )
			child = uSplitter.defineSplitter ( panel );

		if ( ctrlData.constructor.name === 'ListData' )
			child = uList.defineList ( panel );

	//	if ( ctrlData.constructor.name === 'BoxData' )
	//		child = uBox.defineBox ( panel );

	//	updateVsclr0 ( panel.data.eleId );
	//	updateHsclr0 ( panel.data.eleId );
	//	//
		//	When loading (restoring from persistence) ...
		//
		//		Calling dragSclred2() which transforms the base <g> and moves the base <rect>
		//		works to fix (for some reason unknown by me right now) the problem of mouse 
		//		events not being seen in areas where the panel has been panned away from - even 
		//		though chrome debugger indicates the mouse is over the <rect>.
		//
		//		I noticed this in a child panel.  It might have something to do with the 
		//		parent panel (i.e., the root panel) being panned.
		//
		var sel = d3.select ( '#' + panel.data.eleId + '-base' );
	//	var sel = d3.select ( '#' + panel.data.eleId + '-base-rect' );
		var ele = sel._groups[0];
		if ( ele[0] )		//	will be null for panel containing splitter
			dragSclred2.call ( ele[0], ele[0].__data__, 0, ele, { dx: 0, dy: 0 } );

		return child;
	};	//	Panel.prototype.addControl()

	Panel.prototype.scroll = function ( rgs ) {		//	or, that is, pan
		var panel = this;
		var sel = d3.select ( '#' + panel.data.eleId + '-base' );
		var ele = sel._groups[0];
		if ( ele[0] )		//	will be null for panel containing splitter
			dragSclred2.call ( ele[0], ele[0].__data__, 0, ele, rgs );
	};	//	Panel.prototype.scroll()

//	Panel.prototype.rmvControls = function ( ctrls ) {
//		var panel = this;
//
//	//	Removing the clip paths from <defs> is done more generally from updatePanels().
//
//		if ( ctrls.type === 'panel' ) {
//			svc.updatePanels ( panel.data.base, ctrls );
//		} 
//
//		updateVsclr0 ( panel.data.eleId );
//		updateHsclr0 ( panel.data.eleId );
//	};	//	Panel.prototype.rmvControls()

	function getRemainingPanel ( parentPanel, ctrl ) {
		var ppd = parentPanel.data;
		var eleId = ctrl.data.eleId;
		var remainingPanel = null;
		if ( ppd.bSplitPanel && (ctrl.data.constructor === PanelData) ) {
			if ( 	uc.isDefined ( ppd.leftPanel )
				 && uc.isDefined ( ppd.rightPanel ) ) {
				if ( ppd.leftPanel.data.eleId === eleId )
					remainingPanel = ppd.rightPanel;
				else
				if ( ppd.rightPanel.data.eleId === eleId )
					remainingPanel = ppd.leftPanel;
			}
			else
			if ( 	uc.isDefined ( ppd.topPanel )
				 && uc.isDefined ( ppd.bottomPanel ) ) {
				if ( ppd.topPanel.data.eleId === eleId )
					remainingPanel = ppd.bottomPanel;
				else
				if ( ppd.bottomPanel.data.eleId === eleId )
					remainingPanel = ppd.topPanel;
			}
	//		if ( ! remainingPanel ) {
	//			console.log ( sW + ' ERROR: split but no remaining panel' );
	//			return;
	//		}
		}
		return remainingPanel;
	}	//	getRemainingPanel()

	Panel.prototype.rmvControl = function ( ctrl, opts ) {
		var sW = serviceId + ' rmvControl()';
		var panel = this, remainingPanel = null;

		if ( ctrl.constructor.name === 'Panel' )
			remainingPanel = getRemainingPanel ( panel, ctrl );

	//	Removing the clip paths from <defs> is done more generally from updatePanel().

		svc.updatePanel ( panel, ctrl, opts );

		if ( remainingPanel ) {
			panel.unsplit ( remainingPanel );
			return;
		}

		updateVsclr0 ( panel.data.eleId );
		updateHsclr0 ( panel.data.eleId );
	};	//	Panel.prototype.rmvControl()


	Panel.prototype.appendDialog = function ( dlg ) {
		var sW = serviceId + ' appendDialog()';
		var panel = this;		//	we should be the app's root panel

	//	if ( panel.data.eleId !== uc.rootPanel.data.eleId ) {
		if (    (panel.data.eleId !== uc.rootPanel.data.eleId)
			 && (panel.data.eleId !== uc.appScreenPanelEleId() ) ) {
			console.log ( sW + ' ERROR: this is expected to be the root panel' );
			return;
		}

	//	if ( dlg.invokingPanel.data.eleId !== panel.data.eleId ) {		//	if invoker is not the root panel
		//	2017-Aug
		if (    (dlg.invokingPanel.data.eleId !== panel.data.eleId)		//	if invoker is not the root panel
			 && ! uc.isAppScreenPanel ( dlg.invokingPanel ) ) {			//	and is not the app screen
			//	A screen to make the invoking panel appear disabled and to capture its 
			//	mouse actions.
			var g = d3.select ( '#' + dlg.invokingPanel.data.eleId );
			g
				.append ( 'rect' ) 
				.attr ( 'id',     panel.data.eleId + '-dialog-screen' )
				.attr ( 'x',      0 + uc.OFFS_4_1_PIX_LINE )
				.attr ( 'y',      0 + uc.OFFS_4_1_PIX_LINE )
				.attr ( 'width',  function ( d ) { return d.w - uc.PANEL_BORDER_WIDTH; } )
				.attr ( 'height', function ( d ) { return d.h - uc.PANEL_BORDER_WIDTH; } )
				.attr ( 'class',  'u34-dialog-screen' );
		}

		//	Offset the specified location by this panel's base rect position (due to 
		//	panning/scrolling).
		//
		var bd = panel.data.baseData[0];
		var dd = dlg.data;
		dd.x = (dd.x - bd.x) + uc.OFFS_4_1_PIX_LINE;
		dd.y = (dd.y - bd.y) + uc.OFFS_4_1_PIX_LINE;

		//	Now simply add the dialog as another child panel control of the root panel.
		//
		var dlgPanel = dlg.panel = panel.addControl ( dlg.data );

		return dlgPanel;
	};	//	Panel.prototype.appendDialog()

//	Panel.prototype.removeDialog = function ( invokingPanel, dlg ) {
	Panel.prototype.removeDialog = function (                dlg ) {
		var sW = serviceId + ' removeDialog()';
		var panel = this;		//	we should be the app's root panel

		if ( panel.data.eleId !== uc.rootPanel.data.eleId ) {
			console.log ( sW + ' ERROR: this is expected to be the root panel' );
			return;
		}

		//	First the dialog itself.
//		panel.rmvControls ( dlg );
		panel.rmvControl ( dlg.panel );

		//	Now the screen over the invoking panel.
		var g = d3.select ( '#' + dlg.invokingPanel.data.eleId );
		g
			.select ( '#' + panel.data.eleId + '-dialog-screen' )
			.remove();
	};	//	Panel.prototype.removeDialog()


//		Panel.prototype.appendPopup = function() {
//
//			//	Unlike appendDialog(), all panels  * but *  the invoking panel are screened.
//
//		};	//	Panel.prototype.appendPopup()


	Panel.prototype.appendBoard = function ( board ) {
		var sW = serviceId + ' appendBoard()';
		var panel = this;		//	we should be the app's root panel

		if ( panel.data.eleId !== uc.rootPanel.data.eleId ) {
			console.log ( sW + ' ERROR: this is expected to be the root panel' );
			return;
		}

		//	Like appendDialog(), but -
		//
		//		Boards do not disable any part of app.  No "screens".

		//	Offset the specified location by this panel's base rect position (due to 
		//	panning/scrolling).
		//
		var bd = panel.data.baseData[0];
		var dd = board.panelData;
		dd.x = (dd.x - bd.x) + uc.OFFS_4_1_PIX_LINE;
		dd.y = (dd.y - bd.y) + uc.OFFS_4_1_PIX_LINE;

		//	Now simply add the board as another child panel control of the root panel.
		//
		var boardPanel = board.panel = panel.addControl ( board.panelData );

		return boardPanel;
	};	//	Panel.prototype.appendBoard()


//	Panel.prototype.splitPrep = function ( current, drop,     dtIsSrcParent ) {
	Panel.prototype.splitPrep = function ( current, dropData, dtIsSrcParent ) {
		var panel = this;

		//	Get the current child controls data.
		//
		current.nextId = panel.data.childData.nextId;
		current.data   = [];
		panel.data.childData.data.forEach ( function ( ctrl ) { 
//			if ( drop     && dtIsSrcParent && (ctrl.eleId === drop.data.eleId) )
			//	If ctrl is what is being dropped ...
			//		When does this happen?  I.e., when is something dropped in
			//		the same panel it comes from?
			if ( dropData && dtIsSrcParent && (ctrl.eleId ===  dropData.eleId) ) 	
				return;
			current.data.push ( ctrl ); 
		} );

		//	Remove control elements from this panel.  The child elements of 
		//	this panel's base <g>.  Possibly just remove the base <g>.  And
		//	don't forget the clip paths.  
		//
		svc.removeBaseG ( panel );			//	not the <g>, but its content <g>s
		svc.removeSclrs ( panel );			//	And the scrollers.

		//	But we need a base because that is the element controls are added to.
		//
		//	This panel's base is now ... this panel's <g> -
		//
	//	panel.data.base = d3.select ( '#' + panel.data.eleId );		now the base is maintained
	//																see changes in removeBaseG()
	};	//	splitPrep()

	svc.addCtrls = function ( panel, childData, rmvFromEleId ) {
		if ( ! childData )
			return;
	//	var data = childData.data;
	//	panel.data.childData.data   = [];
		//	Need to do a D3 select - .exit-.remove thing here.  Maybe call svc.updatePanel() ?
		//	Something like (as in Panel.prototype.unsplit()) -
		var data = [];
		childData.data.forEach ( function ( d ) {
			data.push ( d );
		} );
		if ( uc.isDefined ( rmvFromEleId ) && !!rmvFromEleId) {
			var cd = panel.data.childData.data;
			while ( cd.length > 0 ) {
				svc.updatePanel ( panel, cd[0], { bKeepChildClipPaths: 	true,
												  baseEleId: 			rmvFromEleId + '-base' } );
			}
		}
		panel.data.childData.nextId = childData.nextId;
		data.forEach ( function ( ctrlD ) { 
		//	var copyD = angular.copy ( ctrlD );
		//	if ( copyD.type === uc.TYPE_PANEL )
		//		copyD.baseData = [];
		//	var ctrl = panel.addControl ( copyD ); 
		//	if ( copyD.fillsPanel )
		//		panel.data.filledBy = ctrl;
		//
		//	if ( copyD.type === uc.TYPE_PANEL ) 
		//		svc.addCtrls ( ctrl, copyD.childData );
		//	//	
			//	To maintain references - do not copy - use existing data.
			//	For example, references between a label and the properties board/table.
			//
			if ( ctrlD.type === uc.TYPE_PANEL )
				ctrlD.baseData = [];
			var ctrl = panel.addControl ( ctrlD ); 
			if ( ctrlD.fillsPanel )
				panel.data.filledBy = ctrl;

			if ( ctrlD.type === uc.TYPE_PANEL ) 
				svc.addCtrls ( ctrl, ctrlD.childData );
		} );
	};	//	addCtrls()

	svc.addCtrls2 = function ( panel, childData ) {
		if ( ! childData )
			return;
		panel.data.childData.nextId = childData.nextId;
		childData.data.forEach ( function ( ctrlD ) { 
		//	var copyD = angular.copy ( ctrlD );
		//	if ( copyD.type === uc.TYPE_PANEL )
		//		copyD.baseData = [];
		//	var ctrl = panel.addControl ( copyD ); 
		//	if ( copyD.fillsPanel )
		//		panel.data.filledBy = ctrl;
		//
		//	if ( copyD.type === uc.TYPE_PANEL ) 
		//		svc.addCtrls ( ctrl, copyD.childData );
		//	//	
			//	To maintain references - do not copy - use existing data.
			//	For example, references between a label and the properties board/table.
			//
			if ( ctrlD.type === uc.TYPE_PANEL )
				ctrlD.baseData = [];
			var ctrl = panel.addControl ( ctrlD ); 
			if ( ctrlD.fillsPanel )
				panel.data.filledBy = ctrl;

			if ( ctrlD.type === uc.TYPE_PANEL ) 
				svc.addCtrls ( ctrl, ctrlD.childData );
		} );
	};	//	addCtrls2()

//	Panel.prototype.splitAddPanel = function ( x, y, w, h, dataName, eleId, ctrls, cb ) {
	Panel.prototype.splitAddPanel = function ( x, y, w, h, dataName, eleId, pd,    cb, docked, bParentSplitAndRoot ) {
		var sW = serviceId + ' Panel.prototype.splitAddPanel()';
		var panel = this, ctrls = null;

		var oldPanelEleId = null;

		if ( ! pd ) 	//	If, for example, splitting an empty panel.  See splitVert(), splitHorz().
			pd = svc.createPanelData ( { x: 		x, 
										 y: 		y, 
										 w: 		w, 
										 h: 		h, 
										 name: 		dataName,
										 clickCB: 	cb,
										 docked: 	docked } );

		if ( pd.constructor !== PanelData ) {
			//	We probably should not create new PanelData.  If we do then references
			//	such as those set up by showPropertiesBoard() might be wrong.
			console.log ( sW + ' WARNING: expect pd to be PanelData' );
			ctrls = pd;
			pd = svc.createPanelData ( { x: 		x, 
										 y: 		y, 
										 w: 		w, 
										 h: 		h, 
										 name: 		dataName,
										 clickCB: 	cb,
										 docked: 	docked } );
		} else {
			oldPanelEleId = pd.eleId;
			pd.x = x;
			pd.y = y;
			pd.w = w;
			pd.h = h;
			pd.baseData = [];
			pd.docked = docked;
			pd.id = 0;				//	to get a new ID that will not conflict with sibling's
			pd.eleId = null;		//	to not be same as what might be destroyed
			ctrls = pd.childData;
		}

		pd.hasBorder = false;
		pd.bMoveRect = false;
		pd.bSizeRect = false;
		pd.bParentSplitAndRoot = uc.isDefined ( bParentSplitAndRoot ) ? bParentSplitAndRoot : false;

		var newPanel = panel.data[dataName] = panel.addControl ( pd );

		svc.addCtrls ( newPanel, ctrls, oldPanelEleId );

		if ( pd.filledBy ) 
			pd.filledBy.parentSizedAbsolute ( pd.baseData[0].w, pd.baseData[0].h );

		if ( pd.constructor === PanelData )
			pd.onSize ( pd, -1, null, 0, 0 );

		return newPanel;
	};	//	Panel.prototype.splitAddPanel()

	Panel.prototype.splitAddPanel2 = function ( x, y, w, h, dataName, childData,  cb, docked, bParentSplitAndRoot ) {
		var sW = serviceId + ' Panel.prototype.splitAddPanel2()';
		var panel = this;
		var	pd = svc.createPanelData ( { x: 		x, 
										 y: 		y, 
										 w: 		w, 
										 h: 		h, 
										 name: 		dataName,
										 clickCB: 	cb,
										 docked: 	docked } );
		pd.hasBorder = false;
		pd.bMoveRect = false;
		pd.bSizeRect = false;
		pd.bParentSplitAndRoot = uc.isDefined ( bParentSplitAndRoot ) ? bParentSplitAndRoot : false;

		var newPanel = panel.data[dataName] = panel.addControl ( pd );

		svc.addCtrls2 ( newPanel, childData );

		if ( pd.filledBy ) 
			pd.filledBy.parentSizedAbsolute ( pd.baseData[0].w, pd.baseData[0].h );

		if ( pd.constructor === PanelData )
			pd.onSize ( pd, -1, null, 0, 0 );

		return newPanel;
	};	//	Panel.prototype.splitAddPanel2()

	function borderInAncestry ( d ) {				//	2017-May-28
		//	Same as asking if the panel or its parent(s) is docked in the root panel. Because the 
		//	root panel is the only panel that does not have a border. For now. Possibly a tab content 
		//	panel would not have a border - in the future. Maybe.
		if ( d.hasBorder )
			return true;
		if ( ! d.parentPanel )
		//	return uc.container && (uc.containerBorderWidth > 0);
			return false;
		return borderInAncestry ( d.parentPanel.data );			
	}

	function horzSplitPanelWidth ( d ) {
	//	var pw = {
	//		w: 	((d.w - uc.SPLITTER_WH - (2 * uc.SPLITTER_BORDER_W)) / 2) + (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH)
	//	};
	//	function hasBorder ( d ) {			//	2017-May
	//		if ( d.hasBorder )
	//			return true;
	//		if ( ! d.parentPanel )
	//			return false;
	//		return hasBorder ( d.parentPanel.data );			
	//	}
		var pw = {
		//	w: 	((d.w - uc.SPLITTER_WH - (2 * uc.SPLITTER_BORDER_W)) / 2) + (hasBorder ( d )        ? 0 : uc.PANEL_BORDER_WIDTH)
		//	w: 	((d.w - uc.SPLITTER_WH - (2 * uc.SPLITTER_BORDER_W)) / 2) + (borderInAncestry ( d ) ? 0 : uc.PANEL_BORDER_WIDTH)
			//	2018-May-10
			w: 	((d.w - uc.SPLITTER_WH - (2 * uc.SPLITTER_BORDER_W)) / 2) + (0)
		};
		//	left: 	left panel width
		//	right: 	right panel width
		if ( Math.trunc ( pw.w ) < pw.w ) {
			pw.left  = Math.trunc ( pw.w ) + 1;
			pw.right = Math.trunc ( pw.w );
		} else {
			pw.left  = pw.w;
			pw.right = pw.w;
		}
		pw.right += d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH;		//	2017-May-26
		return pw;
	}	//	horzSplitPanelWidth()

	Panel.prototype.splitHorz = function ( cb ) {
		var panel = this;
		//	Do -
		//
		//		Save/remember the controls on this panel.
		//
		//		Remove the controls, scrollers - everything  * but *  the -
		//
		//			border
		//			size rect
		//			move rect
		//
		//		Insert -
		//
		//			Child panel control on the left side.  Add the controls 
		//			that were on this panel.  
		//
		//			Splitter control - a vertical bar from top to bottom, 
		//			centered horizontally.
		//
		//			Another, empty, panel control on the right side.
		//
		//		The new child panels should not have size and move rects.

		//	Get the child controls data.
		//
		var current = {};

		panel.splitPrep ( current, null, null );

		panel.data.bSplitPanel = true;

		var d      = panel.data;
		var pw     = horzSplitPanelWidth ( d );
		var	xRight = pw.left + uc.SPLITTER_WH + (1 * uc.SPLITTER_BORDER_W) + 0.5;
		var	ph     = d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0);

		//	Left child panel.    For now, by default, left side gets the controls.
		panel.splitAddPanel ( 0.5, 
							  0.5, 
							  pw.left,						//	should be integer
							  ph, 
							  'leftPanel', 'left-panel', current, cb, 'left' );

		//	Center splitter child
		panel.data.horzSplitter = panel.addControl ( uSplitter.createSplitterData ( {
			x: 		pw.left                        + uc.SPLITTER_BORDER_W,
			y: 		uc.OFFS_4_1_PIX_LINE,
			w: 		uc.SPLITTER_WH,
			h: 		ph,
			name: 	'splitter', 
			vh: 	'horz' } ) );

		//	Right child panel
		panel.splitAddPanel ( xRight, 
							  0.5, 
							  pw.right, 
							  ph, 
							  'rightPanel', 				//	name in this panel's data of the new panel 
							  'right-panel', 				//	new panel's element id
							  null,				 			//	new panel's controls
							  cb, 'right' );				//	an event callback, probably panel click


		var g = d3.select ( '#' + d.eleId );
		sized3 ( d, d.w, d.h, g, true );

	};	//	Panel.prototype.splitHorz()

	function vertSplitPanelHeight ( d ) {
	//	var ph = {
	//		h: 	((d.h - uc.SPLITTER_WH - (2 * uc.SPLITTER_BORDER_W)) / 2) + (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH)
	//	};
	//	function hasBorder ( d ) {			//	2017-May
	//		if ( d.hasBorder )
	//			return true;
	//		if ( ! d.parentPanel )
	//			return false;
	//		return hasBorder ( d.parentPanel.data );			
	//	}
		var ph = {
		//	h: 	((d.h - uc.SPLITTER_WH - (2 * uc.SPLITTER_BORDER_W)) / 2) + (hasBorder ( d )        ? 0 : uc.PANEL_BORDER_WIDTH)
			h: 	((d.h - uc.SPLITTER_WH - (2 * uc.SPLITTER_BORDER_W)) / 2) + (borderInAncestry ( d ) ? 0 : uc.PANEL_BORDER_WIDTH)
		};
		//	top: 		top panel height
		//	bottom: 	bottom panel height
		var truncH = Math.trunc ( ph.h );
		if ( truncH < ph.h ) {
			ph.top    = truncH + 1;
			ph.bottom = truncH;
		} else {
			ph.top    = ph.h;
			ph.bottom = ph.h;
		}
		ph.bottom += d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH;		//	2017-May-26
		return ph;
	}	//	vertSplitPanelHeight()

	Panel.prototype.splitVert = function ( cb ) {
		var panel = this;

		//	Get the child controls data.  Remove controls from this panel.
		//	See splitHorz() for comments.
		//
		var current = {};

		panel.splitPrep ( current, null, null );

		panel.data.bSplitPanel = true;

		//	Top child panel.  For now, by default, top side gets the controls.
		var d = panel.data;
		var ph      = vertSplitPanelHeight ( d );
		var yBottom = ph.top + uc.SPLITTER_WH + (1 * uc.SPLITTER_BORDER_W) + 0.5;
		var	pw      = d.w - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0);

		panel.splitAddPanel ( 0.5, 
							  0.5, 
							  pw, 
							  ph.top, 						//	should be integer
							  'topPanel', 					//	name in this panel's data of the new panel 
							  'top-panel', 					//	new panel's element id
							  current,			 			//	new panel's controls
							  cb, 'top' );					//	an event callback, probably panel click

		//	Splitter child
		panel.data.vertSplitter = panel.addControl ( uSplitter.createSplitterData ( {
			x: 		uc.OFFS_4_1_PIX_LINE,
			y: 		ph.top                        + uc.SPLITTER_BORDER_W,
			w: 		pw,
			h: 		uc.SPLITTER_WH,
			name: 	'splitter', 
			vh: 	'vert' } ) );


		//	Bottom child panel
		panel.splitAddPanel ( 0.5, 
							  yBottom, 
							  pw, 
							  ph.bottom,
							  'bottomPanel', 				//	name in this panel's data of the new panel 
							  'bottom-panel', 				//	new panel's element id
							  null,				 			//	new panel's controls
							  cb, 'bottom' );				//	an event callback, probably panel click

		var g = d3.select ( '#' + d.eleId );
		sized3 ( d, d.w, d.h, g, true );

	};	//	Panel.prototype.splitVert()

	Panel.prototype.dockSplitLeft = function ( drop, cb, dtIsSrcParent ) {
		//	Something (drop - another panel) is being docked to the left side of this panel.
		//
		//	So ...
		//
		//	Split this panel -
		//
		//		right: 	controls currently in this panel
		//
		//		left: 	controls currently in drop
		//
		//	Do like splitHorz() -
		//
		//		Save/remember the controls on this panel.
		//
		//		Remove the controls, scrollers - everything  * but *  the -
		//
		//			border
		//			size rect
		//			move rect
		//
		//		Insert -
		//
		//			Child panel control on the left side.  Add the controls 
		//			that were on this panel.  
		//
		//			Splitter control - a vertical bar from top to bottom, 
		//			centered horizontally.
		//
		//			Another, empty, panel control on the right side.
		//
		//		The new child panels should not have size and move rects.

		var panel = this, current = {};

		panel.splitPrep ( current, drop, dtIsSrcParent );	//	Get this panel's current control's data, 
															//	prepare for split.

		//	left side gets the drop
		//
		var pw = (panel.data.w - uc.SPLITTER_WH) / 2;
		var ph =  panel.data.h;

	//	panel.splitAddPanel ( 0, 							//	x
	//						  0, 							//	y
		panel.splitAddPanel ( -0.5, 						//	x
							  -0.5, 						//	y
							  pw + uc.OFFS_4_1_PIX_LINE, 	//	w
							  ph, 							//	h
							  'leftPanel', 					//	name in this panel's data of the new panel 
							  'left-panel', 				//	new panel's element id
							  drop.data.childData, 			//	new panel's controls
							  cb );							//	an event callback, probably panel click


		//	splitter child
		//
		panel.data.horzSplitter = panel.addControl ( uSplitter.createSplitterData ( {
	//		x: 		0 + pw,
	//		y: 		0 + uc.OFFS_4_1_PIX_LINE,
			x: 		-0.5 + pw,
			y: 		-0.5 + uc.OFFS_4_1_PIX_LINE,
			w: 		uc.SPLITTER_WH,
			h: 		ph - uc.SPLITTER_BORDER_W,
			name: 	'splitter', 
			vh: 	'horz' } ) );


		//	right child panel
		//
	//	panel.splitAddPanel ( pw + uc.SPLITTER_WH - uc.OFFS_4_1_PIX_LINE, 		//	x
	//						  0, 							//	y
		panel.splitAddPanel ( pw + uc.SPLITTER_WH - uc.OFFS_4_1_PIX_LINE - 0.5,	//	x
							  -0.5, 						//	y
							  pw + uc.OFFS_4_1_PIX_LINE, 	//	w
							  ph, 							//	h
							  'rightPanel', 				//	name in this panel's data of the new panel 
							  'right-panel', 				//	new panel's element id
							  current,			 			//	new panel's controls
							  cb );							//	an event callback, probably panel click

		panel.data.bSplitPanel = true;

		var d = panel.data;
		var g = d3.select ( '#' + d.eleId );
		sized3 ( d, d.w, d.h, g, true );

	};	//	Panel.prototype.dockSplitLeft()

	Panel.prototype.dockSplitLeft2 = function ( drop, cb, dtIsSrcParent ) {
		//	Something (drop - another panel) is being docked to the left side of this panel.
		//
		//	So ...
		//
		//	Split this panel -
		//
		//		right: 	controls currently in this panel
		//
		//		left: 	controls currently in drop
		//
		//	Do like splitHorz() -
		//
		//		Save/remember the controls on this panel.
		//
		//		Remove the controls, scrollers - everything  * but *  the -
		//
		//			border
		//			size rect
		//			move rect
		//
		//		Insert -
		//
		//			Child panel control on the left side.  Add the controls 
		//			of the drop
		//
		//			Splitter control - a vertical bar from top to bottom, 
		//			centered horizontally.
		//
		//			Another panel control on the right side.  Add to it the 
		//			controls that were in this panel.
		//
		//		The new child panels should not have size and move rects.

		var panel = this, current = {};

		var dropData = (drop.constructor === PanelData) ? drop : drop.data;

		panel.splitPrep ( current, dropData, dtIsSrcParent );	//	Get this panel's current control's data, 
																//	prepare for split.

		panel.data.bSplitPanel = true;

		var d      = panel.data;
		var pw     = horzSplitPanelWidth ( d );
		var	xRight = pw.left + uc.SPLITTER_WH + (1 * uc.SPLITTER_BORDER_W) + 0.5 - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH);
		var	ph     = d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0);

		//	left side gets the drop
		//
	//	var pw = (panel.data.w - uc.SPLITTER_WH) / 2;
	//	var ph =  panel.data.h;
	//
	//	panel.splitAddPanel ( -0.5, 						//	x
	//						  -0.5, 						//	y
	//						  pw + uc.OFFS_4_1_PIX_LINE, 	//	w
	//						  ph, 							//	h
	//						  'leftPanel', 					//	name in this panel's data of the new panel 
	//						  'left-panel', 				//	new panel's element id
	//						  drop.data.childData, 			//	new panel's controls
	//						  cb );							//	an event callback, probably panel click
		//
		//	First, need to remove the controls from the panel being dropped.  But maintain 
		//	the controls' data.
		//
		//	We just need the data of the dropped panel's controls.
		var childData = { nextId: dropData.childData.nextId, data: [] };
		dropData.childData.data.forEach ( function ( d ) {
			childData.data.push ( d );
		} );
		//
		//	The new left panel's controls (html elements) will have the same element IDs
		//	as those of the dropped panel.  To avoid conflicts we need to destroy the dropped
		//	panel and its child elements here.
		//	Just set the dropped panel's child data to [] and destroy that panel.
		dropData.childData.data = [];
		svc.updatePanel ( dropData.parentPanel, dropData );
		//
		//	Now add the left panel and the controls we got from the dropped panel.
		var leftPanel =
		panel.splitAddPanel2 ( 0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
							   0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
							   pw.left,						//	should be integer
							   ph, 
							   'leftPanel',					//	name in this panel's data of the new panel 
							   childData,					//	new panel's controls
							   cb, 							//	an event callback, probably panel click
							   'left',
							   ! panel.data.parentPanel );	//	bParentSplitAndRoot - to help size left panel


	//	//	splitter child
	//	//
	//	panel.data.horzSplitter = panel.addControl ( uSplitter.createSplitterData ( {
	//		x: 		-0.5 + pw,
	//		y: 		-0.5 + uc.OFFS_4_1_PIX_LINE,
	//		w: 		uc.SPLITTER_WH,
	//		h: 		ph - uc.SPLITTER_BORDER_W,
	//		name: 	'splitter', 
	//		vh: 	'horz' } ) );
		//	Center splitter child
		panel.data.horzSplitter = panel.addControl ( uSplitter.createSplitterData ( {
			x: 		pw.left + uc.SPLITTER_BORDER_W - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
			y: 		uc.OFFS_4_1_PIX_LINE           - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
			w: 		uc.SPLITTER_WH,
			h: 		ph,
			name: 	'splitter', 
			vh: 	'horz' } ) );


		//	right child panel
		//
	//	panel.splitAddPanel ( pw + uc.SPLITTER_WH - uc.OFFS_4_1_PIX_LINE - 0.5,	//	x
	//						  -0.5, 						//	y
	//						  pw + uc.OFFS_4_1_PIX_LINE, 	//	w
	//						  ph, 							//	h
	//						  'rightPanel', 				//	name in this panel's data of the new panel 
	//						  'right-panel', 				//	new panel's element id
	//						  current,			 			//	new panel's controls
	//						  cb );							//	an event callback, probably panel click
	//
	//	panel.data.bSplitPanel = true;
	//
	//	var d = panel.data;
	//	var g = d3.select ( '#' + d.eleId );
	//	sized3 ( d, d.w, d.h, g, true );
		//
		var rightPanel =
		panel.splitAddPanel ( xRight, 
							  0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
							  pw.right, 
							  ph, 
							  'rightPanel',		//	name in this panel's data of the new panel 
							  'right-panel', 	//	new panel's element id
							  current,			//	new panel's controls
							  cb, 				//	an event callback, probably panel click
							  'right',
							  ! panel.data.parentPanel );	//	bParentSplitAndRoot - to help size right panel

		var g = d3.select ( '#' + d.eleId );
		sized3 ( d, d.w, d.h, g, true );

		return { leftPanel: leftPanel, rightPanel: rightPanel };
	};	//	Panel.prototype.dockSplitLeft2()

	Panel.prototype.dockSplitTop = function ( drop, cb, dtIsSrcParent ) {

		//	See comments in dockSplitLeft().

		var panel = this, current = {};

		panel.splitPrep ( current, drop, dtIsSrcParent );	//	Get this panel's current control's data, 
															//	prepare for split.

		//	top gets the drop
		//
		var pw =  panel.data.w;
		var ph = (panel.data.h - uc.SPLITTER_WH) / 2;

	//	panel.splitAddPanel ( 0, 							//	x
	//						  0, 							//	y
		panel.splitAddPanel ( -0.5,							//	x
							  -0.5,							//	y
							  pw, 							//	w
							  ph + uc.OFFS_4_1_PIX_LINE, 	//	h
							  'topPanel', 					//	name in this panel's data of the new panel 
							  'top-panel', 					//	new panel's element id
							  drop.data.childData, 			//	new panel's controls
							  cb );							//	an event callback, probably panel click


		//	splitter child
		//
		panel.data.vertSplitter = panel.addControl ( uSplitter.createSplitterData ( {
	//		x: 		0 + uc.OFFS_4_1_PIX_LINE,
	//		y: 		0 + ph, 
			x: 		-0.5 + uc.OFFS_4_1_PIX_LINE,
			y: 		-0.5 + ph, 
			w: 		pw - uc.SPLITTER_BORDER_W,
			h: 		uc.SPLITTER_WH,
			name: 	'splitter', 
			vh: 	'vert' } ) );


		//	bottom child panel
		//
	//	panel.splitAddPanel ( 0, 							//	x
	//						  ph + uc.SPLITTER_WH - uc.OFFS_4_1_PIX_LINE, 		//	y
		panel.splitAddPanel ( -0.5,							//	x
							  ph + uc.SPLITTER_WH - uc.OFFS_4_1_PIX_LINE - 0.5,	//	y
							  pw, 							//	w
							  ph + uc.OFFS_4_1_PIX_LINE, 	//	h
							  'bottomPanel', 				//	name in this panel's data of the new panel 
							  'bottom-panel', 				//	new panel's element id
							  current,			 			//	new panel's controls
							  cb );							//	an event callback, probably panel click

		panel.data.bSplitPanel = true;

		var d = panel.data;
		var g = d3.select ( '#' + d.eleId );
		sized3 ( d, d.w, d.h, g, true );

	};	//	Panel.prototype.dockSplitTop()

	Panel.prototype.dockSplitTop2 = function ( drop, cb, dtIsSrcParent ) {

		//	See comments in dockSplitLeft().

		var panel = this, current = {};

		var dropData = (drop.constructor === PanelData) ? drop : drop.data;

		panel.splitPrep ( current, dropData, dtIsSrcParent );	//	Get this panel's current control's data, 
																//	prepare for split.

		panel.data.bSplitPanel = true;

		var d       = panel.data;
		var ph      = vertSplitPanelHeight ( d );
		var	yBottom = ph.top + uc.SPLITTER_WH + (1 * uc.SPLITTER_BORDER_W) + 0.5 - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH);
		var	pw      = d.w - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0);

		//	top side gets the drop
		//
		//	First, need to remove the controls from the panel being dropped.  But maintain 
		//	the controls' data.
		//
		//	We just need the data of the dropped panel's controls.
		var childData = { nextId: dropData.childData.nextId, data: [] };
		dropData.childData.data.forEach ( function ( d ) {
			childData.data.push ( d );
		} );
		//
		//	The new top panel's controls (html elements) will have the same element IDs
		//	as those of the dropped panel.  To avoid conflicts we need to destroy the dropped
		//	panel and its child elements here.
		//	Just set the dropped panel's child data to [] and destroy that panel.
		dropData.childData.data = [];
		svc.updatePanel ( dropData.parentPanel, dropData );
		//
		//	Now add the top panel and the controls we got from the dropped panel.
		var topPanel =
		panel.splitAddPanel2 ( 0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
							   0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
							   pw,		
							   ph.top, 						//	should be integer
							   'topPanel',					//	name in this panel's data of the new panel 
							   childData,					//	new panel's controls
							   cb, 							//	an event callback, probably panel click
							   'top',
							   ! panel.data.parentPanel );	//	bParentSplitAndRoot - to help size top panel


		//	Center splitter child
		panel.data.vertSplitter = panel.addControl ( uSplitter.createSplitterData ( {
			x: 		uc.OFFS_4_1_PIX_LINE          - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
			y: 		ph.top + uc.SPLITTER_BORDER_W - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
			w: 		pw,
			h: 		uc.SPLITTER_WH,
			name: 	'splitter', 
			vh: 	'vert' } ) );


		//	bottom child panel
		var bottomPanel =
		panel.splitAddPanel ( 0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
							  yBottom, 
							  pw, 
							  ph.bottom, 
							  'bottomPanel',				//	name in this panel's data of the new panel 
							  'bottom-panel', 				//	new panel's element id
							  current,						//	new panel's controls
							  cb, 							//	an event callback, probably panel click
							  'right',
							  ! panel.data.parentPanel );	//	bParentSplitAndRoot - to help size bottom panel

		var g = d3.select ( '#' + d.eleId );
		sized3 ( d, d.w, d.h, g, true );

		return { topPanel: topPanel, bottomPanel: bottomPanel };
	};	//	Panel.prototype.dockSplitTop2()


	Panel.prototype.dockSplitRight = function ( drop, cb, dtIsSrcParent  ) {

		//	See comments in dockSplitLeft().

		var panel = this, current = {};

		var dropData = (drop.constructor === PanelData) ? drop : drop.data;

	//	panel.splitPrep ( current, drop,     dtIsSrcParent );	//	Get this panel's current control's data, 
		panel.splitPrep ( current, dropData, dtIsSrcParent );	//	Get this panel's current control's data, 
																//	prepare for split.

		panel.data.bSplitPanel = true;

		var d      = panel.data;
		var pw     = horzSplitPanelWidth ( d );
		var	xRight = pw.left + uc.SPLITTER_WH + (1 * uc.SPLITTER_BORDER_W) + 0.5 - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH);
		var	ph     = d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0);

		//	left side gets the current controls
		var leftPanel =
		panel.splitAddPanel ( 0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
							  0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
						//	  pw + uc.OFFS_4_1_PIX_LINE, 
							  pw.left,						//	should be integer
							  ph, 
							  'leftPanel', 					//	name in this panel's data of the new panel 
							  'left-panel', 				//	new panel's element id
							  current, 						//	new panel's controls
							  cb, 							//	an event callback, probably panel click
							  'left',
							  ! panel.data.parentPanel );	//	bParentSplitAndRoot - to help size left panel

		//	Center splitter child
		panel.data.horzSplitter = panel.addControl ( uSplitter.createSplitterData ( {
			x: 		pw.left + uc.SPLITTER_BORDER_W - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
			y: 		uc.OFFS_4_1_PIX_LINE           - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
			w: 		uc.SPLITTER_WH,
			h: 		ph,
			name: 	'splitter', 
			vh: 	'horz' } ) );


		//	Right child panel gets the drop
		var rightPanel =
	//	panel.splitAddPanel ( 0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH) + pw + uc.SPLITTER_WH - uc.OFFS_4_1_PIX_LINE,
		panel.splitAddPanel ( xRight, 
							  0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
						//	  pw + uc.OFFS_4_1_PIX_LINE,
							  pw.right, 
							  ph, 
							  'rightPanel', 				//	name in this panel's data of the new panel 
							  'right-panel', 				//	new panel's element id
						//	  drop.data,		//	drop.data.childData, 			//	new panel's controls
							  dropData,			//	drop.data.childData, 			//	new panel's controls
							  cb, 				//	an event callback, probably panel click
							  'right',
							  ! panel.data.parentPanel );	//	bParentSplitAndRoot - to help size right panel

		var g = d3.select ( '#' + d.eleId );
		sized3 ( d, d.w, d.h, g, true );

		return { leftPanel: leftPanel, rightPanel: rightPanel };
	};	//	Panel.prototype.dockSplitRight()

	Panel.prototype.dockSplitRight2 = function ( drop, cb, dtIsSrcParent  ) {

		//	See comments in dockSplitLeft().
		//
		//	See 2017-Apr-09 comments in mouseUp() (what calls this).

		var panel    = this, current = {};
		var dropData = (drop.constructor === PanelData) ? drop : drop.data;

		panel.splitPrep ( current, dropData, dtIsSrcParent );	//	Get this panel's current control's data, 
																//	prepare for split.

		panel.data.bSplitPanel = true;

		var d      = panel.data;
		var pw     = horzSplitPanelWidth ( d );
		var	xRight = pw.left + uc.SPLITTER_WH + (1 * uc.SPLITTER_BORDER_W) + 0.5 - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH);
		var	ph     = d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0);

		//	left side gets the current controls
		var leftPanel =
		panel.splitAddPanel ( 0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
							  0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
							  pw.left,						//	should be integer
							  ph, 
							  'leftPanel', 					//	name in this panel's data of the new panel 
							  'left-panel', 				//	new panel's element id
							  current, 						//	new panel's controls
							  cb, 							//	an event callback, probably panel click
							  'left',
							  ! panel.data.parentPanel );	//	bParentSplitAndRoot - to help size left panel

		//	Center splitter child
		panel.data.horzSplitter = panel.addControl ( uSplitter.createSplitterData ( {
			x: 		pw.left + uc.SPLITTER_BORDER_W - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
			y: 		uc.OFFS_4_1_PIX_LINE           - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
			w: 		uc.SPLITTER_WH,
			h: 		ph,
			name: 	'splitter', 
			vh: 	'horz' } ) );


		//	Right child panel gets the drop
		//
		//	First, need to remove the controls from the panel being dropped.  But maintain 
		//	the controls' data.
		//
		//	We just need the data of the dropped panel's controls.
		var childData = { nextId: dropData.childData.nextId, data: [] };
		dropData.childData.data.forEach ( function ( d ) {
			childData.data.push ( d );
		} );
		//
		//	The new right panel's controls (html elements) will have the same element IDs
		//	as those of the dropped panel.  To avoid conflicts we need to destroy the dropped
		//	panel and its child elements here.
		//	Just set the dropped panel's child data to [] and destroy that panel.
		dropData.childData.data = [];
		svc.updatePanel ( dropData.parentPanel, dropData );
		//
		//	Now add the right panel and the controls we got from the dropped panel.
		var rightPanel =
		panel.splitAddPanel2 ( xRight, 
							   0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
							   pw.right, 
							   ph, 
							   'rightPanel',	//	name in this panel's data of the new panel 
							   childData,		//	new panel's controls
							   cb, 				//	an event callback, probably panel click
							   'right',
							   ! panel.data.parentPanel );	//	bParentSplitAndRoot - to help size right panel

		var g = d3.select ( '#' + d.eleId );
		sized3 ( d, d.w, d.h, g, true );

		return { leftPanel: leftPanel, rightPanel: rightPanel };
	};	//	Panel.prototype.dockSplitRight2()

	Panel.prototype.dockSplitBottom = function ( drop, cb, dtIsSrcParent ) {

		//	See comments in dockSplitLeft().

		var panel = this, current = {};

		panel.splitPrep ( current, drop, dtIsSrcParent );	//	Get this panel's current control's data, 
															//	prepare for split.

		//	top gets the current controls
		//
		var pw =  panel.data.w;
		var ph = (panel.data.h - uc.SPLITTER_WH) / 2;

	//	panel.splitAddPanel ( 0, 							//	x
	//						  0, 							//	y
		panel.splitAddPanel ( -0.5,							//	x
							  -0.5,							//	y
							  pw, 							//	w
							  ph + uc.OFFS_4_1_PIX_LINE, 	//	h
							  'topPanel', 					//	name in this panel's data of the new panel 
							  'top-panel', 					//	new panel's element id
							  current,			 			//	new panel's controls
							  cb );							//	an event callback, probably panel click


		//	splitter child
		//
		panel.data.vertSplitter = panel.addControl ( uSplitter.createSplitterData ( {
	//		x: 		0 + uc.OFFS_4_1_PIX_LINE,
	//		y: 		0 + ph, 
			x: 		-0.5 + uc.OFFS_4_1_PIX_LINE,
			y: 		-0.5 + ph, 
			w: 		pw - uc.SPLITTER_BORDER_W,
			h: 		uc.SPLITTER_WH,
			name: 	'splitter', 
			vh: 	'vert' } ) );


		//	bottom gets the drop
		//
	//	panel.splitAddPanel ( 0, 							//	x
	//						  ph + uc.SPLITTER_WH - uc.OFFS_4_1_PIX_LINE, 		//	y
		panel.splitAddPanel ( -0.5,							//	x
							  ph + uc.SPLITTER_WH - uc.OFFS_4_1_PIX_LINE - 0.5,	//	y
							  pw, 							//	w
							  ph + uc.OFFS_4_1_PIX_LINE, 	//	h
							  'bottomPanel', 				//	name in this panel's data of the new panel 
							  'bottom-panel', 				//	new panel's element id
							  drop.data.childData, 			//	new panel's controls
							  cb );							//	an event callback, probably panel click

		panel.data.bSplitPanel = true;

		var d = panel.data;
		var g = d3.select ( '#' + d.eleId );
		sized3 ( d, d.w, d.h, g, true );

	};	//	Panel.prototype.dockSplitBottom()

	Panel.prototype.dockSplitBottom2 = function ( drop, cb, dtIsSrcParent ) {

		var panel = this, current = {};

		var dropData = (drop.constructor === PanelData) ? drop : drop.data;

		panel.splitPrep ( current, dropData, dtIsSrcParent );	//	Get this panel's current control's data, 
																//	prepare for split.

		panel.data.bSplitPanel = true;

		var d       = panel.data;
		var ph      = vertSplitPanelHeight ( d );
		var	yBottom = ph.top + uc.SPLITTER_WH + (1 * uc.SPLITTER_BORDER_W) + 0.5 - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH);
		var	pw      = d.w - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0);

		//	top child panel
		var topPanel =
		panel.splitAddPanel ( 0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
							  0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
							  pw, 
							  ph.top, 
							  'topPanel',					//	name in this panel's data of the new panel 
							  'top-panel', 					//	new panel's element id
							  current,						//	new panel's controls
							  cb, 							//	an event callback, probably panel click
							  'right',
							  ! panel.data.parentPanel );	//	bParentSplitAndRoot - to help size top panel


		//	Center splitter child
		panel.data.vertSplitter = panel.addControl ( uSplitter.createSplitterData ( {
			x: 		uc.OFFS_4_1_PIX_LINE          - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
			y: 		ph.top + uc.SPLITTER_BORDER_W - (d.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
			w: 		pw,
			h: 		uc.SPLITTER_WH,
			name: 	'splitter', 
			vh: 	'vert' } ) );


		//	bottom side gets the drop
		//
		//	First, need to remove the controls from the panel being dropped.  But maintain 
		//	the controls' data.
		//
		//	We just need the data of the dropped panel's controls.
		var childData = { nextId: dropData.childData.nextId, data: [] };
		dropData.childData.data.forEach ( function ( d ) {
			childData.data.push ( d );
		} );
		//
		//	The new bottom panel's controls (html elements) will have the same element IDs
		//	as those of the dropped panel.  To avoid conflicts we need to destroy the dropped
		//	panel and its child elements here.
		//	Just set the dropped panel's child data to [] and destroy that panel.
		dropData.childData.data = [];
		svc.updatePanel ( dropData.parentPanel, dropData );
		//
		//	Now add the bottom panel and the controls we got from the dropped panel.
		var bottomPanel =
		panel.splitAddPanel2 ( 0.5 - (panel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH),
							   yBottom,
							   pw,		
							   ph.bottom, 					//	should be integer
							   'bottomPanel',				//	name in this panel's data of the new panel 
							   childData,					//	new panel's controls
							   cb, 							//	an event callback, probably panel click
							   'bottom',
							   ! panel.data.parentPanel );	//	bParentSplitAndRoot - to help size bottom panel

		var g = d3.select ( '#' + d.eleId );
		sized3 ( d, d.w, d.h, g, true );

		return { topPanel: topPanel, bottomPanel: bottomPanel };
	};	//	Panel.prototype.dockSplitBottom2()


	Panel.prototype.unsplit = function ( panelRemaining ) {
		var sW    = serviceId + ' Panel.prototype.unsplit()';
		var panel = this;
		//	This panel is currently split.  Do -
		//		Get the location, dimensions of this panel.
		//		Get the controls of panelRemaining.
		//		Destroy this panel's element - with parentPanel.rmvControl ( panel ).
		//		Create  a new element with this panel's location, dimensions.

		var pd = panel.data, parentPanel = panel.data.parentPanel, rd = panelRemaining.data;
		
		//	location, dimensions of this panel
		var x = pd.x, y = pd.y, w = pd.w, h = pd.h;

		//	If this is the root panel (parentPanel === null) then 
		//		Call svc.updatePanel() to remove the remaining controls
		//		Rebuild the scrollers, etc.
		//		Add the remaining controls.
		//
		if ( parentPanel === null ) {
			var cd = pd.childData.data;
			while ( cd.length > 0 )
				svc.updatePanel ( panel, cd[0], { bKeepChildClipPaths: false } );
			var g = d3.select ( '#' + pd.eleId );
			pd.bSplitPanel  = false;
			pd.horzSplitter = null;
			pd.vertSplitter = null;
			defineScrollers ( g );
			sized3 ( pd, w, h, g, true );
			svc.addCtrls ( panel, rd.childData );
			return;
		}

		//	destroy this panel's current element
		parentPanel.rmvControl ( panel );

		//	new data for this panel
		pd = svc.createPanelData ( { x: 		x, 
									 y: 		y, 
									 w: 		w, 
									 h: 		h, 
									 name: 		rd.name, 
									 clickCB: 	rd.clickCB } );

		var newPanel = parentPanel.addControl ( pd );		//	newPanel replacing this?

		svc.addCtrls ( newPanel, rd.childData );

		return newPanel;
	};	//	Panel.prototype.unsplit()

	Panel.prototype.restoreSplit = function ( pd0, sd, pd2 ) {
		var panel = this;

		//	Restoring this panel from storage.  Caller has already created and passed here
		//	the data for the two new panels (pd0, pd2) and the splitter (sd).  Caller will take 
		//	care of the child controls in the new panels.

		svc.removeBaseG ( panel );
		svc.removeSclrs ( panel );

		panel.data.base = d3.select ( '#' + panel.data.eleId );

		pd0.hasBorder   = false;
		pd0.bMoveRect = false;
		pd0.bSizeRect = false;

		pd2.hasBorder   = false;
		pd2.bMoveRect = false;
		pd2.bSizeRect = false;

		if ( sd.vh === 'vert' ) {
			panel.data.topPanel     = panel.addControl ( pd0 );
			panel.data.vertSplitter = panel.addControl ( sd );
			panel.data.bottomPanel  = panel.addControl ( pd2 );
		} else
		if ( sd.vh === 'horz' ) {
			panel.data.leftPanel    = panel.addControl ( pd0 );
			panel.data.horzSplitter = panel.addControl ( sd );
			panel.data.rightPanel   = panel.addControl ( pd2 );
		}

		panel.data.bSplitPanel = true;

	};	//	Panel.prototype.restoreSplit()


	Panel.prototype.splitterMove = function ( dx, dy ) {
		var panel = this, pd, g;
		if ( panel.data.horzSplitter ) {
			//	Size the right panel.
			pd = panel.data.rightPanel.data;
			g  = d3.select ( '#' + pd.eleId );
			sized2 ( pd, g, -dx, 0, false );
			//	Move the right panel.
		//	g.attr ( 'transform', function ( d, i ) { return 'translate(' + (d.x += dx) + ',0)'; } );
			g.attr ( 'transform', function ( d, i ) { 
			//	return 'translate(' + (d.x += dx) + ',' + (- uc.OFFS_4_1_PIX_LINE)                                                              + ')'; 
				return 'translate(' + (d.x += dx) + ',' + (  uc.OFFS_4_1_PIX_LINE - (d.parentPanel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH)) + ')'; 
			} );
			//	Size the left panel.
			pd = panel.data.leftPanel.data;
			g  = d3.select ( '#' + pd.eleId );
			sized2 ( pd, g, dx, 0, false );
		}
		if ( panel.data.vertSplitter ) {
			//	Size the bottom panel.
			pd = panel.data.bottomPanel.data;
			g  = d3.select ( '#' + pd.eleId );
			sized2 ( pd, g, 0, -dy, false );
			//	Move the bottom panel.
		//	g.attr ( 'transform', function ( d, i ) { return 'translate(0,'                                + (d.y += dy) + ')'; } );
			g.attr ( 'transform', function ( d, i ) { 
			//	return 'translate(' + (- uc.OFFS_4_1_PIX_LINE)                                                              + ',' + (d.y += dy) + ')'; 
				return 'translate(' + (  uc.OFFS_4_1_PIX_LINE - (d.parentPanel.data.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH)) + ',' + (d.y += dy) + ')'; 
			} );
			//	Size the top panel.
			pd = panel.data.topPanel.data;
			g  = d3.select ( '#' + pd.eleId );
			sized2 ( pd, g, 0, dy, false );
		}
	};	//	Panel.prototype.splitterMove()


	Panel.prototype.drag = function ( dragee ) {
		var sW = serviceId + ' Panel.drag()';
		var panel = this;

		//	Drag & Drop: Step 2 -
		//
		//		Create and move a representation of what is being dragged.
		//
		//		Note that the class u34-drag-dragee-outline has pointer-events
		//		set to none.
		//
		//	First, an outline to represent what is being dragged.
		//
		if ( ! dragee.outline ) {
			dragee.outline = d3.select ( '#' + panel.data.eleId )
				.append ( 'g' )
				.attr ( 'id', 'dragee' )
				.attr ( 'transform', 'translate(' + dragee.x + ',' + dragee.y + ')' );

			dragee.outline
				.append ( 'rect' )
				.attr ( 'x', 	  0 )
				.attr ( 'y', 	  0 )
				.attr ( 'width',  dragee.w )
				.attr ( 'height', dragee.h )
				.attr ( 'class',  'u34-drag-dragee-outline' );

			dragee.outline
				.append ( 'text' )
				.attr ( 'id', 'drag-info-text-line-1')
				.attr ( 'text-anchor', 'left' )
				.attr ( 'x',     5 )
				.attr ( 'y',     15 )
				.attr ( 'class', 'u34-drag-info-text' )
				.text ( '' );

			dragee.outline
				.append ( 'text' )
				.attr ( 'id', 'drag-info-text-line-2')
				.attr ( 'text-anchor', 'left' )
				.attr ( 'x',     5 )
				.attr ( 'y',     30 )
				.attr ( 'class', 'u34-drag-info-text' )
				.text ( '' );
		}

		dragee.outline
			.attr ( 'transform', 'translate(' + (dragee.x += dragee.dx) + ',' + (dragee.y += dragee.dy) + ')' );

	};	//	Panel.prototype.drag()

	Panel.prototype.dragInfoLine1 = function ( info ) {
		var sW = serviceId + ' Panel.dragInfoLine1()';
		var panel = this;

	//	console.log ( sW + ' info: ' + info );

		//	Drag & Drop: Step 3 -
		//
		//		Display info, on the dragged outline, about candidate target (what the 
		//		mouse is over).
		//
		if ( ! uc.isDragging ) {
	//		console.log ( sW + ' ERROR: ! uc.isDragging' );
			return;
		}

		if ( ! uc.dragee.outline ) {			//	happens during e2e sometimes
	//		console.log ( sW + ' ERROR: ! uc.dragee.outline' );
			return;
		}

		uc.dragee.outline.select ( '#drag-info-text-line-1' )
			.text ( info );

	};	//	Panel.prototype.dragInfoLine1()

	Panel.prototype.dragInfoLine2 = function ( info ) {
		var sW = serviceId + ' Panel.dragInfoLine2()';
		var panel = this;

		if ( ! uc.isDragging )
			return;

		uc.dragee.outline.select ( '#drag-info-text-line-2' )
			.text ( info );

	};	//	Panel.prototype.dragInfoLine2()


	Panel.prototype.dragEnd = function ( dragee ) {
		var sW = serviceId + ' Panel.dragEnd()';
		var panel = this;

		if ( dragee.outline ) 
			dragee.outline
				.remove();
		dragee.outline = null;
		uc.isDragging = false;

	};	//	Panel.prototype.dragEnd()


	Panel.prototype.showFlyoverInfo = function ( x, y, text ) {
		var sW    = serviceId + ' showFlyoverInfo()';
		var panel = this;
		var wh = uLabel.measureText ( panel, 'verdana', '10px', text );
		var w = wh.w + 4;
		var h = wh.h;
		var labelD = uLabel.createLabelData ( { x: 		x         + uc.OFFS_4_1_PIX_LINE, 
												y: 		y - h - 4 + uc.OFFS_4_1_PIX_LINE,  
												w: 		w,  
												h: 		h, 
												name: 	'flyoverInfo',
												text: 	text } );
		labelD.class  = 'u34-label-flyover-info';
	//	labelD.filter = 'url(#drop-shadow)';
		panel.data.foInfoLabel = panel.addControl ( labelD );
	};	//	Panel.prototype.showFlyoverInfo()

	Panel.prototype.hideFlyoverInfo = function() {
		var sW    = serviceId + ' hideFlyoverInfo()';
		var panel = this;

		if ( panel.data.foInfoLabel ) {
			panel.rmvControl ( panel.data.foInfoLabel );
			panel.data.foInfoLabel = null;
		}
	};	//	Panel.prototype.hideFlyoverInfo()

	Panel.prototype.saveToLS = function() {
		var sW    = serviceId + ' saveToLS()';
		var panel = this, pd = panel.data;

		//	prompt for save-as name
		panel.promptSaveAs ( pd );

	};	//	Panel.prototype.saveToLS()

	Panel.prototype.promptSaveAs = function ( savePanelData ) {
		var sW    = serviceId + ' promptSaveAs()';
		var rpd   = uc.rootPanel.data,
			panel = this, 
			pd    = panel.data, 
			cd    = null, 				//	control data
			dlg   = { isBuiltIn: 		true,
					  invokingPanel: 	panel,
					  data: 			null,
					  panel: 			null };

		function onOK() {
			var sW2 = sW + ' onOK()';
			var pd = savePanelData;
			var cd = dlg.panel.getControlDataByName ( 'edtSaveAs' );
			pd.storeName = cd.value;
			console.log ( sW2 + ':  storeName: ' + pd.storeName );
			uSL.storePanel ( sW2, 
							 uc.ROOT_UDUI_ID,	//	For now.  Later, might be a PE UDUI.
							 pd );
			uc.rootPanel.removeDialog ( dlg );
		}	//	onOK()
		
		function onCancel() {
			var sW2 = sW + ' onCancel()';
			console.log ( sW2 );
			uc.rootPanel.removeDialog ( dlg );
		}	//	onCancel()
		
		var o = { 
			sC: 		sW, 
			itemName: 	{
				createdInSysId: 	0,		//	For now.  Later, current system Id.
				uduiId: 			uc.ROOT_UDUI_ID, 
				createdByUserId: 	userAuth.userID, 			//	For now.  Later, same as current system's createdByUserId.
				storeId: 			uc.SAVE_AS_DLG_STORE_ID,	//	A reserved store Id.
				savedByUserId: 		userAuth.userID, 			//	For now.  For app dialogs this might always be 0?
				storeName: 			uc.SAVE_AS_DLG_STORE_NAME	//	note: same as name given when created below
			},
			panelSvc: 	svc,
			root: 		{ 
				svg: 		null,
				data: 		null,
				panelData: 	null,
				panel: 		uc.rootPanel 
			},
			parentPanel: 	panel,
			dlg: 			dlg,
			panel:  		null,
			panelClick: 	null 
		};

		uSL.loadPanel ( o );

		if ( o.panel ) {
			if ( (cd = o.panel.getControlDataByName ( 'btnOK' )) !== null )
				cd.cb = onOK;
			if ( (cd = o.panel.getControlDataByName ( 'btnCancel' )) !== null )
				cd.cb = onCancel;
			return;
		}

		var w = 200;
		var h = 140;
		var x = Math.round ( (rpd.w - w) / 2 );
		var y = Math.round ( (rpd.h - h) / 2 );

		dlg.data = svc.createAppPanelData ( { x: 			x + uc.OFFS_4_1_PIX_LINE, 
											  y: 			y + uc.OFFS_4_1_PIX_LINE, 
											  w: 			w, 
											  h: 			h, 
											  name: 		'pnlSaveAs', 
											  bStore: 		true,
											  storeId: 		uc.SAVE_AS_DLG_STORE_ID,
											  storeName: 	uc.SAVE_AS_DLG_STORE_NAME } );
		dlg.data.bSaveRect = dlg.isBuiltIn;

		uc.rootPanel.appendDialog ( dlg );

		dlg.panel.addControl ( uLabel.createLabelData ( { x: 	20,
														  y: 	20,
														  w: 	60,  
														  h: 	15, 
														  name: 'lblSaveAs',
														  text: 'Save As:' } ) );
		dlg.panel.addControl ( uInput.createInputData ( { x: 	80,
														  y: 	20,
														  w: 	80,  
														  h: 	15, 
														  name: 'edtSaveAs',
														  value: '' } ) );
		dlg.panel.addControl ( uButton.createButtonData ( { x: 		20,
														    y: 		60,
														    w: 		60,  
														    h: 		20, 
														    name: 	'btnOK',
														    text: 	'OK',
														    cb: 	onOK } ) );
		dlg.panel.addControl ( uButton.createButtonData ( { x: 		80,
														    y: 		60,
														    w: 		60,  
														    h: 		20, 
														    name: 	'btnCancel',
														    text: 	'Cancel',
														    cb: 	onCancel } ) );
	};	//	Panel.prototype.promptSaveAs()

	Panel.prototype.loadFromLS = function() {
		var sW    = serviceId + ' loadFromLS()';
		var panel = this;

		panel.promptLoad (  );

	};	//	Panel.prototype.loadFromLS()

	Panel.prototype.promptLoad = function (  ) {
		var sW    = serviceId + ' promptLoad()';
		var rpd   = uc.rootPanel.data,
			panel = this, 
			pd    = panel.data, 
			cd    = null, 				//	control data
			dlg   = { isBuiltIn: 		true,
					  invokingPanel: 	panel,
					  data: 			null,
					  panel: 			null },
			selectedPanel = null;

		function onListPanelNamesItemClick ( itemData ) {
			selectedPanel = itemData;
		}	//	onListPanelNamesItemClick();

		function onOK() {
			var sW2 = sW + ' onOK()';
			console.log ( sW2 + ':  storeName: ' + pd.storeName );
			uc.rootPanel.removeDialog ( dlg );

			if ( ! selectedPanel )
				return;

			o.itemName.storeId   = Number ( selectedPanel.data.id );
			o.itemName.storeName =          selectedPanel.data.name;
			o.dlg = null;
			uSL.loadPanel ( o );
		}	//	onOK()
		
		function onCancel() {
			var sW2 = sW + ' onCancel()';
			console.log ( sW2 );
			uc.rootPanel.removeDialog ( dlg );
		}	//	onCancel()
		
		function populatePanelList ( listData ) {
			listData.itemData = [];
			var panelList = uSL.getPanelList ( sW, uc.ROOT_UDUI_ID );
			var i, n = panelList.length;
			for ( i = 0; i < n; i++ ) {
				var pnl = panelList[i];

				var itm = { textId: pnl.id + pnl.name,
							text: 	pnl.name,
							data: 	pnl };
				listData.itemData.push ( uList.createListItemData ( itm ) );
			}
			listData.update();
		}	//	populatePanelList()

		var o = { 
			sC: 		sW, 
			itemName: 	{
				createdInSysId: 	0,		//	For now.  Later, current system Id.
				uduiId: 			uc.ROOT_UDUI_ID, 
				createdByUserId: 	userAuth.userID, 			//	For now.  Later, same as current system's createdByUserId.
				storeId: 			uc.LOAD_DLG_STORE_ID,	//	A reserved store Id.
				savedByUserId: 		userAuth.userID, 			//	For now.  For app dialogs this might always be 0?
				storeName: 			uc.LOAD_DLG_STORE_NAME	//	note: same as name given when created below
			},
			panelSvc: 	svc,
			root: 		{ 
				svg: 		null,
				data: 		null,
				panelData: 	null,
				panel: 		uc.rootPanel 
			},
			parentPanel: 	panel,
			dlg: 			dlg,
			panel:  		null,
			panelClick: 	uc.appPanelClick
		};

		uSL.loadPanel ( o );

		if ( o.panel ) {
			if ( (cd = o.panel.getControlDataByName ( 'lstPanelNames' )) !== null ) {
				populatePanelList ( cd );
				cd.cb = onListPanelNamesItemClick;
			}
			
			if ( (cd = o.panel.getControlDataByName ( 'btnOK' )) !== null )
				cd.cb = onOK;
			if ( (cd = o.panel.getControlDataByName ( 'btnCancel' )) !== null )
				cd.cb = onCancel;
			
			return;
		}

		var w = 200;
		var h = 160;
		var x = Math.round ( (rpd.w - w) / 2 );
		var y = Math.round ( (rpd.h - h) / 2 );

		dlg.data = svc.createAppPanelData ( { x: 			x + uc.OFFS_4_1_PIX_LINE, 
											  y: 			y + uc.OFFS_4_1_PIX_LINE, 
											  w: 			w, 
											  h: 			h, 
											  name: 		'pnlLoad', 
											  bStore: 		true,
											  storeId: 		uc.LOAD_DLG_STORE_ID,
											  storeName: 	uc.LOAD_DLG_STORE_NAME } );
		dlg.data.bSaveRect = dlg.isBuiltIn;

		uc.rootPanel.appendDialog ( dlg );

		var list = dlg.panel.addControl ( uList.createListData ( { x: 		20,
																   y: 		20,
																   w: 		80,
																   h: 		100,
																   name: 	'lstPanelNames',
																   cb:		onListPanelNamesItemClick } ) );
		populatePanelList ( list.data );

		dlg.panel.addControl ( uButton.createButtonData ( { x: 		20,
														    y: 		130,
														    w: 		60,  
														    h: 		20, 
														    name: 	'btnOK',
														    text: 	'OK',
														    cb: 	onOK } ) );
		dlg.panel.addControl ( uButton.createButtonData ( { x: 		90,
														    y: 		130,
														    w: 		60,  
														    h: 		20, 
														    name: 	'btnCancel',
														    text: 	'Cancel',
														    cb: 	onCancel } ) );
	};	//	Panel.prototype.promptLoad()

	Panel.prototype.getControlDataByName = function ( name ) {
		var sW    = serviceId + ' getControlDataByName()';
		var panel = this, pd = panel.data, cdd = pd.childData.data, i;
		for ( i = 0; i < cdd.length; i++ )
			if ( cdd[i].name === name )
				return cdd[i];
		return null;
	};	//	Panel.prototype.getControlDataByName()

	Panel.prototype.getControlElementByName = function ( name ) {
		var sW = serviceId + ' getControlElementByName()';
		var cd = this.getControlDataByName ( name );
		if ( cd === null )
			return null;
		var es = d3.select ( '#' + cd.eleId );
		var e  = es._groups[0][0];
		return e;
	};	//	Panel.prototype.getControlElementByName()

	Panel.prototype.setInput = function ( ctrlName, value ) {
		var sW = serviceId + ' setInput()';
		var ce = this.getControlElementByName ( ctrlName );
		if ( ce == null ) 
			return;
		ce.__data__.value = value;
		var eles = ce.getElementsByTagName ( 'input' );
		if ( eles.length > 0 )
			eles[0].value = value;
	};	//	Panel.prototype.setInput()

	Panel.prototype.setCheckBox = function ( ctrlName, value ) {
		var sW = serviceId + ' setCheckBox()';
		var ce = this.getControlElementByName ( ctrlName );
		if ( ce == null ) 
			return;
		ce.__data__.value = value;
		var eles = ce.getElementsByTagName ( 'line' );
		for ( var i = 0; i < eles.length; i++ )
			eles[i].class = value ? 'u34-checkbox-checked' : 'u34-checkbox-checked-not';
	};	//	Panel.prototype.setCheckBox()

	Panel.prototype.gridMove = function ( childData, event ) {
		var xy = null;
		if ( event )
			xy = event;
		else
		if ( d3.event )
			xy = d3.event;
		if ( xy === null )
			return null;
		var grid = this.data.grid;
		var gx = grid.isEnabled ? grid.spaceX : 1;
		var gy = grid.isEnabled ? grid.spaceY : 1;
	//	var ex = (Math.round ( (xy.x * 10) / gx ) * gx) / 10;	//	maintain the fractional part of the
	//	var ey = (Math.round ( (xy.y * 10) / gy ) * gy) / 10;	//	position (e.g., panel)
		var fx = Math.round ( (xy.x - Math.trunc ( xy.x )) * 10 ) / 10;	//	maintain the fractional part of the
		var ex = (Math.round ( xy.x / gx ) * gx) + fx;					//	position (e.g., panel), 1 dec place
		var fy = Math.round ( (xy.y - Math.trunc ( xy.y )) * 10 ) / 10;
		var ey = (Math.round ( xy.y / gy ) * gy) + fy;
		if ( (ex === childData.x) && (ey === childData.y) )
			return null;
		return { x: ex, y: ey };
	};	//	Panel.prototype.gridMove()

	function mouseOverDropTargetLeft ( d, i, ele ) {
		var sW = serviceId + ' mouseOverDropTargetLeft()';
	//	console.log ( sW );
		uc.dragee.rootPanel.dragInfoLine2 ( 'dock left' );

		uc.dragee.dropTarget = { panel: 		d.panelData.panel,
								 where: 		'left',
								 targetEle: 	ele[i] };

		//	show something to indicate possible drop and dock at left side of panel
	//	var x  = d.x;
		var dw = d.w / 4;
		d.dragTarget.screen
			.select ( 'rect' )
	//		.attr ( 'x',      d.x += dw )		//	move to the right and
	//		.attr ( 'width',  d.w -= dw );		//	make narrower
			.attr ( 'x',      dw )				//	move to the right and
			.attr ( 'width',  d.w - uc.PANEL_BORDER_WIDTH - dw );		//	make narrower
		d.dragTarget.screen 
			.append ( 'rect' )
			.attr ( 'id',     'drop-left-rect' )
	//		.attr ( 'x',      x )				//	in the space opened by the rect adjustment above 
	//		.attr ( 'y',      d.y )
			.attr ( 'x',      0 )				//	in the space opened by the rect adjustment above 
			.attr ( 'y',      0 )
			.attr ( 'width',  dw )
			.attr ( 'height', d.h )
			.attr ( 'class',  'u34-drag-target-drop' );
	}	//	mouseOverDropTargetLeft()


	function mouseLeaveDropTargetLeft ( d, i, ele ) {
		var sW = serviceId + ' mouseLeaveDropTargetLeft()';
	//	console.log ( sW );
		uc.dragee.rootPanel.dragInfoLine2 ( '' );

		uc.dragee.dropTarget = null;

		d.dragTarget.screen 					//	undo drop indicator
			.select ( '#drop-left-rect' )
				.remove();
	//	var dw = d.w / 3;
		d.dragTarget.screen
			.select ( 'rect' )
	//		.attr ( 'x',      d.x -= dw )
	//		.attr ( 'width',  d.w += dw );
			.attr ( 'x',      0 )
			.attr ( 'width',  d.w - uc.PANEL_BORDER_WIDTH );
	}	//	mouseLeaveDropTargetLeft()

	function mouseOverDropTargetTop ( d, i, ele ) {
		var sW = serviceId + ' mouseOverDropTargetTop()  panel: ' + d.panelData.name;
	//	console.log ( sW );
		uc.dragee.rootPanel.dragInfoLine2 ( 'dock top' );

		uc.dragee.dropTarget = { panel: 		d.panelData.panel,
								 where: 		'top',
								 targetEle: 	ele[i] };

		//	show something to indicate possible drop and dock at top of panel
	//	var y  = d.y;
		var dh = d.h / 4;
		d.dragTarget.screen
			.select ( 'rect' )
	//		.attr ( 'y',       d.y += dh )		//	move down and
	//		.attr ( 'height',  d.h -= dh );		//	make shorter
			.attr ( 'y',       dh )				//	move down and
			.attr ( 'height',  d.h - uc.PANEL_BORDER_WIDTH - dh );		//	make shorter
		d.dragTarget.screen 
			.append ( 'rect' )
			.attr ( 'id',     'drop-top-rect' )
		//	.attr ( 'x',      d.x )				//	in the space opened by the rect adjustment above 
		//	.attr ( 'y',      y )
			.attr ( 'x',      0 )				//	in the space opened by the rect adjustment above 
			.attr ( 'y',      0 )
			.attr ( 'width',  d.w )
			.attr ( 'height', dh )
			.attr ( 'class',  'u34-drag-target-drop' );
	}	//	mouseOverDropTargetTop()

	function mouseLeaveDropTargetTop ( d, i, ele ) {
		var sW = serviceId + ' mouseLeaveDropTargetTop()';
	//	console.log ( sW );
		uc.dragee.rootPanel.dragInfoLine2 ( '' );

		d.dragTarget.screen 					//	undo drop indicator
			.select ( '#drop-top-rect' )
				.remove();
	//	var dh = d.h / 3;
		d.dragTarget.screen
			.select ( 'rect' )
	//		.attr ( 'y',      d.y -= dh )
	//		.attr ( 'height', d.h += dh );
			.attr ( 'y',      0 )
			.attr ( 'height', d.h - uc.PANEL_BORDER_WIDTH );
	}	//	mouseLeaveDropTargetTop()

	function mouseOverDropTargetRight ( d, i, ele ) {
		var sW = serviceId + ' mouseOverDropTargetRight()';
	//	console.log ( sW );
		uc.dragee.rootPanel.dragInfoLine2 ( 'dock right' );

		uc.dragee.dropTarget = { panel: 		d.panelData.panel,
								 where: 		'right',
								 targetEle: 	ele[i] };

		//	show something to indicate possible drop and dock at right side of panel
	//	var x  = d.x + ((d.w * 3) / 4);
		var x  =        (d.w * 3) / 4;
		var dw = d.w / 4;
		d.dragTarget.screen
			.select ( 'rect' )
	//		.attr ( 'width',  d.w -= dw );		//	make narrower
			.attr ( 'width',  d.w -  dw );		//	make narrower
		d.dragTarget.screen 
			.append ( 'rect' )
			.attr ( 'id',     'drop-right-rect' )
			.attr ( 'x',      x )				//	in the space opened by the rect adjustment above 
	//		.attr ( 'y',      d.y )
			.attr ( 'y',      0 )
			.attr ( 'width',  dw )
			.attr ( 'height', d.h )
			.attr ( 'class',  'u34-drag-target-drop' );
	}	//	mouseOverDropTargetRight()

	function mouseLeaveDropTargetRight ( d, i, ele ) {
		var sW = serviceId + ' mouseLeaveDropTargetRight()';
	//	console.log ( sW );
		uc.dragee.rootPanel.dragInfoLine2 ( '' );

		d.dragTarget.screen 					//	undo drop indicator
			.select ( '#drop-right-rect' )
				.remove();
	//	var dw = d.w / 3;
		d.dragTarget.screen
			.select ( 'rect' )
	//		.attr ( 'width',  d.w += dw );
			.attr ( 'width',  d.w - uc.PANEL_BORDER_WIDTH );
	}	//	mouseLeaveDropTargetRight()

	function mouseOverDropTargetBottom ( d, i, ele ) {
		var sW = serviceId + ' mouseOverDropTargetBottom()';
	//	console.log ( sW );
		uc.dragee.rootPanel.dragInfoLine2 ( 'dock bottom' );

		uc.dragee.dropTarget = { panel: 		d.panelData.panel,
								 where: 		'bottom',
								 targetEle: 	ele[i] };

		//	show something to indicate possible drop and dock at bottom of panel
	//	var y  = d.y + ((d.h * 3) / 4);
		var y  =        (d.h * 3) / 4;
		var dh = d.h / 4;
		d.dragTarget.screen
			.select ( 'rect' )
	//		.attr ( 'height',  d.h -= dh );		//	make shorter
			.attr ( 'height',  d.h - uc.PANEL_BORDER_WIDTH - dh );		//	make shorter
		d.dragTarget.screen 
			.append ( 'rect' )
			.attr ( 'id',     'drop-bottom-rect' )
	//		.attr ( 'x',      d.x )				//	in the space opened by the rect adjustment above 
			.attr ( 'x',      0 )				//	in the space opened by the rect adjustment above 
			.attr ( 'y',      y )
			.attr ( 'width',  d.w )
			.attr ( 'height', dh )
			.attr ( 'class',  'u34-drag-target-drop' );
	}	//	mouseOverDropTargetBottom()

	function mouseLeaveDropTargetBottom ( d, i, ele ) {
		var sW = serviceId + ' mouseLeaveDropTargetBottom()';
	//	console.log ( sW );
		uc.dragee.rootPanel.dragInfoLine2 ( '' );

		d.dragTarget.screen 					//	undo drop indicator
			.select ( '#drop-bottom-rect' )
				.remove();
	//	var dh = d.h / 3;
		d.dragTarget.screen
			.select ( 'rect' )
	//		.attr ( 'height', d.h += dh );
			.attr ( 'height', d.h - uc.PANEL_BORDER_WIDTH );
	}	//	mouseLeaveDropTargetBottom()

	function mouseOverDropTargetCenter ( d, i, ele ) {
		var sW = serviceId + ' mouseOverDropTargetCenter()';
	//	console.log ( sW );

		var dcd = uc.dragee.dragCtrlData;

		if ( dcd.parentPanel.data.eleId === d.panelData.eleId ) {
			uc.dragee.rootPanel.dragInfoLine2 ( 'no drop - already floating here' );
			uc.dragee.dropTarget = null;
			return;
		}

		uc.dragee.rootPanel.dragInfoLine2 ( 'float center' );

		uc.dragee.dropTarget = { panel: d.panelData.panel,
								 where: 'center' };

		//	show something to indicate possible drop and float
	//	var x  = d.x + (d.w / 4);
	//	var y  = d.y + (d.h / 4);
		var x  =        d.w / 4;
		var y  =        d.h / 4;
		var dw = d.w / 2;
		var dh = d.h / 2;
		d.dragTarget.screen 
			.append ( 'rect' )
			.attr ( 'id',     'drop-center-rect' )
			.attr ( 'x',      x )				//	in the space opened by the rect adjustment above 
			.attr ( 'y',      y )
			.attr ( 'width',  dw )
			.attr ( 'height', dh )
			.attr ( 'class',  'u34-drag-target-drop' );
	}	//	mouseOverDropTargetCenter()

	function mouseLeaveDropTargetCenter ( d, i, ele ) {
		var sW = serviceId + ' mouseLeaveDropTargetCenter()';
	//	console.log ( sW );
		uc.dragee.rootPanel.dragInfoLine2 ( '' );

		d.dragTarget.screen 					//	undo drop indicator
			.select ( '#drop-center-rect' )
				.remove();
	}	//	mouseLeaveDropTargetCenter()


	function pushPanelBaseData ( d, bRootPanel ) {
		bRootPanel = uc.isBoolean ( bRootPanel ) ? bRootPanel : false;
	//	var bd = new BaseData ( 0 +                                          uc.OFFS_4_1_PIX_LINE, 	//	x
	//							0 +                                          uc.OFFS_4_1_PIX_LINE, 	//	y
	//	var bd = new BaseData ( 0 + (  d.docked    ? -uc.OFFS_4_1_PIX_LINE : uc.OFFS_4_1_PIX_LINE), 	//	x
	//							0 + (  d.docked    ? -uc.OFFS_4_1_PIX_LINE : uc.OFFS_4_1_PIX_LINE), 	//	y
		//	2017-May-08
	//	var bd = new BaseData ( 0 + (! d.hasBorder ? -uc.OFFS_4_1_PIX_LINE : uc.OFFS_4_1_PIX_LINE), 	//	x
	//							0 + (! d.hasBorder ? -uc.OFFS_4_1_PIX_LINE : uc.OFFS_4_1_PIX_LINE), 	//	y
		//	2017-May-26		This seems to be undone by the statement that creates the element in 
		//					createPanel() - the statement bases.append ( 'rect' ).  That is createPanel() 
		//					was setting the element to the opposite of what this was setting.
		//	So lets get it straight in the data (here) and in  bases.append ( 'rect' )  just use these 
		//	data values.
	//	var bd = new BaseData ( 0 + (d.hasBorder            ? uc.OFFS_4_1_PIX_LINE : -uc.OFFS_4_1_PIX_LINE), 	//	x
	//							0 + (d.hasBorder            ? uc.OFFS_4_1_PIX_LINE : -uc.OFFS_4_1_PIX_LINE), 	//	y
		//	2017-May-28
	//	var bd = new BaseData ( 0 + (borderInAncestry ( d ) ? uc.OFFS_4_1_PIX_LINE : -uc.OFFS_4_1_PIX_LINE), 	//	x
	//							0 + (borderInAncestry ( d ) ? uc.OFFS_4_1_PIX_LINE : -uc.OFFS_4_1_PIX_LINE), 	//	y
		//	2018-May-10		That (above, of 2017-May-28) worked when, for example, docking one panel (B)
		//					into another (A) where A has a border and borderInAncestry() returns true.
		//					It did not work when docking into the root panel which does not have a border.
		//	So, trying to ignore border and always setting this to uc.OFFS_4_1_PIX_LINE.
		var bd = new BaseData ( 0 + uc.OFFS_4_1_PIX_LINE, 	//	x
								0 + uc.OFFS_4_1_PIX_LINE, 	//	y
								0,			//	w, see sizeBaseRectX() call below
								0,			//	h, see sizeBaseRectY() call below
								'base',		//	name
								d,
								d.eleId );
		sizeBaseRectX ( d, bd, bRootPanel );
		sizeBaseRectY ( d, bd, bRootPanel );
		d.baseData.push ( bd );
		return bd;
	}	//	pushPanelBaseData()


	function defineScrollers ( g ) {
		//	A scroll bar - the thumb/handle part - on the base panel. Just a simple rectangle 
		//	for now. Something to indicate scrolled position.
		g.each ( function ( d ) {
				if ( ! d.bVertSB ) 
					return;
			g.append ( 'rect' )
				.attr ( 'id',     function ( d, i ) { return d.eleId + '-vsclr'; } )
			//	.attr ( 'x',      function ( d, i ) { 
			//		return d.w  - uc.PANEL_BORDER_WIDTH - uc.VERT_SCROLL_WIDTH - uc.OFFS_4_1_PIX_LINE; 
			//	} )
				.attr ( 'x',      vsclrX )
				.attr ( 'y',      function ( d, i ) { 
					return        (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) + uc.OFFS_4_1_PIX_LINE; 
				} )
				.attr ( 'width',  function ( d, i ) { return uc.VERT_SCROLL_WIDTH; } )
				.attr ( 'height', function ( d, i ) { return 1; } )
				.attr ( 'class',  function ( d, i ) { return 'u34-scroll-thumb'; } );
			g.append ( 'line' )
				.attr ( 'id',    function ( d, i ) { return d.eleId + '-vsclr-left-border'; } )
			//	.attr ( 'x1',    function ( d, i ) { return d.w - uc.PANEL_BORDER_WIDTH - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH - uc.OFFS_4_1_PIX_LINE; } )
				.attr ( 'x1',    vsclrLeftBorderX )
			//	.attr ( 'y1',    function ( d, i ) { 
			//		return (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0); 
			//	} )
				.attr ( 'y1',    vsclrLeftBorderY1 ) 
			//	.attr ( 'x2',    function ( d, i ) { return d.w - uc.PANEL_BORDER_WIDTH - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH - uc.OFFS_4_1_PIX_LINE; } )
				.attr ( 'x2',    vsclrLeftBorderX )
			//	.attr ( 'y2',    function ( d, i ) { 
			//	//	return d.h - uc.PANEL_BORDER_WIDTH - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH; 
			//	//	return d.h - uc.PANEL_BORDER_WIDTH                     - uc.VERT_SCROLL_WIDTH  - uc.SCROLL_BORDER_WIDTH + uc.OFFS_4_1_PIX_LINE; 
			//		return d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.HORZ_SCROLL_HEIGHT - uc.SCROLL_BORDER_WIDTH + uc.OFFS_4_1_PIX_LINE; 
			//	} )
				.attr ( 'y2',    vsclrLeftBorderY2 )
				.attr ( 'class', function ( d, i ) { return 'u34-scroll-border'; } );
		} );
		g.each ( function ( d ) {
				if ( ! d.bHorzSB ) 
					return;
			g.append ( 'rect' )
				.attr ( 'id',     function ( d, i ) { return d.eleId + '-hsclr'; } )
				.attr ( 'x',      function ( d, i ) { 
					return        (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) + uc.OFFS_4_1_PIX_LINE; 
				} )
			//	.attr ( 'y',      function ( d, i ) { 
			//		return d.h  - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH - uc.OFFS_4_1_PIX_LINE; 
			//	} )
				.attr ( 'y',      hsclrY )
				.attr ( 'width',  function ( d, i ) { return 1; } )
				.attr ( 'height', function ( d, i ) { return uc.VERT_SCROLL_WIDTH; } )
				.attr ( 'class',  function ( d, i ) { return 'u34-scroll-thumb'; } );
			g.append ( 'line' )
				.attr ( 'id',    function ( d, i ) { return d.eleId + '-hsclr-top-border'; } )
			//	.attr ( 'x1',    function ( d, i ) { 
			//		return (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0); 
			//	} )
				.attr ( 'x1', hsclrTopBorderX1 )
			//	.attr ( 'y1',    function ( d, i ) { 
			//	//	return d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH - uc.OFFS_4_1_PIX_LINE; 
			//	//	return d.h;
			//		return d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH                          - uc.OFFS_4_1_PIX_LINE; 
			//	} )
				.attr ( 'y1', hsclrTopBorderY )
			//	.attr ( 'x2',    function ( d, i ) { 
			//	//	return d.w - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH; 
			//		return d.w - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH + uc.OFFS_4_1_PIX_LINE; 
			//	} )
				.attr ( 'x2', hsclrTopBorderX2 )
			//	.attr ( 'y2',    function ( d, i ) { 
			//	//	return d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH - uc.SCROLL_BORDER_WIDTH - uc.OFFS_4_1_PIX_LINE; 
			//	//	return d.h;
			//		return d.h - (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) - uc.VERT_SCROLL_WIDTH                          - uc.OFFS_4_1_PIX_LINE; 
			//	} )
				.attr ( 'y2', hsclrTopBorderY )
				.attr ( 'class', function ( d, i ) { return 'u34-scroll-border'; } );
		} );
	}	//	defineScrollers()

	svc.createPanel = function ( parentSelection, childData, bRootPanel ) {
		var sW = 'createPanel()';
		
		//	childData.data is an array - one array item per panel
		//
		//	i.e., may create multiple panels here

		var newPanel = null, cp = {}, bTestDropTargets = false;

	//	var pe = parentSelection._groups[0][0];			//	parent element
		var pe = parentSelection.nodes()[0];			//	parent element

		console.log ( sW + ' parent eleId: ' + pe.id );

		//	each panel is in a group element
		var s = parentSelection.selectAll ( '#' + pe.id + ' > g' );

		console.log ( sW + ' s length: ' + s._groups[0].length );

		var grps = s
			.data ( childData.data, function ( d ) { 
				return d.id || (d.id = ++childData.nextId); 
			} )
			.enter()
			.each ( function ( d ) { 
				console.log ( sW + ' - g - new data: ' + d.name ); 
				newPanel = d.panel = new Panel ( d );
			//	if ( ! d.parentPanel )		//	if this is the root panel (has no parent)
				if ( bRootPanel )			//	if this is the root panel (has no parent)
					pushPanelClipPathData ( d );
				var bd = pushPanelBaseData ( d, bRootPanel );	//	Panel "base" data (what controls are rendered on)
				if ( d.sclrX )  bd.x = cp.x = d.sclrX;
				if ( d.sclrY )  bd.y = cp.y = d.sclrY;
				bTestDropTargets = d.bTestDropTargets;
			} )
			.append ( 'g' )
			.attr ( 'id',        function ( d, i ) { return d.eleId; } )
			//	group has no x, y - must transform -
			.attr ( 'transform', function ( d, i ) { return 'translate(' + d.x + ',' + d.y + ')'; } );

		//	This should be done only for the root panel.
		if ( bRootPanel ) {
			//	A <defs> only in the root panel.
		//	var defs = grps.append ( 'defs' );			//	2017-Aug	Putting defs under <svg>
			var defs = d3.select ( 'defs' );			//				

			//	The clipPath for the root panel.
			defs.selectAll ( 'clipPath' )
				.data ( clipPathsData )
				.enter()
				.append ( 'clipPath' )
				.attr ( 'id',     function ( d, i ) { return d.eleId; } )			//	e.g., 'cp-root-base'
				.append ( 'rect' )
				.attr ( 'id',     function ( d, i ) { return d.eleId + '-rect'; } )	//	e.g., 'cp-root-base-rect'
				.attr ( 'x',      function ( d, i ) { return (cp.x !== undefined) ? -cp.x + uc.PANEL_BORDER_WIDTH : d.x; } )
				.attr ( 'y',      function ( d, i ) { return (cp.y !== undefined) ? -cp.y + uc.PANEL_BORDER_WIDTH : d.y; } )
				.attr ( 'width',  function ( d, i ) { return d.w; } )
				.attr ( 'height', function ( d, i ) { return d.h; } );

		//	//	Filters.  For now, one filter to implement a drop shadow.
		//	//		http://stackoverflow.com/questions/6088409/svg-drop-shadow-using-css3
		//	//		https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feGaussianBlur
		//	filtersData.push ( new FilterData ( { eleId: 			'drop-shadow',
		//										  inBlur: 			'SourceAlpha',
		//										  stdDev: 			1,
		//										  dx: 				2,
		//										  dy: 				4,
		//										  inMergeNode2: 	'SourceGraphic' } ) );
		//	defs.selectAll ( 'filter')
		//		.data ( filtersData, function ( d ) { 
		//			return d.id || (d.id = ++nextFilterId); 
		//		} )
		//		.enter()
		//		.each ( function ( d ) {
		//			var filter = d3.select ( this ).append ( 'filter' );
		//			filter
		//				.attr ( 'id', function ( d ) { return d.eleId; } );
		//			filter.append ( 'feGaussianBlur' )
		//				.attr ( 'in',           function ( d ) { return d.inBlur; } )
		//				.attr ( 'stdDeviation', function ( d ) { return d.stdDev; } );
		//			filter.append ( 'feOffset' )
		//				.attr ( 'dx', function ( d ) { return d.dx; } )
		//				.attr ( 'dy', function ( d ) { return d.dy; } );
		//			var merge = filter.append ( 'feMerge' );
		//			merge.append ( 'feMergeNode' );
		//			merge.append ( 'feMergeNode' )
		//				.attr ( 'in', function ( d ) { return d.inMergeNode2; } );
		//		} );
		}


		//	Panel border
		grps.each ( function ( d ) {
			if ( ! d.hasBorder ) 
				return;
			d3.select ( this )
				.append ( 'rect' )
				.attr ( 'id',     function ( d ) { return d.eleId + '-panel-border'; } )
				.attr ( 'x',      0 + uc.OFFS_4_1_PIX_LINE )
				.attr ( 'y',      0 + uc.OFFS_4_1_PIX_LINE )
			//	.attr ( 'width',  function ( d ) { return d.w - uc.PANEL_BORDER_WIDTH; } )
			//	.attr ( 'height', function ( d ) { return d.h - uc.PANEL_BORDER_WIDTH; } )
				.attr ( 'width',  function ( d ) { return d.w;                         } )
				.attr ( 'height', function ( d ) { return d.h;                         } )
				.attr ( 'class',  function ( d ) { return d.borderClass; } );				//	default: 'u34-panel-border'
		} );

		//	Panel base rectangle - what contents are rendered on
		var bases = grps.selectAll ( 'g' )
			.data ( function ( d ) { return d.baseData; } )
			.enter()
			.append ( 'g' )
			.attr ( 'id',        function ( d, i ) { return (d.eleId = d.panelEleId + '-' + d.name); } )
			//	group has no x, y - must transform -
			.attr ( 'transform', function ( d, i ) { return 'translate(' + d.x + ',' + d.y + ')'; } )
			.attr ( 'clip-path', function ( d, i ) { return 'url(#cp-' + d.panelEleId + '-' + d.name + ')'; } )
			.on ( 'mouseover', uCD.mouseover )
			.on ( 'mouseout',  uCD.mouseleave )
			.on ( 'mousedown', uCD.mousedown )
			.on ( 'mousemove', uCD.mousemove )
			.on ( 'mouseup',   uCD.mouseup )
			.on ( 'click',     click );

		bases.each ( function ( bd ) {	//	base data
			var base = this;
			grps.each ( function ( d ) {
				if ( d.eleId === bd.panelEleId ) {
					d.base = d3.select ( base );
				}
			} );
		} );

		//	A transparent rect, covers whole panel. Something to catch drag (evidently, you 
		//	can not click on a <g>).  x y maintained so that rect continuously covers only 
		//	the visible part of the panel.
		bases.append ( 'rect' )
			.attr ( 'id',     function ( d, i ) { return d.panelEleId + '-' + d.name + '-rect'; } )
		//	.attr ( 'x',      function ( d, i ) { return -d.x + (d.panelData.hasBorder ?  uc.PANEL_BORDER_WIDTH : 0                    ); } )
 		//	.attr ( 'y',      function ( d, i ) { return -d.y + (d.panelData.hasBorder ?  uc.PANEL_BORDER_WIDTH : 0                    ); } )
 		//	//	2017-May-08
			.attr ( 'x',      function ( d, i ) { 
			//	return  d.x + (d.panelData.hasBorder ? -uc.PANEL_BORDER_WIDTH : uc.PANEL_BORDER_WIDTH); 
 				//	2017-May-26		Get d.x right in pushPanelBaseData() and use it here.
			 //	return d.x;
				//	2018-May-07 	Like dragSclred2().
				return -d.x + (d.panelData.hasBorder ? uc.PANEL_BORDER_WIDTH : 0);
				 } )
 			.attr ( 'y',      function ( d, i ) { 
 			//	return  d.y + (d.panelData.hasBorder ? -uc.PANEL_BORDER_WIDTH : uc.PANEL_BORDER_WIDTH); 
 				//	2017-May-26		Get d.y right in pushPanelBaseData() and use it here.
 			//	return d.y;
				//	2018-May-07 	Like dragSclred2().
				return -d.y + (d.panelData.hasBorder ? uc.PANEL_BORDER_WIDTH : 0);
 			} )
			.attr ( 'width',  function ( d, i ) { 
				return  d.w; } )
			.attr ( 'height', function ( d, i ) { return  d.h; } )
			.attr ( 'class',  function ( d, i ) { return d.panelData.baseClass; } );

		//	A scroll bar - the thumb/handle part - on the base panel. Just a simple rectangle 
		//	for now. Something to indicate scrolled position.
		defineScrollers ( grps );

		//	For panels, make the size handle size align with the scrollers.  Make the move handle size the same 
		//	as the size handle.
	//	var widthSizeMove  = uc.PANEL_BORDER_WIDTH + uc.VERT_SCROLL_WIDTH  + 1;
	//	var heightSizeMove = uc.PANEL_BORDER_WIDTH + uc.HORZ_SCROLL_HEIGHT + 1;

		grps.each ( function ( d ) {	//	size handle - invisible until mouse is over
			if ( ! d.bSizeRect ) 
				return;
		//	var x = sizeHandleX ( d );
		//	var y = sizeHandleY ( d );
		//	var w = uc.SCROLL_BORDER_WIDTH + uc.VERT_SCROLL_WIDTH  + (d.hasBorder ? uc.PANEL_BORDER_WIDTH : -uc.OFFS_4_1_PIX_LINE);
		//	var h = uc.SCROLL_BORDER_WIDTH + uc.HORZ_SCROLL_HEIGHT + (d.hasBorder ? uc.PANEL_BORDER_WIDTH : -uc.OFFS_4_1_PIX_LINE);
			var sel = d3.select ( this );
			sel
				.append ( 'rect' )	
				.attr ( 'id',     function ( d, i ) { return d.eleId + '-size'; } )
			//	.attr ( 'x',      x )
			//	.attr ( 'y',      y )
				.placeSizeHandleRect()
			//	.attr ( 'width',  function ( d, i ) { return widthSizeMove; } )
			//	.attr ( 'height', function ( d, i ) { return heightSizeMove; } )
				.attr ( 'width',  widthSizeHandle )
				.attr ( 'height', heightSizeHandle )
			//	.attr ( 'class',  function ( d, i ) { return 'u34-size-handle'; } )				//	always visible	
				.attr ( 'class',  function ( d, i ) { return 'u34-size-handle-rect'; } )		//	always visible	
				.on ( 'mouseover', uCD.mouseoverSize )
				.on ( 'mouseout',  uCD.mouseleaveSize )
				.on ( 'mousedown', uCD.mousedownSize )
				.on ( 'mouseup',   uCD.mouseup );			//	2017-Apr-17
			sel
				.append ( 'line' )
				.attr ( 'id',    function ( d, i ) { return d.eleId + '-size-left-border'; } )
			//	.attr ( 'x1',    x )
			//	.attr ( 'y1',    y )
			//	.attr ( 'x2',    x )
			//	.attr ( 'y2',    y + uc.HORZ_SCROLL_HEIGHT + (d.hasBorder ? 1 + uc.OFFS_4_1_PIX_LINE : 0) )
				.placeSizeHandleLeftBorder()
				.attr ( 'class', function ( d, i ) { 
					return 'u34-size-handle-border'; 
				} );
			sel
				.append ( 'line' )
				.attr ( 'id',    function ( d, i ) { return d.eleId + '-size-top-border'; } )
			//	.attr ( 'x1',    x )
			//	.attr ( 'y1',    y )
			//	.attr ( 'x2',    x + uc.VERT_SCROLL_WIDTH + (d.hasBorder ? 1 + uc.OFFS_4_1_PIX_LINE : 0) )
			//	.attr ( 'y2',    y )
				.placeSizeHandleTopBorder()
				.attr ( 'class', function ( d, i ) { return 'u34-size-handle-border'; } );
		} );

		grps.each ( function ( d ) {	//	move handle
			if ( ! d.bMoveRect ) 
				return;
			//	move handle is same size as the size handle
			var w  = (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) + uc.VERT_SCROLL_WIDTH  + uc.SCROLL_BORDER_WIDTH;
			var h  = (d.hasBorder ? uc.PANEL_BORDER_WIDTH : 0) + uc.HORZ_SCROLL_HEIGHT + uc.SCROLL_BORDER_WIDTH;
			d3.select ( this )
				.append ( 'rect' )	
				.attr ( 'id',     function ( d, i ) { return d.eleId + '-move'; } )
				.attr ( 'x',      0 + uc.OFFS_4_1_PIX_LINE )
				.attr ( 'y',      0 + uc.OFFS_4_1_PIX_LINE )
			//	.attr ( 'width',  widthSizeMove )
			//	.attr ( 'height', heightSizeMove )
				.attr ( 'width',  w )
				.attr ( 'height', h )
				.attr ( 'class',  'u34-move-handle-transparent' )
				.on ( 'mouseover', uCD.mouseoverMove )
				.on ( 'mouseout',  uCD.mouseleaveMove )
				.on ( 'mousedown', uCD.mousedownMove );
		} );

		grps.each ( function ( d ) {	//	Layout save (to LS) rect/handle ...
			var x = 0;
			if ( ! d.bSaveRect ) 
				return;
			if ( d.bMoveRect )
				x = uc.PANEL_BORDER_WIDTH + widthSizeHandle ( d )  + 1;
			d3.select ( this )
				.append ( 'rect' )	
				.attr ( 'id',      function ( d, i ) { return d.eleId + '-save'; } )
				.attr ( 'x',       x + uc.OFFS_4_1_PIX_LINE )
				.attr ( 'y',       0 + uc.OFFS_4_1_PIX_LINE )
				.attr ( 'width',   uc.SAVE_HANDLE_WIDTH )
				.attr ( 'height',  uc.SAVE_HANDLE_HEIGHT )
				.attr ( 'class',   'u34-save-handle-transparent' )
			//	.on ( 'mouseover', mouseOverSave )
			//	.on ( 'mouseout',  mouseLeaveSave )
				.on ( 'mouseover', uCD.mouseoverSave )
				.on ( 'mouseout',  uCD.mouseleaveSave )
				.on ( 'click',     clickSave );
		} );

		grps.each ( function ( d ) { 
			if ( ! d.hasCloseBox )
				return;
		//	var x = d.baseData[0].w - uc.CLOSE_HANDLE_WIDTH;
			d3.select ( this )
				.append ( 'rect' )		//	close handle - invisible until mouse is over
				.attr ( 'id',      function ( d, i ) { return d.eleId + '-close'; } )
		//		.attr ( 'x',       x + uc.OFFS_4_1_PIX_LINE )
				.attr ( 'x',       closeHandleX )
				.attr ( 'y',       0 + uc.OFFS_4_1_PIX_LINE )
				.attr ( 'width',   uc.CLOSE_HANDLE_WIDTH )
				.attr ( 'height',  uc.CLOSE_HANDLE_HEIGHT )
				.attr ( 'class',   'u34-close-handle-transparent' )
				.on ( 'mouseover', uCD.mouseoverClose )
				.on ( 'mouseout',  uCD.mouseleaveClose )
				.on ( 'click',     clickClose );
		} );

		return newPanel;
	};	//	svc.createPanel


	function rmvClipPaths ( d, opts ) {
		var sW       = 'rmvClipPaths()';
		var cpEleIds = [];		//	Clip Path element Ids
		function findClipPaths ( d ) {
			var sW = 'findClipPaths()';
			var i, td;
//			console.log ( sW + ' - d - name: ' + d.name + '  eleId: ' + d.eleId ); 
			if ( d.constructor.name === 'PanelData' ) {
				cpEleIds.push ( 'cp-' + d.eleId + '-base' );

				var be = d.base._groups[0][0];				//	panel's base element
				d3.selectAll ( '#' + be.id + '> g' )		//	just the child g and not descendents of those
					.each ( function ( d ) {
						findClipPaths ( d );
					} );
			}
			else
			if ( d.constructor.name === 'BaseData' ) {		//	d is that of the base element
				cpEleIds.push ( 'cp-' + d.eleId );

				d3.selectAll ( '#' + d.eleId + '> g' )		//	just the child g and not descendents of those
					.each ( function ( d ) {
						findClipPaths ( d );
					} );
			}
			else
			if ( d.constructor.name === 'ListData' ) {
				cpEleIds.push ( 'cp-' + d.eleId );

				if ( d.subMenuData )						//	d is a menu and it has a submenu
					findClipPaths ( d.subMenuData );
			}
			else
			if ( d.constructor.name === 'TabsData' ) {
				for ( i = 0; i < d.tabs.data.length; i++ ) {
					td = d.tabs.data[i];
					cpEleIds.push ( 'cp-' + td.eleId );
					if ( td.panel )
						findClipPaths ( td.panel.data );
				}
			}
			else
//			if ( (! angular.isDefined ( opts )) || ! opts.bKeepChildClipPaths ) {
			if ( (! uc.isDefined ( opts )) || ! opts.bKeepChildClipPaths ) {
				cpEleIds.push ( 'cp-' + d.eleId );
			}
		}	//	findClipPaths();

		//	Find defs data (clip paths) used by d and its child elements.
		findClipPaths ( d );

		//	splice clipPathsData
		while ( cpEleIds.length > 0 ) {
			var eleId = cpEleIds.pop();
			for ( var j = 0; j < clipPathsData.length; j++ ) {
				if ( clipPathsData[j].eleId === eleId ) {
					clipPathsData.splice ( j, 1 );
					break;
				}
			}
		}

		//	remove clip paths from <defs>
		d3.select ( 'defs' )
			.selectAll ( 'clipPath' )
			.data ( clipPathsData, function ( d ) { return d.id; } )
			.exit()
			.each ( function ( d ) { 
			//	console.log ( sW + ' - defs - old data: ' + d.eleId ); 
			} )
			.remove();
	}	//	rmvClipPaths()

	svc.updatePanels = function ( parentSelection, ctrls ) {
		var sW = serviceId + ' updatePanels()';

		for ( var i = ctrls.di; i < ctrls.di + ctrls.dn; i++ ) {
			var d = ctrls.data[i];
			parentSelection.select ( '#' + d.eleId + '-move' )
				.remove();
		}

		ctrls.data.splice ( ctrls.di, ctrls.dn );

		var pe = parentSelection._groups[0][0];
		d3.selectAll ( '#' + pe.id + '> g' )		//	just the child g and not descendents of those
			.data ( ctrls.data, function ( d ) { return d.id; } )
			.exit()
			.each ( function ( d ) { 
				console.log ( sW + ' - g - old data - name: ' + d.name + '  eleId: ' + d.eleId ); 
				rmvClipPaths ( d );
			} )
			.remove();
	};	//	svc.updatePanels()

	svc.updatePanel = function ( panel, ctrl, opts ) {
	//	var sW = serviceId + ' updatePanel()';
	//	var i;
	//
	//	if ( ctrl.data )
	//		console.log ( sW + '  ctrl.data.id: ' + ctrl.data.id + '  ctrl.data.name: ' + ctrl.data.name );
	//	else
	//		console.log ( sW + '  ctrl.id: ' + ctrl.id + '  ctrl.name: ' + ctrl.name );
	//
	//	for ( i = 0; i < panel.data.childData.data.length; i++ ) {
	//		if ( ctrl.data ) {
	//			if ( panel.data.childData.data[i].id === ctrl.data.id )  {
	//				panel.data.base.select ( '#' + ctrl.data.eleId + '-move' )
	//					.remove();
	//				break;
	//			}
	//			continue;
	//		}
	//		if ( panel.data.childData.data[i].id === ctrl.id )  {
	//			panel.data.base.select ( '#' + ctrl.eleId + '-move' )
	//				.remove();
	//			break;
	//		}
	//	}
	//
	//	if ( i >= panel.data.childData.data.length ) {
	//		console.log ( sW + ' ERROR: can not find control' );
	//		return;
	//	}
	//
	//	panel.data.childData.data.splice ( i, 1 );
	//
	//	var baseEleId;
	//	if ( uc.isDefined ( opts ) && uc.isDefined ( opts.baseEleId ) )
	//		baseEleId = opts.baseEleId;
	//	else
	//		baseEleId = panel.data.base._groups[0][0].id;
	//	d3.selectAll ( '#' + baseEleId + '> g' )		//	just the child g and not descendents of those
	//		.data ( panel.data.childData.data, function ( d ) { return d.id; } )
	//		.exit()
	//		.each ( function ( d ) { 
	//			console.log ( sW + ' - g - old data - name: ' + d.name + '  eleId: ' + d.eleId ); 
	//			rmvClipPaths ( d, opts );
	//		} )
	//		.remove();
	//	//
		var opts2 = uc.isDefined ( opts ) ? opts : {};

		if ( ! uc.isDefined ( opts2.removeMove ) )
			opts2.removeMove = true;
		
		svc.rmvControl2 ( panel.data, ctrl, opts2 );

	};	//	svc.updatePanel()

	svc.rmvControl2 = function ( data, ctrl, opts ) {
		var sW = serviceId + ' rmvControl2()';
		var i;

		if ( ! uc.isDefined ( opts ) )
			return;

		if ( ctrl.data )
			console.log ( sW + '  ctrl.data.id: ' + ctrl.data.id + '  ctrl.data.name: ' + ctrl.data.name );
		else
			console.log ( sW + '  ctrl.id: ' + ctrl.id + '  ctrl.name: ' + ctrl.name );

		for ( i = 0; i < data.childData.data.length; i++ ) {
			if ( ctrl.data ) {
				if ( data.childData.data[i].id === ctrl.data.id )  
					break;
			} else 
				if ( data.childData.data[i].id === ctrl.id )  
					break;
		}

		if ( i >= data.childData.data.length ) {
			console.log ( sW + ' ERROR: can not find control' );
			return;
		}

		if ( uc.isDefined ( opts.removeMove ) )
			if ( ctrl.data ) 
				data.base.select ( '#' + ctrl.data.eleId + '-move' )
					.remove();
			else
				data.base.select ( '#' + ctrl.eleId + '-move' )
					.remove();

		data.childData.data.splice ( i, 1 );

		var parentEleId;
		if ( uc.isDefined ( opts.parentEleId ) )
			parentEleId = opts.parentEleId;
		else
		if ( uc.isDefined ( opts.baseEleId ) )
			parentEleId = opts.baseEleId;
		else 
			parentEleId = data.base._groups[0][0].id;
		d3.selectAll ( '#' + parentEleId + '> g' )		//	just the child g and not descendents of those
			.data ( data.childData.data, function ( d ) { return d.id; } )
			.exit()
			.each ( function ( d ) { 
				console.log ( sW + ' - g - old data - name: ' + d.name + '  eleId: ' + d.eleId ); 
				rmvClipPaths ( d, opts );
			} )
			.remove();
	};	//	svc.rmvControl2()

	svc.removeBaseG = function ( panel ) {
		var sW = 'removeBaseG()';

		panel.data.childData.data = [];

	//	d3.selectAll ( '#' + panel.data.eleId + '> g' )			//	just the child g and not descendents of those
		//	leave the base <g>
	//	d3.selectAll ( '#' + panel.data.eleId + '-base > *' )	//	all children of the base but not descendents of those
		d3.selectAll ( '#' + panel.data.eleId + '-base > g' )	//	all child <g> of the base but not descendents of those
			.data ( [] )
			.exit()
			.each ( function ( d ) { 
			//	console.log ( sW + ' - g - old data - name: ' + d.name + '  eleId: ' + d.eleId ); 
				rmvClipPaths ( d );
			} )
			.remove();
	//	d3.select ( '#' + panel.data.eleId + '-base rect' )			leave the <rect> of the base
	//		.each ( function ( d ) { 
	//			console.log ( sW + ' - removing rect' );
	//		} )
	//		.remove();
		//	2017-May-21 	Reimplement this.
		//	Assume the panel is being split so that it will contain two new (split) panels
		//	with their own base rects and clippaths.  So, the base rect of the parent panel 
		//	is no longer needed.  Nor its clippath.
	//	d3.select ( '#' + panel.data.eleId + '-base rect' )
	//		.each ( function ( d ) { 
	//			console.log ( sW + ' - removing rect' );
	//	//		rmvClipPaths ( d );
	//		} );
	//	d3.select ( '#' + panel.data.eleId + '-base rect' )
	//	d3.select ( '#' + panel.data.eleId + '-base-rect' )
	//		.data ( [] )
	//		.exit()
	//	//	.each ( function ( d ) { 
	//	//		console.log ( sW + ' - removing rect' );
	//	//		rmvClipPaths ( d );
	//	//	} )
	//		.remove();
	//	d3.select ( '#' + panel.data.eleId + '-base rect' )
	//		.each ( function ( d ) { 
	//			console.log ( sW + ' - rect still selected????' );
	//		} );
		d3.select ( '#' + panel.data.eleId + '-base' )
			.select  ( '#' + panel.data.eleId + '-base-rect' )
			//	.data ( [] )
			//	.exit()
				.each ( function ( d ) { 
					console.log ( sW + ' d.eleId: ' + d.eleId + ' - removing rect' );
					rmvClipPaths ( d );
				} )
				.remove();
	};	//	svc.removeBaseG()

	svc.removeSclrs = function ( panel ) {
		d3.select ( '#' + panel.data.eleId + '-vsclr' )
			.remove();
		d3.select ( '#' + panel.data.eleId + '-vsclr-left-border' )
			.remove();
		d3.select ( '#' + panel.data.eleId + '-hsclr' )
			.remove();
		d3.select ( '#' + panel.data.eleId + '-hsclr-top-border' )
			.remove();
	};	//	svc.removeSclrs()

	svc.clearFiltersData = function() {
		filtersData = [];			
	};	//	svc.clearFiltersData()

	return svc;

})();
