

//	filename: what?
//
//	these are not really "dialogs" ...
//
//	->	panel	   					can't be just "panel"
//		modalless dialog  			to much
//		pane?
//		props						to specific
//		frame						no
//	->	board						mmm ...
//		sheet
//		control values
//		panel implementation
//		panel use
//		occupied panel
//		populated panel
//		app panel
//		applied panel
//		controls

'use strict';

//	For now -
//
//	app/partials/udui/udui-boards-a.js

//	These are not dialogs where other parts of the app are screened so
//	that the user can not interact with them while the dialog is active.
//
//	Instead these are displayed - either floating or docked - and possibly
//	left showing when the user is not interacting with them - to control 
//	some ... and/or modify something.  And these might be used to show 
//	status - values - of something - i.e., some controls in these may be
//	"read only".

module.exports = (function() { 

	var uc = 			require ( './udui-common.js' );
//	var uSL = 			require ( './udui-store-load-a.js' );
//	var upanel = 		require ( './udui-panel-f.js' );
	var uTable = 		require ( './udui-table-a.js' );

	var serviceId = 'uduiBoardsA';

	/* jshint validthis: true */

	var svc = {};

	svc.propertiesBoard = null;
//	svc.propertiesTableDesign = {};
	svc.propertiesTable = null;

	function createPropertiesTable ( rgs ) {
		var sW  = serviceId + ' createPropertiesTable()';
		var rpd = uc.rootPanel.data;
		var uSL    = uc.storeLoadSvc;	//	2018-May-07
		var uPanel = uc.panelSvc;		//	2018-May-07
		
		var	board = { isBuiltIn: 		true,
	//				  invokingPanel: 	rgs.forPanel,
					  panelData:		null,
					  panel: 			null };
		var tableName = 'tblProps';
		var tableD, panel;		//	Properties Table

		//	two columns' width is adjusted by designating a middle column that splits the
		//	the two - the middle column's width is small and fixed - the user drags it like
		//	a splitter
		var nCols    = 3;				//	total number of table columns
		var nAdjCols = nCols - 1;		//	number of columns whose width is adjustable
		var adjColW  = 40;				//	starting width of all adjustable columns

		//	3 is the paddingLeft of all cells (see CSS .u34-table-fo-body-div-table tbody tr td)
		var tableW = (nCols * 3) + (nAdjCols * adjColW);	

		var panelW = tableW + 16;		//	+ 16 for the panel's borders and vertical "scroll bar"
		//
		//	or, if panelW is specified, then -
		//		
		//		adjColW = (panelW - 16 - (nCols * 3)) / nAdjCols;

		var w = panelW;
		var h = 150;
		var x = Math.round ( (rpd.w - w) / 2 );
		var y = Math.round ( (rpd.h - h) / 2 );

		function onClose() {
			var sW = serviceId + ' onClose()';
			uSL.storePanel ( sW, uc.ROOT_UDUI_ID, svc.propertiesBoard.panelData );
	//		svc.propertiesTableDesign = {};
			svc.propertiesTable = null;
			svc.propertiesBoard = null;
		}	//	onClose()

		var o = uSL.getLoadSpec ( { sW: 		sW, 
									uduiId: 	rgs.uduiId, 
									panelSvc: 	uPanel, 
									dlg: 		null, 
									board: 		board,
									storeId: 	uc.PROPERTIES_BOARD_STORE_ID, 
									storeName: 	uc.PROPERTIES_BOARD_STORE_NAME } );
	//	o.ctrls = 'none';		//	do not load child controls. just the panel.
		uSL.loadPanel ( o );
		if ( ! o.panel ) {
			board.panelData = uPanel.createAppPanelData ( { x: 				x + uc.OFFS_4_1_PIX_LINE, 
															y: 				y + uc.OFFS_4_1_PIX_LINE, 
															w: 				w, 
															h: 				h, 
															name: 			'pnlProperties', 
															clickCB: 		uc.appPanelClick, 
															storeId: 		uc.PROPERTIES_BOARD_STORE_ID,
															storeName: 		uc.PROPERTIES_BOARD_STORE_NAME,
															hasCloseBox: 	true,
															closeCB: 		onClose } );

			board.panelData.bSaveRect = board.isBuiltIn;

			board.panel = uc.rootPanel.appendBoard ( board );

			tableD = uTable.createTableData ( { x: 			0,  
												y: 			0, 
												w: 			60,  
												h: 			60, 
												name: 		tableName } );

			var	styleCell0div = tableD.createStyle ( { name: 'styleCell0div' } );
				styleCell0div.list.push ( { property: 'display',    value: 'inline-block' } );
				styleCell0div.list.push ( { property: 'overflowX',  value: 'hidden' } );
				styleCell0div.list.push ( { property: 'paddingTop', value: '4px' } );
				styleCell0div.list.push ( { property: 'width',      value: '' + adjColW + 'px' } );
				styleCell0div.list.push ( { property: 'whiteSpace', value: 'nowrap' } );
			var	styleCell0td = tableD.createStyle ( { name: 'styleCell2td' } );					//	should be 'styleCell0td' ?
				styleCell0td.list.push ( { property: 'borderRight', value: 'transparent' } );
			var	styleCell1td = tableD.createStyle ( { name: 'styleCell1td' } );
				styleCell1td.list.push ( { property: 'borderLeft',      value: 'none' } );
				styleCell1td.list.push ( { property: 'borderRight',     value: 'none' } );
				styleCell1td.list.push ( { property: 'cursor',          value: 'col-resize' } );
				styleCell1td.list.push ( { property: 'backgroundColor', value: 'lightgray' } );
			var	styleCell2div = tableD.createStyle ( { name: 'styleCell2div' } );
				styleCell2div.list.push ( { property: 'display',    value: 'inline-block' } );
				styleCell2div.list.push ( { property: 'overflowX',  value: 'hidden' } );
				styleCell2div.list.push ( { property: 'paddingTop', value: '4px' } );
				styleCell2div.list.push ( { property: 'width',      value: '' + adjColW + 'px' } );
			var	styleCell2td = tableD.createStyle ( { name: 'styleCell2td' } );
				styleCell2td.list.push ( { property: 'borderLeft', value: 'transparent' } );

			tableD.createColumn ( { iCol: 			0, 
									name: 			'property-name',
									colStyleId:		0,
									divStyleId: 	styleCell0div.id,
									tdStyleId: 		styleCell0td.id,
									hasDiv: 		true,
									isSplitter: 	false } );
			tableD.createColumn ( { iCol: 			1, 
									name: 			'splitter',
									colStyleId: 	0,
									divStyleId: 	0,
									tdStyleId: 		styleCell1td.id,
									hasDiv: 		false,
									isSplitter: 	true } );
			tableD.createColumn ( { iCol: 			2, 
									name: 			'property-value',
									colStyleId: 	0,
									divStyleId: 	styleCell2div.id,
									tdStyleId: 		styleCell2td.id,
									hasDiv: 		true,
									isSplitter: 	false } );
		} else {
			tableD = board.panelData.getControl ( uc.TYPE_TABLE, tableName );
			board.panelData.closeCB = onClose;
		}

		svc.propertiesBoard = board;

		return tableD;
	}	//	createPropertiesTable()

	svc.showPropertiesBoard = function ( rgs ) {
		var sW = rgs.sC + ' ' + serviceId + ' showPropertiesBoard()';

		var o, tableD = null, board = null;

		if ( ! svc.propertiesTable ) 
			tableD = createPropertiesTable ( rgs );
		else
			tableD = svc.propertiesTable.data;

		board = svc.propertiesBoard;

		tableD.rows = [];		//	in the table.update() the existing <tr> elements will be removed

		var i = 0, cells, 
		//	ptd   = svc.propertiesTableDesign,
			props = rgs.ofCtrlD.listProperties();		//, r;

		for ( i = 0; i < props.length; i++ ) {
			cells = [ tableD.createCell ( { iCol: 0, iRow: i }, { text: props[i].displayName } ),      
					  tableD.createCell ( { iCol: 1, iRow: i }, { isSplitter: true } ),
					  tableD.createCell ( { iCol: 2, iRow: i }, { input: { value: '' + props[i].value } } ) ];
			tableD.createRow ( { cells: cells } );
		}	



		if ( ! svc.propertiesTable ) {
			tableD.fillsPanel = true;
			if ( tableD.table ) {			//	board was probably just loaded from storage
				svc.propertiesTable = tableD.table;
				svc.propertiesTable.update ( { bFirstUpdate: true } );		//	first update after rows added
				//
				//	note - "first update" is probably a misnomer - one of the important things done in
				//			update() is calculating the relative sizes of columns if those sizes have not
				//			already been calculated
				//
				//	if rows previously existed then the column widths will already have been set so update()
				//	does not need to calculate relative column widths - in fact, we probably want those to be 
				//	as they were for the previous rows
				//	
				//	if the board has just been loaded from storage update() will have been called when the
				//	table was defined - so this will not be the first update() call - but at the first call
				//	no rows will have been defined and therefore update() could not have set the relative 
				//	column widths - so, here, we call update() again, after the rows are added, as if it is the 
				//	first update.
			}
			else
				svc.propertiesTable = board.panel.addControl ( tableD );
			board.panelData.filledBy = svc.propertiesTable;	
		} else
			svc.propertiesTable.update();

		board.panelData.onSize ( board.panelData, -1, null, 0, 0 );

		function update ( name, value ) {
			var i, sW = serviceId + ' update()';
			for ( i = 0; i < props.length; i++ )
				if ( props[i].property === name ) {
					tableD.setCell ( i, 2, value );
					break;
				}
		}	//	update()

		function onInput ( cellD, value ) {
			var name = props[cellD.iRow].property;
			rgs.ofCtrlD.setProperty ( name, value );
		}	//	onInput()

		function onChange ( cellD, value ) {

		}	//	onChange()

		rgs.ofCtrlD.propCB = update;

		svc.propertiesTable.data.setTitle ( rgs.title );

		svc.propertiesTable.data.inputCB  = onInput;
		svc.propertiesTable.data.changeCB = onChange;

		uc.testSetOutput ( JSON.stringify ( { propertiesPanelEleId: board.panelData.eleId } ) );

	};	//	showPropertiesBoard()

	return svc;

})();
