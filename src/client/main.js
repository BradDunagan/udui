"use strict"

var misc =        require ( './udui/misc.js' );
var a =           require ( './tmp/a.js' );
var b =           require ( './tmp/b.js' );

var d3 =          require ( 'd3' );

var rrLS =        require ( './udui/udui-ls.js' );
var uc =          require ( './udui/udui-common.js' );
var uPanel =      require ( './udui/udui-panel-f.js' );
var uButton =     require ( './udui/udui-button-e.js' );
var uShiftClick = require ( './udui/udui-shift-click-a.js' );
var uDialog =     require ( './udui/udui-dialogs-a.js' );
var uInput = 	  require ( './udui/udui-input-b.js' );
var uLabel =      require ( './udui/udui-label-b.js' );

var bGotResizeFactors = false;

var resizeFactorsTimeOut = null;

var cmdOutputEleId = null;

function unsetResizeFactors() {
	var sW = 'unsetResizeFactors()';
	console.log ( sW );
	bGotResizeFactors = false;
}

function tryMisc() {
	misc.hello ( 'Mr Brad' );

	a.setMiscValue ( 'a' );
	console.log ( misc.getValue() );

	b.setMiscValue ( 'b' );
	console.log ( misc.getValue() );
}

function tryD3() {
	var sW = 'tryD3()';

	//	each panel is in a group element
	uc.svg = d3.select ( '#tryD3Root' );

	var svgNode = uc.svg.node();

	uc.svg.append ( 'defs' );			//	2017-Aug

	if ( uc.container ) {
		uc.containerWidth  = svgNode.width.baseVal.value;
		uc.containerHeight = svgNode.height.baseVal.value;
		uc.svg.append ( 'rect' )
			.attr ( 'x', uc.containerBorderWidth / 2 )
			.attr ( 'y', uc.containerBorderWidth / 2 )
			.attr ( 'width',  uc.containerWidth  - uc.containerBorderWidth )
			.attr ( 'height', uc.containerHeight - uc.containerBorderWidth )
			.attr ( 'class',  'rr-container-border' )
			.attr ( 'stroke-width', uc.containerBorderWidth );
	}

	//	The container group. To offset contents for the container border.
	var g = uc.svg.append ( 'g' )
		.attr ( 'transform', 'translate(' + uc.containerBorderWidth + ',' 
										  + uc.containerBorderWidth + ')' );

	//	Put each rectangle in its own group.
	var s = g.selectAll ( 'g' );		//	I.e., select all g inside the container g.

	console.log ( sW + ' s length: ' + s._groups[0].length );

	var w  = uc.containerWidth - (uc.containerBorderWidth * 2);
	var h  = 14;
	var bw = 1;
	var ff = 'consolas';				//	font family
	var fs = 8;							//	font size, pixels
	var classText = 'u34-label-text';	//	for now

	function drawGroups ( y, bw, rects ) {
		g.append ( 'text' )
			.attr ( 'id',          function ( d, i ) { return 'a-text-x-' + y; } )
			.attr ( 'text-anchor', function ( d, i ) { return 'start'; } )
			.attr ( 'x',           function ( d, i ) { return 4; } )
			.attr ( 'y',           function ( d, i ) { return y; } )
			.attr ( 'style',       function ( d, i ) { return 'font-family: ' + ff + '; font-size: ' + fs + 'px;'; } )
			.attr ( 'class',       function ( d, i ) { return classText; } )
			.text (                function ( d, i ) { return 'bw (border width): ' + bw; } );
		y += 4; 
		var grps = s
			.data ( rects )
			.enter()
			.append ( 'g' )
				.attr ( 'id',  function ( d, i ) {
					return 'a-group-' + d.id;
				} )
					//	group has no x, y - must transform -
				.attr ( 'transform', function ( d, i ) { 
					return 'translate(' + eval ( d.xT ) + ',' + (y + d.y) + ')'; 
				} );

		grps.each ( function ( d ) {
			d3.select ( this )
				.append ( 'rect' )
					.attr ( 'id',     function ( d ) { return 'a-rect-' + d.id; } )
					.attr ( 'x',      0 )
					.attr ( 'y',      0 )
					.attr ( 'width',  function ( d ) { return eval ( d.wT ); } )
					.attr ( 'height', function ( d ) { return d.h; } )
					.attr ( 'stroke-width', function ( d ) { return d.borderWidth; } )
					.attr ( 'class',  function ( d ) { return d.borderClass; } );
			} );
		grps.each ( function ( d ) {
			d3.select ( this )
				.append ( 'text' )
					.attr ( 'id',          function ( d, i ) { return 'a-text-x-' + d.id; } )
					.attr ( 'text-anchor', function ( d, i ) { return 'start'; } )
					.attr ( 'x',           function ( d, i ) { return 4; } )
					.attr ( 'y',           function ( d, i ) { return (d.h -   4 + fs) / 2 ; } )
					.attr ( 'style',       function ( d, i ) { return 'font-family: ' + ff + '; font-size: ' + fs + 'px;'; } )
					.attr ( 'class',       function ( d, i ) { return classText; } )
					.text (                function ( d, i ) { return 'x: ' + d.xT; } );
			} );
		grps.each ( function ( d ) {
			d3.select ( this )
				.append ( 'text' )
					.attr ( 'id',          function ( d, i ) { return 'a-text-w-' + d.id; } )
					.attr ( 'text-anchor', function ( d, i ) { return 'start'; } )
					.attr ( 'x',           function ( d, i ) { return w - 84; } )
					.attr ( 'y',           function ( d, i ) { return (d.h -   4 + fs) / 2 ; } )
					.attr ( 'style',       function ( d, i ) { return 'font-family: ' + ff + '; font-size: ' + fs + 'px;'; } )
					.attr ( 'class',       function ( d, i ) { return classText; } )
					.text (                function ( d, i ) { return 'w: ' + d.wT; } );
			} );
	}	//	drawGroups()

	var bw, rects;

	bw = 1;
	rects = [
		{ id:  4, borderWidth: bw, borderClass: 'u35-rect-border', xT: '0',      y: 4 + ((h + 4 + bw) * 0), wT:  'w',            h:  h },
		{ id:  5, borderWidth: bw, borderClass: 'u35-rect-border', xT: 'bw / 2', y: 4 + ((h + 4 + bw) * 1), wT:  'w - bw',       h:  h },
	];

	drawGroups ( 10, bw, rects );

	bw = 4;
	rects = [
		{ id:  6, borderWidth: bw, borderClass: 'u35-rect-border', xT: '0',      y: 4 + ((h + 4 + bw) * 0), wT:  'w',            h:  h },
		{ id:  7, borderWidth: bw, borderClass: 'u35-rect-border', xT: 'bw / 2', y: 4 + ((h + 4 + bw) * 1), wT:  'w - bw',       h:  h },
	];

	drawGroups ( 70, bw, rects );

}	//	tryD3()

function processLoginResponse ( bOAuth, res ) {
	//	Based on 
	//		C:\Dign\Next\Angular\Forms\01a\src\client\app\partials\user-login-controller.js.
	if ( res.token ) {
		userAuth.setAuthenticated ( true, res.user.session, res.token );
		userAuth.userID = res.user.id;
		if ( uc.isString ( res.user.displayName ) && (res.user.displayName.length > 0) )
			userAuth.displayName = res.user.displayName;
		else
			userAuth.displayName = res.user.email;
		userAuth.photo = JSON.parse ( res.user.photo );
		userAuth.about = JSON.parse ( res.user.about );
	//	$state.go ( 'front-page' );		//	home page/view
	} else {

		//	Error

		//	If OAuth ...
		//
		//		Where to display the error message?

	//	if ( res.error || res.emailError ) {
	//		$scope.emailErrorMsg = res.message;
	//		
	//		//	Not sure about this ...  But "it seems to work".
	//		$scope.form.uEmail.$setValidity ( 'myuserloginemailvalidator', false );
	//	}
	//	if ( res.passwordError ) {
	//		$scope.passwordErrorMsg = res.message;
	//
	//		//	Not sure about this ...  But "it seems to work".
	//		$scope.form.uPassword.$setValidity ( 'loginpassword', false );
	//	}
	}

}	//	processLoginResponse()

//	Signing in -
//
//		C:\Dign\Next\Azure\nodeDS\01\src\client\app\partials\user-login.html
//		C:\Dign\Next\Azure\nodeDS\01\src\client\app\partials\user-login-controller.html
//
function signIn ( user ) {
	var sW = 'signIn()';
//	//	Trying axios -
//	//		https://github.com/mzabriskie/axios
//	//	Based on 
//	//		C:\Dign\Next\Angular\Forms\01a\src\client\app\partials\user-login-controller.js.
//	axios.post ( '/login', user )
//		.then ( function ( res ) {
//			console.log ( res );
//			console.log ( sW + ': Welcome ' + res.data.user.displayName );
//
//			processLoginResponse ( false, res.data );
//
//			//	Change  button text from "Sign In"  to "<user's display name>" -
//			d3.select ( '#' + uc.appHeader.btnDSignIn.eleId )
//				.select ( 'text' )
//					.text ( res.data.user.displayName );
//		} )
//		.catch ( function ( err ) {
//			var sMsg = JSON.stringify ( err, null, '    ' );
//			console.log ( sW + ' error: ' + sMsg );
//			processLoginResponse ( false, err.data );
//		} );
	console.log ( sW + ': App must implement this.' );
}	//	signIn()

function dialogSignIn() {
	var sW = 'dialogSignIn()';
	console.log ( sW );

	//	Use a panel for the screen (a kind of a shield) - so that -
	//
	//		if the user clicks anywhere outside the dialog we know about it
	//
	//		the dialog can be moved by panning this screen panel
	//
	//	Validation based on - 
	//
	//		https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
	//		Validating forms without a built-in API
	//
	//		Developed, tested in C:\Dign\OT\VSCode\Validation.
	//
	var screenPanel = null, dlg = null, d = null;

	function clickScreen ( d, i, ele ) {
		var sW2 = sW + ' clickScreen()';
	//	uc.downAppScreen();
		//	We could remove the screen which will remove the dialog (as is done with
		//	the popup menu).  But here we will direct the user's attention to the 
		//	dialog by flashing its border.
		console.log ( sW2 );
	}	//	clickScreen()

	function onEmailInput ( d, i, ele ) {
		//	Validate the email address.
		var emailErrMsgData = dlg.panel.getControlDataByName ( 'lblEmailError' );
		var emailErrMsgEle  = document.querySelector ( '#' + emailErrMsgData.eleId + '-text' );

		//	Reg exp per the HTML5 Specification -
		var emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

	//	var s = dlg.panel.getControlDataByName ( 'edtEmail' ).value;
		var inputEle = ele[i].children[0];
		var s = inputEle.value;
		if ( s.length === 0 )
			emailErrMsgEle.innerHTML = '';
		else {
			if ( ! emailRegExp.test ( s )  )
				emailErrMsgEle.innerHTML = 'looks like an invalid email address';
			else
				emailErrMsgEle.innerHTML = '';
		}

	}	//	onEmailInput()

	function onOK() {
		var sW2 = sW + ' onOK()';
		console.log ( sW2 );
		var user = {
			email: 		dlg.panel.getControlDataByName ( 'edtEmail' ).value,
			password: 	dlg.panel.getControlDataByName ( 'edtPassword' ).value
		};
		signIn ( user );
		uc.downAppScreen();
	}	//	onOK()
	
	function onCancel() {
		var sW2 = sW + ' onCancel()';
		console.log ( sW2 );
		uc.downAppScreen();
	}	//	onCancel()

	screenPanel = uc.upAppScreen ( { sc: 			sW,
									 clickCB: 		clickScreen,
									 baseClass: 	'u34-popupmenu-screen' } );
	dlg = uDialog.showLoginDialog ( { sC: 		sW,
									  uduiId:	uc.ROOT_UDUI_ID, 
									  forPanel: screenPanel,
									  onOK: 	onOK,
									  onCancel: onCancel } );

	d = dlg.panel.getControlDataByName ( 'edtEmail' );
	if ( d ) {
		d.inputCB = onEmailInput;
	}
}	//	dialogSignIn()

function onSignIn() {
	var sW = 'onSignIn()';
	console.log ( sW );

	//	test ...
//	signIn ( { email: 'brad.dunagan@gmail.com',	 password: 'bradspw' } )	;

	dialogSignIn();

}	//	onSignIn()

function setHeaderPanelW ( w ) {
	var hpd = uc.rootData.data[0];
	var bd  = hpd.baseData[0];
	var bWasPercent = (hpd.w === '100%');
	if ( bWasPercent ) {
		hpd.w = w;
		bd.w = w;
		return;
	}

	var dx = w - hpd.w;
	var dy = 0;
	hpd.onSize ( hpd, -1, null, dx, dy );
}	//	setHeaderPanelW()

function setRootPanelWH ( w, h ) {
	var rpd = uc.rootData.data[1];
	var bd  = rpd.baseData[0];
	var bWasPercent = (rpd.w === '100%' && rpd.h === '100%');
	if ( bWasPercent ) {
		rpd.w = w;
		rpd.h = h;
		bd.w = w;
		bd.h = h;
		return;
	}

	//	Need rpd.lpwf, tphf ...
	//		calculated when size-change starts
	if ( ! bGotResizeFactors ) {
		rpd.onSizeStart ( rpd, -1, null );
		bGotResizeFactors = true;
		if ( resizeFactorsTimeOut )
			clearTimeout ( resizeFactorsTimeOut );
		resizeFactorsTimeOut = setTimeout ( unsetResizeFactors, 3000 );
	}
	//
	//	Maybe instead of that -
	//		Calculate the lpwf and tphf when the user manually  moves the
	//		splitter.

	var dx = w - rpd.w;
	var dy = h - rpd.h;
	rpd.onSize ( rpd, -1, null, dx, dy );
}	//	setRootPanelWH()

function onDocResize ( evt ) {
	var sW = 'onDocResize()';
	var w = document.body.parentElement.clientWidth;
	var h = document.body.parentElement.clientHeight - uc.APP_HEADER_ROOT_PANEL_HEIGHT;
//	console.log ( sW + ':  view w h ' + w + ' ' + h + '   outer window w h ' + window.outerWidth + ' ' + window.outerHeight );
	e2eSetCmdOutputText ( '{ view (client root panel): { w: ' + w + ', h: ' + h + ' }, outer: { w ' + window.outerWidth + ', h: ' + window.outerHeight + ' } }' );
	setHeaderPanelW ( w );
	setRootPanelWH ( w, h );
}

function createHeaderPanel() {
	var w, h, x, y;
	if ( uc.container )
	//	w = uc.containerWidth;
		//	2018-May-10
		w = uc.containerWidth - (uc.containerBorderWidth * 2);
	else
		w = '100%';
	h = uc.APP_HEADER_ROOT_PANEL_HEIGHT;
	var headerPanel = null;
	var hpd = uPanel.createAppPanelData ( { x: 			0, 
											y: 			0, 
											w: 			w, 
											h: 			h, 
											name: 		uc.APP_HEADER_ROOT_PANEL_NAME, 
											clickCB: 	null, 
											storeId: 	uc.APP_HEADER_ROOT_PANEL_STORE_ID,
											storeName: 	uc.APP_HEADER_ROOT_PANEL_STORE_NAME,
											hasBorder: 	false,
											bW100Pct: 	! uc.container,
											bMoveRect: 	false,
											bSizeRect: 	false,
											bVertSB: 	false,
											bHorzSB: 	false } );
	hpd.eleId = 'rr-' + uc.APP_HEADER_ROOT_PANEL_ELE_ID;	//	Normally the parent panel sets this.  Since this 
															//	is the "header" panel (it has no parent) we do it here.
	uc.rootData.data.push ( hpd );
	headerPanel = uPanel.createPanel ( uc.rootRootG, uc.rootData, true );
	if ( ! uc.container )
		setHeaderPanelW ( document.body.parentElement.clientWidth );

	d3.select ( '#' + hpd.eleId )
		.append ( 'line' )
		.attr ( 'id',    hpd.eleId + '-bottom-border' )
		.attr ( 'x1',    0 )
		.attr ( 'y1',    uc.APP_HEADER_ROOT_PANEL_HEIGHT + 0.5 )
	//	.attr ( 'x2',    hpd.w - (uc.container ? uc.containerBorderWidth * 2 : 0) )
		//	2018-May-10
		.attr ( 'x2',    hpd.w )
		.attr ( 'y2',    uc.APP_HEADER_ROOT_PANEL_HEIGHT + 0.5 )
		.attr ( 'stroke-width', uc.APP_HEADER_BOTTOM_BORDER_WIDTH )
		.attr ( 'class', 'u34-app-header-root-panel-bottom-border' );

	var base = d3.select ( '#' + hpd.eleId + '-base' );

	//	Robot Records app title -
	var ff   = 'verdana';				//	font family
	var fs   = 18;						//	font size, pixels
	var classText = 'u34-label-text';	//	for now

	base.append ( 'text' )
		.attr ( 'id',          function ( d, i ) { return d.eleId + '-text'; } )
		.attr ( 'text-anchor', function ( d, i ) { return 'start'; } )
		.attr ( 'x',           function ( d, i ) { return 4; } )
		.attr ( 'y',           function ( d, i ) { return (d.h -   4 + fs) / 2 ; } )
		.attr ( 'style',       function ( d, i ) { return 'font-family: ' + ff + '; font-size: ' + fs + 'px;'; } )
		.attr ( 'class',       function ( d, i ) { return classText; } )
	//	.attr ( 'clip-path',   function ( d, i ) { return 'url(#cp-' + d.eleId + ')'; } )		for now
		.text (                function ( d, i ) { return 'Robot Records'; } );

	//	Sign in button -
	if ( uc.container ) 
		x = uc.containerWidth - (uc.containerBorderWidth * 2) - uc.SIGN_IN_BUTTON_WIDTH - 4;
	else {
	//	x = 300;		//	for now, fix later
		//	Now is later.
		let svgNode = uc.svg.node();
		x = svgNode.width.baseVal.value - uc.SIGN_IN_BUTTON_WIDTH - 4;
	}
	uc.appHeader.btnDSignIn = 
		uButton.createButtonData ( { x:  x, 
									 y:  6, 
									 w: uc.SIGN_IN_BUTTON_WIDTH, 
									 h: 18, 
									 name: 'btnSignIn', text: 'Sign In', 
									 fontSize: 12,
									 borderColor: 'transparent',
									 bMoveRect: false,
									 bSizeRect: false,
									 horzAlign: 'right',
									 cb: onSignIn } );
	headerPanel.addControl ( uc.appHeader.btnDSignIn );

	//	When the app window (browser) size changes -
	var onHdrSize = hpd.onSize;
	hpd.onSize = function ( d, i, ele, dx, dy ) {
		onHdrSize ( d, i, ele, dx, dy );

		var hdrW = d.w;

		d3.select ( '#' + d.eleId + '-bottom-border' )
			.attr ( 'x2',    hdrW );

		d3.select ( '#' + uc.appHeader.btnDSignIn.eleId )
			.attr ( 'transform', function ( d, i ) { 
				return 'translate(' + (d.x = hdrW - uc.SIGN_IN_BUTTON_WIDTH - 2) + ',' + (d.y = 6) + ')'; 
			} );
	};

}	//	createHeaderPanel()

function createRootPanel() {
	var w = '100%';
	var h = '100%';
	var w, h;
	if ( uc.container ) {
	//	w = uc.containerWidth;
	//	h = uc.containerHeight - uc.APP_HEADER_ROOT_PANEL_HEIGHT - uc.APP_HEADER_BOTTOM_BORDER_WIDTH; }
		//	2018-May-10
		w = uc.containerWidth  - (uc.containerBorderWidth * 2);
		h = uc.containerHeight - uc.APP_HEADER_ROOT_PANEL_HEIGHT - uc.APP_HEADER_BOTTOM_BORDER_WIDTH
							   - (uc.containerBorderWidth * 2); } 
	else {
		w = '100%';
		h = '100%'; }
	var rpd = uPanel.createAppPanelData ( { x: 			0, 
											y: 			uc.APP_HEADER_ROOT_PANEL_HEIGHT + uc.APP_HEADER_BOTTOM_BORDER_WIDTH, 
											w: 			w, 
											h: 			h, 
											name: 		uc.APP_CLIENT_ROOT_PANEL_NAME, 
											clickCB: 	uShiftClick.shiftClickPanel, 
											storeId: 	uc.APP_CLIENT_ROOT_PANEL_STORE_ID,
											storeName: 	uc.APP_CLIENT_ROOT_PANEL_STORE_NAME,
											hasBorder: 	false,
											bW100Pct: 	! uc.container,
											bH100Pct: 	! uc.container,
											bMoveRect: 	false,
											bSizeRect: 	false,
											bVertSB: 	false,
											bHorzSB: 	false } );

	rpd.eleId = 'rr-' + uc.APP_CLIENT_ROOT_PANEL_ELE_ID;		//	Normally the parent panel sets this.  Since this 
															//	is the "root" panel (it has no parent) we do it here.
	uc.rootData.data.push ( rpd );
	uc.rootPanel = uPanel.createPanel ( uc.rootRootG, uc.rootData, true );
	if ( ! uc.container )
		setRootPanelWH ( document.body.parentElement.clientWidth, 
						document.body.parentElement.clientHeight - uc.APP_HEADER_ROOT_PANEL_HEIGHT );

	//	Try adding a control to see if if fixes the placement of the panel's base rect.
	//	Yes, addControl() calls dragSclred2() which sets the rect's x, y.
//	var btnData  = 
//		uButton.createButtonData ( { x:  10, 
//									 y:  10, 
//									 w:  60,
//									 h:  18, 
//									 name: 'btnFixPanelBaseRectPlacement', text: 'Fixed It?', 
//									 fontSize: 12,
//									 bMoveRect: false,
//									 bSizeRect: false,
//									 cb: null } );
//	uc.rootPanel.addControl ( btnData );
				
}	//	createRootPanel()

function createTestLayout_11() {
	var sW = 'createTestLayout_11()';
	console.log ( sW );

	var pd, bd, goodPanel, ralphPanel, waldoPanel;

//	//	First a split panel is known to work and look right, that will be compared with.
//	pd = uPanel.createPanelData ( { x: 75.5,  y: 5.5,  w: 100,  h: 40, 
//									name: 		'good', 
//									clickCB: 	uShiftClick.shiftClickPanel,
//									hasBorder: 	true,
//								  } );
//	goodPanel = uc.rootPanel.addControl ( pd );
//	goodPanel.splitHorz();

	//	A panel that will be docked to another panel.
	//
	//	Using this to develop test panels-dock-one-a.js -
	//
	//		After this panel is created and buttons added ...
	//
	//		Click on the root panel to show properties.
	//
	//		Drag and drop the properties to dock at right on panel.
	//
	//		Get coords info (in debug output) and put in test.
	//
//	pd = uPanel.createPanelData ( { x:   5.5,  y: 55.5,  w: 228,  h: 183, 
//	pd = uPanel.createPanelData ( { x:   5.5,  y: 55.5,  w: 228,  h: 184, 
//	pd = uPanel.createPanelData ( { x:   5.5,  y: 55.5,  w: 160,  h: 140, 
	pd = uPanel.createPanelData ( { x: 105.5,  y: 55.5,  w:  98,  h:  97, 
									name: 		'ralph', 
									clickCB: 	uShiftClick.shiftClickPanel,
									hasBorder: 	true,
									eleId: 		'rr-ralph',
								  } );
	ralphPanel = uc.rootPanel.addControl ( pd );

	bd = uButton.createButtonData ( { x: 5, y:  5, w: 60, h: 15, name: 'btnA', text: 'btnA' } );
	ralphPanel.addControl ( bd );

	bd = uButton.createButtonData ( { x: 5, y: 25, w: 60, h: 15, name: 'btnB', text: 'btnB' } );
	ralphPanel.addControl ( bd );

	bd = uButton.createButtonData ( { x: 5, y: 45, w: 60, h: 15, name: 'btnC', text: 'btnC' } );
	ralphPanel.addControl ( bd );

	bd = uButton.createButtonData ( { x: 5, y: 65, w: 60, h: 15, name: 'btnD', text: 'btnD' } );
	ralphPanel.addControl ( bd );

//	ralphPanel.splitHorz ( uShiftClick.shiftClickPanel );
//	ralphPanel.splitVert ( uShiftClick.shiftClickPanel );

//	setTimeout ( function() {
//		var d = {
//			value: '{"cmd":"move-splitter","args":{"eleId":"rr-6",    "dx":20,"dy":0}}'
//		};
//		e2eOnCmdChange ( d );
//	}, 1000 );

	//	dock to this panel 'waldo'
//	pd = uPanel.createPanelData ( { x: 30.5,  y: 90.5,  w: 100,  h: 60, 
//									name: 		'waldo', 
//									clickCB: 	uShiftClick.shiftClickPanel,
//									hasBorder: 	true,
//								  } );
//	waldoPanel = uc.rootPanel.addControl ( pd );
}	//	createTestLayout_11()

function createTestLayout_17() {
	var sW = 'createTestLayout_17()';
	console.log ( sW );

	//	2018-May-10		Two panels. Dock one (A) into the other (B).
	//
	//	B will end up being split. Everything positioned right?

	var pd, bd, panelB, panelA;		//	goodPanel, ralphPanel, waldoPanel;

//	//	First a split panel is known to work and look right, that will be compared with.
//	pd = uPanel.createPanelData ( { x: 75.5,  y: 5.5,  w: 100,  h: 40, 
//									name: 		'good', 
//									clickCB: 	uShiftClick.shiftClickPanel,
//									hasBorder: 	true,
//								  } );
//	goodPanel = uc.rootPanel.addControl ( pd );
//	goodPanel.splitHorz();

	//	A panel that will be docked to another panel.
	//
	pd = uPanel.createPanelData ( { x:  5.5,  y:  55.5,  w:  98,  h:  47, 
									name: 		'B', 
									clickCB: 	uShiftClick.shiftClickPanel,
									hasBorder: 	true,
									eleId: 		'rr-B',
								  } );
	panelB = uc.rootPanel.addControl ( pd );

	//	The other panel.
	//
	pd = uPanel.createPanelData ( { x:  5.5,  y: 155.5,  w:  45,  h:  35, 
									name: 		'A', 
									clickCB: 	uShiftClick.shiftClickPanel,
									hasBorder: 	true,
									eleId: 		'rr-A',
								  } );

	panelA = uc.rootPanel.addControl ( pd );

}	//	createTestLayout_17()


function e2eShowCmdInputBox ( cmdInputEleId ) {
	uc.rootPanel.addControl ( uInput.createInputData ( { eleId: 	cmdInputEleId,
														 x: 		2,  
														 y: 		2, 
														 w: 		400,  
														 h: 		18, 
														 name: 		'edtTestCmd', 
														 value:		'Hello!',
														 changeCB: 	e2eOnCmdChange,
														 class: 	'u34-input-test' } ) );
}	//	e2eShowCmdInputBox()

function e2eShowCmdOutputBox() {
	uc.rootPanel.addControl ( uInput.createInputData ( { eleId: cmdOutputEleId,
														 x: 	2,  
														 y: 	24, 
														 w: 	400,  
														 h: 	18, 
														 name: 	'edtTestCmdOutput', 
														 value:	'',
														 class: 'u34-input-test' } ) );
}	//	e2eShowCmdOutputBox()

function e2eCreateLabel ( cmd ) {
	var sW = 'e2eCreateLabel()';
	if ( typeof cmd.panelEleId !== 'string' ) {
		console.log ( sW + ' expected cmd.panelEleId');
		return;
	}
	d3.select ( '#' + cmd.panelEleId ).each ( function ( d ) {
		d.panel.addControl ( uLabel.createLabelData ( cmd.args ) );
	} );
}	//	e2eCreateLabel()

function e2eCreatePanel ( args ) {
	var d, ctrl;
	var prms = { clickCB: uShiftClick.shiftClickPanel, hasCloseBox: true };
	Object.assign ( prms, args );
	d = uPanel.createPanelData ( prms );
	ctrl = uc.rootPanel.addControl ( d );
}	//	e2eCreatePanel()

function e2eCreateButton ( cmd ) {
	var sW = 'e2eCreateButton()';
	if ( typeof cmd.panelEleId !== 'string' ) {
		console.log ( sW + ' expected cmd.panelEleId');
		return;
	}
	d3.select ( '#' + cmd.panelEleId ).each ( function ( d ) {
		d.panel.addControl ( uButton.createButtonData ( cmd.args ) );
	} );
}	//	e2eCreateButton()

function e2eMoveControl ( args ) {
	var sW = 'e2eMoveControl()';
	d3.select ( '#' + args.eleId )
		.attr ( 'transform', function ( d, i ) { 
			return 'translate(' + (d.x = args.x) + ',' + (d.y = args.y) + ')'; 
		} );
}	//	e2eMoveControl()

function e2eSizeStart ( args ) {
	var sW = 'e2eSizeStart()';
	d3.select ( '#' + args.eleId ).each ( function ( d, i, ele ) {
		d.onSizeStart ( d, -1, null );
	} );
}	//	e2eSizeStart()

function e2eSizeControlDelta ( args ) {
	var sW = 'e2eSizeControlDelta()';
	d3.select ( '#' + args.eleId + '-size' ).each ( function ( d, i, ele ) {
		d.onSize ( d, -1, ele[i], args.dx, args.dy );
	} );
}	//	e2eSizeControlDelta()

function e2eSizeControl ( args ) {
	var sW = 'e2eSizeControl()';
	d3.select ( '#' + args.eleId + '-size' ).each ( function ( d, i, ele ) {
		var dx = args.w - d.w;
		var dy = args.h - d.h;
		d.onSize ( d, -1, ele[i], dx, dy );
	} );
}	//	e2eSizeControl()

function e2eOutSplitInfo ( d ) {
	var out;
	if ( d.panel.data.horzSplitter ) {
		out = {  leftPanelEleId: 	d.panel.data.leftPanel.data.eleId, 
				   splitterEleId: 	d.panel.data.horzSplitter.data.eleId,
				rightPanelEleId: 	d.panel.data.rightPanel.data.eleId, };
		e2eSetCmdOutputText ( JSON.stringify ( out ) );
	}
	else
	if ( d.panel.data.vertSplitter ) {
		out = {    topPanelEleId:	d.panel.data.topPanel.data.eleId, 
				   splitterEleId: 	d.panel.data.vertSplitter.data.eleId,
				bottomPanelEleId: 	d.panel.data.bottomPanel.data.eleId, };
		e2eSetCmdOutputText ( JSON.stringify ( out ) );
	}

}	//	e2eOutSplitInfo()

function e2eSplitPanel ( args ) {
	var sW = 'e2eSplitPanel()';
	var out;
	d3.select ( '#' + args.panelEleId ).each ( function ( d, i, ele ) {
		if ( args.vh === 'horz' ) {
			d.panel.splitHorz();
		}
		else
		if ( args.vh === 'vert' ) {
			d.panel.splitVert();
		}
		e2eOutSplitInfo ( d );
	} );
}	//	e2eSplitPanel()

function e2eGetSplitInfo ( args ) {
	var sW = 'e2eGetSplitInfo()';
	var out;
	d3.select ( '#' + args.panelEleId ).each ( function ( d, i, ele ) {
		e2eOutSplitInfo ( d );
	} );
}	//	e2eGetSplitInfo()

function e2eMoveSplitter ( args ) {
	var sW = 'e2eMoveSplitter()';
	console.log ( sW );
	d3.select ( '#' + args.eleId ).each ( function ( d, i, ele ) {
	//	d.panel.splitterMove ( args.dx, args.dy );
		console.log ( sW + ' splitter eleId ' + d.eleId + ' dx y ' + args.dx + ' ' + args.dy );
		var x = d.x + args.dx;
		var y = d.y + args.dy;
		d.move ( ele[i], x, y, args.dx, args.dy );
	} );
}	//	e2eMoveSplitter()

function e2eGetListItemEleId ( args ) {
	var sW = 'e2eGetListItemEleId()';
	d3.select ( '#' + args.listEleId ).each ( function ( d, i, ele ) {
		var out = { itemEleId: d.getItemEleId ( args.itemTextId ) };	
		e2eSetCmdOutputText ( JSON.stringify ( out ) );
	} );
}	//	e2eGetListItemEleId()

function e2eSetCmdOutputText ( text ) {
	d3.select ( '#' + cmdOutputEleId ).each ( function ( d, i, ele ) {
		d.setText ( text );
	} );
}	//	e2eSetCmdOutputText()

uc.e2eSetCmdOutputText = e2eSetCmdOutputText;

function e2eOnCmdChange ( d ) {
	var cmd = JSON.parse ( d.value );
	if ( cmd.cmd === 'test-cmd-input' ) {
		let out = { status: 'ok' };
		e2eSetCmdOutputText ( JSON.stringify ( out ) );
	}
	else
	if ( cmd.cmd === 'create-label' )
		e2eCreateLabel ( cmd );
	else
	if ( cmd.cmd === 'create-panel' ) 
		e2eCreatePanel ( cmd.args );
	else
	if ( cmd.cmd === 'create-button' )
		e2eCreateButton ( cmd );
	else
	if ( cmd.cmd === 'move-control' )
		e2eMoveControl ( cmd.args );
	else
	if ( cmd.cmd === 'size-start' )
		e2eSizeStart ( cmd.args );
	else
	if ( cmd.cmd === 'size-control-delta' )
		e2eSizeControlDelta ( cmd.args );
	else
	if ( cmd.cmd === 'size-control' )
		e2eSizeControl ( cmd.args );
	else
	if ( cmd.cmd === 'split-panel' )
		e2eSplitPanel ( cmd.args );
	else
	if ( cmd.cmd === 'get-split-info' )
		e2eGetSplitInfo ( cmd.args );
	else
	if ( cmd.cmd === 'move-splitter' )
		e2eMoveSplitter ( cmd.args );
	else
	if ( cmd.cmd === 'get-list-item-ele-id' )
		e2eGetListItemEleId ( cmd.args );
}	//	e2eOnCmdChange()

function debugTest_createPanel ( args ) {					//	function of test helpers.js createPanel()
	var cmd = {
		cmd: 	'create-panel',
		args: 	args
	};
	e2eOnCmdChange ( { value: JSON.stringify ( cmd ) } );
}	//	debugTest_createPanel()
	
function debugTest_createPixDiffLabel() {
	var labelPixDiffEleId = 'rr-test-label-sc';
	var cmd = {
		cmd: 		'create-label',
		panelEleId: 'rr-app-client-root',		//	on the root panel, the parent of the panel whose border we are looking at
		args: {
			x: 		 	36,			//	looking at border of panel with eleId 'rr-test-panel-2' created above
			y: 		 	94,			//	this should be over the left border, alittle down from the top
			w: 			8,
			h: 			8,
			name: 		'lblTestLabelSC',
			text: 		'',
			class: 		'u34-label-with-border',
			hasBorder: 	true,		//	to see it while testing the test
			eleId: 		labelPixDiffEleId,
			fill: 		'transparent'
		}
	};
	var sCmd = JSON.stringify ( cmd );
	e2eOnCmdChange ( { value: sCmd } );
}	//	debugTest_createPixDiffLabel()

function bootstrap() {
	var sW = 'bootstrap()';
	console.debug ( sW );
	console.debug ( 'uc.APP_CLIENT_ROOT_PANEL_NAME: ' + uc.APP_CLIENT_ROOT_PANEL_NAME );

	rrLS.enable ( true );

//	uc.svg = d3.select ( 'svg' );
//	uc.svg.append ( 'defs' );			//	2017-Aug

	uc.svg = d3.select ( '#uduiRootRoot' );

	var svgNode = uc.svg.node();

	uc.svg.append ( 'defs' );			//	2017-Aug

	if ( uc.container ) {
		uc.containerWidth  = svgNode.width.baseVal.value  - 1;
		uc.containerHeight = svgNode.height.baseVal.value - 1;
		uc.svg.append ( 'rect' )
			.attr ( 'id', 'uduiRootRootRect' )
			.attr ( 'x', uc.containerBorderWidth / 2 )
			.attr ( 'y', uc.containerBorderWidth / 2 )
			.attr ( 'width',  uc.containerWidth  - uc.containerBorderWidth )
			.attr ( 'height', uc.containerHeight - uc.containerBorderWidth )
		//	.attr ( 'fill',   'white' )
		//	.attr ( 'stroke', 'black' )
			.attr ( 'class',  'rr-container-border' )
			.attr ( 'stroke-width', uc.containerBorderWidth );
	}

	//	The container group. To offset contents for the container border.
	var g = uc.svg.append ( 'g' )
		.attr ( 'id', 'uduiRootRootG' )
		.attr ( 'transform', 'translate(' + uc.containerBorderWidth + ',' 
										  + uc.containerBorderWidth + ')' );

	uc.rootRootG = g;

	(function() {
		window.addEventListener ( 'resize', resizeThrottler, false );
		var resizeTimeout;
		function resizeThrottler() {
			//	ignore resize events as long as an onDocResize execution is in the queue
			if ( ! resizeTimeout ) {
			resizeTimeout = setTimeout ( function() {
				resizeTimeout = null;
				onDocResize();

				//	onDocResize will execute at a rate of 10 fps
				}, 100 );
			}
		}
	}());

	createHeaderPanel();
	createRootPanel();

	if ( ! uc.container ) {
		//	For e2e testing -
		//	Add a hidden(?) input box for test commands.
		let rpd = uc.rootData.data[1];
		e2eShowCmdInputBox ( rpd.eleId + '-e2et-cmd-input' );
		cmdOutputEleId = rpd.eleId + '-e2et-cmd-output';
		e2eShowCmdOutputBox();
	}

//	createTestLayout_11();		//	A simple panel with buttons. Dock it to the root panel.
//	createTestLayout_17();		//	Two simple panels. Dock one (A - the smaller, bottom one) into the 
								//	other (B - wider, top one).

	//	For developing/debuging functions used in tests.
	//
//	debugTest_createPixDiffLabel();

//	var panelRalph = { x: 5.5,  y:  55.5,  w: 228,  h: 183, name: 'ralph', eleId: 'rr-ralph' };
//	var args = { 
//		x: 		20.5,
//		y: 		60.5,
//		w: 		200,
//		h: 		150,
//		name: 	'testPanel',
//		eleId: 	'rr-test-panel-1'
//	};
//	debugTest_createPanel ( panelRalph );
//	debugTest_createPanel ( args );

}   //  bootstrap()

/*
tryMisc();
*/

/*
tryD3();
*/

/*
bootstrap();
*/
/*
//	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
document.addEventListener ( 'DOMContentLoaded', function() {
*/
//	https://developer.mozilla.org/en-US/docs/Web/Events/load
window.addEventListener ( 'load', function() {
	bootstrap();
}, false );
