// Response
class Response {
	constructor() {
		this.path = require( 'path' );
		this.zlib = require( 'zlib' );
		this.response_config = require( this.path.normalize( this.path.resolve( __dirname + '/' + './response-config' ) ) );
		this.Rest = new ( require( this.path.normalize( this.path.resolve( __dirname + '/' + '../rest/rest' ) ) ) )();
	}

	// write
	write( request , response , parameters , callback ) {
		var self = this,
			forceStatusCode = request.route.query[ 'force-status-code' ],
			forceContentType = request.route.query[ 'force-content-type' ];

		if( parameters == undefined ) parameters = self.response_config;

		if( !parameters[ 'headers' ] ) parameters[ 'headers' ] = {};
		if( !parameters[ 'content' ] ) parameters[ 'content' ] = '';

		if( forceStatusCode ){
			parameters[ 'statusCode' ] = forceStatusCode;
		}
		else {
			if( !parameters[ 'statusCode' ] ) parameters[ 'statusCode' ] = 500;
		}

		if( forceContentType ) parameters[ 'headers' ][ 'Content-Type' ] = forceContentType;

		if( parameters[ 'cookie' ] ) {
			parameters[ 'headers' ][ 'Set-Cookie' ] = self.checkCookies( parameters[ 'cookie' ] );
		}

		if( parameters[ 'rest' ] === true ) {
			parameters[ 'pretty' ] = ( parameters[ 'pretty' ] != undefined ) ? ( ( parseInt( parameters[ 'pretty' ] , 10 ) != NaN ) ? parseInt( parameters[ 'pretty' ] , 10 ) : parameters[ 'pretty' ] ) : 0;
			parameters[ 'headers' ] = self.Rest.headers( parameters[ 'headers' ] );
			parameters[ 'content' ] = self.Rest.response( parameters[ 'content' ] , parameters[ 'statusCode' ] , parameters[ 'pretty' ] , parameters[ 'filter' ] );
		}
		else {
			if( Object.prototype.toString.call( parameters[ 'content' ] ) == '[object Object]' || Object.prototype.toString.call( parameters[ 'content' ] ) == '[object Array]' ) {
				parameters[ 'content' ] = JSON.stringify( parameters[ 'content' ] );
			}
		}

		var total = parameters[ 'headers' ][ 'Content-Length' ] = ( parameters[ 'headers' ][ 'Content-Length' ] ) ? parameters[ 'headers' ][ 'Content-Length' ] : parameters[ 'content' ].length,
			rangeHeader = request.headers.range;

		if( rangeHeader ){
			var positions = rangeHeader.replace( /bytes=/ , '' ).split( '-' ),
				start = parseInt( positions[0] , 10 ),
				end = positions[1] ? parseInt( positions[1] , 10 ) : NaN;

			if ( isNaN( start ) && !isNaN( end ) ) {
				start = total - end;
				end = total ? total - 1 : 0;
			}
			else if ( !isNaN( start ) && isNaN( end ) ) {
				end = total ? total - 1 : 0;
			}

			var chunksize = ( end - start ) + 1;

			parameters[ 'headers' ][ 'Content-Range' ] = 'bytes ' + start + '-' + end + '/' + total;
			parameters[ 'headers' ][ 'Content-Length' ] = chunksize;
//			parameters[ 'headers' ][ 'Content-Type' ] = parameters[ 'headers' ][ 'Content-Type' ].split( ';' )[0];
			parameters[ 'headers' ][ 'Content-Type' ] = parameters[ 'headers' ][ 'Content-Type' ];
			parameters[ 'statusCode' ] = 206;
			parameters[ 'content' ] = parameters[ 'content' ].slice( start , end + 1 );
		}

		if( parameters[ 'compress' ] ) {
			switch( request.acceptEncoding ) {
				case 'deflate':
					self.zlib.deflate( parameters[ 'content' ] , ( err , result ) => {
						parameters[ 'headers' ][ 'Content-Encoding' ] = 'deflate';
						parameters[ 'headers' ][ 'Content-Length' ] = result.length;
						response.writeHead( parameters[ 'statusCode' ] , parameters[ 'headers' ] );
						( parameters[ 'binary' ] ) ? response.end( result , 'binary' ) : response.end( result );
					} );
				break;
				case 'gzip':
					self.zlib.gzip( parameters[ 'content' ] , ( err , result ) => {
						parameters[ 'headers' ][ 'Content-Encoding' ] = 'gzip';
						parameters[ 'headers' ][ 'Content-Length' ] = result.length;
						response.writeHead( parameters[ 'statusCode' ] , parameters[ 'headers' ] );
						( parameters[ 'binary' ] ) ? response.end( result , 'binary' ) : response.end( result );
					} );
				break;
				default:
					response.writeHead( parameters[ 'statusCode' ] , parameters[ 'headers' ] );
					( parameters[ 'binary' ] ) ? response.end( parameters[ 'content' ] , 'binary' ) : response.end( parameters[ 'content' ] );
			}
		}
		else {
			response.writeHead( parameters[ 'statusCode' ] , parameters[ 'headers' ] );
			( parameters[ 'binary' ] ) ? response.end( parameters[ 'content' ] , 'binary' ) : response.end( parameters[ 'content' ] );
		}

		if( callback ) callback();
	}

	// check cookies
	checkCookies( cookies ) {
		var self = this;
		if( cookies && Object.prototype.toString.call( cookies ) == '[object Array]' ){
			for( var i=0; i<cookies.length; i++ ){
				var cookie = cookies[ i ];
				if( cookie && Object.prototype.toString.call( cookie ) == '[object String]' ){
					var parts = cookie.split( '=' ),
						key = parts.shift().replace( /([.*+?^=!:${}()|[\]\/\\])/g , '\\$1' ),
						cookieRegex = new RegExp( '(?:^|;)\\s?' + key + '=(.*?)(?:;|$)' , 'i' ),
						match = cookie.match( cookieRegex );
					if( !match ) cookies.splice( i , 1 );
				}
				else {
					cookies.splice( i , 1 );
				}
			}
		}
		return cookies;
	}
}

module.exports = Response;
