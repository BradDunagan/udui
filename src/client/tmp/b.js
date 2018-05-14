"use strict"

module.exports = (function() {
    var misc = require ( '../udui/misc.js' );

    return {
        logID: function() {
            console.log ( 'This is b.' );
        },
        setMiscValue: function ( val ) {
            misc.setValue ( val );
        }
    }
})();


