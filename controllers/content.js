// content controller
class Content {
	constructor( server ) {
		this.server = server;
		this.path = require( 'path' );
		this.fs = require( 'graceful-fs' );
		this.os = require( 'os' );
		this.crypto = require( 'crypto' );
		this.Response = new ( require( this.path.normalize( this.path.resolve( __dirname + '/' + '../libs/response/response' ) ) ) )();
		this.Common = new ( require( this.path.normalize( this.path.resolve( __dirname + '/' + './common' ) ) ) )( server );
		this.app_config = require( this.path.normalize( this.path.resolve( __dirname + '/' + '../libs/app-server/app-server-config' ) ) );
		this.uploadDir = this.app_config[ 'upload_dir' ] || this.os.tmpdir();
	}

	// content stream
	stream( request , response , callback ) {
		var self = this,
			start = null,
			end = null,
			rangeHeader = ( request.headers && request.headers.range ) ? request.headers.range : null,
			route = ( request && request.route != undefined ) ? request.route : null,
			query = ( route ) ? route.query : null,
			actionPath = ( query && query.actionPath ) ? query.actionPath : ( ( route ) ? route.actionPath : null ),
			content = ( query && query.content ) ? query.content : actionPath;

		query.content = content = content.split( '../' ).join( '' );

		if( content == null || content == undefined ){
			self.Response.write( request , response , { statusCode: 400 , content: { 'message' :'Invalid request.' } , rest: true , pretty: request.route.query.pretty , filter: null , cookie: null , compress: true , binary : false ,  headers: {} } );
			return;
		}
		var path = self.path.normalize( self.path.resolve( self.app_config[ 'upload_dir' ] + '/' + content ) );

		self.fs.stat( path , function( err , stats ){
			if( err ) {
				self.Response.write( request , response , { statusCode: 400 , content: err , rest: true , pretty: request.route.query.pretty , filter: null , cookie: null , compress: true , binary : false ,  headers: {} } );
				return;
			}
			if( rangeHeader ){
				var total = stats[ 'size' ],
					positions = rangeHeader.replace( /bytes=/ , '' ).split( '-' ),
					start = parseInt( positions[0] , 10 ),
					end = positions[1] ? parseInt( positions[1] , 10 ) : NaN;
				if ( isNaN( start ) && !isNaN( end ) ) {
					start = total - end;
					end = total ? total - 1 : 0;
				}
				else if ( !isNaN( start ) && isNaN( end ) ) {
					end = total ? total - 1 : 0;
				}
			}
			var streamResponse = [],
				streamOptions = ( start != null && end != null ) ?
					{ start: start, end: end , autoClose: true } : null,
				stream = ( streamOptions != null ) ? self.fs.createReadStream( path , streamOptions ) : self.fs.createReadStream( path );

			stream.setEncoding( 'binary' );
			stream.on( 'data', ( chunk ) => {
				streamResponse.push( chunk );
			} );

			stream.on( 'end', () => {
				self.Response.write( request , response , { statusCode: 200 , content: streamResponse.join( '' ) , rest: false , pretty: request.route.query.pretty , filter: null , cookie: null , compress: false , binary : true ,  headers: {} } );
			} );

			stream.on( 'error', ( err ) => {
				self.Response.write( request , response , { statusCode: 500 , content: err , rest: true , pretty: request.route.query.pretty , filter: null , cookie: null , compress: true , binary : false ,  headers: {} } );
			} );
		} );
	}
}

module.exports = Content;
