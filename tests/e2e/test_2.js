/* global describe */
/* global it */
/* global browser */
/* global Keys */
/* global beforeEach */
/* global element */
/* global by */

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
	getImage 								= helpers.getImage,
	createPixDiffLabel 						= helpers.createPixDiffLabel,
	checkImage 								= helpers.checkImage;

/*	For screen capture and compare stuff.

// create a WebdriverIO instance
var client = require ( 'webdriverio' ).remote({
	desiredCapabilities: {
		browserName: 'chrome'
	}
	} ).init();
// initialise WebdriverCSS for `client` instance
require ( 'webdrivercss' ).init ( client, {
	// example options
	screenshotRoot: 'my-shots',
	failedComparisonsRoot: 'diffs',
});
*/

browser.pixDiff = new PixDiff ( {
	basePath: 	'./test/desktop/',
	diffPath: 	'./diff/',
} );

console.log ( 'PixDiff.THRESHOLD_PERCENT: ' + PixDiff.THRESHOLD_PERCENT );
console.log ( 'PixDiff.THRESHOLD_PIXEL:   ' + PixDiff.THRESHOLD_PIXEL );

var testInputEleId  = 'rr-app-client-root-e2et-cmd-input';
var testOutputEleId = 'rr-app-client-root-e2et-cmd-output';

setCmdInputEleId ( testInputEleId + '-input' );
setCmdOutputEleId ( testOutputEleId + '-input' );

describe ( 'Preparing to test UDUI (paneless) geometry. ', function () {

	it ( 'To the home page (waiting 10 seconds for everything to load and transpile).', function ( done ) {
		browser.ignoreSynchronization = true;
		browser.get ( 'http://localhost:3000/' );
		setTimeout ( done, 10000 );		//	Wait 10 secs before we say we are done.
	} );

	it ( 'Setting browser window size ...', function ( done ) {
		browser.manage().window().setSize ( 520, 480 );
		done();
	} );

//	it ( 'Waiting 60 seconds.', function ( done ) {
//		setTimeout ( done, 60000 );
//	} );

	it ( 'Creating a transparent label element. ', function ( done ) {
		clearElementCache();
		createPixDiffLabel();
		done();
	} );

//	it ( 'Waiting 120 seconds.', function ( done ) {
//		setTimeout ( done, 120000 );
//	} );

} );	//	describe ( 'Preparing to test paneless geometry. '

describe ( 'Use pix-diff to verify UDUI (paneless) geometry. ', function () {

	var err = null;

	it ( 'Create a panel at 20.5 60.5. ', function ( done ) {
		clearElementCache();
		var cmdInputEleId = 'rr-app-client-root-e2et-cmd-input-input';
		var cmd = {
			cmd: 	'create-panel',
			args: {
				x: 		20.5,
				y: 		60.5,
				w: 		200,
				h: 		150,
				name: 	'testPanel',
				eleId: 	'rr-test-panel-1'
			}
		};
		var sCmd = JSON.stringify ( cmd );
		expect_ElementById_Present ( cmdInputEleId, true );
		sendKeys_ElementById ( cmdInputEleId, sCmd, { selectAllFirst: true } );
		sendEnter_ElementById ( cmdInputEleId );
		done();
	} );
/*
	it ( 'Getting an image of panel-1-err. ', function ( done ) {
		clearElementCache();
		getImage ( 15, 55, 210, 160, 'panel-1-err' )
			.then ( function() {
				done();
			} );
	} );
*/
	it ( 'Checking image of panel-1-err.', function ( done ) {
		var options = {	
			//	Note that these are not well documented (if at all) in the pix-diff
			//	docs.  See PixelDiff (what pix-diff calls) code.
//			debug: 			true,	//	shows filters in output image
//			thresholdType: 	PixDiff.THRESHOLD_PERCENT,
//			threshold: 		0.00
			thresholdType: 	PixDiff.THRESHOLD_PIXEL,
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
		clearElementCache();
		checkImage ( 15, 55, 210, 160, 'panel-1-err', options )
			.then ( function ( result ) {
				expect ( result.code ).to.equal ( PixDiff.RESULT_IDENTICAL );
				done();
			} )
			.catch ( function ( error ) {
				err = error;
				done();
			} );
	} );

	it ( 'Expect identical images.', function ( done ) {
		if ( err )
			console.log ( err );
		expect ( err === null, 'err === null' ).to.equal ( true );
		done();
	} );

} );	//	describe ( 'Use pix-diff to verify paneless geometry. '

