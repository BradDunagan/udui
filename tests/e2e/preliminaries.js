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
	getImage0 								= helpers.getImage0,
	getImage 								= helpers.getImage,
	createPixDiffLabel 						= helpers.createPixDiffLabel,
	checkImage 								= helpers.checkImage;


browser.pixDiff = new PixDiff ( {
	basePath: 	'./test/desktop/',
	diffPath: 	'./diff/'
} );

setCmdInputEleId ( 'udui-e2et-cmd-input' );
setCmdOutputEleId ( 'udui-e2et-cmd-output' );

describe ( 'Preliminaries. ', function () {

	//  windowed or full screen

	//  border -
	//		Transparent (or low alpha) border so that we can see excursions 
	//		(drawing outside the border).

	//  clipping -      nothing drawn outside top SVG

	it ( 'To the home page (waiting 2 seconds for everything to load and transpile).', function ( done ) {
		browser.ignoreSynchronization = true;
		browser.get ( 'http://localhost:3000/' );
		setTimeout ( done, 2000 );		//	Wait 2 secs before we say we are done.
	} );

//	it ( 'Setting browser window size ...', function ( done ) {
//		browser.manage().window().setSize ( 520, 480 );
//		done();
//	} );

	it ( 'Testing cmd intput/output. ', function ( done ) {
		clearElementCache();
		testCmdInputOutput ( 'testing! ...   testing! ...' )
			.then ( function ( text ) {
				output = JSON.parse ( text );
			//	expect ( output.status, msg ).to.eventually.equal ( 'ok' );
				expect ( output.status, msg ).to.equal ( 'ok' );
				done();
			} )
			.catch ( function() {
				expect ( true, 'intput/output error' ).to.equal ( false );
			} );
		done();
	} );

} );	//	describe ( 'Warm Up. '


