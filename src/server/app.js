const express = require ( 'express' );
const app = express();

/*
app.get ( '/', function ( req, res ) {
	res.send ( 'Hello World!  Load\'n it ...' )
} );
*/

var port = 7203;

app.listen ( port, function () {
	console.log ( 'App listening on port ' + port + '!' )
	app.use ( express.static ( './' ) );
} );
