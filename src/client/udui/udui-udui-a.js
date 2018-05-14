'use strict';

//  app/partials/udui/udui-udui-a.js

//	UDUI: User Defined User Interface

//	The RR App UDUI -
//
//		The RR user-facing app's UI is implemented with SVG UDUI stuff.  It is
//		the "rr-app" UDUI.  It has panels, etc..
//
//	RR Elements -
//
//		Panels in the rr-app UDUI may represent RR System elements.  
//
//		A Process Element (PE), for example, may have a child panel that is itself 
//		a UDUI for that PE.
//
//	So generally there are multiple UDUIs for any RR System and this service maintains
//	those UDUIs.

//	Useful to -
//
//		Controlling, allocating IDs of UDUIs so that UDUIs can be indexed, stored for
//		persistence.

module.exports = (function() { 

	var serviceId = 'uduiUduiA';

	/* jshint validthis: true */

	var svc = {};

	svc.nextUduiId = 0;

	return svc;

})();
