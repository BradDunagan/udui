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

var	hasClass 								= helpers.hasClass,
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
	diffPath: 	'./diff/'
} );

describe ( 'Warm Up. ', function () {

	//	http://stackoverflow.com/questions/20927652/how-to-use-protractor-on-non-angularjs-website
	//	http://ng-learn.org/2014/02/Protractor_Testing_With_Angular_And_Non_Angular_Sites/
	it ( 'To the home page (waiting 10 seconds for everything to load and transpile).', function ( done ) {
		browser.ignoreSynchronization = true;
		browser.get ( 'http://localhost:3000/' );
		setTimeout ( done, 10000 );		//	Wait 10 secs before we say we are done.
	} );

	//	https://seleniumhq.github.io/selenium/docs/api/java/org/openqa/selenium/WebDriver.Window.html
	//	http://seleniumhq.github.io/selenium/docs/api/javascript/
	//	http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver.html
	//	http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_ThenableWebDriver.html
	//	http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_Options.html
	//	http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_Window.html
	//	https://github.com/SeleniumHQ/selenium/blob/master/javascript/node/selenium-webdriver/lib/webdriver.js#L1582
	//	https://github.com/SeleniumHQ/selenium/blob/master/javascript/node/selenium-webdriver/lib/webdriver.js#L2549
	it ( 'Setting browser window size ...', function ( done ) {
		browser.manage().window().setSize ( 520, 480 );
		done();
	} );

} );	//	describe ( 'Warm Up. '


/* 	This works.
describe ( 'Try pix-diff example. ', function () {

	beforeEach ( function() {
		browser.pixDiff = new PixDiff({
			basePath: './test/desktop/',
			diffPath: './diff/'
		});
		browser.get('http://www.example.com/');
	});

//	it ( 'should generate examplePage image', function() {
//		browser.pixDiff.saveScreen ( 'examplePage' )
//			.then ( function() {
//				console.log ( 'should have examplePage' );
//			} );
//	} );

	it ( 'should match the page', function() {
		browser.pixDiff.checkScreen('examplePage')
			.then ( function ( result ) {
			//	expect ( result.code ).toEqual ( PixDiff.RESULT_IDENTICAL );
				expect ( result.code ).to.equal ( PixDiff.RESULT_IDENTICAL );
			});
	});

	it ( 'should generate page title exampleRegion ', function() {
		browser.pixDiff.saveRegion ( element(by.css('h1')), 'exampleRegion' )
			.then ( function() {
				console.log ( 'should have exampleRegion' );
			} );
	} );

	it ( 'should match the page title', function() {
		browser.pixDiff.checkRegion ( element ( by.css ( 'h1' ) ), 'exampleRegion' )
			.then ( function ( result ) {
				expect ( result.code ).to.equal ( PixDiff.RESULT_IDENTICAL );
			} );
	} );

	it ( 'should not match the page title', function() {
		browser.pixDiff.checkRegion ( element ( by.css ( 'a' ) ), 'exampleRegion' )
			.then ( function ( result ) {
				expect(result.code).to.equal(PixDiff.RESULT_DIFFERENT);
			});
	});

} );	//	describe ( 'Try pix-diff example.'
*/
