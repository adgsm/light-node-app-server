// Reading arguments
var args = process.argv;

// Starting app servers
var appServer = new ( require( __dirname + '/libs/app-server/app-server.js' ) )();
appServer.start( args[2] , args[3] , args[4] , args[5] );
