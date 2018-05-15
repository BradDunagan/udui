'use strict';

//  app/partials/udui/udui-shift-click-a.js

//	Clicking on a control while holding the shift key down pops up a menu.
//
//	The menu items will depend on the control.
//
//	This functionality for the panel was implemented in the shiftClickPanel() function
//	of bootstrap.js.

module.exports = (function() { 

	var d3 = 			require ( 'd3' );
	var uc = 			require ( './udui-common.js' );
	var uCD = 			require ( './udui-control-data-a.js' );
	var uBoards = 		require ( './udui-boards-a.js' );

	var uButton = 		require ( './udui-button-e.js' );
	var uList = 		require ( './udui-list-b.js' );
	var uInput = 		require ( './udui-input-b.js' );
	var uLabel = 		require ( './udui-label-b.js' );
	var uCheckbox = 	require ( './udui-checkbox-b.js' );
	var uTabs = 		require ( './udui-tabs-a.js' );
	var uTable = 		require ( './udui-table-a.js' );
	var uTextarea = 	require ( './udui-textarea-a.js' );
//	var uPanel =		require ( './udui-panel-f.js' );
	var uDialog =		require ( './udui-dialogs-a.js' );

	var serviceId = 'uduiTextareaA';

	/* jshint validthis: true */

	var svc = {};


	svc.shiftClickPanel = function ( panelData, baseX, baseY ) {
		var sW  = serviceId + ' shiftClickPanel()';
		var lcl = uc.localXY ( panelData, event.clientX, event.clientY, baseX, baseY );

		console.log ( sW + '  root panel eleId: ' + uc.rootPanel.data.eleId + '  X Y: ' + lcl.x + '  ' + lcl.y );

		var uPanel = uc.panelSvc;		//	2018-May-07

		//	Want to bring up a dialog.  As in udui-dialog-a-directive.js.
		//
		//	But - instead of screening the invoking panel - we -
		//
		//		Screen all  * but *  the invoking panel.  
		//
		//		This dialog is intended to edit the controls on the invoking dialog.
		//
		//		Put the invoking panel on top of the Z order (it might be already).
		//
		//		Put this dialog on top of the invoking panel (on top of everything).
		//
		//	The invoking panel can not be the root panel.  The root panel's controls 
		//	can only be sized and moved.  The root panel's controls, therefore, do not
		//	require this dialog.  Right?

		var	screenPanel = null;		//	A screen for the popup menu - it might be transparent -
	//	var menuX = event.clientX - uc.offsX;		2018-May-07		See below.
	//	var menuY = event.clientY - uc.offsY;
		var listMenu = null;

		function clickScreen ( d, i, ele ) {
			var sW = serviceId + ' shiftClickPanel()  clickScreen()';
			console.log ( sW );
			uc.downAppScreen();		//	The menu is removed because it is a child of the screen.
		}	//	clickScreen()

		//	Use a panel for the screen (a kind of a shield) - so that -
		//
		//		the list is a child of the screen
		//
		//		the list can be moved by panning this screen panel
		//
		screenPanel = uc.upAppScreen ( { sc: 			sW,
									//	 panelSvc: 		uPanel,
										 clickCB: 		clickScreen,
										 baseClass: 	'u34-popupmenu-screen' } );

		//	2018-May-07 	Menu location relative to screen panel.
		var scn = uc.localXY ( screenPanel.data, event.clientX, event.clientY, baseX, baseY );										 
		var menuX = scn.x;			//	2018-May-07		uc.localXY() considers container pos
		var menuY = scn.y;			//	2018-May-07		uc.localXY() considers container pos

		//	A menu -
		//
		//		Add Control 		>	Button
		//								Edit
		//								Label
		//								List
		//								Panel
		//		Properties ...
		//
		//	Implement a Menu with a List control -
		//
		//		Each item in the list is a Menu Item.
		//
		//		Submenus are additional lists.
		//
		//	Arrow keys and menu item hot keys select a menu item.
		//
		//	The list disappears when the user -
		//
		//		Clicks anywhere
		//		or
		//		Hits the Esc key
		//		or
		//		Hits a menu item hot key or Enter

	//	//	Remove the menu -
	//	if ( listMenu ) {
	//		removeMenu();
	//		return;
	//	}

		function removeMenu() {
			var sW = serviceId + ' shiftClickPanel() removeMenu()';
	//			console.log ( sW );
	//		panelData.panel.rmvControl ( listMenu );
	//		uc.rootPanel.rmvControl ( screenPanel );
			uc.downAppScreen();		screenPanel = null;
			listMenu = null;
		}	//	removeMenu()

		function itemClick ( itemData ) {
			var sW = serviceId + ' shiftClickPanel() itemClick()';
			var ld = itemData.ld,					//	ld: listData
				subListData, subMenu, subX, subY;
			event.stopPropagation();
	//			console.log ( sW + ': ' + itemData.text );

			function subItemClick ( subItemData ) {
				var sW = serviceId + ' shiftClickPanel() itemClick() subItemClick()';
				event.stopPropagation();
	//				console.log ( sW + ': ' + subItemData.text );

				var rrePanel = null;

	//			function splitHorz() {
	//				var sW = serviceId + ' shiftClickPanel() itemClick() subItemClick() splitHorz()';
	//			//		console.log ( sW );
	//				rrePanel.splitHorz();
	//			}	//	splitHorz()

	//			function splitVert() {
	//				var sW = serviceId + ' shiftClickPanel() itemClick() subItemClick() splitVert()';
	//			//		console.log ( sW );
	//				rrePanel.splitVert ( shiftClickPanel );
	//			}	//	splitVert()

				removeMenu();

				if ( subItemData.textId === 'button' ) {
					var buttonD = uButton.createButtonData ( 
						{ x: lcl.x, y: lcl.y, w: 75, h: 25, name: 'btnNew', text: 'New Button!', shiftClickCB: svc.shiftClickButton } );
					panelData.panel.addControl ( buttonD );
					buttonD.showPropertiesBoard ( 'New Button' );
				}
				else
				if ( subItemData.textId === 'checkbox' ) {
					var checkboxD = uCheckbox.createCheckBoxData ( 
						{ x: lcl.x, y: lcl.y, w: 100, h: 25, name: 'chkNew', text: 'New Checkbox' } );
					panelData.panel.addControl ( checkboxD );
					checkboxD.showPropertiesBoard ( 'New Checkbox' );
				}
				else
				if ( subItemData.textId === 'input' ) {
					var inputD = uInput.createInputData ( 
						{ x: lcl.x, y: lcl.y, w: 60, h: 30, name: 'edtNew', value: '' } );
					panelData.panel.addControl ( inputD );
			//		inputD.showPropertiesBoard ( 'New Input' );				disable while developing/testing tabs
				}
				else
				if ( subItemData.textId === 'label' ) {
					var labelD = uLabel.createLabelData ( 
						{ x: lcl.x, y: lcl.y, w: 75, h: 15, name: 'lblNew', text: 'new label', shiftClickCB: svc.shiftClickLabel } );
					panelData.panel.addControl ( labelD );
			//		labelD.showPropertiesBoard ( 'New Label' );				disable while developing/testing tabs
				}
				else
				if ( subItemData.textId === 'textarea' ) {
					var textareaD = uTextarea.createTextareaData ( 
						{ x: lcl.x, y: lcl.y, w: 60, h: 30, name: 'txtNew', value: 'Wala. Textarea!' } );
					panelData.panel.addControl ( textareaD );
			//		textareaD.showPropertiesBoard ( 'New Textarea' );			disable while developing/testing tabs
				}
				else
				if ( subItemData.textId === 'list' ) {
					var listD = uList.createListData (
						{ x: lcl.x, y: lcl.y, w: 75, h: 100, name: 'lstNew' } );
					var list = panelData.panel.addControl ( listD );
					list.data.itemData.push ( uList.createListItemData ( 'bug-howard', 'Bug Howard' ) );
					list.data.itemData.push ( uList.createListItemData ( 'les-miles', 'Les Miles' ) );
					list.data.itemData.push ( uList.createListItemData ( 'ralph', 'Ralph' ) );
					list.data.itemData.push ( uList.createListItemData ( 'waldo', 'Waldo' ) );
					list.data.itemData.push ( uList.createListItemData ( 'emerson', 'Emerson' ) );
					list.data.itemData.push ( uList.createListItemData ( 'grace', 'Grace' ) );
					list.data.itemData.push ( uList.createListItemData ( 'hopper', 'Hopper' ) );
					list.data.itemData.push ( uList.createListItemData ( 'brad-dunagan', 'Brad Dunagan' ) );
					list.data.itemData.push ( uList.createListItemData ( 'linus', 'Linus' ) );
					list.data.itemData.push ( uList.createListItemData ( 'elija', 'Elija' ) );
					list.data.itemData.push ( uList.createListItemData ( 'bart', 'Bart' ) );
					list.data.itemData.push ( uList.createListItemData ( 'rosco', 'Rosco' ) );
					list.data.itemData.push ( uList.createListItemData ( 'jake', 'Jake' ) );
					list.update();
			//		listD.showPropertiesBoard ( 'New List' );				disable while developing/testing tabs
				}
				else
				if ( subItemData.textId === 'tabs' ) {
					var tabsD = uTabs.createTabsData ( 
						{ x: lcl.x, y: lcl.y, w: 150, h: 150, name: 'tabsNew', panelSvc: uPanel } );
					panelData.panel.addControl ( tabsD );
					tabsD.showPropertiesBoard ( 'New Tab' );
				}
				else
				if ( subItemData.textId === 'table' ) {
					var tableD = uTable.createTableData ( 
						{ x: lcl.x, y: lcl.y, w: 175, h: 115, name: 'tblNew' } );
					var table = panelData.panel.addControl ( tableD );

	//					console.log ( sW + ': created table ' + table.name );
				}
				else
				if ( subItemData.textId === 'panel' ) {
					var panelD = uPanel.createPanelData ( 
						{ x: 			lcl.x + uc.OFFS_4_1_PIX_LINE,
						  y: 			lcl.y + uc.OFFS_4_1_PIX_LINE, 
						  w: 			400, 
						  h: 			170, 
						  name: 		'pnlNew', 
						  hasCloseBox: 	true,
						  clickCB: 		svc.shiftClickPanel } );
					rrePanel = panelData.panel.addControl ( panelD );
				//	//	Controls on it.
				//	rrePanel.addControl ( uButton.createButtonData ( { x: 		150,  
				//													   y: 		20, 
				//													   w: 		130,  
				//													   h: 		30, 
				//													   name: 	'btnA', 
				//													   text: 	'clip - Btn A - clip' } ) );
				//	rrePanel.addControl ( uButton.createButtonData ( { x: 		50,  
				//													   y: 		50,  
				//													   w: 		70,  
				//													   h: 		30, 
				//													   name: 	'btnB', 
				//													   text: 	'Btn B' } ) );
				//	rrePanel.addControl ( uButton.createButtonData ( { x: 		130, 
				//													   y: 		100,  
				//													   w: 		70,  
				//													   h: 		30, 
				//													   name: 	'btnC', 
				//													   text: 	'Btn C' } ) );

				//	splitVert();			//	Just go ahead and split it.  Controls will be on the top panel.
				//	splitHorz();
				//	rrePanel.splitHorz ( svc.shiftClickPanel );
				}
			}	//	subItemClick()
			
			subX = ld.w;
			subY = 0;
			if ( itemData.textId === 'grid' ) {
				removeMenu();
				uDialog.showGridDialog ( { sC: 			sW,
										   uduiId: 		uc.ROOT_UDUI_ID, 
										   forPanel: 	panelData.panel } );
			}
			else
			if ( itemData.textId === 'add-control' ) {
				subListData = uList.createListData ( { x: 		subX, 
													   y: 		subY,  
													   w: 		100,  
													   h: 		100, 
													   name: 	'add-control',
													   isMenu: 	true,
													   cb: 		subItemClick } );
				subMenu = listMenu.addSubMenu ( subListData );
				subMenu.data.itemData.push ( uList.createListItemData ( 'button',   '[B]utton' ) );
				subMenu.data.itemData.push ( uList.createListItemData ( 'checkbox', '[C]heckbox' ) );
				subMenu.data.itemData.push ( uList.createListItemData ( 'input',    '[I]nput' ) );
				subMenu.data.itemData.push ( uList.createListItemData ( 'label',    '[L]abel' ) );
				subMenu.data.itemData.push ( uList.createListItemData ( 'textarea', 'Te[x]tarea' ) );
				subMenu.data.itemData.push ( uList.createListItemData ( 'list',     'Li[s]t' ) );
				subMenu.data.itemData.push ( uList.createListItemData ( 'panel',    '[P]anel' ) );
				subMenu.data.itemData.push ( uList.createListItemData ( 'tabs',     '[T]abs' ) );
				subMenu.data.itemData.push ( uList.createListItemData ( 'table',    'T[a]ble' ) );

				subMenu.update();
			}
			else
			if ( itemData.textId === 'properties' ) {
				removeMenu();
			//	uDialog.showPropertiesDialog ( { sC: 		sW,
			//									 udui: 		uc.ROOT_UDUI_ID, 
			//									 forPanel: 	panelData.panel } );
				panelData.showPropertiesBoard ( 'Panel Properties' );
			}
			else
			if ( itemData.textId === 'delete' ) {
				removeMenu();
				if ( panelData.parentPanel )
					panelData.parentPanel.rmvControl ( panelData.panel );
				else
				if ( panelData.parent && (panelData.parent.constructor.name === 'Tabs') )
					panelData.parent.rmvTab ( panelData.panel );

			}
			else
			if ( itemData.textId === 'save' ) {
				removeMenu();
				panelData.panel.saveToLS();
			}
			else
			if ( itemData.textId === 'load' ) {
				removeMenu();
				panelData.panel.loadFromLS();
			}
			else
			if ( itemData.textId === 'copy' ) {
				removeMenu();

			}
			else
			if ( itemData.textId === 'paste' ) {
				removeMenu();

			}
			else
			if ( itemData.textId === 'split-horz' ) {
				removeMenu();
				panelData.panel.splitHorz ( svc.shiftClickPanel );
			}
			else
			if ( itemData.textId === 'split-vert' ) {
				removeMenu();
				panelData.panel.splitVert ( svc.shiftClickPanel );
			}

		}	//	itemClick()

		//	Create and show the menu -
	//	var listD = uList.createListData ( { x: 		lcl.x, 
	//										 y: 		lcl.y,  
		var listD = uList.createListData ( { x: 		menuX - uc.MOVE_HANDLE_WIDTH  - 4,	//	to avoid the pointer 
											 y: 		menuY - uc.MOVE_HANDLE_HEIGHT - 2, 	//	being on the move box
											 w: 		140,  
											 h: 		160, 
						 					 name: 	  	'menuA',
											 isMenu: 	true,
											 cb: 		itemClick } );
	//	listMenu = panelData.panel.addControl ( listD );
		listMenu = screenPanel.addControl ( listD );

	//		console.log ( sW + ' listMenu eleId: ' + listMenu.data.eleId );

		listMenu.data.itemData.push ( uList.createListItemData ( 'grid',        '[G]rid ...' ) );
		listMenu.data.itemData.push ( uList.createListItemData ( 'add-control', '[A]dd Control >' ) );
		listMenu.data.itemData.push ( uList.createListItemData ( 'properties',  '[P]roperties ...' ) );
		if ( panelData.parentPanel )
			listMenu.data.itemData.push ( uList.createListItemData ( 'delete',      '[D]elete' ) );
		else
		if ( panelData.parent && (panelData.parent.constructor.name === 'Tabs') )
			listMenu.data.itemData.push ( uList.createListItemData ( 'delete',      '[D]elete Tab' ) );
		listMenu.data.itemData.push ( uList.createListItemData ( 'save',        '[S]ave ...' ) );
		listMenu.data.itemData.push ( uList.createListItemData ( 'load',        '[L]oad' ) );
		listMenu.data.itemData.push ( uList.createListItemData ( 'copy',        '[C]opy' ) );
		listMenu.data.itemData.push ( uList.createListItemData ( 'paste',       'Pas[t]e' ) );
		listMenu.data.itemData.push ( uList.createListItemData ( 'split-horz',  'Split [H]orizontally' ) );
		listMenu.data.itemData.push ( uList.createListItemData ( 'split-vert',  'Split [V]ertically' ) );

		listMenu.update();

		console.log ( sW + ' list: ' + listD.jsonize() );

		uc.testSetOutput ( JSON.stringify ( { menuListEleId: listD.eleId } ) );

	};	//	shiftClickPanel()

	function createMenu ( sW, itemClick, items ) {
		var menuX = event.clientX - uc.offsX;
		var menuY = event.clientY - uc.offsY;

		//	Use a panel for the screen (a kind of a shield) - so that -
		//
		//		the list is a child of the screen
		//
		//		the list can be moved by panning this screen panel
		//
		function clickScreen ( d, i, ele ) {
			var sW = serviceId + ' createMenu()  clickScreen()';
			console.log ( sW );
			uc.downAppScreen();		//	The menu is removed because it is a child of the screen.
		}	//	clickScreen()

		var screenPanel = uc.upAppScreen ( { sc: 			sW,
											 clickCB: 		clickScreen,
											 baseClass: 	'u34-popupmenu-screen' } );

		var listD = uList.createListData ( { x: 		menuX - uc.MOVE_HANDLE_WIDTH  - 4,	//	to avoid the pointer 
											 y: 		menuY - uc.MOVE_HANDLE_HEIGHT - 2, 	//	being on the move box
											 w: 		140,  
											 h: 		160, 
						 					 name: 	  	'menuA',
											 isMenu: 	true,
											 cb: 		itemClick } );
		var listMenu = screenPanel.addControl ( listD );


		for ( var i = 0; i < items.length; i++ ) {
			var item = items[i];
			listMenu.data.itemData.push ( uList.createListItemData ( item.textId, item.text ) );
		}

		listMenu.update();

	}	//	createMenu()

	function removeMenu() {
		uc.downAppScreen();
	}	//	removeMenu()

	svc.shiftClickButton = function ( buttonData ) {
		var sW  = serviceId + ' shiftClickButton()';

		var menuX = event.clientX - uc.offsX;
		var menuY = event.clientY - uc.offsY;

		function clickScreen ( d, i, ele ) {
			var sW = serviceId + ' shiftClickButton()  clickScreen()';
			console.log ( sW );
			uc.downAppScreen();		//	The menu is removed because it is a child of the screen.
		}	//	clickScreen()

		//	Use a panel for the screen (a kind of a shield) - so that -
		//
		//		the list is a child of the screen
		//
		//		the list can be moved by panning this screen panel
		//
		var screenPanel = uc.upAppScreen ( { sc: 			sW,
											 clickCB: 		clickScreen,
											 baseClass: 	'u34-popupmenu-screen' } );

		function removeMenu() {
			uc.downAppScreen();		screenPanel = null;
			listMenu = null;
		}	//	removeMenu()

		function itemClick ( itemData ) {
			var sW = serviceId + ' shiftClickButton() itemClick()';
			var ld = itemData.ld,					//	ld: listData
				subListData, subMenu, subX, subY;
			event.stopPropagation();
	//			console.log ( sW + ': ' + itemData.text );

			
			if ( itemData.textId === 'properties' ) {
				removeMenu();
			//	uBoards.showPropertiesBoard ( { sC: 		sW,
			//									uduiId:		uc.ROOT_UDUI_ID, 
			//									ofCtrlD: 	buttonData,
			//									title: 		'Edit Button' } );
				buttonData.showPropertiesBoard ( 'Edit Button' );
			}
			else
			if ( itemData.textId === 'delete' ) {
				removeMenu();
				buttonData.parentPanel.rmvControl ( buttonData );
			}
			else
			if ( itemData.textId === 'copy' ) {
				removeMenu();

			}

		}	//	itemClick()

		var listD = uList.createListData ( { x: 		menuX - uc.MOVE_HANDLE_WIDTH  - 4,	//	to avoid the pointer 
											 y: 		menuY - uc.MOVE_HANDLE_HEIGHT - 2, 	//	being on the move box
											 w: 		140,  
											 h: 		160, 
						 					 name: 	  	'menuA',
											 isMenu: 	true,
											 cb: 		itemClick } );
		var listMenu = screenPanel.addControl ( listD );

	//	console.log ( sW + ' listMenu eleId: ' + listMenu.data.eleId );

		listMenu.data.itemData.push ( uList.createListItemData ( 'properties',  '[P]roperties ...' ) );
		listMenu.data.itemData.push ( uList.createListItemData ( 'delete',      '[D]elete' ) );
		listMenu.data.itemData.push ( uList.createListItemData ( 'copy',        '[C]opy' ) );

		listMenu.update();

	};	//	shiftClickButton()

	svc.shiftClickLabel = function ( labelData ) {
		var sW  = serviceId + ' shiftClickLabel()';

		function itemClick ( itemData ) {
			event.stopPropagation();
			removeMenu();
			switch ( itemData.textId ) {
				case 'properties': 	labelData.showPropertiesBoard ( 'Edit Label' );		break;
				case 'delete': 		labelData.parentPanel.rmvControl ( labelData );		break;
				case 'copy': 															break;
			}
		}	//	itemClick()

		var items = [
			{ textId: 'properties',  text: '[P]roperties ...' },
			{ textId: 'delete',      text: '[D]elete' },
			{ textId: 'copy',        text: '[C]opy' }
		];
		createMenu ( sW, itemClick, items );

	};	//	shiftClickLabel()

	return svc;

})();
