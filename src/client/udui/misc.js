"use strict"

module.exports = (function() {
    return {
        value: null,
        hello: function ( name ) {
            console.log ( 'Hello ' + name + '!' );
        },
        setValue: function ( val ) {
            this.value = val;
        },
        getValue: function() {
            return this.value;
        }
    }
})();


