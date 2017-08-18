// Create app server
class AppServer {
	constructor() {
		this.http = require( 'http' );
		this.https = require( 'https' );
		this.path = require( 'path' );
		this.fs = require( 'graceful-fs' );
		this.cluster = require( 'cluster' );
		this.os = require( 'os' );
		this.Response = new ( require( this.path.normalize( this.path.resolve( __dirname + '/' + '../response/response' ) ) ) )();
		this.app_config = require( this.path.normalize( this.path.resolve( __dirname + '/' + '/' + './app-server-config' ) ) );
		this.numCPUs = this.os.cpus().length;
	}

	start( host , port , secure_host , secure_port ) {
		var self  = this,
			host = ( host != undefined ) ? host : self.app_config.host,
			port = ( port != undefined ) ? port : self.app_config.port,
			secure_host = ( secure_host != undefined ) ? secure_host : self.app_config.secure_host,
			secure_port = ( secure_port != undefined ) ? secure_port : self.app_config.secure_port;

		var ca = [];
		if( self.app_config.ca != undefined && Object.prototype.toString.call( self.app_config.ca ) == '[object Array]' ) {
			self.app_config.ca.forEach( function( path ){
				ca.push( self.fs.readFileSync( path ) );
			} );
		}

		// https server options
		var https_options = {
			ca: ca,
			key: self.fs.readFileSync( self.app_config.keyPath ),
			cert: self.fs.readFileSync( self.app_config.certPath )
		};

		if ( self.cluster.isMaster ) {
			for (var i = 0; i < self.numCPUs; i++) {
				self.cluster.fork();
			}
		}
		else {
			// start https server
			var httpsServer = self.https.createServer( https_options , ( request , response ) => {
				// initialize response handler
				self.httpsServerHandler( httpsServer , request , response );
			} );
			httpsServer.listen( secure_port , () => {
				console.log( ( self.cluster.worker ? 'Worker "' + self.cluster.worker.id +'"' : 'Master' ) + ' is running HTTPS on port %s at host "' + self.os.hostname() + ' (%s)"', secure_port , secure_host );
			} );

			// start http server
			var httpServer = self.http.createServer( ( request , response ) => {
				// Permanent redirect to https (POST/PUT data will be lost)
				try{
					response.writeHead( 301, { 'Location' : 'https://' + request.headers.host.replace( port , secure_port ) + request.url , 'Expires': ( new Date ).toGMTString() } );
				}
				catch( e ){
	//					console.log( 'Malformed request (no host exists in headers)!' );
	//					console.log( e );
				}
				response.end();
			} );
			httpServer.listen( port , () => {
				console.log( ( self.cluster.worker ? 'Worker "' + self.cluster.worker.id +'"' : 'Master' ) + ' is running HTTP on port %s at host "' + self.os.hostname() + ' (%s)", and permanently redirecting to HTTPS', port , host );
			} );
		}
	}

	httpsServerHandler( httpsServer , request , response ) {
		var self = this;

		if( request && request.connection ) request.connection.setTimeout( self.app_config.connection_timeout );
		if( response && response.connection ) response.connection.setTimeout( self.app_config.connection_timeout );
		// Prevent favicon requests
		if ( request.url === '/favicon.ico') {
			response.writeHead( 200, { 'Content-Type' : 'image/x-icon' } );
			response.end();
			return;
		}

		var Router = new ( require( self.path.normalize( self.path.resolve( __dirname + '/' + '../router/router' ) ) ) )( httpsServer );
		var route = Router.route( request , response , httpsServer );
		if( !route ) {
			var errorMessage = 'Router did not digest request!';
			self.Response.write( request , response , { statusCode: 500 , content: errorMessage , rest: true , pretty: 4 , filter: null , cookie: null , compress: true , binary : false ,  headers: {} } );
		}
	}
}

module.exports = AppServer;
