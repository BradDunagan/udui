'use strict';

//  app/partials/udui/udui-table-a.js

//	Maybe see -
//
//		Fiddle - SVG Table (using d3)
//		http://jsfiddle.net/christopheviau/v6VMf/
//
//		D3 Dynamic Array of Tables
//		https://bl.ocks.org/boeric/e16ad218bc241dfd2d6e

module.exports = (function() { 

	var d3 = 	require ( 'd3' );
	var uc = 	require ( './udui-common.js' );
//	var uCD = 	require ( './udui-control-data-a.js' );

	var serviceId = 'uduiTableA';

	/* jshint validthis: true */

	var svc = {};

	var builtInStyles = {
		divStatic: 		new StyleData ( { id:   1,
										  name: 'divStatic',
										  list: [
											{ property: 'display',    value: 'inline-block' },
											{ property: 'overflowX',  value: 'hidden' },
											{ property: 'paddingTop', value: '4px' },
											{ property: 'width',      value: '40px' },
											{ property: 'whiteSpace', value: 'nowrap' },
										  ] } ),

		tdStatic: 		new StyleData ( { id:   2,
										  name: 'tdStatic',
										  list: [
											{ property: 'borderLeft',  value: 'transparent' },
										  	{ property: 'borderRight', value: 'transparent' },
										  ] } ),

		tdSplitter: 	new StyleData ( { id:   3,
										  name: 'tdSplitter',
										  list: [
											{ property: 'borderLeft',      value: 'none' },
											{ property: 'borderRight',     value: 'none' },
											{ property: 'cursor',          value: 'col-resize' },
											{ property: 'backgroundColor', value: 'lightgray' },
										  ] } ),

		divEditable: 	new StyleData ( { id:   4,
										  name: 'divEditable',
										  list: [
											{ property: 'display',    value: 'inline-block' },
											{ property: 'overflowX',  value: 'hidden' },
											{ property: 'paddingTop', value: '4px' },
											{ property: 'width',      value: '40px' },
										  ] } ),

		tdEditable: 	new StyleData ( { id:   5,
										  name: 'tdEditable',
										  list: [
											{ property: 'borderLeft',  value: 'transparent' },
										  	{ property: 'borderRight', value: 'transparent' },
										  ] } ),
	};

	var firstCustomStyleId = 6;

	function mousedownCellDiv ( d, i, ele ) {
//		var sW = serviceId + ' mousedownCellDiv()';
//		console.log ( sW + ': Name: ' + d.name + '  event.altKey: ' + event.altKey );
		event.stopPropagation();
	}	//	mousedownCellDiv()

	function clickCellDiv ( d, i, ele ) {
//		var sW = serviceId + ' clickCellDiv()';
//		console.log ( sW + ': Name: ' + d.name + '  event.altKey: ' + event.altKey );
		event.stopPropagation();
	}	//	clickCellDiv()

	function inputInput ( d, i, ele ) {
		var sW = serviceId + ' inputInput()';
		var inputEle = ele[i];
		console.log ( sW + ': row col: ' + d.iRow + ' ' + d.iCol + '  value: ' + inputEle.value );
		event.stopPropagation();

		//	set value where?  for what data?
		//
		//	this table is a properties dialog thing -
		//
		//		TableData must have a  propertiy ...
		//
		//			clientData			?
		//
		//			clientCallBack		?
		//
		//			changeCallBack		?			<--

		if ( d.tableData.inputCB )
			d.tableData.inputCB ( d, ele[i].value );

	}	//	inputInput()

	function inputChange ( d, i, ele ) {
		var sW = serviceId + ' inputChange()';
		var inputEle = ele[i];
		console.log ( sW + ': row col: ' + d.iRow + ' ' + d.iCol + '  value: ' + inputEle.value );
		event.stopPropagation();

		if ( d.tableData.changeCB )
			d.tableData.changeCB ( d, ele[i].value );

	}	//	inputChange()

	function sized ( d, i, ele, dx, dy ) {
		var sW = serviceId + ' sized()';
	//	var tableData = d, j, nCol, k, cellD, dCellWidthTotal, oldCellW, newCellW, newCellW2, sumCellWidth, wAdd = 0;
		var tableData = d, j, nCol, k, cellD,                  oldCellW, newCellW, newCellW2, sumCellWidth, wAdd = 0;
		var tableWidth, baseWidth, divWidth, divWidthF, dw;
		var parentPanel     = tableData.parentPanel;
		var parentPanelData = parentPanel.data;
		var bd = parentPanelData.baseData[0];
		var filledBy, sx = 0, sy = 0;

//		console.log ( sW + ' d.name: ' + d.name + '   dx y: ' + dx + ' ' + dy );

		if ( (dx > 0) && (bd.x < 0) ) {				//	scroll/pan first
			filledBy = parentPanelData.filledBy;
			sx = dx;
			if ( sx > -(bd.x + 0.5) )
				sx = -(bd.x + 0.5);
			dx -= sx;
		}
		if ( (dy > 0) && (bd.y < 0) ) {				//	scroll/pan first
			filledBy = parentPanelData.filledBy;
			sy = dy;
			if ( sy > -(bd.y + 0.5) )
				sy = -(bd.y + 0.5);
			dy -= sy;
		}
		if ( sx || sy ) {
			parentPanelData.filledBy = null;
			parentPanel.scroll ( { dx: sx, dy: sy } );
			parentPanelData.filledBy = filledBy;
		}

		d.w += dx;
	//	d.h += dy;				d.h is fixed == td.tableY + td.tableEle.clientHeight

		baseWidth = bd.w;
		divWidth  = baseWidth < uc.TABLE_MIN_WIDTH ? uc.TABLE_MIN_WIDTH : baseWidth;

		if ( baseWidth < uc.TABLE_MIN_WIDTH )
			d.w = divWidth;

		var g = ele ? d3.select ( ele.parentNode ) : d3.select ( '#' + d.eleId );
		g.select ( '#' + d.eleId + '-rect' )
			.attr ( 'width',  function ( d, i ) { return d.w; } )
			.attr ( 'height', function ( d, i ) { 
			//	return d.h; 
				return d.h + (parentPanelData.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH); 
			} );
		g.select ( '#' + d.eleId + '-title' )
			.attr ( 'x',      function ( d, i ) { return d.w / 2; } )
			.attr ( 'y',      function ( d, i ) { return d.titleFS + 2; } );

		g.select ( '#' + d.eleId + '-fo' )
			.attr ( 'width',  function ( d, i ) { return d.w - 1; } );

		g.select ( '#' + d.eleId + '-size' )
			.attr ( 'x',      function ( d, i ) { return d.w - uc.SIZE_HANDLE_WIDTH;  } )
			.attr ( 'y',      function ( d, i ) { return d.h - uc.SIZE_HANDLE_HEIGHT; } );
		d3.select ( '#cp-' + d.eleId + '-rect' )
			.attr ( 'width',  function ( d, i ) { return d.w += dx; } )
			.attr ( 'height', function ( d, i ) { return d.h += dy; } );

		//	size columns to maintain table filling control
		//
	//	divWidthF = divWidth - 9;		//	9 === nCols * paddingLeft
		divWidthF = divWidth - (d.cols.length * d.colsPaddingLeft);

	//	if ( (dx !== 0) && (divWidthF > 0) && (tableData.nColAdj > 0) ) {
		if (               (divWidthF > 0) && (tableData.nColAdj > 0) ) {
			for ( j = 0; j < tableData.rows.length; j++ ) {
	//			nCol = dCellWidthTotal = sumCellWidth = 0;
				nCol =                   sumCellWidth = 0;
				for ( k = 0; k < tableData.cols.length; k++ ) {
					if ( nCol >= tableData.nColAdj )				//	this should not happen
						break;
					cellD = tableData.rows[j].cells[k];
					if ( (! cellD.divEle) || cellD.isSplitter)
						continue;
					nCol++;
					oldCellW  = parseInt ( cellD.divEle.style.width );

					newCellW2 = newCellW = Math.round ( tableData.dwr[k] * divWidthF );
					
					if ( (newCellW >= uc.TABLE_MIN_COL_WIDTH) && (oldCellW >= uc.TABLE_MIN_COL_WIDTH) ) {
	//					dCellWidthTotal += newCellW - oldCellW;
						if ( nCol === tableData.nColAdj ) {
	//						dw = dx - dCellWidthTotal;
	//						if ( dw > 0 )
	//							newCellW2 += 1;
	//						if ( dw < 0 )
	//							newCellW2 -= 1;
							newCellW2 = divWidthF - sumCellWidth;
						}
//	//					console.log ( 'divWidthF: ' + divWidthF + ' k: ' + k + ' dwr: ' + tableData.dwr[k] + ' oldCellW: ' + oldCellW + ' newCellW: ' + newCellW + ' newCellW2: ' + newCellW2 + ' dCellWidthTotal: ' + dCellWidthTotal );
//						console.log ( 'divWidthF: ' + divWidthF + ' k: ' + k + ' dwr: ' + tableData.dwr[k] + ' oldCellW: ' + oldCellW + ' newCellW: ' + newCellW + ' newCellW2: ' + newCellW2 + ' sumCellWidth: '    + sumCellWidth );
					} else {
						if ( j === 0 ) 
							wAdd += uc.TABLE_MIN_COL_WIDTH - newCellW;
						newCellW2 = uc.TABLE_MIN_COL_WIDTH;
//						console.log ( 'divWidthF: ' + divWidthF + ' k: ' + k + ' dwr: ' + tableData.dwr[k] + ' oldCellW: ' + oldCellW + ' newCellW: ' + newCellW + ' newCellW2: ' + newCellW2 );
					}
					sumCellWidth += newCellW2;
					cellD.divEle.style.width = '' + newCellW2 + 'px';
				}
			}
		}

		g.select ( '#' + d.eleId + '-fo-body-div' )
			.style ( 'width',  '' + divWidth + 'px' );
		d.parentPanel.updateSclrs();
	}	//	sized()

	function moved ( d, i, ele, x, y ) {
		var sW = serviceId + ' moved()';
//		console.log ( sW + ' d.name: ' + d.name + '   x y: ' + x + ' ' + y );
		d3.select ( ele.parentNode )
			.attr ( 'transform', function ( d, i ) { 
				return 'translate(' + (d.x = x) + ',' + (d.y = y) + ')'; 
			} );
		d.parentPanel.updateSclrs();
	}	//	moved()

	function split ( d, i, ele, dx, dy ) {
		var sW = serviceId + ' split()';
		var colD = d;

//		var lcE = colD.tableData.cols[colD.iCol - 1].ele;		//	left column element
//		var rcE = colD.tableData.cols[colD.iCol + 1].ele;		//	right 
//
//		var lcEw = parseInt ( lcE.style.width ) + dx;
//		var rcEw = parseInt ( rcE.style.width ) - dx;
//
//		if ( (lcEw < 2) || (rcEw < 2) )
//			return;
//
//		lcE.style.width = '' + lcEw + 'px';
//		rcE.style.width = '' + rcEw + 'px';
//		//
		//	<col> width has some, but not complete, control over the width 
		//	of the column.
		//	
		//	Generally, a <td>'s minimum width is the width of its contents.
		//	
		//	Therefore a <td>'s contents (except splitter columns) is a 
		//	<div> whose width can be set explicitly and its overflow can be 
		//	hidden. (Splitter columns' width does not change, then do not 
		//	have a div, their <td> width is set/fixed with the width style
		//	property.)
		//	
		//	A <td> element's (not a splitter column) clientWidth is 
		//	maintained in the DOM as the width of the <div> plus any left
		//	and right padding. The total width of the table is the sum of
		//	each <td>'s (of one row, of course) clientWidth.
		//	
		//	To change the table's size the width of the <div> of one or 
		//	more <td> is changed.

		var tD = colD.tableData, j, cellDL, cellDR, wL, wR;
		var baseWidth = colD.tableData.parentPanel.data.baseData[0].w;

		var divWidth  = baseWidth < uc.TABLE_MIN_WIDTH ? uc.TABLE_MIN_WIDTH : baseWidth;
		var divWidthF = divWidth - (tD.cols.length * tD.colsPaddingLeft);

		for ( j = 0; j < tD.rows.length; j++ ) {
			cellDL = tD.rows[j].cells[colD.iCol - 1];
			cellDR = tD.rows[j].cells[colD.iCol + 1];
			if ( (! cellDL.divEle) || (! cellDR.divEle) )
				continue;
			wL = parseInt ( cellDL.divEle.style.width ) + dx;
			wR = parseInt ( cellDR.divEle.style.width ) - dx;
			if ( (wL < 2) || (wR < 2) )
				continue;
			cellDL.divEle.style.width = '' + wL + 'px';
			cellDR.divEle.style.width = '' + wR + 'px';

			colD.tableData.dwr[colD.iCol - 1] = wL / divWidthF;				//	div width ratio
			colD.tableData.dwr[colD.iCol + 1] = wR / divWidthF;				//
		}

	}	//	split()

//	function tdMouseDown ( evt ) {
//		var sW = serviceId + ' tdMouseDown()';
//		var td = this;				//	<td> element
//		var cd = td.__data__;		//	CellData
//
//		console.log ( sW );
//
//		evt.stopPropagation();
//
//		cd.msDown   = true;
//		cd.msDnPt.x = evt.clientX;
//		cd.msDnPt.y = evt.clientY;
//
//		var lcE = cd.tableData.cols[cd.iCol - 1].ele;		//	left column element
//		var rcE = cd.tableData.cols[cd.iCol + 1].ele;		//	right 
//
//		cd.lrcW = { lw: parseInt ( lcE.style.width ),
//					rw: parseInt ( rcE.style.width ) };
//	}	//	tdMouseDown()

//	function tdMouseMove ( evt ) {
//		var sW = serviceId + ' tdMouseMove()';
//		var td = this;				//	<td> element
//		var cd = td.__data__;		//	CellData
//
//		console.log ( sW );
//
//		evt.stopPropagation();
//
//		if ( ! cd.msDown )
//			return;
//
//		var dx  = evt.clientX - cd.msDnPt.x;
//
//		var lcEw = cd.lrcW.lw + dx;					//	left  column Element width
//		var rcEw = cd.lrcW.rw - dx;					//	right
//		if ( (lcEw < 2) || (rcEw < 2) )
//			return;
//
//		var lcE = cd.tableData.cols[cd.iCol - 1].ele;		//	left column element
//		var rcE = cd.tableData.cols[cd.iCol + 1].ele;		//	right 
//
//		lcE.style.width = '' + lcEw + 'px';
//		rcE.style.width = '' + rcEw + 'px';
//	}	//	tdMouseMove()

//	function tdMouseUp ( evt ) {
//		var sW = serviceId + ' tdMouseUp()';
//		var td = this;				//	<td> element
//		var cd = td.__data__;		//	CellData
//
//		console.log ( sW );
//
//		evt.stopPropagation();
//
//		cd.msDown = false;
//
//	}	//	tdMouseUp()

	function tdClick ( evt ) {
		var sW = serviceId + ' tdClick()';
	//	var td = this;
	//	var tD = td.__data__;

		console.log ( sW );

		evt.stopPropagation();

	}	//	tdClick()

	function StyleData ( o ) {	//	A collection of these is maintained in TableData
		this.id = 		o.id ? o.id : 0;
		this.name = 	o.name;
		//	See -
		//		https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference
		this.list = 	o.list ? o.list : [];		//	array of objects like, e.g.,  { property: 'width', value: '20px' }
	}	//	StyleData

	function ColumnData ( tableData, o ) {
		this.id  = 0;			//	set from tableData.nextId in createColumn().
		this.ele = null;
		this.tableData = 		tableData;
		this.iCol = 			o.iCol;

		this.colStyleId = 		o.colStyleId;								//	for the <col>
		this.colStyle = 		tableData.findStyle ( o.colStyleId );

		//	these are for each <td> (i.e., cell) of the column
		this.divStyleId = 		o.divStyleId;
		this.divStyle = 		tableData.findStyle ( o.divStyleId );
		this.tdStyleId = 		o.tdStyleId;
		this.tdStyle = 			tableData.findStyle ( o.tdStyleId );
		this.hasDiv =			o.hasDiv;
		this.isSplitter = 		o.isSplitter;
		this.isStatic =      	(uc.isDefined ( o.isStatic ) ? o.isStatic : false);
		this.isEditable = 		(uc.isDefined ( o.isEditable ) ? o.isEditable : false);
	}	//	ColumnData

	function RowData ( rgs ) {
		this.id    = 0;						//	set in Table.prototype.update()
		this.cells = rgs.cells;				//	array of CellData
	}	//	RowData()


//	function CellData ( o ) {
//		this.tableData = 	o.tableData;
	function CellData ( tableData, o ) {
		this.tableData = 	tableData,
		this.iRow =  		o.iRow;			
		this.iCol = 		o.iCol;
//		this.divStyle = 	o.divStyle;		//	one of the Styles maintained in TableData
//		this.tdStyle = 		o.tdStyle;		//	one of the Styles maintained in TableData
//		this.hasDiv = 		o.hasDiv;
		//	set by createCell()
		this.isSplitter = 	o.isSplitter ? o.isSplitter : false;
		this.text = 		o.text       ? o.text       : null;
		this.divEle = 		null;			//	the <td> <div> (if hasDiv)
		this.inputEle = 	null;			//	the <input> if div has one
		this.mouseDown = 	null;
		this.mouseMove = 	null;
		this.mouseUp = 		null;
		this.click = 		null;
		this.msDn = 		false;
		this.msDnPt = { x: 0,  y: 0 };
	}	//	CellData

	function Table ( d ) {
		this.data = d;
	}	//	Table

	Table.prototype.update = function ( rgs ) {
		var uCD = uc.uCD;				//	2018-May-07
		var tableData = this.data;
		var cs  = d3.select ( '#' + tableData.eleId + '-colgroup' ).selectAll ( 'col' )
			.data ( tableData.cols, function ( d ) {
				return d.id;
			} );
		cs.enter()
			.append ( 'col' )
			.each ( function ( d, i, g ) {
				var list, j;
				d.ele = g[i];				//	easy, quick reference to the <col> element
			//	console.log ( 'each col ... ' );
				if ( d.colStyle ) {
					list = d.colStyle.list;
					for ( j = 0; j < list.length; j++ )
						d.ele.style[list[j].property] = list[j].value;
				}
			} );

		var rs = d3.select ( '#' + tableData.eleId + '-tbody' ).selectAll ( 'tr' )
			.data ( tableData.rows, function ( d ) {
				return d.id;
			} );

		rs.exit()
			.remove();

		rs.enter()
			.append ( 'tr' )
			.selectAll ( 'td' )
			.data ( function ( d ) { 
			//	return d.row;
				return d.cells;
			} )
			.enter()
			//	.append ( 'td' )
			//		.text ( function ( d, i ) { 
			//			return d; 
			//		} );
				.each ( function ( d, i, g ) {
					var col = tableData.cols[d.iCol];
					if ( typeof ( d ) === 'string' )
						d3.select ( this )
							.append ( 'td' )
								.text ( d );
					else
					if ( typeof ( d ) === 'object' )
						if ( d.constructor.name === 'CellData' ) {
			//				if ( d.hasDiv ) 
							if ( col.hasDiv ) 
								d3.select ( this )
									.append ( 'td' )
									.each ( function ( d, i, g ) {
										var td = g[0], list, j;
									//	console.log ( 'each td ... ' );
			//							if ( d.tdStyle ) {
			//								list = d.tdStyle.list;
										if ( col.tdStyle ) {
											list = col.tdStyle.list;
											for ( j = 0; j < list.length; j++ )
												td.style[list[j].property] = list[j].value;
										}
									} )
										.append ( 'div' )
										.each ( function ( d, i, g ) {
											var div = d.divEle = g[0], list, j;
									//		console.log ( 'each td div ... ' );
			//								if ( d.divStyle ) {
			//									list = d.divStyle.list;
											if ( col.divStyle ) {
												list = col.divStyle.list;
												for ( j = 0; j < list.length; j++ )
													div.style[list[j].property] = list[j].value;
											}
									//	} )
									//	.text ( d.text );
											if ( d.input )			//	note that  d  is the CellData
												d3.select ( this ) 
													.on ( 'mousedown', mousedownCellDiv )
													.on ( 'click',     clickCellDiv )
													.append ( 'input' )
														.attr ( 'id', d.tableData.eleId + 'r' + d.iRow + 'c' + d.iCol )
														.attr ( 'type', 'text' )
														.attr ( 'autocorrect', 'off' )
														.attr ( 'spellcheck', 'false' )
														.attr ( 'class', 'u34-input' )
														.attr ( 'style', 'width:100%; outline:none; border:none;' )
														.attr ( 'value', d.input.value )
														.on ( 'input', inputInput )		//	fires on any change
														.on ( 'change', inputChange )	//	fires when focus lost or on Enter key
														.each ( function ( d, i, g ) {
															d.inputEle = g[i];
													} );
											if ( d.text )
												d3.select ( this )
													.text ( d.text );
										} );
							else
								d3.select ( this )
									.append ( 'td' )
									.each ( function ( d, i, g ) {
										var td = g[0], list, j;
									//	console.log ( 'each td ... ' );
				//						if ( d.tdStyle ) {
				//							list = d.tdStyle.list;
										if ( col.tdStyle ) {
											list = col.tdStyle.list;
											for ( j = 0; j < list.length; j++ )
												td.style[list[j].property] = list[j].value;
										}
									//	if ( d.mouseDown ) 
									//		td.onmousedown = tdMouseDown;
									//	if ( d.mouseMove ) 
									//		td.onmousemove = tdMouseMove;
									//	if ( d.mouseUp ) 
									//		td.onmouseup = tdMouseUp;
										if ( d.isSplitter ) {
											d3.select ( td ).on ( 'mousedown', uCD.mousedownSplitter );
											d.onSplit = split;
										}

										td.onclick = tdClick;
									} )
									.text ( d.text );
						}
						else
						if ( d.divClass ) 
							d3.select ( this )
								.append ( 'td' )
									.append ( 'div' )
									.attr ( 'class', d.divClass )
									.text ( d.text )
									.each ( function ( d, i, g ) {
								//		console.log ( 'each td div ... ' );
									} );
						else
							d3.select ( this )
								.append ( 'td' )
								.attr ( 'class', function ( d ) { return d.class ? d.class : null; } )
								.text ( d.text )
								.each ( function ( d, i, g ) {
									var td = g[0];
								//	console.log ( 'each td ... ' );
									if ( d.mouseDown ) 
										td.onmousedown = d.mouseDown;
								} );
				} );

		//	Calc dwr (div width ratio)s. Do this when all the columns are defined
		//	and the <table> element's width is set, here.
		//
		//	The table's width, when not explicitly set, is the sum of a row's <td> 
		//	widths.
		//
		//	Each row's <td> width - for a column - is the same.  Therefore we need 
		//	only look at the first row.
		//
		if ( (! rgs) || (! rgs.bFirstUpdate) )	//	only when control is being defined
			return;

		//	This control is being defined.  Want the table to fill the control width
		//	(i.e., tableDate.w).
		//
		//	If the control width is greater than the table width then 
		//		increase the last column's width to make the table fill the control
		//	else
		//	If the control width is a little less than the table width then 
		//		decrease each column's width
		//	else
		//		do nothing - the control (it's panel) should show a scroll/panning 
		//		indicator - to see columns to the right then schroll/pan left

		tableData.w = tableData.parentPanel.data.baseData[0].w;		//	horzontally, fill the panel, for now
	//	tableData.h = tableData.parentPanel.data.baseData[0].h;		//	vertically,  ?
		tableData.h = tableData.tableY + tableData.tableEle.clientHeight;	//	vertically, per table height (number of rows)

		//	Assumptions (for now) -
		//
		//		number of table data (<td>) rows > 0

		var baseWidth = tableData.parentPanel.data.baseData[0].w;
		var divWidth  = baseWidth < uc.TABLE_MIN_WIDTH ? uc.TABLE_MIN_WIDTH : baseWidth;

		var tdSel = d3.select ( '#' + tableData.eleId + '-tbody' ).select ( 'tr' ).selectAll ( 'td' );
		var nCol;
		tableData.nColAdj = 0;		//	number of columns whose width may be adjusted
		tdSel.each ( function ( d, i, g ) { 
			tableData.nColAdj += d.isSplitter ? 0 : 1; 
		} );

		var tableSel = d3.select ( '#' + tableData.eleId ).select ( 'table' );
		var tableWidth = 0, dwTotal, dwEach, dwLast, j, k, cellD, w;
		tableSel.each ( function ( d, i, g ) { tableWidth = g[i].clientWidth; } );
		if ( tableWidth <= 0 )
			return;
		if ( tableData.w > tableWidth ) {
			dwTotal = tableData.w - tableWidth;
			dwEach  = Math.floor ( dwTotal / tableData.nColAdj );
			dwLast  = dwEach + (dwTotal % tableData.nColAdj);
			for ( j = 0; j < tableData.rows.length; j++ ) {
				nCol = 0;
				for ( k = 0; k < tableData.cols.length; k++ ) {
					cellD = tableData.rows[j].cells[k];
					if ( (! cellD.divEle) || cellD.isSplitter)
						continue;
					nCol++;
					if ( nCol < tableData.nColAdj )
						w = parseInt ( cellD.divEle.style.width ) + dwEach;
					else
						w = parseInt ( cellD.divEle.style.width ) + dwLast;
					cellD.divEle.style.width = '' + w + 'px';
					if ( (j === 0) && (typeof tableData.dwr[k] !== 'number') )
						tableData.dwr[k] = w / (divWidth - (tableData.cols.length * tableData.colsPaddingLeft));
				}
			}
		} else
		if ( tableData.w + 10 >= tableWidth ) {		//	10 === uc.TABLE_MIN_WIDTH ?
			dwTotal = tableWidth - tableData.w;

		} else {

		}

		

//		ds.each ( function ( d, i, g ) {
//
//		} );
//
//		d3.select ( '#' + )
//		tableData.dwr[d.iCol] = div.clientWidth / tableData.w;

	};	//	Table.prototype.update()

//	Table.prototype.parentSized = function ( w, h )  { 		//	i.e., this control's "client" area has been resized
	Table.prototype.parentSized = function ( dx, dy )  { 		//	i.e., this control's "client" area has been resized
		var td = this.data;
//		var dx = w - td.w + 1;
//		var dy = h - td.h + 1;
		sized ( td, null, null, dx, dy );
	};	//	Table.prototype.parentSized()

	Table.prototype.parentSizedAbsolute = function ( w, h )  { 	//	i.e., this control's "client" area has been resized
		var td = this.data;
		var dx = w - td.w + 1;
		var dy = h - td.h + 1;
		sized ( td, null, null, dx, dy );
	};	//	Table.prototype.parentSizedAbsolute()

	Table.prototype.parentScrolled = function ( evt ) {		//	i.e., this control's "client" area has been scrolled/panned
		var td = this.data;								//	table data
		var bd = td.parentPanel.data.baseData[0];		//	parent panel's base data
		var divW   = parseInt ( td.divEle.style.width );
		var tableH = td.tableEle.clientHeight;

		var ax = divW - (bd.w - (bd.x - 0.5)) + evt.dx;
	//	var ay = td.h - (bd.w - (bd.y - 0.5)) + evt.dy;
		var ay = (td.tableY + tableH) - (bd.h - (bd.y - 0.5)) + evt.dy;
		
	//	console.log ( 'bd.x: ' + bd.x + '  bd.w: ' + bd.w + '  divW: ' + divW + '  evt.dx: ' + evt.dx + '  ax: ' + ax );

	//	if ( bd.x + evt.dx > 0.5 )	//	don't allow panning right (past origin)
	//		evt.dx = 0.5 - bd.x;		//	will set bd.x === 0.5
	//	//	2017-May-08
		var bdX = bd.x + (! bd.panelData.hasBorder ? uc.PANEL_BORDER_WIDTH : 0);
		if ( bdX  + evt.dx > 0.5 )	//	don't allow panning right (past origin)
			evt.dx = 0.5 - bdX;			//	will set bd.x === 0.5
		else
		if ( ax <= 0 )
			evt.dx = 0;

	//	if ( bd.y + evt.dy > 0.5 )	//	don't allow panning down (past origin)
	//		evt.dy = 0.5 - bd.y;		//	will set bd.y === 0.5
	//	//	2017-May-08
		var bdY = bd.y + (! bd.panelData.hasBorder ? uc.PANEL_BORDER_WIDTH : 0);
		if ( bdY  + evt.dy > 0.5 )	//	don't allow panning down (past origin)
			evt.dy = 0.5 - bdY;			//	will set bd.y === 0.5
		else
		if ( ay <= 0 )
			evt.dy = 0;

	};	//	Table.prototype.parentScrolled()

	function TableData ( o ) {
		var uCD = uc.uCD;				//	2018-May-07
		//	Initialize the "base" of this object, ControlData -
		o.type      = uc.TYPE_TABLE;
		o.class     = o.class     === undefined ? 'u34-table' : o.class;
		o.hasBorder = o.hasBorder === undefined ? true        : o.hasBorder;
		uCD.callControlData ( this, o );

		//	Initialize the rest of this object -
		this.title = o.title ? o.title : 'table title goes here';
		this.cb = o.cb ? o.cb : null;
		this.ff = 'verdana';				//	font family
		this.fs = 10;						//	font size, pixels

		this.titleFF = 'verdana';			//	title font family
		this.titleFS = 12;					//	and size
		this.titleFW = 'bold';				//	and weight

		this.styles = [];
		this.nextStyleId = firstCustomStyleId;

		this.cols = [];			//	array of ColumnData - defined with createColumn().
		this.nextColId = 0;

		this.rows = [];			//	array of RowData - each RowData contains an array of CellData
		this.nextRowId = 0;

		this.dwr = o.dwr ? o.dwr : [];		//	<Div> Width Ratio, i.e., each col's <div> width / table width  
											//	- to maintain col relative widths when table (control) width changes

		this.nColAdj = 0;		//	number of columns whose width may be adjusted

		this.tableEle = null;	//	the <table> element
		this.divEle = null;		//	the <div> element the table is in 

		this.tableY = 20;		//	to make room for title above the table

		this.colsPaddingLeft = 3;	//	all columns' left padding - matches CSS .u34-table-fo-body-div-table tbody tr td

		this.inputCB  = o.inputCB  ? o.inputCB  : null;		//	when a cell's <input> changes
		this.changeCB = o.changeCB ? o.changeCB : null;		//	when focus is lost, or Enter key on cell's <input>

		this.table = null;		//	reference (circular) to Table - set by defineTable()

		//	Override some "base" (those in ControlData) properties -
		this.onSize = sized;
		this.onMove = moved;
	}	//	TableData()

//	TableData.prototype = uCD.newControlData();
//	TableData.prototype.constructor = TableData;
//	See svc.createTableData()

//	TableData.prototype.findStyle = function ( styleId ) {
	function TableData_findStyle ( styleId ) {
		var style;
		if ( styleId < firstCustomStyleId ) {
			for ( var pprty in builtInStyles ) {
				if ( ! builtInStyles.hasOwnProperty ( pprty ) )
					continue;
				style = builtInStyles[pprty];
				if ( style.id === styleId )
					return style;
			}
		} else
		for ( var i = 0; i < this.styles.length; i++ ) {
			if ( this.styles[i].id === styleId )
				return this.styles[i];
		}
		return null;
	}	//	TableData.prototype.findStyle()

//	TableData.prototype.createStyle = function ( o ) {
	function TableData_createStyle ( o ) {
		var style = new StyleData ( o );
		if ( style.id === 0 )
			style.id = ++this.nextStyleId;
		this.styles.push ( style );
		return style;
	}	//	TableData.prototype.createStyle()

//	TableData.prototype.createColumn = function ( o ) {
	function TableData_createColumn ( o ) {
		if ( ! uc.isDefined ( o.iCol ) )
			o.iCol = this.cols.length;
		if ( uc.isBoolean ( o.isSplitter ) && o.isSplitter ) {
			o.name       = uc.isString ( o.name ) ? o.name : 'splitter';
			o.colStyleId = 0;
			o.divStyleId = 0;
			o.tdStyleId  = uc.isDefined ( o.tdStyleId ) ? o.tdStyleId : builtInStyles.tdSplitter.id;
			o.hasDiv     = false;
			o.isStatic   = false;
			o.isEditable = false;
		} else 
		if ( uc.isString ( o.style ) && (o.style === 'static') ) {
			o.colStyleId = 0;
			o.divStyleId = uc.isDefined ( o.divStyleId ) ? o.divStyleId : builtInStyles.divStatic.id;
			o.tdStyleId  = uc.isDefined ( o.tdStyleId ) ? o.tdStyleId : builtInStyles.tdStatic.id;
			o.hasDiv     = true;
			o.isSplitter = false;
			o.isStatic   = true;
			o.isEditable = false;
		} else
		if ( uc.isString ( o.style ) && (o.style === 'editable') ) {
			o.colStyleId = 0;
			o.divStyleId = uc.isDefined ( o.divStyleId ) ? o.divStyleId : builtInStyles.divEditable.id;
			o.tdStyleId  = uc.isDefined ( o.tdStyleId ) ? o.tdStyleId : builtInStyles.tdEditable.id;
			o.hasDiv     = true;
			o.isSplitter = false;
			o.isStatic   = false;
			o.isEditable = true;
		} 

		var col = new ColumnData ( this, o );
		col.id = ++this.nextColId;
		this.cols.push ( col );
		return col;
	}	//	TableData.prototype.createColumn()

//	TableData.prototype.createRow = function ( rgs ) {
	function TableData_createRow ( rgs ) {
		var row = new RowData ( rgs );
		row.id = ++this.nextRowId;
		this.rows.push ( row );
		return row;
	}	//	TableData.prototype.createRow()

//	TableData.prototype.createRows = function ( rgs ) {
	function TableData_createRows ( rgs ) {
		var sW = 'TableData_createRows()';
		var iRow, cells, iCol, iCell, col, row;
		for ( iRow = 0; iRow < rgs.length; iRow++ ) {
			cells = [];
			for ( iCell = 0, iCol = 0; iCol < this.cols.length; iCol++ ) {
				col = this.cols[iCol];
				if ( col.isSplitter ) {
					cells.push ( this.createCell ( { iCol: iCol, iRow: iRow }, { isSplitter: true } ) );
				} else
				if ( col.isStatic ) {
					cells.push ( this.createCell ( { iCol: iCol, iRow: iRow }, { text: rgs[iRow][iCell++] } ) );
				} else
				if ( col.isEditable ) {
					cells.push ( this.createCell ( { iCol: iCol, iRow: iRow }, { input: { value: '' + rgs[iRow][iCell++] } } ) );
				} else
					console.log ( sW + ': Unrecognized column type' );
			}

			row = new RowData ( { cells: cells } );
			row.id = ++this.nextRowId;
			this.rows.push ( row );
		}
	}	//	TableData.prototype.createRows()

//	TableData.prototype.createCell = function ( oCommon, o ) {
	function TableData_createCell ( oCommon, o ) {
		var cell = new CellData ( this, oCommon );
		for ( var prop in o ) {
			cell[prop] = o[prop];
		}
		return cell;
	}	//	TableData.prototype.createCell()

//	TableData.prototype.setTitle = function ( titleText ) {
	function TableData_setTitle ( titleText ) {
		this.title = titleText;
		d3.select ( '#' + this.eleId + '-title' )
			.text ( function ( d, i ) { return d.title; } );
	}	//	TableData.prototype.setTitle()

//	TableData.prototype.setCell = function ( iRow, iCol, value ) {
	function TableData_setCell ( iRow, iCol, value ) {
		var cellD = this.rows[iRow].cells[iCol];
		if ( cellD.inputEle )
			cellD.inputEle.value = '' + value;
		else
		if ( cellD.divEle )
			cellD.divEle.innerHtml = '' + value;
	}	//	TableData.prototype.setCell()

	svc.createTableData = function ( o ) {
		var uCD = uc.uCD;				//	2018-May-07
		if ( TableData.prototype.constructor.name === 'TableData' ) {
			//	Do this once, here to avoid cir ref issue
			TableData.prototype = uCD.newControlData();
			TableData.prototype.constructor = TableData;
			TableData.prototype.findStyle = TableData_findStyle;
			TableData.prototype.createStyle = TableData_createStyle;
			TableData.prototype.createColumn = TableData_createColumn;
			TableData.prototype.createRow = TableData_createRow;
			TableData.prototype.createRows = TableData_createRows;
			TableData.prototype.createCell = TableData_createCell;
			TableData.prototype.setTitle = TableData_setTitle;
			TableData.prototype.setCell = TableData_setCell;
		}

		return new TableData ( o );
	};	//	svc.createTableData()


	function defineTableElement ( div ) {
		var table = div.append ( 'table' )
			.attr ( 'class', 'u34-table-fo-body-div-table' )
		//	.attr ( 'style', 'width: 100%;');
			.each ( function ( d, i, g ) {
				d.tableEle = g[i];
			} );

	//	var colgroup = table
	//		.append ( 'colgroup' );
	//	colgroup
	//		.append ( 'col' )
	//			.attr ( 'class', 'u34-table-col-prop-name' );
	//	colgroup
	//		.append ( 'col' )
	//			.attr ( 'class', 'u34-table-col-splitter' );
	//	colgroup
	//		.append ( 'col' )
	//			.attr ( 'class', 'u34-table-col-prop-value' );

	//	table
	//		.append ( 'col' )
	//			.attr ( 'class', 'u34-table-col-prop-name' );
	//	table
	//		.append ( 'col' )
	//			.attr ( 'class', 'u34-table-col-splitter' );
	//	table
	//		.append ( 'col' )
	//			.attr ( 'class', 'u34-table-col-prop-value' );

		var colgroup = table
			.append ( 'colgroup' )
				.attr ( 'id', function ( d ) { return d.eleId + '-colgroup'; } );
	//	colgroup
	//		.append ( 'col' );
	//			.attr ( 'class', 'u34-table-col-prop-name' );
	//	colgroup
	//		.append ( 'col' );
	//			.attr ( 'class', 'u34-table-col-splitter' );
	//	colgroup
	//		.append ( 'col' );
	//			.attr ( 'class', 'u34-table-col-prop-value' );

		table
			.append ( 'tbody' )
				.attr ( 'id', function ( d ) { return d.eleId + '-tbody'; } );

	} 	//	defineTableElement()

	svc.defineTable = function ( panel ) {
		var sW = serviceId + ' defineTable()';
		var uCD = uc.uCD;				//	2018-May-07
		var table = null;
		var pd    = panel.data;
		var s = pd.base.selectAll ( '#' + pd.eleId + '-base' + ' > g' );
//		console.log ( sW + '  s length: ' + s._groups[0].length );

		var ctrlEles = s
			.data ( pd.childData.data, function ( d ) { 
					return d.id || (d.id = ++pd.childData.nextId); 
			} )
			.enter()
			.each ( function ( d ) { 
//				console.log ( sW + ': - g - new data: ' + d.name ); 
				table = d.table = new Table ( d );
			} )
			.append ( 'g' )
				.attr ( 'id',        function ( d, i ) { return d.eleId; } )
				//	<g> has no x, y - must transform -
				.attr ( 'transform', function ( d, i ) { return 'translate(' + d.x + ',' + d.y + ')'; } );

		ctrlEles
			.on ( 'mouseover', uCD.mouseover )
			.on ( 'mouseout',  uCD.mouseleave )
			.on ( 'mousemove', uCD.mousemove )
			.on ( 'mousedown', uCD.mousedown )
			.on ( 'mouseup',   uCD.mouseup )
			.on ( 'click',     uCD.click );

		ctrlEles.append ( 'rect' )
			.attr ( 'id',     function ( d, i ) { return d.eleId + '-rect'; } )
			.attr ( 'x',      function ( d, i ) { 
				return pd.hasBorder || (pd.docked && pd.parentPanel.data.hasBorder) ? 0.5 : -0.5;
			} )
			.attr ( 'y',      function ( d, i ) { 
				return pd.hasBorder || (pd.docked && pd.parentPanel.data.hasBorder) ? 0.5 : -0.5;
			} )
			.attr ( 'width',  function ( d, i ) { 
				return d.w; 
			} )
			.attr ( 'height', function ( d, i ) { 
				return d.h + (pd.hasBorder ? 0 : uc.PANEL_BORDER_WIDTH); 
			} )
			.attr ( 'class',  function ( d, i ) { return d.class; } );

		ctrlEles.append ( 'text' )													//	title
			.attr ( 'id',          function ( d, i ) { return d.eleId + '-title'; } )
			.attr ( 'text-anchor', function ( d, i ) { return 'middle'; } )
			.attr ( 'x',           function ( d, i ) { return d.w / 2; } )
			.attr ( 'y',           function ( d, i ) { return d.titleFS + 2; } )
			.attr ( 'style',       function ( d, i ) { return 'font-family: ' + d.titleFF + '; font-size: ' + d.titleFS + 'px; ' + 'font-weight: ' + d.titleFW + ';'; } )
			.attr ( 'class',       function ( d, i ) { return 'u34-label-text'; } )
			.attr ( 'clip-path',   function ( d, i ) { return 'url(#cp-' + d.eleId + ')'; } )
			.text (                function ( d, i ) { return d.title; } );


		var div = ctrlEles.append ( 'g' )
			.attr ( 'id',        function ( d, i ) { return d.eleId + '-g-fo'; } )
		//	.attr ( 'transform', 'translate(0.5,20.5)' )
			.attr ( 'transform', function ( d, i ) {
			//	return 'translate(' + (       0 + uc.OFFS_4_1_PIX_LINE) + ',' 
			//	return 'translate(' + (       0 - uc.OFFS_4_1_PIX_LINE) + ',' 		//	2017-May-04 	Why - ?
			//						+ (d.tableY + uc.OFFS_4_1_PIX_LINE) + ')'; 
				return 'translate(' + (       0 + uc.OFFS_4_1_PIX_LINE) + ',' 		//					changing back to + .
									+ (d.tableY + uc.OFFS_4_1_PIX_LINE) + ')'; 
			} )
			.append ( 'foreignObject' )
				.attr ( 'id',          function ( d, i ) { return d.eleId + '-fo'; } )
				.attr ( 'x', 0 )
				.attr ( 'y', 0 )
				.attr ( 'width',  function ( d, i ) { return d.w - 1; } )
				.attr ( 'height', 1 ) 	//	function ( d, i ) { return d.h; } )
				.append ( 'xhtml:body' )
					.attr ( 'id',          function ( d, i ) { return d.eleId + '-fo-body'; } )
					.style ( 'font', '10px "consolas"' )
					.append ( 'div' )
						.attr ( 'id', function ( d, i ) { return d.eleId + '-fo-body-div'; } )
						.each ( function ( d, i, g ) {
							d.divEle = g[i];
						} );

		defineTableElement ( div );

		table.update ( { bFirstUpdate: true } );


		ctrlEles.each ( function ( d ) { 
			if ( d.fillsPanel )
				return;						//	i.e., use the panel's move, size handles

			ctrlEles.append ( 'rect' )		//	size handle - invisible until mouse is over
				.attr ( 'id',     function ( d, i ) { return d.eleId + '-size'; } )
				.attr ( 'x',      function ( d, i ) { return d.w - uc.SIZE_HANDLE_WIDTH; } )
				.attr ( 'y',      function ( d, i ) { return d.h - uc.SIZE_HANDLE_HEIGHT; } )
				.attr ( 'width',  function ( d, i ) { return uc.SIZE_HANDLE_WIDTH; } )
				.attr ( 'height', function ( d, i ) { return uc.SIZE_HANDLE_HEIGHT; } )
				.attr ( 'class',  function ( d, i ) { return 'u34-size-handle-transparent'; } )
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
		} );

		return table;
	};	//	svc.defineTable()

	return svc;

})();
