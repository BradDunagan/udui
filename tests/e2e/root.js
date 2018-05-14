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


chai.use ( chaiAsPromised );
var expect = chai.expect;

var helpers 		= require ( './helpers/helpers.js' ).helpers;

var	setCmdInputEleId 						= helpers.setCmdInputEleId,
	setCmdOutputEleId						= helpers.setCmdOutputEleId,
	testCmdInputOutput						= helpers.testCmdInputOutput,
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
	getOutputText 							= helpers.getOutputText,
	createPanel 							= helpers.createPanel,
	createLabel 							= helpers.createLabel,
	createButton 							= helpers.createButton,
	sizeStart 								= helpers.sizeStart,
	sizeControlDelta 						= helpers.sizeControlDelta,
	splitPanel 								= helpers.splitPanel,
	getImage 								= helpers.getImage,
	getImage2 								= helpers.getImage2,
	getImage3 								= helpers.getImage3,
	createPixDiffLabel 						= helpers.createPixDiffLabel,
	checkImage 								= helpers.checkImage,
	checkImage2 							= helpers.checkImage2,
	checkImage3 							= helpers.checkImage3;


browser.pixDiff = new PixDiff ( {
	basePath: 	'./test/desktop/',
	diffPath: 	'./diff/'
} );

/*
var getImages = true;		//	When developing the test: 	true
							//	When regression testing:  	false	i.e., images will be checked against
							//										those gotten during development.
*/					
//	Parameters from the command line -
//
//		https://github.com/angular/protractor/blob/e7873093ada02ad6c9d6e190b7184775ab3686ce/docs/referenceConf.js#L87
//
//	Specified on the command line like -
//
//		--params.getImages true
//
var getImages = (browser.params.getImages === 'true');

var sGetCheck = getImages ? '\n  getImages: ' + getImages
						  : '\n  checking images';
						  
var testInputEleId  = 'rr-app-client-root-e2et-cmd-input';
var testOutputEleId = 'rr-app-client-root-e2et-cmd-output';

setCmdInputEleId ( testInputEleId + '-input' );
setCmdOutputEleId ( testOutputEleId + '-input' );

var rootPanelEleId = 'rr-app-client-root';

function getImageOfElement ( eleName, imgName ) {
	it ( 'Getting an image of ' + imgName + '. ', function ( done ) {
		clearElementCache();

		var ele = expect_ElementById_Present  ( eleName, true );
		getImage3 ( ele,  imgName )
			.then ( function() {
				done();
			} );
	} );
}	//	getImageOfElement()

function checkImageOfElement ( eleName, imgName ) {
	var sResult = 'result-not-set';
	it ( 'Checking image of ' + imgName + '. ', function ( done ) {
		clearElementCache();
		var ele = expect_ElementById_Present  ( eleName, true );
		checkImage3 ( ele, imgName )
			.then ( function ( s ) { 
				sResult = s; 
				done(); 
			} );
	} );

	it ( 'Expect identical images.', function ( done ) {
		expect ( sResult === 'identical', (sResult + ' === identical') ).to.equal ( true );
		done();
	} );
}	//	checkImageOfElement()


//	Drag & Drop (dock) properties to right side of root panel.  
//
//	Verify all is drawn correctly.
//
describe ( 'Dock properties on right side of root panel. ' + sGetCheck, function () {

	var sResult;

	//	Start with a blank root panel.
	//
	//	Click (will get the popup menu) - Properties (will show the properties panel).
	//
	//	Drag and drop the properties panel - dock it on the right side of the root panel.
	//
	//	Check the image (entire browser).
	//
	//	Size the browser smaller than the height of the properties table.
	//
	//	Check the image  (entire browser).  

	it ( 'To the home page (waiting 10 seconds for everything to load and transpile).', function ( done ) {
		browser.ignoreSynchronization = true;
		browser.get ( 'http://localhost:3000/' );
		setTimeout ( done, 10000 );		//	Wait 10 secs before we say we are done.
	} );

	it ( 'Setting browser window size ...', function ( done ) {
		browser.manage().window().setSize ( 700, 500 );
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

	it ( 'Click Properties ...', function ( done ) {
		clearElementCache();
		expect_ElementById_Present ( 'rr-2-rect-item-2', true );
		click_ElementById ( 'rr-2-rect-item-2' );
		done();
	} );

	it ( 'Pausing 1 second.', function ( done ) {
		setTimeout ( done, 1000 );
	} );

	it ( 'Start drag properties panel.', function ( done ) {
		clearElementCache();
		//	See -
		//		http://stackoverflow.com/questions/27825116/how-can-i-do-a-ctrlclick-on-protractor
		//		http://www.protractortest.org/#/api?view=webdriver.WebDriver.prototype.actions
		var webEle = expect_ElementById_Present  ( 'rr-3-base', true ).getWebElement();
		browser.actions()
			.mouseMove ( webEle, { x: 40,  y: 10 } )
			.keyDown ( protractor.Key.ALT )
			.mouseDown()
			.mouseMove ( webEle, { x: 300, y: 10 } )	//	target will not show unless we move off the dragee
			.perform();
		setTimeout ( done, 1000 );
	} );

	it ( 'Dock to right side of root panel.', function ( done ) {
		clearElementCache();
		var tgtWebEle = expect_ElementById_Present  ( rootPanelEleId + '-base-droptargetright', true ).getWebElement();
		browser.actions()
			.mouseMove ( tgtWebEle, { x: 70, y: 173 } )
			.mouseUp()
			.perform();
		setTimeout ( done, 1000 );
	} );

	it ( 'Hide the test input and output boxes.', function ( done ) {
		var webEle;
		clearElementCache();
		webEle = expect_ElementById_Present  ( testInputEleId,  true ).getWebElement();
		browser.executeScript ( 'arguments[0].style.visibility = "hidden"', webEle );
		webEle = expect_ElementById_Present  ( testOutputEleId, true ).getWebElement();
		browser.executeScript ( 'arguments[0].style.visibility = "hidden"', webEle );
		done();
	} );

	var eleName = 'rr-app-client-root';
	var imgName = 'root-panel-properties-docked-right-1';
	if ( getImages ) 
		getImageOfElement ( eleName, imgName );
	else 
		checkImageOfElement ( eleName, imgName );

	it ( 'Pausing 1 second.', function ( done ) {
		setTimeout ( done, 1000 );
	} );

	it ( 'Shorten the window to check properties table clipping.', function ( done ) {
		browser.manage().window().setSize ( 700, 192 );
		done();
	} );

	imgName = 'root-panel-properties-docked-right-2';
	if ( getImages ) 
		getImageOfElement ( eleName, imgName );
	else 
		checkImageOfElement ( eleName, imgName );

	it ( 'Show the test input and output boxes.', function ( done ) {
		var webEle;
		clearElementCache();
		webEle = expect_ElementById_Present  ( testInputEleId,  true ).getWebElement();
		browser.executeScript ( 'arguments[0].style.visibility = "visible"', webEle );
		webEle = expect_ElementById_Present  ( testOutputEleId, true ).getWebElement();
		browser.executeScript ( 'arguments[0].style.visibility = "visible"', webEle );
		done();
	} );

	it ( 'Pausing 3 seconds.', function ( done ) {
		setTimeout ( done, 3000 );
	} );

} );	//	describe ( 'Dock properties on right side of root panel. '


