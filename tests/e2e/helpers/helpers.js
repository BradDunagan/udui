
/* global describe */
/* global it */
/* global browser */
/* global element */
/* global by */
/* global protractor */
/* global $ */

var q 				= require ( 'q' );

var chai 			= require('chai');
var chaiAsPromised 	= require('chai-as-promised');

var PixDiff 		= require ( 'pix-diff' );

chai.use(chaiAsPromised);
var expect = chai.expect;
var assert = chai.assert;

function textBeginsWith ( element, preText ) {
	return element.getText()
		.then ( function ( text ) {
			return text.indexOf ( preText ) === 0;
		});
}	//	textBeginsWith()

//	http://stackoverflow.com/questions/20268128/how-to-test-if-an-element-has-class-using-protractor
var hasClass = function (element, cls) {
	return element.getAttribute ( 'class' )
		.then ( function ( classes ) {
			return classes.split(' ').indexOf ( cls ) !== -1;
		});
};	//	hasClass()

var hasTag = function (element, tagName ) {
	return element.getTagName()
		.then ( function ( name ) {
			return name === tagName;
		});
};	//	hasTag()

var getEleSize = function (element ) {
	return element.getSize()
		.then ( function ( size ) {
			return size;		//	{ width: , height: }
		});
};	//	getEleSize()

var eleCache = {};

function clearElementCache() {
	eleCache = {};
}	//	clearElementCache()

function cacheElementById ( eleId ) {
	var ele = eleCache[eleId];
	if ( ele )
		return ele;
	ele = element ( by.id ( eleId ) );
	if ( ele )
		eleCache[eleId] = ele;
	return ele;
}	//	cacheElementById()

function getElementByTagName ( tagName ) {
	var ele = element ( by.tagName ( tagName ) );
	return ele;
}	//	getElementByTagName()

function expect_ElementByTag_Present ( tagName, bPresent ) {
	var msg = 'element with tag ' + tagName + ' present';
	var ele = getElementByTagName ( tagName );
	expect ( ele.isPresent(), msg ).to.eventually.equal ( bPresent );
	if ( bPresent ) 
		return ele;
	return null;
}	//	expect_ElementByTag_Present()

function expect_ElementById_Present ( eleId, bPresent, tagName ) {
	var msg = 'element with id ' + eleId + ' present';
	var ele = cacheElementById ( eleId );
	expect ( ele.isPresent(), msg ).to.eventually.equal ( bPresent );
	if ( bPresent ) {
		if ( tagName )
			expect_ElementById_HasTag ( eleId, tagName );
		return ele;
	}
	return null;
}	//	expect_ElementById_Present()

function expect_ElementById_Enabled ( eleId, bIsEnabled ) {
	var msg = 'element with id ' + eleId + ' is enabled';
	var ele = cacheElementById ( eleId );
	expect ( ele.isEnabled(), msg ).to.eventually.equal ( bIsEnabled );
}	//	expect_ElementById_Enabled()

function expect_ElementById_Text ( eleId, text ) {
	var msg = 'text of element with id ' + eleId;
	var ele = cacheElementById ( eleId );
	expect ( ele.getText(), msg ).to.eventually.equal ( text );
}	//	expect_ElementById_Text()

function expect_ElementById_Text_BeginsWith ( eleId, preText ) {
	var msg = 'text of element with id ' + eleId + ' begins with "' + preText + '"';
	var ele = cacheElementById ( eleId );
	expect ( textBeginsWith ( ele, preText ), msg ).to.eventually.equal ( true );
}	//	expect_ElementById_Text_BeginsWith()

function expect_ElementById_HasClass ( eleId, className, bHas ) {
	var msg = 'element with id ' + eleId + ' has class ' + className;
	var ele = cacheElementById ( eleId );
	expect ( hasClass ( ele, className ), msg ).to.eventually.equal ( bHas );
}	//	expect_ElementById_HasClass()

function expect_ParentOf_ElementById_HasClass ( eleId, className, bHas ) {
	var msg = 'parent of element with id ' + eleId + ' has class ' + className;
	var ele = cacheElementById ( eleId );
	var parent = ele.element ( by.xpath ( '..' ) );
	expect ( hasClass ( parent, className ), msg ).to.eventually.equal ( bHas );
}	//	expect_ParentOf_ElementById_HasClass()

function expect_ElementById_HasTag ( eleId, tagName ) {
	var msg = 'element with id ' + eleId + ' has tag ' + tagName;
	var ele = cacheElementById ( eleId );
	expect ( hasTag ( ele, tagName ), msg ).to.eventually.equal ( true );
}	//	expect_ElementById_HasTag()

function click_ElementById ( eleId ) {
	var ele = cacheElementById ( eleId );
	ele.click();
}	//	click_ElementById()

function sendKeys_ElementById ( eleId, keys, opts ) {
	var ele = cacheElementById ( eleId );
	if ( opts && opts.selectAllFirst ) {
		ele.sendKeys ( protractor.Key.chord ( protractor.Key.CONTROL, 'a' ),
					   keys );
		return;
	}
	ele.sendKeys ( keys );
}	//	sendKeys_ElementById()

function sendCtrlA_ElementById ( eleId ) {
	var ele = cacheElementById ( eleId );
	ele.sendKeys ( protractor.Key.chord ( protractor.Key.CONTROL, 'a' ) );
}	//	sendCtrlA_ElementById()

function sendEnter_ElementById ( eleId ) {
	var ele = cacheElementById ( eleId );
	ele.sendKeys ( protractor.Key.ENTER );
}	//	sendEnter_ElementById()

function getEleText ( eleId, bInput, bVerbose ) {
	var sW = 'getEleText()', 
		deferred = q.defer();
	var ele   = cacheElementById ( eleId );
	if ( bVerbose )
		console.log ( sW + ': looking for ' + eleId );
	if ( ! ele ) {
		deferred.resolve ( null );
		return;
	}
	ele.isPresent()
		.then ( function ( bPresent ) {
			if ( bVerbose )
				console.log ( sW + ' bPresent: ' + bPresent );
			if ( ! bPresent ) {
				deferred.resolve ( null );
				return;					
			}
			if ( bInput )
				return ele.getAttribute ( 'value' );
			return ele.getText();
		}, 		function() {
			if ( bVerbose )
				console.log ( sW + ' ele.isPresent() fnc2 - resolving null' );
			deferred.resolve ( null );
		} )
		.then ( function ( eleText ) {
			if ( bVerbose )
				console.log ( sW + ' eleText: ' + eleText );
			if ( ! eleText ) {
				deferred.resolve ( null );
				return;					
			}
			deferred.resolve ( eleText );
		} )
		.catch ( function() {
			if ( bVerbose )
				console.log ( sW + ' catch - resolving null' );
			deferred.resolve ( null );
		} );
	return deferred.promise;
}	//	getEleText()

/*
function getImgSrc ( eleId, bVerbose ) {
	var sW = 'getImgSrc()', 
		deferred = q.defer();
	var ele   = cacheElementById ( eleId );
	if ( bVerbose )
		console.log ( sW + ': looking for ' + eleId );
	if ( ! ele ) {
		deferred.reject ( null );
		return;
	}
	ele.isPresent()
		.then ( function ( bPresent ) {
			if ( bVerbose )
				console.log ( sW + ' bPresent: ' + bPresent );
			if ( ! bPresent ) {
				deferred.reject();
				return;					
			}
			return ele.getAttribute ( 'src' );
		}, 		function() {
			if ( bVerbose )
				console.log ( sW + ' ele.isPresent() fnc2 - reject' );
			deferred.reject();
		} )
		.then ( function ( src ) {
			if ( bVerbose )
				console.log ( sW + ' src: ' + src );
			if ( ! src ) {
				deferred.reject();
				return;					
			}
			deferred.resolve ( src );
		} )
		.catch ( function() {
			if ( bVerbose )
				console.log ( sW + ' catch - reject' );
			deferred.reject();
		} );
	return deferred.promise;
}	//	getImgSrc()
*/
function getImgSrc ( eleId, done, bVerbose ) {
	var sW = 'getImgSrc()', 
		deferred = q.defer();
	var ele   = cacheElementById ( eleId );
	if ( bVerbose )
		console.log ( sW + ': looking for ' + eleId );
	if ( ! ele ) {
		done()
		return;
	}
	ele.isPresent()
		.then ( function ( bPresent ) {
			if ( bVerbose )
				console.log ( sW + ' bPresent: ' + bPresent );
			if ( ! bPresent ) {
				done();
				return;					
			}
			return ele.getAttribute ( 'src' );
		}, 		function() {
			if ( bVerbose )
				console.log ( sW + ' ele.isPresent() fnc2 - reject' );
			done();
		} )
		.then ( function ( src ) {
			if ( bVerbose )
				console.log ( sW + ' src: ' + src );
			deferred.resolve ( src );
			done();
		} )
		.catch ( function() {
			if ( bVerbose )
				console.log ( sW + ' catch - reject' );
			done();
		} );
	return deferred.promise;
}	//	getImgSrc()


function getMarkdown ( eleId, done, bVerbose ) {
	var sW = 'getMarkdown()', 
		deferred = q.defer();
	var ele   = cacheElementById ( eleId );
	if ( bVerbose )
		console.log ( sW + ': looking for ' + eleId );
	if ( ! ele ) {
		done()
		return;
	}
	ele.isPresent()
		.then ( function ( bPresent ) {
			if ( bVerbose )
				console.log ( sW + ' bPresent: ' + bPresent );
			if ( ! bPresent ) {
				done();
				return;					
			}
			return ele.getAttribute ( 'value' );
		}, 		function() {
			if ( bVerbose )
				console.log ( sW + ' ele.isPresent() fnc2 - reject' );
			done();
		} )
		.then ( function ( text ) {
			if ( bVerbose )
				console.log ( sW + ' got markdown text' );
			deferred.resolve ( text );
			done();
		} )
		.catch ( function() {
			if ( bVerbose )
				console.log ( sW + ' catch - reject' );
			done();
		} );
	return deferred.promise;
}	//	getMarkdown()

var labelPixDiffEleId = 'rr-test-label-sc';

var cmdInputEleId  = 'rr-app-client-root-e2et-cmd-input-input';
var cmdOutputEleId = 'rr-app-client-root-e2et-cmd-output-input';

function setCmdInputEleId ( eleId ) {
	cmdInputEleId = eleId;
}

function setCmdOutputEleId ( eleId ) {
	cmdOutputEleId = eleId;
}

function cmdInputOutput ( cmd ) {
	var sCmd = JSON.stringify ( cmd );
	expect_ElementById_Present ( cmdInputEleId, true );
	sendKeys_ElementById ( cmdInputEleId, sCmd, { selectAllFirst: true } );
	sendEnter_ElementById ( cmdInputEleId );

	return getOutputText();		//	a promise
}	//	cmdInputOutput()

function testCmdInputOutput ( args ) {
	var sW = 'testCmdInputOutput()';
	var cmd = {
		cmd: 	'test-cmd-input',
		args: 	args
	};
	return cmdInputOutput ( cmd );		//	a promise
}	//	testCmdInputOutput()

function getListItemEleId ( listEleId, itemTextId ) {
	var sW = 'getListItemEleId()';
	var cmd = {
		cmd: 	'get-list-item-ele-id',
		args: 	{
			listEleId: 	listEleId,
			itemTextId: itemTextId,
		},
	};
	return cmdInputOutput ( cmd );		//	a promise
}	//	getListItemEleId()

function createPixDiffLabel() {
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
	expect_ElementById_Present ( cmdInputEleId, true );
	sendKeys_ElementById ( cmdInputEleId, sCmd, { selectAllFirst: true } );
//	sendCtrlA_ElementById ( cmdInputEleId );
//	sendKeys_ElementById ( cmdInputEleId, sCmd );
	sendEnter_ElementById ( cmdInputEleId );
	expect_ElementById_Present ( labelPixDiffEleId, true );
}	//	createPixDiffLabel()

function placePixDiffLabel ( x, y, w, h ) {
	var sW = 'placePixDiffLabel()';
//	console.log ( sW + ': x ' + x + '  y ' + y + '  w ' + w + '  h ' + h );
	expect_ElementById_Present ( labelPixDiffEleId, true );

	//	Place the label over the region.
	var cmd, sCmd;
	cmd = {
		cmd: 		'move-control',
		args: {
			eleId: 		labelPixDiffEleId,
			x: 		 	x,		//	in control's parent coords which in this case 
			y: 		 	y		//	is the root panel's
		}
	};
	sCmd = JSON.stringify ( cmd );
	expect_ElementById_Present ( cmdInputEleId, true );
	sendKeys_ElementById ( cmdInputEleId, sCmd, { selectAllFirst: true } );
	sendEnter_ElementById ( cmdInputEleId );

	cmd = {
		cmd: 		'size-control',
		args: {
			eleId: 		labelPixDiffEleId,
			w: 		 	w,
			h: 		 	h	
		}
	};
	sCmd = JSON.stringify ( cmd );
	expect_ElementById_Present ( cmdInputEleId, true );
	sendKeys_ElementById ( cmdInputEleId, sCmd, { selectAllFirst: true } );
	sendEnter_ElementById ( cmdInputEleId );
}	//	placePixDiffLabel()

function getOutputText() {
	return getEleText ( cmdOutputEleId, true, false );		//	a promise
}	//	getOutputText()

function createPanel ( args ) {
	var sW = 'createPanel()';
	var cmd = {
		cmd: 	'create-panel',
		args: 	args
	};
	var sCmd = JSON.stringify ( cmd );
	expect_ElementById_Present ( cmdInputEleId, true );
	sendKeys_ElementById ( cmdInputEleId, sCmd, { selectAllFirst: true } );
	sendEnter_ElementById ( cmdInputEleId );
}	//	createPanel()

function createButton ( panelEleId, args ) {
	var sW = 'createButton()';
	var cmd = {
		cmd: 			'create-button',
		panelEleId: 	panelEleId,
		args: 			args
	};
	var sCmd = JSON.stringify ( cmd );
	expect_ElementById_Present ( cmdInputEleId, true );
	sendKeys_ElementById ( cmdInputEleId, sCmd, { selectAllFirst: true } );
	sendEnter_ElementById ( cmdInputEleId );
}	//	createButton()

function createLabel ( panelEleId, args ) {
	var sW = 'createLabel()';
	var cmd = {
		cmd: 			'create-label',
		panelEleId: 	panelEleId,
		args: 			args
	};
	var sCmd = JSON.stringify ( cmd );
	expect_ElementById_Present ( cmdInputEleId, true );
	sendKeys_ElementById ( cmdInputEleId, sCmd, { selectAllFirst: true } );
	sendEnter_ElementById ( cmdInputEleId );
}	//	createLabel()

function sizeStart ( eleId ) {
	var sW = 'sizeStart()';
	expect_ElementById_Present ( eleId, true );
	var cmd = {
		cmd: 		'size-start',
		args: {
			eleId: 		eleId
		}
	};
	var sCmd = JSON.stringify ( cmd );
	expect_ElementById_Present ( cmdInputEleId, true );
	sendKeys_ElementById ( cmdInputEleId, sCmd, { selectAllFirst: true } );
	sendEnter_ElementById ( cmdInputEleId );
}	//	sizeStart()

function sizeControlDelta ( eleId, dx, dy ) {
	var sW = 'sizeControlDelta()';
	expect_ElementById_Present ( eleId, true );
	var cmd = {
		cmd: 		'size-control-delta',
		args: {
			eleId: 		eleId,
			dx: 		dx,
			dy: 		dy
		}
	};
	var sCmd = JSON.stringify ( cmd );
	expect_ElementById_Present ( cmdInputEleId, true );
	sendKeys_ElementById ( cmdInputEleId, sCmd, { selectAllFirst: true } );
	sendEnter_ElementById ( cmdInputEleId );
}	//	sizeControlDelta()

function splitPanel ( panelEleId, vh ) {
	var sW = 'splitPanel()';
	var cmd = {
		cmd: 	'split-panel',
		args: 	{
			panelEleId: 	panelEleId,
			vh: 			vh				//	'vert' or horz'
		}
	};
	var sCmd = JSON.stringify ( cmd );
	expect_ElementById_Present ( cmdInputEleId, true );
	sendKeys_ElementById ( cmdInputEleId, sCmd, { selectAllFirst: true } );
	sendEnter_ElementById ( cmdInputEleId );
}	//	splitPanel()

function getSplitInfo ( panelEleId ) {
	var sW = 'getSplitInfo()';
	var cmd = {
		cmd: 	'get-split-info',
		args: 	{
			panelEleId: 	panelEleId
		}
	};
	var sCmd = JSON.stringify ( cmd );
	expect_ElementById_Present ( cmdInputEleId, true );
	sendKeys_ElementById ( cmdInputEleId, sCmd, { selectAllFirst: true } );
	sendEnter_ElementById ( cmdInputEleId );
}	//	getSplitInfo()

function moveSplitter ( eleId, dx, dy ) {
	var sW = 'moveSplitter()';
	var cmd = {
		cmd: 	'move-splitter',
		args: 	{
			eleId: 		eleId,
			dx: 		dx,
			dy: 		dy
		}
	};
	var sCmd = JSON.stringify ( cmd );
//	console.log ( sW + ' sCmd: ' + sCmd );
	expect_ElementById_Present ( cmdInputEleId, true );
	sendKeys_ElementById ( cmdInputEleId, sCmd, { selectAllFirst: true } );
	sendEnter_ElementById ( cmdInputEleId );
}	//	moveSplitter()

function getImage0 ( imgRect, imgName ) {
	it ( 'Getting an image of ' + imgName + '. ', function ( done ) {
		clearElementCache();
		getImage2 ( imgRect, imgName )
			.then ( function() {
				done();
			} );
	} );
}	//	getImage0()

function getImage ( x, y, w, h, name ) {
	var sW = 'getImage()', 
		deferred = q.defer();
	placePixDiffLabel ( x, y, w, h );
	browser.pixDiff.saveRegion ( element ( by.id ( labelPixDiffEleId ) ), name )
		.then ( function() {
			deferred.resolve();
		} );
	return deferred.promise;
}	//	getImage()

function getImage2 ( ctrl, name ) {
	var sW = 'getImage2()';
	var x = Math.trunc ( ctrl.x - 5 );
	var y = Math.trunc ( ctrl.y - 5 );
	var w = ctrl.w + 10;
	var h = ctrl.h + 10;
	return getImage ( x, y, w, h, name );
}	//	getImage2()

function getImage3 ( ele, name ) {
	var sW = 'getImage3()', 
		deferred = q.defer();
	browser.pixDiff.saveRegion ( ele, name )
		.then ( function() {
			deferred.resolve();
		} );
	return deferred.promise;
}	//	getImage3()


function checkImage0 ( imgRect, imgName ) {
	var sResult = 'result-not-set';
	it ( 'Checking image of ' + imgName + '. ', function ( done ) {
		checkImage2 ( imgRect, imgName ).then ( function ( s ) { sResult = s; done(); } );
	} );

	it ( 'Expect identical images.', function ( done ) {
		expect ( sResult === 'identical', (sResult + ' === identical') ).to.equal ( true );
		done();
	} );
}	//	checkImage0()

function checkImageOptions() {
	var options = {	
		//	Note that these are not well documented (if at all) in the pix-diff
		//	docs.  See PixelDiff (what pix-diff calls) code.
//		debug: 			true,	//	shows filters in output image
		thresholdType: 	PixDiff.THRESHOLD_PIXEL,	//	default (I think), but just in case
		threshold: 		0,

		//	Want pixel-by-pixel comparison. Not perceptual. 
		perceptual: 	false,	//	this is the default - but just in case

		//	See PixelDiff code.  If a pixel difference is found it shifts this 
		//	much to look for no difference.
		hShift: 		0,		//	default is 2
		vShift: 		0,		//	default is 2

		//	May need option here to turn off pixel color/intensity tolerance.
		delta: 			0		//	default is 20
	};
	return options;
}	//	checkImageOptions()

function checkImage ( x, y, w, h, name ) {
	var sW = 'checkImage()', 
		deferred = q.defer();
	var options = checkImageOptions();
	placePixDiffLabel ( x, y, w, h );
	browser.pixDiff.checkRegion ( element ( by.id ( labelPixDiffEleId ) ), name, options )
		.then ( function ( result ) {
			deferred.resolve ( result );
		}, 		function ( result ) {
			console.log ( sW + ' reject' );
			deferred.reject ( result );
		} )
		.catch ( function ( error ) {
			console.log ( sW + ' error' );
		} );
	return deferred.promise;
}	//	checkImage()

function checkImagePromise ( sC, ele, name, options ) {
	var sW = sC + ' checkImagePromise()', 
		deferred = q.defer();
	browser.pixDiff.checkRegion ( ele, name, options )
		.then ( function ( result ) {
			var s = 'unknown';
			switch ( result.code ) {
				case PixDiff.RESULT_DIFFERENT: 	s = 'different'; 	break;
				case PixDiff.RESULT_SIMILAR: 	s = 'similar';		break;
				case PixDiff.RESULT_IDENTICAL: 	s = 'identical';	break;
			}
			deferred.resolve ( s );
		}, 		function ( result ) {
			console.log ( sW + ' reject' );
			deferred.reject ( result );
		} )
		.catch ( function ( error ) {
			console.log ( sW + ' error' );
		} );
	return deferred.promise;
}	//	checkImagePromise()

function checkImage2 ( ctrl, name ) {
	var sW = 'checkImage2()', 
		deferred = q.defer();
	var x = Math.trunc ( ctrl.x - 5 );
	var y = Math.trunc ( ctrl.y - 5 );
	var w = ctrl.w + 10;
	var h = ctrl.h + 10;
	var options = checkImageOptions();
	clearElementCache();
	placePixDiffLabel ( x, y, w, h );
	browser.pixDiff.checkRegion ( element ( by.id ( labelPixDiffEleId ) ), name, options )
		.then ( function ( result ) {
			var s = 'unknown';
			switch ( result.code ) {
				case PixDiff.RESULT_DIFFERENT: 	s = 'different'; 	break;
				case PixDiff.RESULT_SIMILAR: 	s = 'similar';		break;
				case PixDiff.RESULT_IDENTICAL: 	s = 'identical';	break;
			}
			deferred.resolve ( s );
		}, 		function ( result ) {
			console.log ( sW + ' reject' );
			deferred.reject ( result );
		} )
		.catch ( function ( error ) {
			console.log ( sW + ' error' );
		} );
	return deferred.promise;
}	//	checkImage2()

function checkImage3 ( ele, name ) {
	var sW = 'checkImage3()'; 
	var options = checkImageOptions();
	return checkImagePromise ( sW, ele, name, options );
}	//	checkImage3()

exports.helpers = {
	setCmdInputEleId: 						setCmdInputEleId,
	setCmdOutputEleId:						setCmdOutputEleId,
	testCmdInputOutput: 					testCmdInputOutput,
	getListItemEleId: 						getListItemEleId,
	hasClass: 								hasClass,
	hasTag: 								hasTag,
	clearElementCache: 						clearElementCache,
	cacheElementById: 						cacheElementById,
	expect_ElementByTag_Present:  			expect_ElementByTag_Present,
	expect_ElementById_Present:  			expect_ElementById_Present,
	expect_ElementById_Enabled: 			expect_ElementById_Enabled,
	expect_ElementById_Text: 				expect_ElementById_Text,
	expect_ElementById_Text_BeginsWith:		expect_ElementById_Text_BeginsWith,
	expect_ElementById_HasClass: 			expect_ElementById_HasClass,
	expect_ParentOf_ElementById_HasClass: 	expect_ParentOf_ElementById_HasClass,
	expect_ElementById_HasTag: 				expect_ElementById_HasTag,
	click_ElementById: 						click_ElementById,
	sendKeys_ElementById: 					sendKeys_ElementById,
	sendEnter_ElementById: 					sendEnter_ElementById,
	sendCtrlA_ElementById: 					sendCtrlA_ElementById,
	getEleText: 							getEleText,
	getImgSrc: 								getImgSrc,
	getMarkdown: 							getMarkdown,
	getEleSize: 							getEleSize,
	createPixDiffLabel: 					createPixDiffLabel,
	getOutputText: 							getOutputText,
	createPanel: 							createPanel,
	createLabel: 							createLabel,
	createButton: 							createButton,
	sizeStart: 								sizeStart,
	sizeControlDelta: 						sizeControlDelta,
	splitPanel: 							splitPanel,
	getSplitInfo: 							getSplitInfo,
	moveSplitter: 							moveSplitter,
	getImage0: 								getImage0,
	getImage: 								getImage,
	getImage2: 								getImage2,
	getImage3: 								getImage3,
	checkImage0: 							checkImage0,
	checkImage: 							checkImage,
	checkImage2: 							checkImage2,
	checkImage3: 							checkImage3,
};
