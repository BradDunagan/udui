
//	suites -
//		http://www.protractortest.org/#/page-objects#configuring-test-suites

//	disabling info bar -
//		https://github.com/angular/protractor/blob/master/docs/browser-setup.md
//		https://sqa.stackexchange.com/questions/26051/chrome-driver-2-28-chrome-is-being-controlled-by-automated-test-software-notif
//
//	ChromeDriver - WebDriver for Chrome
//		https://sites.google.com/a/chromium.org/chromedriver/capabilities
//
//	Other -
//
//		Debugging Protractor Tests
//		https://github.com/angular/protractor/blob/master/docs/debugging.md

exports.config = {
	seleniumAddress: 	'http://localhost:4444/wd/hub',
	framework: 			'mocha',
	specs: 				['e2e/*.js'],

	mochaOpts: {
		reporter: 	'spec',
		slow: 		3000,
		timeout: 	300000
	},

	capabilities: {
		'browserName': 'chrome',
		'chromeOptions': {
			'args': ['disable-infobars']
		}
	},

	suites: {
		warmUp: 	'./e2e/test_1.js',
		pixDiff: 	'./e2e/test_2.js',

		preliminaries:	'./e2e/preliminaries.js',
		
		root: 		'./e2e/root.js',
		panels: 	'./e2e/panels.js',

		new: 		'./e2e/panels-ralph-dock-root-properties-a.js',
		
		all: 		[
			'./e2e/root.js',
			'./e2e/panels.js',
			'./e2e/panels-ralph-dock-root-properties-a.js',
		]
	}  
};
