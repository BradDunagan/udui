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
	diffPath: 	'./diff/',
} );

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
	sendCtrlA_ElementById 					= helpers.sendCtrlA_ElementById,
	getOutputText 							= helpers.getOutputText,
	createPanel 							= helpers.createPanel,
	createLabel 							= helpers.createLabel,
	createButton 							= helpers.createButton,
	sizeStart 								= helpers.sizeStart,
	sizeControlDelta 						= helpers.sizeControlDelta,
	splitPanel 								= helpers.splitPanel,
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


//	Verify panels are drawn correctly.  

describe ( 'Preparing to test paneless panel geometry. ', function () {

	it ( 'To the home page (waiting 10 seconds for everything to load and transpile).', function ( done ) {
		browser.ignoreSynchronization = true;
		browser.get ( 'http://localhost:3000/' );
		setTimeout ( done, 10000 );		//	Wait 10 secs before we say we are done.
	} );

	it ( 'Setting browser window size ...', function ( done ) {
		browser.manage().window().setSize ( 520, 480 );
		done();
	} );

	//	Can't seem to get ctrl-a to work in the createPixDiffLabel() call below so
	//	sending it separately here.  When this suite is run by itself (when there is
	//	not the root.js suite running immediately before this) this is not necessary.
	//	Why?
	it ( 'Ctrl-A on input element ...', function ( done ) {			//	select all so that it is deleted when the new text is inserted
		var cmdInputEleId = testInputEleId + '-input';
		clearElementCache();
		expect_ElementById_Present ( cmdInputEleId, true );
		sendCtrlA_ElementById ( cmdInputEleId );
		setTimeout ( done, 3000 );
	} );

	it ( 'Creating a transparent label element. ', function ( done ) {
		clearElementCache();
		createPixDiffLabel();
		done();
	} );

//	it ( 'Pausing 300 seconds.', function ( done ) {				//	when debugging the Ctrl-A issue above
//		setTimeout ( done, 300000 );
//	} );

} );	//	describe ( 'Preparing to test paneless geometry. '


var panel1 = { 
	x: 		20.5,
	y: 		60.5,
	w: 		200,
	h: 		150,
	name: 	'testPanel',
	eleId: 	'rr-test-panel-1'
};

describe ( 'Paneless panel geometry warm-up. ' + sGetCheck, function () {

	var err = null;

	it ( 'Create a panel at 20.5 60.5. ', function ( done ) {
		clearElementCache();
		createPanel ( panel1 );
		done();
	//	console.log ( 'created panel - pausing 20 secs')
	//	setTimeout ( done, 20000 );		//	Wait 10 secs before we say we are done.
	} );

	if ( getImages ) {
		it ( 'Getting an image of panel-1. ', function ( done ) {
			clearElementCache();
			getImage ( 15, 55, 210, 160, 'panel-1' )
				.then ( function() {
					done();
				} );
		} );
	} else {
		var sResult = 'result-not-set';
		it ( 'Checking image of panel-1.', function ( done ) {
			sResult = 'result-not-set';
			checkImage2 ( panel1, 'panel-1' ).then ( function ( s ) { sResult = s; done(); } );
		} );

		it ( 'Expect identical images.', function ( done ) {
			expect ( sResult === 'identical', (sResult + ' === identical') ).to.equal ( true );
			done();
		} );
	}


	it ( 'Splitting panel horizontally. ', function ( done ) {
		clearElementCache();
		splitPanel ( panel1.eleId, 'horz' );
		done();
	//	setTimeout ( done, 2000 );
	} );

	if ( getImages ) {
		it ( 'Getting an image of panel-1-split-horz-1. ', function ( done ) {
			clearElementCache();
			getImage ( 15, 55, 210, 160, 'panel-1-split-horz-1' )
				.then ( function() {
					done();
				} );
		} );
	} else {
		it ( 'Checking image of panel-1-split-horz-1.', function ( done ) {
			sResult = 'result-not-set';
			checkImage2 ( panel1, 'panel-1-split-horz-1' ).then ( function ( s ) { sResult = s; done(); } );
		} );

		it ( 'Expect identical images.', function ( done ) {
			expect ( sResult === 'identical', (sResult + ' === identical') ).to.equal ( true );
			done();
		} );
	}
} );	//	describe ( 'Paneless panel geometry warm-up. '


describe ( 'Panel w, h even and odd number of pixels - split horz - panels-2. ' + sGetCheck, function () {
	var panel2a = { x: 5.5,  y:  55.5,  w: 100,  h: 50, name: 'ralph', eleId: 'rr-ralph' };
	var panel2b = { x: 5.5,  y: 110.5,  w: 101,  h: 51, name: 'waldo', eleId: 'rr-waldo' };
	var button2 = { x:  3, y:  3, w: 10, h:  5, name: 'btn', text: 'btn' };
	var label2a = { x: 20, y:  5, w: 70, h: 15, name: 'lblA', text: 'not on grid', hasBorder: false, vertAlign: 'middle',  horzAlign: 'left' };
	var label2b = { x: 20, y: 20, w: 70, h: 15, name: 'lblB', text: 'w, h += 1',   hasBorder: false, vertAlign: 'middle',  horzAlign: 'left' };

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
		createPanel ( panel2a );
		done();
	} );

	it ( 'Add button2 to panel ralph. ', function ( done ) {
		clearElementCache();
		createButton ( panel2a.eleId, button2 );
		done();
	} );

	it ( 'Add label2a to panel ralph. ', function ( done ) {
		clearElementCache();
		createLabel ( panel2a.eleId, label2a );
		done();
	} );


	it ( 'Create panel waldo w,h += 1. ', function ( done ) {
		clearElementCache();
		createPanel ( panel2b );
		done();
	} );

	it ( 'Add button2 to panel waldo. ', function ( done ) {
		clearElementCache();
		createButton ( panel2b.eleId, button2 );
		done();
	} );

	it ( 'Add label2a to panel waldo. ', function ( done ) {
		clearElementCache();
		createLabel ( panel2b.eleId, label2a );
		done();
	} );

	it ( 'Add label2b to panel waldo. ', function ( done ) {
		clearElementCache();
		createLabel ( panel2b.eleId, label2b );
		done();
	} );

//	it ( 'Look right? ', function ( done ) {
//		setTimeout ( done, 2000 );
//	} );

	var imgRect = { x: 6.5, y: 55.5, w: 102, h: 106 };
	var imgName = 'panels-2';
	if ( getImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	//	Split the panels.
	//
	it ( 'Split ralph horizontally. ', function ( done ) {
		clearElementCache();
		splitPanel ( panel2a.eleId, 'horz' );
		done();
	} );

	var output, leftPanelEleId, rightPanelEleId;
	it ( 'Get ralph left and right panel element Ids. ', function ( done ) {
		clearElementCache();
		getOutputText()
			.then ( function ( text ) {
			//	console.log ( 'ralph left and right panel element Id: ' + text);
				output = JSON.parse ( text );
				leftPanelEleId  = output.leftPanelEleId;
				rightPanelEleId = output.rightPanelEleId;
				done();
			} )
			.catch ( function() {
				expect ( true, 'ralph left and right panel element Id error' ).to.equal ( false );
			} );
		done();
	} );

	it ( 'Add button2 to ralph right panel. ', function ( done ) {
		clearElementCache();
		createButton ( rightPanelEleId, button2 );
		done();
	} );

	it ( 'Split waldo horizontally. ', function ( done ) {
		clearElementCache();
		splitPanel ( panel2b.eleId, 'horz' );
		done();
	} );

	it ( 'Get waldo left and right panel element Ids. ', function ( done ) {
		clearElementCache();
		getOutputText()
			.then ( function ( text ) {
			//	console.log ( 'waldo left and right panel element Id: ' + text);
				output = JSON.parse ( text );
				leftPanelEleId  = output.leftPanelEleId;
				rightPanelEleId = output.rightPanelEleId;
				done();
			} )
			.catch ( function() {
				expect ( true, 'waldo left and right panel element Id error' ).to.equal ( false );
			} );
		done();
	} );

	it ( 'Add button2 to waldo right panel. ', function ( done ) {
		clearElementCache();
		createButton ( rightPanelEleId, button2 );
		done();
	} );

	imgName = 'panels-2-split-horz-1';
	if ( getImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	//	Still good after sizing?
	//
	it ( 'Start sizing. ', function ( done ) {
		clearElementCache();
		sizeStart ( panel2a.eleId );
		sizeStart ( panel2b.eleId );
		done();
	} );

	it ( 'Increment size x +1. ', function ( done ) {
		clearElementCache();
		sizeControlDelta ( panel2a.eleId, 1, 0 );
		sizeControlDelta ( panel2b.eleId, 1, 0 );
	//	done();
		setTimeout ( done, 1000 );
	} );

	imgName = 'panels-2-split-horz-1-size-1-0';
	if ( getImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	it ( 'Increment size y +1. ', function ( done ) {
		clearElementCache();
		sizeControlDelta ( panel2a.eleId, 0, 1 );
		sizeControlDelta ( panel2b.eleId, 0, 1 );
	//	done();
		setTimeout ( done, 1000 );
	} );

	imgName = 'panels-2-split-horz-1-size-1-1';
	if ( getImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	it ( 'Increment size x +1. ', function ( done ) {
		clearElementCache();
		sizeControlDelta ( panel2a.eleId, 1, 0 );
		sizeControlDelta ( panel2b.eleId, 1, 0 );
	//	done();
		setTimeout ( done, 1000 );
	} );

	imgName = 'panels-2-split-horz-1-size-2-1';
	if ( getImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	it ( 'Increment size y +1. ', function ( done ) {
		clearElementCache();
		sizeControlDelta ( panel2a.eleId, 0, 1 );
		sizeControlDelta ( panel2b.eleId, 0, 1 );
	//	done();
		setTimeout ( done, 1000 );
	} );

	imgName = 'panels-2-split-horz-1-size-2-2';
	if ( getImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

} );	//	describe ( 'Panel w, h even and odd number of pixels - split horz - panels-2. '


describe ( 'Panel w, h even and odd number of pixels - split vert - panels-3. ' + sGetCheck, function () {
	var panel3a = { x: 5.5,  y:  55.5,  w: 100,  h: 100, name: 'ralph', eleId: 'rr-ralph' };
	var panel3b = { x: 5.5,  y: 165.5,  w: 101,  h: 101, name: 'waldo', eleId: 'rr-waldo' };
	var button3 = { x:  3, y:  3, w: 10, h:  5, name: 'btn', text: 'btn' };
	var label3a = { x: 20, y:  5, w: 70, h: 15, name: 'lblA', text: 'not on grid', hasBorder: false, vertAlign: 'middle',  horzAlign: 'left' };
	var label3b = { x: 20, y: 20, w: 70, h: 15, name: 'lblB', text: 'w, h += 1',   hasBorder: false, vertAlign: 'middle',  horzAlign: 'left' };

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
		createPanel ( panel3a );
		done();
	} );

	it ( 'Add button3 to panel ralph. ', function ( done ) {
		clearElementCache();
		createButton ( panel3a.eleId, button3 );
		done();
	} );

	it ( 'Add label3a to panel ralph. ', function ( done ) {
		clearElementCache();
		createLabel ( panel3a.eleId, label3a );
		done();
	} );


	it ( 'Create panel waldo w,h += 1. ', function ( done ) {
		clearElementCache();
		createPanel ( panel3b );
		done();
	} );

	it ( 'Add button3 to panel waldo. ', function ( done ) {
		clearElementCache();
		createButton ( panel3b.eleId, button3 );
		done();
	} );

	it ( 'Add label3a to panel waldo. ', function ( done ) {
		clearElementCache();
		createLabel ( panel3b.eleId, label3a );
		done();
	} );

	it ( 'Add label3b to panel waldo. ', function ( done ) {
		clearElementCache();
		createLabel ( panel3b.eleId, label3b );
		done();
	} );

//	it ( 'Look right? ', function ( done ) {
//		setTimeout ( done, 2000 );
//	} );

	var imgRect = { x: 6.5, y: 55.5, w: 102, h: 216 };
	var imgName = 'panels-3';
	if ( getImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );


	//	Split the panels.
	//
	it ( 'Split ralph vertically. ', function ( done ) {
		clearElementCache();
		splitPanel ( panel3a.eleId, 'vert' );
		done();
	} );

	var output, topPanelEleId, bottomPanelEleId;
	it ( 'Get ralph top and bottom panel element Ids. ', function ( done ) {
		clearElementCache();
		getOutputText()
			.then ( function ( text ) {
			//	console.log ( 'ralph top and bottom panel element Id: ' + text);
				output = JSON.parse ( text );
				topPanelEleId    = output.topPanelEleId;
				bottomPanelEleId = output.bottomPanelEleId;
				done();
			} )
			.catch ( function() {
				expect ( true, 'ralph top and bottom panel element Id error' ).to.equal ( false );
			} );
		done();
	} );

	it ( 'Add button3 to ralph bottom panel. ', function ( done ) {
		clearElementCache();
		createButton ( bottomPanelEleId, button3 );
		done();
	} );

	it ( 'Split waldo vertically. ', function ( done ) {
		clearElementCache();
		splitPanel ( panel3b.eleId, 'vert' );
		done();
	} );

	it ( 'Get waldo top and bottom panel element Ids. ', function ( done ) {
		clearElementCache();
		getOutputText()
			.then ( function ( text ) {
			//	console.log ( 'waldo top and bottom panel element Id: ' + text);
				output = JSON.parse ( text );
				topPanelEleId    = output.topPanelEleId;
				bottomPanelEleId = output.bottomPanelEleId;
				done();
			} )
			.catch ( function() {
				expect ( true, 'waldo top and bottom panel element Id error' ).to.equal ( false );
			} );
		done();
	} );

	it ( 'Add button3 to waldo bottom panel. ', function ( done ) {
		clearElementCache();
		createButton ( bottomPanelEleId, button3 );
		done();
	} );

	imgName = 'panels-3-split-vert-1';
	if ( getImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );


	//	Still good after sizing?
	//
	it ( 'Start sizing. ', function ( done ) {
		clearElementCache();
		sizeStart ( panel3a.eleId );
		sizeStart ( panel3b.eleId );
		done();
	} );

	it ( 'Increment size x +1. ', function ( done ) {
		clearElementCache();
		sizeControlDelta ( panel3a.eleId, 1, 0 );
		sizeControlDelta ( panel3b.eleId, 1, 0 );
	//	done();
		setTimeout ( done, 1000 );
	} );

	imgName = 'panels-3-split-vert-1-size-1-0';
	if ( getImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	it ( 'Increment size y +1. ', function ( done ) {
		clearElementCache();
		sizeControlDelta ( panel3a.eleId, 0, 1 );
		sizeControlDelta ( panel3b.eleId, 0, 1 );
	//	done();
		setTimeout ( done, 1000 );
	} );

	imgName = 'panels-3-split-vert-1-size-1-1';
	if ( getImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	it ( 'Increment size x +1. ', function ( done ) {
		clearElementCache();
		sizeControlDelta ( panel3a.eleId, 1, 0 );
		sizeControlDelta ( panel3b.eleId, 1, 0 );
	//	done();
		setTimeout ( done, 1000 );
	} );

	imgName = 'panels-3-split-vert-1-size-2-1';
	if ( getImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

	it ( 'Increment size y +1. ', function ( done ) {
		clearElementCache();
		sizeControlDelta ( panel3a.eleId, 0, 1 );
		sizeControlDelta ( panel3b.eleId, 0, 1 );
	//	done();
		setTimeout ( done, 1000 );
	} );

	imgName = 'panels-3-split-vert-1-size-2-2';
	if ( getImages ) 
		getImage0 ( imgRect, imgName );
	else 
		checkImage0 ( imgRect, imgName );

} );	//	describe ( 'Panel w, h even and odd number of pixels - split horz - panels-3. '


