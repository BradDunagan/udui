'use strict';

//  app/udui/udui-common.js

module.exports = (function() { 

	var d3 = require ( 'd3' );

	var serviceId = 'uduiCommon';

	/* jshint validthis: true */

	var svc = {};

	svc.svg = null;
	svc.rootRootG = null;

	//	It may be that this UDUI stuff is used in an app that is not, overall, UDUI
	//	stuff.  That is, this is just a component in a larger app and does not fill the 
	//	entire browser window. In this case there is a container.
	//
	//		width, height: 		set by parent element or browser window
	//
	svc.container = false;				//	When false then the root UDUI fills 
	svc.containerWidth  = 0;			//	the entire browser window and these 
	svc.containerHeight = 0;			//	other container values are not used.
	svc.containerBorderWidth = 0;		//

	svc.e2eSetCmdOutputText = null;		//	When testing.

	//	So far, two root panels: header and client.  The client root panel is sometimes
	//	called the app panel or the just the root panel.
	//	The data of the header root panel is at rootData.data[0].
	//	The data of the client root panel is at rootData.data[1].
	//	To focus/force attention and actions to a popup menu or modal dialog, for examples,
	//	a screen panel is displayed over all the app - that screen panel is also a root
	//	panel and the popup or dialog is a child of it.
	svc.rootData = {		
		nextId: 	0,		//	Each item in data[] must have a unique Id.  Set by
		data: 		[]		//	the panel service - uPanel.
	};

	svc.appPanelClick 	= null;		//	When clicking on the client root panel.

	svc.panelSvc 		= null;		//	To avoid circular reference issues, I think.
	svc.storeLoadSvc    = null;		//	To avoid circular reference issues, I think.
	svc.uCD             = null;		//	To avoid circular reference issues, I think.

	svc.ROOT_UDUI_ID 	= 0;

	svc.APP_CLIENT_ROOT_PANEL_NAME 			= 'client-root-panel';
//	svc.APP_CLIENT_ROOT_PANEL_ELE_ID 		= '0';
	svc.APP_CLIENT_ROOT_PANEL_ELE_ID 		= 'app-client-root';
	svc.APP_CLIENT_ROOT_PANEL_STORE_ID 		= 1;		//	some panel store Ids are reserved - this is one
	svc.APP_CLIENT_ROOT_PANEL_STORE_NAME	= 'RRWebApp';

	svc.SAVE_AS_DLG_STORE_ID 		= 2;		//	another one
	svc.SAVE_AS_DLG_STORE_NAME 		= 'RRDlgSaveAs';

	svc.PROPERTIES_DLG_STORE_ID		= 3;
	svc.PROPERTIES_DLG_STORE_NAME 	= 'RRDlgProperties';

	svc.NEW_LABEL_DLG_STORE_ID 		= 4;
	svc.NEW_LABEL_DLG_STORE_NAME 	= 'RRDlgNewLabel';

	svc.GRID_DLG_STORE_ID 			= 5;
	svc.GRID_DLG_STORE_NAME 		= 'RRDlgGrid';

	svc.PROPERTIES_BOARD_STORE_ID	= 6;
	svc.PROPERTIES_BOARD_STORE_NAME = 'RRBoardProperties';

	svc.LOAD_DLG_STORE_ID 			= 7;
	svc.LOAD_DLG_STORE_NAME 		= 'RRDlgLoad';


	svc.APP_HEADER_ROOT_PANEL_NAME 			= 'header-panel';
//	svc.APP_HEADER_ROOT_PANEL_ELE_ID 		= '1';
	svc.APP_HEADER_ROOT_PANEL_ELE_ID 		= 'app-header-root';
	svc.APP_HEADER_ROOT_PANEL_STORE_ID 		= 8;
	svc.APP_HEADER_ROOT_PANEL_STORE_NAME	= 'RRWebAppHeader';
	svc.APP_HEADER_ROOT_PANEL_HEIGHT		= 26;
	svc.APP_HEADER_BOTTOM_BORDER_WIDTH 		= 1;

	svc.APP_SCREEN_ROOT_PANEL_ELE_ID 	= 'app-screen';

	svc.LOGIN_DLG_STORE_ID 			= 9;
	svc.LOGIN_DLG_STORE_NAME		= 'RRDlgLogin';
	
	svc.SIGN_IN_BUTTON_WIDTH 		= 120;


	svc.FIRST_PANEL_STORE_ID 		= 101;		//	first not-reserved store Id


	svc.OFFS_4_1_PIX_LINE		= 0.5;		//	without this SVG antialiasing makes 1 pix lines appear to be 2 wide

	svc.PANEL_BORDER_WIDTH		= 1;		//	same for the outside border of a splitter

	svc.SCROLL_BORDER_WIDTH		= 1;

	svc.VERT_SCROLL_WIDTH  		= 7;
	svc.HORZ_SCROLL_HEIGHT 		= 7;

	svc.BAR_BOX_BORDER_WIDTH 	= 1;		//	2018-May-14 	"bar boxes" are the move, save, close
											//	(others?) "handles" that appear along the top of panels
	svc.MOVE_HANDLE_WIDTH  		= 7;		//	on pointer proximity.
	svc.MOVE_HANDLE_HEIGHT 		= 7;

	svc.SIZE_HANDLE_WIDTH		= 7;
	svc.SIZE_HANDLE_HEIGHT		= 7;

	svc.SAVE_HANDLE_WIDTH 		= 7;
	svc.SAVE_HANDLE_HEIGHT 		= 7; 

	svc.CLOSE_HANDLE_WIDTH 		= 7;
	svc.CLOSE_HANDLE_HEIGHT 	= 7; 

	svc.SPLITTER_WH				= 7;		//	width (for horz splitter) / height (for vert splitter) of
											//	splitter bar

	svc.INPUT_BORDER_WIDTH 		= 1;
	svc.INPUT_PADDING_LEFT 		= 2;		//	See .u34-input in app.css.
	svc.INPUT_PADDING_RIGHT		= 2;		//	See .u34-input in app.css.

	svc.SPLITTER_BORDER_W 		= 1;		//	i.e., the splitter bar border width

	svc.LIST_BORDER_WIDTH		= 1;		//	same for the outside border of a splitter

	svc.CHECKBOX_BOX_WIDTH 		= 8;
	svc.CHECKBOX_BOX_HEIGHT 	= 8;

	svc.TABS_TABS_TAHA 			= 3;		//	TAHA: 	Text Area Height Addition
	svc.TABS_TABS_EAWL			= 4;		//	EAWL: 	Empty Area Width - to left of tabs
	svc.TABS_TABS_EAWR			= 12;		//	EAWR: 	Empty Area Width - to right of tabs
	svc.TABS_TABS_EAH 			= 5;		//			and height of empty area below tabs
	svc.TABS_TABS_PLUS_W 		= 20;		//	Width of always-present tab the user clicks on to add a tab.

	svc.TABLE_MIN_WIDTH 		= 80;		//	controller width can go to 0
	svc.TABLE_MIN_COL_WIDTH 	= 10;		//	min width of what is displayed in a cell  -  that is, min 
											//	width of <td>'s <div>

	svc.TYPE_BUTTON 			= 'button';
	svc.TYPE_CHECKBOX 			= 'checkbox';
	svc.TYPE_INPUT 				= 'input';
	svc.TYPE_LABEL 				= 'label';
	svc.TYPE_TEXTAREA 			= 'textarea';
	svc.TYPE_LIST 				= 'list';
	svc.TYPE_PANEL 				= 'panel';
	svc.TYPE_PANEL_BASE 		= 'panel-base';
	svc.TYPE_TABLE 				= 'table';
	svc.TYPE_TABS 				= 'tabs';
	svc.TYPE_TABS_TAB 			= 'tabs-tab';

	svc.dragee  				= null;
	svc.isDragging 				= false;

	svc.offsX = 0;
	svc.offsY = 0;

	svc.rootPanel = null;

	svc.appHeader = {};						//	Members - signin button, etc.

//	svc.appScreenPanel = null;
	var appScreenPanels = [];				//	When a modal dialog is displayed it will go on a screen.
											//	Then if a popu menu, for example, is displayed it is easier
											//	to just put up another screen.
	svc.mouseOp = null;

	svc.localXY = function ( ctrlData, eventClientX, eventClientY, baseX, baseY ) {
		//	calc X Y local to the panel
		var x  = eventClientX - svc.offsX - baseX;
		var y  = eventClientY - svc.offsY - baseY;
		var cd = ctrlData;

		if ( svc.container ) {			//	2018-May-07
			let e  = document.querySelector ( '#' + cd.eleId );
			let br = e.getBoundingClientRect();
			x -= br.x;
			y -= br.y;
		}

		while ( (cd.parentPanel) || (cd.parent) ) {
			x -= Math.round ( cd.x );
			y -= Math.round ( cd.y );
			if ( cd.parentPanel )
				cd = cd.parentPanel.data;
			else
				cd = cd.parent.data;
		}
		if ( (cd !== ctrlData) && (cd.type === svc.TYPE_PANEL) ) {
			var bd = cd.baseData[0];		//	adjust for root panel pan 
			x -= Math.round ( bd.x );
			y -= Math.round ( bd.y );
		}
		return { x: x, y: y };
	};	//	localXY()

	svc.pageXY = function ( ctrlData, eventClientX, eventClientY, baseX, baseY ) {
		//	calc X Y on the web page
		//	(this is just a guess - i.e., this needs work)
		var x  = eventClientX - svc.offsX - baseX;
		var y  = eventClientY - svc.offsY - baseY;
		var cd = ctrlData;
		while ( (cd.parentPanel) || (cd.parent) ) {
			x += Math.round ( cd.x );
			y += Math.round ( cd.y );
			if ( cd.parentPanel )
				cd = cd.parentPanel.data;
			else
				cd = cd.parent.data;
		}
		if ( (cd !== ctrlData) && (cd.type === svc.TYPE_PANEL) ) {
			var bd = cd.baseData[0];		//	adjust for root panel pan 
			x += Math.round ( bd.x );
			y += Math.round ( bd.y );
		}
		return { x: x, y: y };
	};	//	pageXY()

	svc.initiateDrag = function ( panelData, w, h ) {
		var sW  = serviceId + ' initiateDrag()';
		var svc = this;
		var pd  = panelData, x, y, rootPanel = null;
		console.log ( sW + ': mouse x y ' + svc.mouseOp.x + ' ' + svc.mouseOp.y + '  ele x y ' + svc.mouseOp.eleX + ' ' + svc.mouseOp.eleY );
		//	drag on top of all else, in root panel's coordinates
		x = pd.x;
		y = pd.y;
		pd = pd.parentPanel ? pd.parentPanel.data : null;
		while ( pd ) {
			if ( pd.name === svc.APP_CLIENT_ROOT_PANEL_NAME )
				rootPanel = pd.panel;
			else {
				x += pd.x;
				y += pd.y;
			}
			pd = pd.parentPanel ? pd.parentPanel.data : null;
		}
		if ( ! rootPanel )
			return;

		var bd = rootPanel.data.baseData[0];		//	adjust for root panel pan 
		x += Math.round ( bd.x );
		y += Math.round ( bd.y );

		svc.dragee = {
			x:  x,	
			y:  y,	
			w:  w,	
			h:  h,	
			dx:	0,	
			dy:	0,
			dragCtrlData: 	panelData,
			rootPanel: 		rootPanel
		};
		svc.isDragging = true;
	};	//	initiateDrag()


	svc.isDefined = function ( a ) {
		return (typeof a !== 'undefined');
	};	//	isDefined()

	svc.isBoolean = function ( a ) {
		return (typeof a === 'boolean');
	};	//	isBoolean()

	svc.isString = function ( a ) {
		return (typeof a === 'string');
	};	//	isString()

	svc.isNumber = function ( a ) {
		return (typeof a === 'number');
	};	//	isNumber()

	svc.isFunction = function ( a ) {
		return (typeof a === 'function');
	};	//	isFunction()

	svc.upAppScreen = function ( o ) {
		var sW = o.sc + ' ' + serviceId + ' upAppScreen()';
//		console.log ( sW );
		var svc = this;
		if ( ! svc.rootPanel )
			return;

		var rootPanelData = svc.rootPanel.data;
//		var x = 0 - rootPanelData.baseData[0].x;
//		var y = 0 - rootPanelData.baseData[0].y;
//	//	var w = document.body.clientWidth  - svc.VERT_SCROLL_WIDTH  - svc.SCROLL_BORDER_WIDTH - svc.PANEL_BORDER_WIDTH;
//	//	var h = document.body.clientHeight - svc.HORZ_SCROLL_HEIGHT - svc.SCROLL_BORDER_WIDTH - svc.PANEL_BORDER_WIDTH;
//		var w = rootPanelData.w;
//		var h = rootPanelData.h;
		var x = 0.0;
		var y = 0.0;
		var w = document.body.parentElement.clientWidth;		//	cover both header and 
		var h = document.body.parentElement.clientHeight;		//	client panels

		var panel = null;

		//	a panel (probably invisible) that covers the entire app

		var asd = svc.panelSvc.createTemporaryPanelData (  { 	//	App Screen Data
			x: 		 		x,
			y: 		 		y,
			w: 		 		w, 
			h: 		 		h, 
			name: 	 		'app-screen-' + appScreenPanels.length,
			clickCB: 		o.clickCB ? o.clickCB : null,
			baseClass: 		o.baseClass,
			borderClass: 	'u34-panel-border-transparent' ,
			hasBorder: 		false,
			bMoveRect: 		false,
			bSizeRect: 		false,
			bVertSB: 		false,
			bHorzSB: 		false } );

	//	appScreenPanels.push ( panel = svc.rootPanel.addControl ( asd ) );
	//	//
		asd.eleId  = 'rr-' + svc.APP_SCREEN_ROOT_PANEL_ELE_ID;	//	Normally the parent panel sets this.  Since this 
	 	asd.eleId += '-' + appScreenPanels.length;				//	panel has no parent we do it here.
		svc.rootData.data.push ( asd );
		panel = svc.panelSvc.createPanel ( svc.rootRootG, svc.rootData, true );
		appScreenPanels.push ( panel );
		return panel;
	};	//	upAppScreen()

	svc.appScreenPanel = function() {
		var i = appScreenPanels.length - 1;
		if ( i < 0 ) 
			return null;
		return appScreenPanels[i];
	};	//	appScreenPanel()

	svc.downAppScreen = function() {
		var sW = serviceId + ' downAppScreen()';
		console.log ( sW );
		var svc = this;

	//	if ( ! svc.rootPanel )
	//		return;

		var panel = svc.appScreenPanel();
		if ( ! panel )
			return;
	//	svc.rootPanel.rmvControl ( panel );


		//	2018-May-13
	//	d3.select ( '#' + 'cp-' + panel.data.eleId + '-base' )
	//		.remove();
		//	2018-May-13 	Maybe use uPanel.removeBaseG() ?
		//	It will remove the base rect but not the panel <g>.  It will also 
		//	remove clip path and decendent's clip paths.
		svc.panelSvc.removeBaseG ( panel );

		d3.select ( '#' + panel.data.eleId )
			.remove();
		svc.rootData.data.pop();

		appScreenPanels.pop();
	};	//	downAppScreen()

	svc.appScreenPanelEleId = function() {
		var svc = this;
		var panel = svc.appScreenPanel();
		if ( ! panel )
			return;
		return panel.data.eleId;
	};	//	appScreenPanelEleId()
	
	svc.isAppScreenPanel = function ( panel ) {
		var svc = this;
		var screenPanel = svc.appScreenPanel();
		if ( ! screenPanel )
			return;
		return panel.data.eleId === screenPanel.data.eleId;
	};	//	isAppScreenPanel()

	svc.testSetOutput = function ( json ) {
		if ( svc.isFunction ( svc.e2eSetCmdOutputText ) )
			svc.e2eSetCmdOutputText ( json );
	};
	return svc;

})();

