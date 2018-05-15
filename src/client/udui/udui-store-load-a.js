'use strict';

//  app/partials/udui/udui-store-load-a.js

//	For UDUI controls, to save to and load from local storage.

//	LS 	- 	In Local Storage (and probably in Share) things are stored with indirection
//
//	-	rr systems 
//		-	sys id
//			-	udui
//				-	panels
//					-	next panel id 			//	just one of these
//					-	panel id
//						-	<saved as>				//	a name
//							-	<panel JSON>
//						-	<saved as>				//	a name
//							-	<panel JSON>
//						...							//	user may store a panel to multiple names
//					...							//	for each panel of the system's udui
//
//	So -
//
//		Panel ID may need to be allocated by Share.
//
//			complex
//
//			perf hit
//
//			is there another way?
//
//			it must be unique system wide
//
//		Include the user ID - 
//
//			allocate panel IDs per user
//
//			<sys-id>-<user-id>-<panel-id> specification is like that of record types
//
//			user ID is that of the user that created the panel
//
//			prevents a particular user from maliciously (or otherwise) using up IDs for 
//			all users
//
//		Panels may be referenced/used across systems, between users -
//
//			<sys-id> is always the system where the  panel was created
//
//			<user-id> is always the user that created the panel
//
//		The LS item name for a particular panel's JSON might be something like -
//
//			<created-in-sys-id>-<created-by-user-id>-<panel-id>
//
//		May need a <saved-by-user-id> -
//
//			<created-in-sys-id>-<created-by-user-id>-<panel-id>-<saved-by-user-id>-<saved-as>
//
//		For example, the LS panel ID item name will look like -
//
//			30C4-9112-B-4C621
//
//		The item will be an array of panel names.  From that the current user can select
//		a panel, or verify a new name is not already being used.  The item name for the 
//		JSON of the panel will then be -
//
//			30C4-9112-B-4C621-<panel-name>
//
//		Share ? - Store Priority -
//
//			IndexdDB (iDB) - Local Storage (rrLS) - Share (thru RR Server API)
//
//			So, for storage, the app (almost?) always calls iDB functions -
//
//				On load - if the value is not present -
//
//					Get it from Share and insert it.
//
//				On store - if the bUpdate flag is true -
//
//					Store it in Share also.
//
//	App -
//
//		UDUI things - especially a command record's UDUI - 
//
//		-	is stored as a RR record
//
//		-	which means -
//
//			-	it has a RecID
//
//			-	it has a type ? - a user-specified subtype of ^UDUI ?
//
//			-	it is a server to -
//
//				-	the user that created it
//
//				-	probably command records
//
//		or 	- 	command records are its servers ?

module.exports = (function() { 

	var userAuth = 		require ( './udui-user-auth.js' );
	var rrLS = 			require ( './udui-ls.js' );

	var uc = 			require ( './udui-common.js' );
	var uButton = 		require ( './udui-button-e.js' );
	var uSplitter = 	require ( './udui-splitter-b.js' );
	var uList = 		require ( './udui-list-b.js' );
	var uInput = 		require ( './udui-input-b.js' );
	var uLabel = 		require ( './udui-label-b.js' );
	var uCheckbox = 	require ( './udui-checkbox-b.js' );
	var uTable = 		require ( './udui-table-a.js' );
	var uTextarea = 	require ( './udui-textarea-a.js' );

	var uShiftClick = 	require ( './udui-shift-click-a.js' );

	var serviceId = 'uduiStoreLoadA';

	/* jshint validthis: true */

	var svc = {};
	
	uc.storeLoadSvc = svc;

	var uduis = null;		//	uduis is an object whose item's key is '<uduiId>' and each item's
							//	value is also an object.
							//
							//	And the key of each item in the panels object is the panel's storeId
							//	and the items' value is a list (array) of names representing each 
							//	version of the panel stored (i.e., the panel's storeName).
							//
							//	Like so -
							//
							//		uduis = {
							//			'<uduiId>': {
							//				nextStoreId: 	<number>,
							//				panels: {
							//					'<storeId>': [
							//						'<storeName>',
							//						'<storeName>',
							//						...
							//					],
							//					'<storeId>': [
							//						'<storeName>',
							//						'<storeName>',
							//						...
							//					],
							//					...
							//				}
							//			},
							//			'<uduiId>': {
							//				nextStoreId: 	<number>,
							//				panels: {
							//					...
							//				}
							//			},
							//			...
							//		}
							//
							//	This is the UDUI "list".  One, for all users, per system.  For now.
							//
							//	It stored with a item name like -
							//
							//		 <sys-id>-udui-list

	svc.getLoadSpec = function ( rgs ) {
		return { 
			sC: 		rgs.sW, 
			itemName: 	{
				createdInSysId: 	0,		//	For now.  Later, current system Id.
				uduiId: 			rgs.uduiId, 
				createdByUserId: 	userAuth.userID, 		//	For now.  Later, same as current system's createdByUserId.
				storeId: 			rgs.storeId,
				savedByUserId: 		userAuth.userID, 		//	For now.  For app dialogs this might always be 0?
				storeName: 			rgs.storeName
			},
			panelSvc: 	rgs.panelSvc,
			root: 		{ 
				svg: 		null,
				data: 		null,
				panelData: 	null,
				panel: 		uc.rootPanel 
			},
			parentPanel: 	uc.rootPanel,
			dlg: 			rgs.dlg,
			board: 			rgs.board,
			panel:  		null,
			panelClick: 	uc.rootPanelClick 
		};
	};	//	getLoadSpec()

	function uduiListItemName() {
		var itemName = 	  		'0'			 		//	Sys Id.  0 for now.
						+ '-' + 'udui-list';
		return itemName;			
	}	//	uduiListItemName()

	function loadUDUIs ( sC ) {
		var sW  = sC + ' loadUDUIs()';
		console.log ( sW );
		uduis = rrLS.getItem ( 'udui', uduiListItemName() );
		if ( ! uduis )
			uduis = {};
	}	//	loadUDUIs()

	function storeUDUIs ( sC ) {
		var sW  = sC + ' storeUDUIs()';
		console.log ( sW );
		rrLS.setItem ( 'udui', uduiListItemName(), uduis );
	}	//	storeUDUIs()

	function getUDUI ( sC, uduiId ) {
		var sW  = sC + ' getUDUI()';
//		console.log ( sW );
		if ( uduis === null ) 
			loadUDUIs ( sW );
		var udui = uduis[uduiId];
		if ( ! udui ) 
			udui = uduis[uduiId] = { nextStoreId: 	uc.FIRST_PANEL_STORE_ID,
									 panels:       	{} };
		return udui;
	}	//	getUDUI()

	function updatePanelList ( sC, uduiId, panelData ) {
		var sW  = sC + ' updatePanelList()';
		console.log ( sW );
		var udui       = getUDUI ( sW, uduiId );
		var storeNames = udui.panels[panelData.storeId];
		if ( storeNames.indexOf ( panelData.storeName ) >= 0 ) 
			return;
		storeNames.push ( panelData.storeName );
		storeUDUIs ( sW );
	}	//	updatePanelList()


	svc.allocPanelStore = function ( uduiId, storeId ) {
		var sW  = serviceId + ' allocPanelStore()';
//		console.log ( sW );
		var udui = getUDUI ( sW, uduiId );
		if ( storeId === 0 )
			storeId = udui.nextStoreId++;
		if ( udui.panels[storeId] === undefined ) {
			udui.panels[storeId] = [];
			storeUDUIs ( sW );
		}
		return storeId;
	};	//	allocPanelStore()


	svc.getPanelList = function ( sC, uduiId ) {
		var sW = sC + ' ' + serviceId + ' getPanelList';
		console.log ( sW );
		var list = [];
		var udui = getUDUI ( sW, uduiId );
		var key, names, n, i;
		for ( key in udui.panels ) {
			names = udui.panels[key];
			n = names.length;
			for ( i = 0; i < n; i++ ) {
				list.push ( { id: key, name: names[i] } );
			}
		}
		return list;
	};	//	getPanelList()


	//	UDUI Panel storage item name (its pretty long) -
	//
	//		 <created-in-sys-id>		the system the panel was created in
	//		-<udui-store-id>			the UDUI the panel was in when it was stored
	//		-<created-by-user-id>		the user that created the panel
	//		-<panel-store-id>			the Id given to the panel when it was created
	//		-<saved-by-user-id>			the user that stored the panel - synonymous with posted-by
	//		-<panel-store-name>			the name given by the user when the panel was stored
	//
	//	Loading ... ?  How to specify all those things -
	//
	//		created-in-sys-id		?
	//		created-by-user-id 		?
	//
	//	Its like selecting a record, or record type.  Need a dialog with lists of systems, 
	//	users to choose from.  Silly.
	//
	//	Root panel -
	//
	//		Goes with the system.  When a system is Shared, for example, there are PEs, etc..
	//		Systems have a posted-by (user) property.
	//
	//	->		That posted-by will apply to the layout too. ?
	//
	//			Same for the created-by.
	//
	//
	//		So, for the root panel -
	//
	//			created-in-sys-id 		==		current system's Id
	//			udui-store-id			==		uc.ROOT_UDUI_ID
	//			created-by-user-id 		==		current system's created-by-user-id
	//			panel-store-id			==		?
	//			saved-by-user-id		==		current system's posted-by-user-id
	//			panel-store-name		==		'RRWebApp'
	//
	//		What about panel-store-id?  For the root panel will it always be some known
	//		value?  Something like -
	//
	//			uc.APP_CLIENT_ROOT_PANEL_STORE_ID	?
	//
	//		i.e., some reserved store Ids

	svc.storePanel = function ( sC, uduiId, panelData ) {
		var sW  = sC + ' ' + serviceId + ' storePanel()';
		console.log ( sW );

		var globalWhiteList = [ 'x', 'y', 'w', 'h', 'scale', 'name', 'eleId', 'childData', 'data', 'text',
			'isMenu', 'itemData', 'ff', 'fs', 'vh', 'type', 'textId', 'sclrX', 'sclrY', 'bSplitPanel',
			'bSaveRect', 'createdInSysId', 'createdByUserId', 'storeId', 'storeName', 'value', 'grid',
			'isEnabled', 'isVisible', 'spaceX', 'spaceY', 'hasBorder', 'class', 'horzAlign', 'vertAlign',
			'docked', 'bMoveRect', 'hasCloseBox', 'bSizeRect', 'bVertSB', 'bHorzSB', 'inputType' ];
		var tableColsWhiteList = [ 'iCol', 'colStyleId', 'divStyleId', 'tdStyleId', 'hasDiv', 'isSplitter' ];

		function setChildPanelStoreNames ( pd0 ) {
			var panel       = pd0.panel;			pd0.panel       = null;		//	Before copying, 
			var parentPanel = pd0.parentPanel;		pd0.parentPanel = null;		//	temporarily undo possible
			var childData   = pd0.childData;		pd0.childData   = null;		//	circular refs.
			var filledBy    = pd0.filledBy;			pd0.filledBy    = null;		//
			var base        = pd0.base;				pd0.base        = null;		//
			var baseData    = pd0.baseData;			pd0.baseData    = null;		//
		//	var pd = angular.copy ( pd0 );										//	Copy 	
			var pd = JSON.parse ( JSON.stringify ( pd0 ) );						//	Copy
			pd0.panel       = panel;											//	Redo ...
			pd0.parentPanel = parentPanel;										//
			pd0.childData   = childData;										//
			pd0.filledBy    = filledBy;											//
			pd0.base        = base;												//
			pd0.baseData    = baseData;											//

			pd.childData = { nextId: 	pd0.childData.nextId,
							 data: 		[] };
			pd0.childData.data.forEach ( function ( ctrl ) { 
				if ( ctrl.type === 'panel' ) {
					if ( ctrl.savedAs ) {
						pd.childData.data.push ( { storeName: 	ctrl.storeName,
												   data:    	null } ); 
						svc.storePanel ( sW, uduiId, ctrl );
					}
					else {
						pd.childData.data.push ( { storeName: 	null,
												   data:    	setChildPanelStoreNames ( ctrl ) } ); 
					}
				}
				else
					pd.childData.data.push ( { storeName: 	null,
											   data:    	ctrl } ); 
			} );
			return pd;		//	Return copy of pd0 with storeName in childData.data.
		}	//	setChildPanelStoreNames()			

		function replacer ( key, value ) {
			if ( this.constructor.name === 'TableData' ) {
				if ( key === 'styles' )
					return JSON.stringify ( value );
				if ( key === 'cols' )
					return JSON.stringify ( value, tableColsWhiteList );
			//	if ( key === 'nextStyleId' )
			//		return value;
			//	if ( key === 'nextColId' )
			//		return value;
				if ( key === 'dwr' )
					return value;
			} 
			if ( key.length === 0 ) 
				return value;
			if ( Array.isArray ( this ) )			//	key will be the string form of the index
				return value;
			if ( globalWhiteList.includes ( key ) )
				return value;
			return undefined;
		}	//	replacer()

		var pd = setChildPanelStoreNames ( panelData );

	//	var s = JSON.stringify ( pd, globalWhiteList );
	//	console.log ( sW + ': data - (length: ' + s.length + ')\n' + s );
	//	s = JSON.stringify ( pd, globalWhiteList, '    ' );
	//	console.log ( sW + ': data -\n' + s );
		var s = JSON.stringify ( pd, replacer );
		console.log ( sW + ': data - (length: ' + s.length + ')\n' + s );
			s = JSON.stringify ( pd, replacer, '    ' );
		console.log ( sW + ': data -\n' + s );

//		rrLS.setItem ( itemType, itemName, s );
//	};	//	storePanel()

		updatePanelList ( sW, uduiId, panelData );

		var itemName =  panelData.createdInSysId 
				+ '-' + uduiId 
				+ '-' + panelData.createdByUserId 
				+ '-' + panelData.storeId
				+ '-' + userAuth.userID
				+ '-' + panelData.storeName;

		rrLS.setItem ( 'udui', itemName, s );
	};	//	storePanel()


	svc.loadPanel = function ( o ) {
		var sW = o.sC + ' ' + serviceId + ' loadPanel()';

		var itemName =  o.itemName.createdInSysId 
				+ '-' + o.itemName.uduiId 
				+ '-' + o.itemName.createdByUserId 
				+ '-' + o.itemName.storeId
				+ '-' + o.itemName.savedByUserId
				+ '-' + o.itemName.storeName;
		
		var item = rrLS.getItem ( 'udui', itemName );

		if ( ! item ) {
			console.log ( sW + ': item not in local storage' );
			return null;
		}
		var s = JSON.stringify ( item );
		console.log ( sW + ' data - (length: ' + s.length + ')\n' + s );

		function buildPanel ( itemD, parentPanel ) {
			var sW2   = sW + ' buildPanel()';
			var panel = null;
			console.log ( sW2 + ':  itemD.name: ' + itemD.name );
		//	if ( itemD.savedAs )
		//		itemD = rrLS.getItem ( 'udui-user-defined', itemD.savedAs );

			function addChildCtrls ( data, panel ) {
				var d, o2, child;
				for ( var i = 0; i < data.length; i++ ) {
					d = data[i];
				//	if ( d.itemName ) {
					if ( d.storeName ) {
						o2 = { 
							sC: 		sW2, 
							itemName: 	{
								createdInSysId: 	d.createdInSysId,
								uduiId: 			uc.ROOT_UDUI_ID, 		//	for now
								createdByUserId: 	d.createdByUserId,
								storeId: 			d.storeId,
								savedByUserId: 		userAuth.userID,		//	for now
								storeName: 			d.storeName
							},
							panelSvc: 	o.svc,
							root: 		{ 
								svg: 		null,
								data: 		null,
								panelData: 	null,
								panel: 		uc.rootPanel
							},
							parentPanel: 	panel,
							dlg: 			null,
							panel:  		null,
							panelClick: 	null 
						};

						data[i] = svc.loadPanel ( o2 ).data;
					}
					else {
						data[i] = d.data;
						buildUDUI ( data[i], panel );
					}
				}
			}	//	addChildCtrls()

			if ( o.root.panel === null ) {
				o.root.panelData = o.panelSvc.restorePanelData ( { x: 			itemD.x, 
																   y: 			itemD.y, 
																   w: 			itemD.w, 
																   h: 			itemD.h, 
																   name: 		itemD.name, 
																   clickCB: 	o.panelClick,
																   bStore: 		true,
																   storeId: 	itemD.storeId,
																   storeName: 	itemD.storeName } );
				o.root.panelData.sclrX = itemD.sclrX;
				o.root.panelData.sclrY = itemD.sclrY;

				o.root.panelData.eleId = itemD.eleId;		//	Normally the parent panel sets this.  Since this 
															//	is the "root" panel (it has no parent) we do it here.
				o.root.data.data = [];
				o.root.data.data.push ( o.root.panelData );
				o.root.panel = o.panelSvc.createPanel ( o.root.svg, o.root.data, true );
				panel = o.root.panel;
			} else {
				//	A child panel.  
				var pd = o.panelSvc.restorePanelData ( { x: 			itemD.x, 
													   	 y: 			itemD.y, 
														 w: 			itemD.w, 
														 h: 			itemD.h, 
														 name: 			itemD.name, 
														 clickCB: 		o.panelClick,
														 bStore: 		true,
														 storeId: 		itemD.storeId,
														 storeName: 	itemD.storeName,
														 docked: 		itemD.docked,
														 bMoveRect: 	itemD.bMoveRect,
														 bSizeRect: 	itemD.bSizeRect,
														 hasCloseBox: 	itemD.hasCloseBox,
														 bVertSB: 		itemD.bVertSB,
														 bHorzSB: 		itemD.bHorzSB } );
				pd.sclrX = itemD.sclrX;
				pd.sclrY = itemD.sclrY;

				if ( o.dlg ) {
					o.dlg.data = pd;
					o.dlg.data.bSaveRect = o.dlg.isBuiltIn;

				//	panel = o.root.panel.appendDialog ( o.dlg );	//	i.e., show it on top of everything else
					//	2017-Aug
				//	panel = parentPanel.appendDialog ( o.dlg );		//	i.e., show it on top of everything else
					//	2018-May-13		appendDialog() must be called on the root panel.
					panel = o.root.panel.appendDialog ( o.dlg );	//	i.e., show it on top of everything else
				} else
				if ( o.board ) {
					o.board.panelData = pd;
					o.board.panelData.bSaveRect   = o.board.isBuiltIn;
					o.board.panelData.hasCloseBox = true;
					switch ( pd.docked ) {
						case 'right':
							o.board.panel = panel = o.root.panel.dockSplitRight ( pd, 	//	expecting Panel here
																				  uc.appPanelClick, 
																				  false ).rightPanel;
							break;
						default:
							o.board.panel = panel = o.root.panel.appendBoard ( o.board );
					}
						
				} else
					panel = parentPanel.addControl ( pd );

				//	Split?
				if ( itemD.bSplitPanel ) {
					var id0 = itemD.childData.data[0];
					var pd0 = o.panelSvc.createPanelData ( id0.x, id0.y, id0.w, id0.h, id0.name, o.panelClick );
					pd0.sclrX = id0.sclrX;
					pd0.sclrY = id0.sclrY;

					var sd = uSplitter.createSplitterData ( itemD.childData.data[1] );

					var id2 = itemD.childData.data[2];
					var pd2 = o.panelSvc.createPanelData ( id2.x, id2.y, id2.w, id2.h, id2.name, o.panelClick );
					pd2.sclrX = id2.sclrX;
					pd2.sclrY = id2.sclrY;

					panel.restoreSplit ( pd0, sd, pd2 );

					addChildCtrls ( id0.childData.data, pd0.panel );

					addChildCtrls ( id2.childData.data, pd2.panel );

					return panel;
				}
			}

			if ( o.ctrls === 'none' )
				return panel;

			addChildCtrls ( itemD.childData.data, panel );

			return panel;
		}	//	buildPanel()

		function buildButton ( itemD, panel ) {
		//	panel.addControl ( uButton.createButtonData ( { x: 			itemD.x, 
		//													y: 			itemD.y, 
		//													w: 			itemD.w, 
		//													h: 			itemD.h, 
		//													name: 		itemD.name, 
		//													text: 		itemD.text } ) );
			itemD.eleId = 0;
			itemD.shiftClickCB = uShiftClick.shiftClickButton;
			panel.addControl ( uButton.createButtonData ( itemD ) );
		}	//	buildButton()

		function buildLabel ( itemD, panel ) {
		//	panel.addControl ( uLabel.createLabelData ( { x: 	itemD.x, 
		//												  y: 	itemD.y, 
		//												  w: 	itemD.w, 
		//												  h: 	itemD.h, 
		//												  name: itemD.name, 
		//												  text: itemD.text,
		//												  ff: 	itemD.ff,
		//												  fs: 	itemD.fs,
		//												  vertAlign: itemD.vertAlign,
		//												  horzAlign: itemD.horzAlign } ) );
			itemD.eleId = 0;
			itemD.shiftClickCB = uShiftClick.shiftClickLabel;
			panel.addControl ( uLabel.createLabelData ( itemD ) );
		}	//	buildLabel()

		function buildCheckBox ( itemD, panel ) {
			panel.addControl ( uCheckbox.createCheckBoxData ( { x: 		itemD.x, 
														  		y: 		itemD.y, 
																w: 		itemD.w, 
																h: 		itemD.h, 
																name: 	itemD.name, 
																text: 	itemD.text,
																value: 	itemD.value } ) );
		}	//	buildCheckBox()

		function buildList ( itemD, panel ) {
			itemD.eleId = 0;
			var list = panel.addControl ( uList.createListData ( itemD ) );

			var i, a = itemD.itemData;

			for ( i = 0; i < a.length; i++ ) {
				var id = a[i];
				list.data.itemData.push ( uList.createListItemData ( id.textId, id.text ) );
			}
			list.update();
		}	//	buildList()

		function buildInput ( itemD, panel ) {
			panel.addControl ( uInput.createInputData ( { x: 			itemD.x, 
														  y: 			itemD.y, 
														  w: 			itemD.w, 
														  h: 			itemD.h, 
														  name: 		itemD.name, 
														  value: 		itemD.value,
														  inputType: 	itemD.inputType } ) );
		}	//	buildInput()

		function buildTextarea ( itemD, panel ) {
			itemD.eleId = 0;			
			panel.addControl ( uTextarea.createTextareaData ( itemD ) );
		}	//	buildTextarea()

		function buildTable ( itemD, panel ) {
			var styles = JSON.parse ( itemD.styles );	itemD.styles = [];
			var cols   = JSON.parse ( itemD.cols );		itemD.cols   = [];
			var tableD = uTable.createTableData ( { x: 		itemD.x, 
													y: 		itemD.y, 
													w: 		itemD.w, 
													h: 		itemD.h, 
													name: 	itemD.name,
													dwr: 	itemD.dwr } );
			styles.forEach ( function ( style ) {
				tableD.createStyle ( style );
			} );
			cols.forEach ( function ( col ) {
				tableD.createColumn ( col );
			} );
			panel.addControl ( tableD );
		}	//	buildTable()

		function buildUDUI ( itemD, panel ) {
			if ( itemD.type === uc.TYPE_PANEL ) 
				return buildPanel ( itemD, panel );
			else
			if ( itemD.type === uc.TYPE_BUTTON )
				buildButton ( itemD, panel );
			else
			if ( itemD.type === uc.TYPE_LABEL )
				buildLabel ( itemD, panel );
			else
			if ( itemD.type === uc.TYPE_CHECKBOX )
				buildCheckBox ( itemD, panel );
			else
			if ( itemD.type === uc.TYPE_LIST )
				buildList ( itemD, panel );
			else
			if ( itemD.type === uc.TYPE_INPUT )
				buildInput ( itemD, panel );
			else
			if ( itemD.type === uc.TYPE_TEXTAREA )
				buildTextarea ( itemD, panel );
			else
			if ( itemD.type === uc.TYPE_TABLE )
				buildTable ( itemD, panel );
			return null;
		}

		o.panel = buildUDUI ( item, o.parentPanel ? o.parentPanel : o.root.panel );

	};	//	loadPanel()

	return svc;

})();
