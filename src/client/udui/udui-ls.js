'use strict';

//  local storage

//  On listing the items in storage -
//
//      https://html.spec.whatwg.org/multipage/webstorage.html
//
//      There is a length attribute and a key ( n ) function.  key() takes the
//      index of the key you want.

module.exports = (function() { 

	var serviceId = 'rrLS';

	/* jshint validthis: true */

	var svc = {};

	svc.ls = null;           //  Local Storage

	svc.types = {};          //  Types of stuff stored in localStorage.

	svc.bInitialized = false;

	svc.meta = { enabled: false };

	function initialPopulation() {

	    var meta = svc.getItem ( 'ls', 'meta' );

	    if ( typeof meta === 'object' )
	        svc.meta = meta;
	    else
	        svc.setItem ( 'ls', 'meta', svc.meta );

	}   //  initialPopulation()

	function init() {

		if (svc.bInitialized) 
			return;

		if ( ('localStorage' in window) && (window.localStorage !== null) ) {
		//	console.log ( 'localStorage: Is available!' );
			svc.ls = window.localStorage;
		}

		svc.addType ( 'ls' );                      //  Enabling use of LS, etc..

		svc.addType ( 'api-systems' );
		svc.addType ( 'api-system-selected' );
		svc.addType ( 'api-load-ntrp' );
		svc.addType ( 'api-record' );
		svc.addType ( 'pes' );
		svc.addType ( 'vpes' );
		svc.addType ( 'vpe' );
		svc.addType ( 'ntrp' );
		svc.addType ( 'vals' );
	    svc.addType ( 'odef' );
	    svc.addType ( 'world' );
	    svc.addType ( 'GenRobot' );
	    svc.addType ( 'data' );
	    svc.addType ( 'udui' );
	    svc.addType ( 'udui-built-in' );
	    svc.addType ( 'udui-user-defined' );

		svc.bInitialized = true;

		initialPopulation();

	}   //  init()

	svc.clear = function() {

		init();

		svc.ls.clear();

		svc.meta.enabled = false;

		initialPopulation();

	};  //  svc.clear()

	svc.isEnabled = function() {

	    init();

	    return svc.meta.enabled;

	};  //  svc.enable()

	svc.enable = function ( bEnable ) {

	    init();

	    svc.meta.enabled = bEnable;

	    svc.setItem ( 'ls', 'meta', svc.meta );

	};  //  svc.enable()

	function squish ( o ) {
	    //  Return a compact string representation of o's member values.
	    if ( typeof o === 'string' )
	        return o;
	    if ( typeof o === 'number' )
	    	return o;
	    var ks = Object.keys ( o ), s = '', i;
	    if ( (i = ks.indexOf ( 'bUpdate' )) >= 0 )
	        ks.splice ( i, 1 );
	    ks.sort();
	    for ( i = 0; i < ks.length; i++ ) {
	        if ( s.length > 0 ) {
	            s += '-';
	        }
	        if ( typeof o[ks[i]] === 'object' ) {
	            s += squish ( o[ks[i]] );
	        }
	        else {
	            s += o[ks[i]].toString();
	        }
	    }
	    return s;            
	}   //  squish()

	svc.addType = function ( type ) {
	    svc.types[type] = true;
	};  //  svc.addType()

	svc.addTypes = function ( types ) {
	    for ( var t in types ) {
	        if ( ! types.hasOwnProperty ( t ) )
	            continue;
	        svc.types[types[t]] = true;
	    }
	};  //  svc.addTypes()


	svc.getItem = function ( type, key ) {

		//  Return false if type is not what is stored or if an item 
		//  matching the type and key is not present.
		//
		//  Else return the item.

		var fullKey, log = {}, sItem;

		init();

		if ( ! svc.ls )
			return false;

		if ( ! svc.types[type] )
			return false;

		if ( (type !== 'ls') && (key !== 'meta') && ! svc.meta.enabled )
			return false;

		fullKey = type + '-' + squish ( key );

		log.key = fullKey;

		sItem = svc.ls.getItem ( fullKey );

		log.itemPresent = (sItem != null);

	//	console.log ( 'localStorage -\n' + JSON.stringify ( log, null, '    ' ) );

		if ( sItem ) 
			return JSON.parse ( sItem );

		return false;

	};  //  svc.getItem()


	function getFullKey ( type, key ) {

	    var fullKey;

	    init();

	    if ( ! svc.ls )
	        return false;

	    if ( ! svc.types[type] )
	        return false;

	    if ( (type !== 'ls') && (key !== 'meta') && ! svc.meta.enabled )
	        return false;

	    fullKey = type + '-' + squish ( key );

	    return fullKey;

	}   //  getFullKey()

	svc.setItem = function ( type, key, item ) {

	//	var fullKey, sItem, js = [];
	//
	//	init();
	//
	//	if ( ! svc.ls )
	//		return false;
	//
	//	if ( ! svc.types[type] )
	//		return false;
	//
	//	if ( (type !== 'ls') && (key !== 'meta') && ! svc.meta.enabled )
	//		return false;
	//
	//	if ( ! item )
	//		return false;
	//
	//	fullKey = type + '-' + squish ( key );

		var fullKey = getFullKey ( type, key ), sItem, js = [];

		if ( ! fullKey )
			return false;

		function replacer ( key, value ) {
			if ( key.slice ( 0, 1 ) === '$' )
				return undefined;
			if ( (typeof value === 'object') && (! Array.isArray ( value )) ) {
				if ( js.indexOf ( value ) >= 0 )
					console.log ( 'rrLS setItem(): hold on there!  circular stuff?' );
				js.push ( value );
			}
			return value;
	    }

		if ( typeof item === 'string' )
			sItem = item;
		else 
			sItem = JSON.stringify ( item, replacer, '' );

		try {
			svc.ls.setItem ( fullKey, sItem );
		} catch ( e ) {
			var msg;
			if ( typeof e === 'string' )
				msg = e;
			else
				if ( typeof e.message === 'string' )
			msg = e.message;
				else
			if ( typeof e === 'object' )
				msg = JSON.stringify ( e );
			else
				msg = '' + e;
			console.log ( 'rrLS setItem(): ERROR - ' + msg );
		}


		//  console.log ( 'localStorage - set item - key: ' + fullKey );

		return true;

	};  //  svc.setItem()

	svc.removeItem = function ( type, key ) {

		var fullKey = getFullKey ( type, key ), sItem;

		if ( ! fullKey )
			return false;

		svc.ls.removeItem ( fullKey );

		//  console.log ( 'localStorage - remove item - key: ' + fullKey );

		return true;

	};  //  svc.removeItem()

	return svc;

})();
