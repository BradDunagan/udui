/* global describe */
/* global it */
/* global browser */
/* global Keys */
/* global beforeEach */
/* global element */
/* global by */
/* global protractor */

var chai 			= require ( 'chai' );
var chaiAsPromised 	= require ( 'chai-as-promised' );

var PixDiff 		= require ( 'pix-diff' );

browser.pixDiff = new PixDiff ( {
	basePath: 	'./test/desktop/',
	diffPath: 	'./diff/'
} );

chai.use ( chaiAsPromised );
var expect = chai.expect;

var helpers = require ( './helpers/helpers.js' ).helpers;

var	setCmdInputEleId 						= helpers.setCmdInputEleId,
	setCmdOutputEleId						= helpers.setCmdOutputEleId,
	testCmdInputOutput						= helpers.testCmdInputOutput,
	getListItemEleId 						= helpers.getListItemEleId,
	hasClass 								= helpers.hasClass,
	hasTag	 								= helpers.hasTag,
	getEleSize 								= helpers.getEleSize,
	clearElementCache 						= helpers.clearElementCache,
	cacheElementById 						= helpers.cacheElementById,
	expect_ElementByTag_Present 			= helpers.expect_ElementByTag_Present,
	expect_ElementById_Present  			= helpers.expect_ElementById_Present,
	expect_ElementById_Text 				= helpers.expect_ElementById_Text,
	expect_ElementById_Text_BeginsWith		= helpers.expect_ElementById_Text_BeginsWith,
	expect_ElementById_HasClass 			= helpers.expect_ElementById_HasClass,
	expect_ParentOf_ElementById_HasClass 	= helpers.expect_ParentOf_ElementById_HasClass,
	expect_ElementById_HasTag 				= helpers.expect_ElementById_HasTag,
	click_ElementById 						= helpers.click_ElementById,
	sendKeys_ElementById 					= helpers.sendKeys_ElementById,
	sendEnter_ElementById					= helpers.sendEnter_ElementById,
	sendCtrlA_ElementById 					= helpers.sendCtrlA_ElementById,
	getOutputText 							= helpers.getOutputText,
	createPanel 							= helpers.createPanel,
	createLabel 							= helpers.createLabel,
	createButton 							= helpers.createButton,
	sizeStart 								= helpers.sizeStart,
	sizeControlDelta 						= helpers.sizeControlDelta,
	splitPanel 								= helpers.splitPanel,
	getSplitInfo 							= helpers.getSplitInfo,
	moveSplitter							= helpers.moveSplitter,
	getImage0 								= helpers.getImage0,
	getImage 								= helpers.getImage,
	getImage2 								= helpers.getImage2,
	createPixDiffLabel 						= helpers.createPixDiffLabel,
	checkImage0 							= helpers.checkImage0,
	checkImage 								= helpers.checkImage,
	checkImage2 							= helpers.checkImage2;


var getImages = (browser.params.getImages === 'true');

var sGetCheck = getImages ? '\n  getImages: ' + getImages
						  : '\n  checking images';
						  
var testInputEleId  = 'rr-app-client-root-e2et-cmd-input';
var testOutputEleId = 'rr-app-client-root-e2et-cmd-output';

setCmdInputEleId ( testInputEleId + '-input' );
setCmdOutputEleId ( testOutputEleId + '-input' );

var rootPanelEleId = 'rr-app-client-root';

var testName = 'panels-ralph-dock-root-properties-a';



function setup ( panelRalph, out ) {
	var buttonA = { x: 5, y:  5, w: 60, h: 15, name: 'btnA', text: 'btnA' };
	var buttonB = { x: 5, y: 25, w: 60, h: 15, name: 'btnA', text: 'btnB' };
	var buttonC = { x: 5, y: 45, w: 60, h: 15, name: 'btnA', text: 'btnC' };
	var buttonD = { x: 5, y: 65, w: 60, h: 15, name: 'btnA', text: 'btnD' };


	it ( 'To the home page (waiting 10 seconds for everything to load and transpile).', function ( done ) {
		browser.ignoreSynchronization = true;
		browser.get ( 'http://localhost:3000/' );
		setTimeout ( done, 10000 );		//	Wait 10 secs before we say we are done.
	} );

	it ( 'Setting browser window size ...', function ( done ) {
		browser.manage().window().setSize ( 520, 480 );
		done();
	} );

	it ( 'Creating a transparent label element. ', function ( done ) {
		clearElementCache();
		createPixDiffLabel();
		done();
	} );

	it ( 'Create panel ralph. ', function ( done ) {
		clearElementCache();
		createPanel ( panelRalph );
		done();
	} );

	it ( 'Add buttons to panel ralph. ', function ( done ) {
		clearElementCache();
		createButton ( panelRalph.eleId, buttonA );
		createButton ( panelRalph.eleId, buttonB );
		createButton ( panelRalph.eleId, buttonC );
		createButton ( panelRalph.eleId, buttonD );
		done();
	} );

	it ( 'Click anywhere in root panel.', function ( done ) {
		clearElementCache();
		expect_ElementById_Present ( rootPanelEleId + '-base', true );
		click_ElementById ( rootPanelEleId + '-base' );
		done();
	} );

	it ( 'Pausing 1 second.', function ( done ) {
		setTimeout ( done, 1000 );
	} );

	var menuListEleId = null;

	it ( 'Get menu list element Id.', function ( done ) {
		getOutputText()
			.then ( function ( text ) {
				var output = JSON.parse ( text );
				if ( 	(typeof output === 'object') 
					 && (typeof output.menuListEleId === 'string')
					 && (       output.menuListEleId !== 'not found') )
					menuListEleId = output.menuListEleId;
				else
					throw 'menu list not found';
				done();
			} )
			.catch ( function() {
				expect ( true, 'click pop-up menu error' ).to.equal ( false );
			} );
	} );
		
	it ( 'Pausing 1 second.', function ( done ) {
		setTimeout ( done, 1000 );
	} );

	var propertiesMenuItemEleId = null;

	it ( 'Get properties menu item element Id.', function ( done ) {
		getListItemEleId ( menuListEleId, 'properties' )	//	'properties' is the textId of the menu item
			.then ( function ( text ) {
				var output = JSON.parse ( text );
				if ( 	(typeof output === 'object') 
					 && (typeof output.itemEleId === 'string')
					 && (       output.itemEleId !== 'not found') )
					propertiesMenuItemEleId = output.itemEleId;
				else
					throw 'properties menu item not found';
				done();
			} )
			.catch ( function() {
				expect ( true, 'click pop-up menu error' ).to.equal ( false );
			} );
	} );
		
	it ( 'Click Properties ...', function ( done ) {
		clearElementCache();
		expect_ElementById_Present ( propertiesMenuItemEleId, true );
		click_ElementById ( propertiesMenuItemEleId );
		done();
	} );

	it ( 'Pausing 1 second(s).', function ( done ) {
		setTimeout ( done, 1000 );
	} );

	out.propertiesPanelEleId = null;

	it ( 'Get properties panel element Id.', function ( done ) {
		getOutputText()
			.then ( function ( text ) {
				var output = JSON.parse ( text );
				if ( 	(typeof output === 'object') 
					 && (typeof output.propertiesPanelEleId === 'string')
					 && (       output.propertiesPanelEleId !== 'not found') )
					out.propertiesPanelEleId = output.propertiesPanelEleId;
				else
					throw 'menu list not found';
				done();
			} )
			.catch ( function() {
				expect ( true, 'properties table error' ).to.equal ( false );
			} );
	} );
		
	it ( 'Pausing 1 second.', function ( done ) {
		setTimeout ( done, 1000 );
	} );

}	//	setup()

function checkSizingImages ( gettingImages, imgRect, panelEleId, imgName ) {
	var sResult = '';
	if ( gettingImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	it ( 'So good so far?  (pausing 3 seconds)  ', function ( done ) {
		setTimeout ( done, 3000 );
	} );

	//	Still good after sizing?
	//
	it ( 'Start sizing. ', function ( done ) {
		clearElementCache();
		sizeStart ( panelEleId );
		done();
	} );

	it ( 'Increment size x +1. ', function ( done ) {
		clearElementCache();
		sizeControlDelta ( panelEleId, 1, 0 );
		setTimeout ( done, 1000 );
	} );

	if ( gettingImages ) 
		getImage0 ( imgRect, imgName + '-size-1-0' );
	else 
		checkImage0 ( imgRect, imgName + '-size-1-0' );

	it ( 'Increment size y +1. ', function ( done ) {
		clearElementCache();
		sizeControlDelta ( panelEleId, 0, 1 );
		setTimeout ( done, 1000 );
	} );

	if ( gettingImages ) 
		getImage0 ( imgRect, imgName + '-size-1-1' );
	else 
		checkImage0 ( imgRect, imgName + '-size-1-1' );

	it ( 'Increment size x +1. ', function ( done ) {
		clearElementCache();
		sizeControlDelta ( panelEleId, 1, 0 );
		setTimeout ( done, 1000 );
	} );

	if ( gettingImages ) 
		getImage0 ( imgRect, imgName + '-size-2-1' );
	else 
		checkImage0 ( imgRect, imgName + '-size-2-1' );

	it ( 'Increment size y +1. ', function ( done ) {
		clearElementCache();
		sizeControlDelta ( panelEleId, 0, 1 );
		setTimeout ( done, 1000 );
	} );

	if ( gettingImages ) 
		getImage0 ( imgRect, imgName + '-size-2-2' );
	else 
		checkImage0 ( imgRect, imgName + '-size-2-2' );

}	//	checkSizingImages()

function checkSplittingImages ( vh, gettingImages, imgRect, splitterInfo, imgNamePrefix ) {
	var sW = 'checkSplittingImages()';
	var imgName;
	if ( (vh !== 'horz') && (vh !== 'vert') ) {
		console.log ( sW + ': ERROR - expect parameter vh to be "horz" or "vert".' );
		return;
	}

	it ( 'Move splitter + 1.', function ( done ) {
		clearElementCache();
		if ( vh === 'horz' )
			moveSplitter ( splitterInfo.eleId, 1, 0 );
		else
			moveSplitter ( splitterInfo.eleId, 0, 1 );
		setTimeout ( done, 1000 );
	} );
	imgName = imgNamePrefix + '-split+1';
	if ( gettingImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	it ( 'Move splitter + 2.', function ( done ) {
		clearElementCache();
		if ( vh === 'horz' )
			moveSplitter ( splitterInfo.eleId, 2, 0 );
		else
			moveSplitter ( splitterInfo.eleId, 0, 2 );
		setTimeout ( done, 1000 );
	} );
	imgName = imgNamePrefix + '-split+2';
	if ( gettingImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	it ( 'Move splitter - 1.', function ( done ) {
		clearElementCache();
		if ( vh === 'horz' )
			moveSplitter ( splitterInfo.eleId, -1, 0 );
		else
			moveSplitter ( splitterInfo.eleId, 0, -1 );
		setTimeout ( done, 1000 );
	} );
	imgName = imgNamePrefix + '-split-1';
	if ( gettingImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	it ( 'Move splitter + 2.', function ( done ) {
		clearElementCache();
		if ( vh === 'horz' )
			moveSplitter ( splitterInfo.eleId, 2, 0 );
		else
			moveSplitter ( splitterInfo.eleId, 0, 2 );
		setTimeout ( done, 1000 );
	} );
	imgName = imgNamePrefix + '-split+2-again';
	if ( gettingImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	it ( 'Move splitter - 3.', function ( done ) {
		clearElementCache();
		if ( vh === 'horz' )
			moveSplitter ( splitterInfo.eleId, -3, 0 );
		else
			moveSplitter ( splitterInfo.eleId, 0, -3 );
		setTimeout ( done, 1000 );
	} );
	imgName = imgNamePrefix + '-split-3';
	if ( gettingImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	it ( 'Move splitter - 1.', function ( done ) {
		clearElementCache();
		if ( vh === 'horz' )
			moveSplitter ( splitterInfo.eleId, -1, 0 );
		else
			moveSplitter ( splitterInfo.eleId, 0, -1 );
		setTimeout ( done, 1000 );
	} );
	imgName = imgNamePrefix + '-split-1-again';
	if ( gettingImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

}	//	checkSplittingImages()


describe ( 'Split panel by docking properties right. ' + sGetCheck, function () {
	var gettingImages = getImages;

	var panelRalph = { x: 5.5,  y:  55.5,  w: 228,  h: 183, name: 'ralph', eleId: 'rr-ralph' };
	var setupOut = {};
	setup ( panelRalph, setupOut );

	it ( 'Start drag properties panel.', function ( done ) {
		clearElementCache();
		//	See -
		//		http://stackoverflow.com/questions/27825116/how-can-i-do-a-ctrlclick-on-protractor
		//		http://www.protractortest.org/#/api?view=webdriver.WebDriver.prototype.actions
	//	var srcWebEle = expect_ElementById_Present  ( 'rr-7-base', true ).getWebElement();
		var srcWebEle = expect_ElementById_Present  ( setupOut.propertiesPanelEleId + '-base', true ).getWebElement();
		var tgtWebEle = expect_ElementById_Present  ( panelRalph.eleId + '-base', true ).getWebElement();
		browser.actions()
			.mouseMove ( srcWebEle, { x: 49,  y: 12 } )
			.keyDown ( protractor.Key.ALT )
			.mouseDown()
			.mouseMove ( tgtWebEle, { x: 200, y: 40 } )	//	target will not show unless we move off the dragee
			.perform();
		setTimeout ( done, 1000 );
	} );

	it ( 'Dock to right side of panelRalph.', function ( done ) {
		clearElementCache();
		var tgtEleId  = panelRalph.eleId + '-base-droptargetright';
		var tgtWebEle = expect_ElementById_Present  ( tgtEleId, true ).getWebElement();
		browser.actions()
			.mouseMove ( tgtWebEle, { x: 24, y: 43 } )
			.mouseUp()
			.perform();

		setTimeout ( done, 1000 );
	} );

	//	Can't seem to get ctrl-a to work.  Why?
	it ( 'Ctrl-A on input element ...', function ( done ) {			//	select all so that it is deleted when the new text is inserted
		var cmdInputEleId = testInputEleId + '-input';
		clearElementCache();
		expect_ElementById_Present ( cmdInputEleId, true );
		sendCtrlA_ElementById ( cmdInputEleId );
		setTimeout ( done, 1000 );
	} );

	var output, leftPanelEleId, splitterInfo = {}, rightPanelEleId;
	it ( 'Get ralph left and right panel element Ids. ', function ( done ) {
		clearElementCache();
		getSplitInfo ( panelRalph.eleId );
		getOutputText()
			.then ( function ( text ) {
			//	console.log ( 'ralph left and right panel element Id: ' + text);
				output = JSON.parse ( text );
				leftPanelEleId      = output.leftPanelEleId;
				splitterInfo.eleId  = output.splitterEleId;
				rightPanelEleId     = output.rightPanelEleId;
				done();
			} )
			.catch ( function() {
				expect ( true, 'ralph left and right panel element Id error' ).to.equal ( false );
			} );
		done();
	} );

	//	Can't seem to get ctrl-a to work.  Why?
	it ( 'Ctrl-A on input element ...', function ( done ) {			//	select all so that it is deleted when the new text is inserted
		var cmdInputEleId = testInputEleId+ '-input';
		clearElementCache();
		expect_ElementById_Present ( cmdInputEleId, true );
		sendCtrlA_ElementById ( cmdInputEleId );
		setTimeout ( done, 1000 );
	} );

	var imgRect = { x: 6.5, y: 52.5, w: 232, h: 190 };		//	all of panelRalph
	checkSizingImages ( gettingImages, imgRect, panelRalph.eleId, testName + '-right' );

	it ( 'Pause  (pausing 3 seconds)  ', function ( done ) {
		setTimeout ( done, 3000 );
	} );

//	gettingImages = true;
	checkSplittingImages ( 'horz', gettingImages, imgRect, splitterInfo, testName + '-right' );

	it ( 'Pause at end  (pausing 3 seconds)  ', function ( done ) {
		setTimeout ( done, 3000 );
	} );

} );	//	describe ( 'Split panel by docking properties right. '


describe ( 'Split panel by docking properties left. ' + sGetCheck, function () {
	var gettingImages = getImages;
	var panelRalph = { x: 5.5,  y:  55.5,  w: 228,  h: 183, name: 'ralph', eleId: 'rr-ralph' };
	var setupOut = {};
	setup ( panelRalph, setupOut );

	it ( 'Start drag properties panel.', function ( done ) {
		clearElementCache();
		//	See -
		//		http://stackoverflow.com/questions/27825116/how-can-i-do-a-ctrlclick-on-protractor
		//		http://www.protractortest.org/#/api?view=webdriver.WebDriver.prototype.actions
	//	var srcWebEle = expect_ElementById_Present  ( 'rr-7-base', true ).getWebElement();
		var srcWebEle = expect_ElementById_Present  ( setupOut.propertiesPanelEleId + '-base', true ).getWebElement();
		var tgtWebEle = expect_ElementById_Present  ( panelRalph.eleId + '-base', true ).getWebElement();
		browser.actions()
			.mouseMove ( srcWebEle, { x: 49,  y: 12 } )
			.keyDown ( protractor.Key.ALT )
			.mouseDown()
			.mouseMove ( tgtWebEle, { x: 200, y: 40 } )	//	target will not show unless we move off the dragee
			.perform();
		setTimeout ( done, 1000 );
	} );

	it ( 'Dock to left side of panelRalph.', function ( done ) {
		clearElementCache();
		var tgtEleId  = panelRalph.eleId + '-base-droptargetleft';
		var tgtWebEle = expect_ElementById_Present  ( tgtEleId, true ).getWebElement();
		browser.actions()
			.mouseMove ( tgtWebEle, { x: 38, y: 80 } )
			.mouseUp()
			.perform();

		setTimeout ( done, 1000 );
	} );

	//	Can't seem to get ctrl-a to work.  Why?
	it ( 'Ctrl-A on input element ...', function ( done ) {			//	select all so that it is deleted when the new text is inserted
		var cmdInputEleId = testInputEleId + '-input';
		clearElementCache();
		expect_ElementById_Present ( cmdInputEleId, true );
		sendCtrlA_ElementById ( cmdInputEleId );
		setTimeout ( done, 1000 );
	} );

	var output, leftPanelEleId, splitterInfo = {}, rightPanelEleId;
	it ( 'Get ralph left and right panel element Ids. ', function ( done ) {
		clearElementCache();
		getSplitInfo ( panelRalph.eleId );
		getOutputText()
			.then ( function ( text ) {
			//	console.log ( 'ralph left and right panel element Id: ' + text);
				output = JSON.parse ( text );
				leftPanelEleId      = output.leftPanelEleId;
				splitterInfo.eleId  = output.splitterEleId;
				rightPanelEleId     = output.rightPanelEleId;
				done();
			} )
			.catch ( function() {
				expect ( true, 'ralph left and right panel element Id error' ).to.equal ( false );
			} );
		done();
	} );

	//	Can't seem to get ctrl-a to work.  Why?
	it ( 'Ctrl-A on input element ...', function ( done ) {			//	select all so that it is deleted when the new text is inserted
		var cmdInputEleId = testInputEleId + '-input';
		clearElementCache();
		expect_ElementById_Present ( cmdInputEleId, true );
		sendCtrlA_ElementById ( cmdInputEleId );
		setTimeout ( done, 1000 );
	} );

	var imgRect = { x: 6.5, y: 52.5, w: 232, h: 190 };		//	all of panelRalph
	checkSizingImages ( gettingImages, imgRect, panelRalph.eleId, testName + '-left' );

	it ( 'Pause  (pausing 3 seconds)  ', function ( done ) {
		setTimeout ( done, 3000 );
	} );

//	gettingImages = true;
	checkSplittingImages ( 'horz', gettingImages, imgRect, splitterInfo, testName + '-left' );

	it ( 'Pause at end  (pausing 3 seconds)  ', function ( done ) {
		setTimeout ( done, 3000 );
	} );

} );	//	describe ( 'Split panel by docking properties left. '


describe ( 'Split panel by docking properties top. ' + sGetCheck, function () {
	var gettingImages = getImages;
//	var gettingImages = true;
	var panelRalph = { x: 5.5,  y:  55.5,  w: 228,  h: 183, name: 'ralph', eleId: 'rr-ralph' };

//	setup ( panelRalph );
	var setupOut = {};
	setup ( panelRalph, setupOut );

	it ( 'Start drag properties panel.', function ( done ) {
		clearElementCache();
		//	See -
		//		http://stackoverflow.com/questions/27825116/how-can-i-do-a-ctrlclick-on-protractor
		//		http://www.protractortest.org/#/api?view=webdriver.WebDriver.prototype.actions
	//	var srcWebEle = expect_ElementById_Present  ( 'rr-7-base', true ).getWebElement();
		var srcWebEle = expect_ElementById_Present  ( setupOut.propertiesPanelEleId + '-base', true ).getWebElement();
		var tgtWebEle = expect_ElementById_Present  ( panelRalph.eleId + '-base', true ).getWebElement();
		browser.actions()
			.mouseMove ( srcWebEle, { x: 49,  y: 12 } )
			.keyDown ( protractor.Key.ALT )
			.mouseDown()
			.mouseMove ( tgtWebEle, { x: 200, y: 40 } )	//	target will not show unless we move off the dragee
			.perform();
		setTimeout ( done, 1000 );
	} );

	it ( 'Dock to top side of panelRalph.', function ( done ) {
		clearElementCache();
		var tgtEleId  = panelRalph.eleId + '-base-droptargettop';
		var tgtWebEle = expect_ElementById_Present  ( tgtEleId, true ).getWebElement();
		browser.actions()
			.mouseMove ( tgtWebEle, { x: 102, y: 21 } )
			.mouseUp()
			.perform();

		setTimeout ( done, 1000 );
	} );

	//	Can't seem to get ctrl-a to work.  Why?
	it ( 'Ctrl-A on input element ...', function ( done ) {			//	select all so that it is deleted when the new text is inserted
		var cmdInputEleId = testInputEleId + '-input';
		clearElementCache();
		expect_ElementById_Present ( cmdInputEleId, true );
		sendCtrlA_ElementById ( cmdInputEleId );
		setTimeout ( done, 1000 );
	} );

	var output, bottomPanelEleId, splitterInfo = {}, topPanelEleId;
	it ( 'Get ralph top and bottom panel element Ids. ', function ( done ) {
		clearElementCache();
		getSplitInfo ( panelRalph.eleId );
		getOutputText()
			.then ( function ( text ) {
			//	console.log ( 'ralph top and bottom panel element Id: ' + text);
				output = JSON.parse ( text );
				topPanelEleId      = output.topPanelEleId;
				splitterInfo.eleId = output.splitterEleId;
				bottomPanelEleId   = output.bottomPanelEleId;
				done();
			} )
			.catch ( function() {
				expect ( true, 'ralph top and bottom panel element Id error' ).to.equal ( false );
			} );
		done();
	} );

	//	Can't seem to get ctrl-a to work.  Why?
	it ( 'Ctrl-A on input element ...', function ( done ) {			//	select all so that it is deleted when the new text is inserted
		var cmdInputEleId = testInputEleId + '-input';
		clearElementCache();
		expect_ElementById_Present ( cmdInputEleId, true );
		sendCtrlA_ElementById ( cmdInputEleId );
		setTimeout ( done, 1000 );
	} );

	var imgRect = { x: 6.5, y: 52.5, w: 232, h: 190 };		//	all of panelRalph
	checkSizingImages ( gettingImages, imgRect, panelRalph.eleId, testName + '-top' );

	it ( 'Pause  (pausing 3 seconds)  ', function ( done ) {
		setTimeout ( done, 3000 );
	} );

//	gettingImages = true;
	checkSplittingImages ( 'vert', gettingImages, imgRect, splitterInfo, testName + '-top' );

	it ( 'Pause at end  (pausing 3 seconds)  ', function ( done ) {
		setTimeout ( done, 3000 );
	} );

} );	//	describe ( 'Split panel by docking properties top. '


describe ( 'Split panel by docking properties bottom. ' + sGetCheck, function () {
	var gettingImages = getImages;
//	var gettingImages = true;
	var panelRalph = { x: 5.5,  y:  55.5,  w: 228,  h: 183, name: 'ralph', eleId: 'rr-ralph' };

//	setup ( panelRalph );
	var setupOut = {};
	setup ( panelRalph, setupOut );

	it ( 'Start drag properties panel.', function ( done ) {
		clearElementCache();
		//	See -
		//		http://stackoverflow.com/questions/27825116/how-can-i-do-a-ctrlclick-on-protractor
		//		http://www.protractortest.org/#/api?view=webdriver.WebDriver.prototype.actions
	//	var srcWebEle = expect_ElementById_Present  ( 'rr-7-base', true ).getWebElement();
		var srcWebEle = expect_ElementById_Present  ( setupOut.propertiesPanelEleId + '-base', true ).getWebElement();
		var tgtWebEle = expect_ElementById_Present  ( panelRalph.eleId + '-base', true ).getWebElement();
		browser.actions()
			.mouseMove ( srcWebEle, { x: 49,  y: 12 } )
			.keyDown ( protractor.Key.ALT )
			.mouseDown()
			.mouseMove ( tgtWebEle, { x: 200, y: 40 } )	//	target will not show unless we move off the dragee
			.perform();
		setTimeout ( done, 1000 );
	} );

	it ( 'Dock to bottom side of panelRalph.', function ( done ) {
		clearElementCache();
		var tgtEleId  = panelRalph.eleId + '-base-droptargetbottom';
		var tgtWebEle = expect_ElementById_Present  ( tgtEleId, true ).getWebElement();
		browser.actions()
			.mouseMove ( tgtWebEle, { x: 110, y: 18 } )
			.mouseUp()
			.perform();

		setTimeout ( done, 1000 );
	} );

	//	Can't seem to get ctrl-a to work.  Why?
	it ( 'Ctrl-A on input element ...', function ( done ) {			//	select all so that it is deleted when the new text is inserted
		var cmdInputEleId = testInputEleId + '-input';
		clearElementCache();
		expect_ElementById_Present ( cmdInputEleId, true );
		sendCtrlA_ElementById ( cmdInputEleId );
		setTimeout ( done, 1000 );
	} );

	var output, bottomPanelEleId, splitterInfo = {}, topPanelEleId;
	it ( 'Get ralph top and bottom panel element Ids. ', function ( done ) {
		clearElementCache();
		getSplitInfo ( panelRalph.eleId );
		getOutputText()
			.then ( function ( text ) {
			//	console.log ( 'ralph top and bottom panel element Id: ' + text);
				output = JSON.parse ( text );
				topPanelEleId      = output.topPanelEleId;
				splitterInfo.eleId = output.splitterEleId;
				bottomPanelEleId   = output.bottomPanelEleId;
				done();
			} )
			.catch ( function() {
				expect ( true, 'ralph top and bottom panel element Id error' ).to.equal ( false );
			} );
		done();
	} );

	//	Can't seem to get ctrl-a to work.  Why?
	it ( 'Ctrl-A on input element ...', function ( done ) {			//	select all so that it is deleted when the new text is inserted
		var cmdInputEleId = testInputEleId + '-input';
		clearElementCache();
		expect_ElementById_Present ( cmdInputEleId, true );
		sendCtrlA_ElementById ( cmdInputEleId );
		setTimeout ( done, 1000 );
	} );

	var imgRect = { x: 6.5, y: 52.5, w: 232, h: 190 };		//	all of panelRalph
	checkSizingImages ( gettingImages, imgRect, panelRalph.eleId, testName + '-bottom' );

	it ( 'Pause  (pausing 3 seconds)  ', function ( done ) {
		setTimeout ( done, 3000 );
	} );

//	gettingImages = true;
	checkSplittingImages ( 'vert', gettingImages, imgRect, splitterInfo, testName + '-bottom' );

	it ( 'Pause at end  (pausing 3 seconds)  ', function ( done ) {
		setTimeout ( done, 3000 );
	} );

} );	//	describe ( 'Split panel by docking properties bottom. '


