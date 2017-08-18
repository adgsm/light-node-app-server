// request wrapper
class Request {
	constructor() {
		this.querystring = require( 'querystring' );
	}

	// HTTP GET/DELETE/POST/PUT request
	parse( data , options , protocol , form , callback ) {
		var	self = this,
			request_protocol = null;

		if( data == undefined || options == undefined || options.host == undefined ) {
			if ( callback )
				callback.apply( this, Array.prototype.slice.call( [ null ] ) );
			return;
		}

		try {
			if( form != null ){
				var	req = form.submit( options , ( err , res ) => {
					if( err ){
						console.log( '[Request.parse] ' + err );
						if ( callback )
							callback.apply( this, Array.prototype.slice.call( [ {} ] ) );
						return;
					}
					self[ 'do-callback' ]( res , callback );
				} );
			}
			else{
				request_protocol = ( protocol == 'https' ) ? require( 'https' ) : require( 'http' );
				options[ 'agent' ] = false;
				options[ 'path' ] = options[ 'path' ].replace( / /gi , "%20" );

				var	req = request_protocol.request( options , ( res ) => {
					self[ 'do-callback' ]( res , callback );
				} );

				// for post data
				req.write( data );
				req.end();

				req.on( 'error' , function( err ){
					console.log( '[Request.parse] ' , err );
					req.end();
					if ( callback )
						callback.apply( this, Array.prototype.slice.call( [ {} ] ) );
				} );
			}

		}
		catch( e ) {
			console.log( '[Request.parse] ' + e );
			if ( callback )
				callback.apply( this, Array.prototype.slice.call( [ {} ] ) );
		}
	}

	// do callback with respnse
	[ 'do-callback' ]( res , callback ) {
		var self = this,
			responseBody = '',
			result = {};

//		res.setEncoding( 'binary' );
		res.on( 'data', ( chunk ) => {
			responseBody += chunk;
		} );

		res.on( 'end', () => {
			result[ 'content-type' ] = ( result[ 'content-type' ] ) ? result[ 'content-type' ] : 'application/json;charset=UTF-8';
			result[ 'statusCode' ] = ( res[ 'statusCode' ] ) ? res[ 'statusCode' ] : ( ( res[ 'status' ] && res[ 'status' ][ 'code' ] ) ? res[ 'status' ][ 'code' ] : 500 );

			if( res[ 'content-length' ] ) result[ 'content-length' ] = res[ 'content-length' ];
			if( res[ 'method' ] ) result[ 'method' ] = res[ 'method' ];
			if( res[ 'url' ] ) result[ 'url' ] = res[ 'url' ];
			if( res[ 'complete' ] ) result[ 'complete' ] = res[ 'complete' ];
			if( res[ 'domain' ] ) result[ 'domain' ] = res[ 'domain' ];

			if( res[ 'headers' ] ) {
				result[ 'headers' ] = res[ 'headers' ];
				result[ 'content-type' ] = res[ 'headers' ][ 'content-type' ];

				if( result[ 'content-type' ].indexOf( 'charset=' ) == -1 ) result[ 'content-type' ] += '; charset=UTF-8';

				var binaryContent = true,
					mime = result[ 'content-type' ].split( ';' )[0];

				switch ( mime ) {
					case 'application/json':
					case 'application/xml':
					case 'text/html':
					case 'text/plain':
						result = self[ 'set-non-binary-response' ]( responseBody , result );
						break;
					default:
						result = self[ 'set-binary-response' ]( responseBody , result );
				}
			}
			if ( callback )
				callback.apply( this, Array.prototype.slice.call( [ result ] ) );
		} );
	}

	// set binary headers
	[ 'set-binary-response' ]( responseBody , result ) {
		var self = this;

		result[ 'binary' ] = true;
		result[ 'body' ] = responseBody;

		return result;
	}

	// set non-binary headers
	[ 'set-non-binary-response' ]( responseBody , result ) {
		var self = this;

		result[ 'binary' ] = false;
		responseBody = responseBody.toString();
		if( result[ 'content-type' ].indexOf( 'application/json' ) != -1 ) {
			try {
				result[ 'body' ] = JSON.parse( responseBody );
			} catch (e) {
				result[ 'body' ] = self.querystring.parse( responseBody );
			}
		}
		else {
			result[ 'body' ] = responseBody;
		}
		var extra = encodeURIComponent( responseBody ).match( /%[89ABab]/g ),
			contenLength = responseBody.length + ( extra ? extra.length : 0 );
		result[ 'content-length' ] = result[ 'headers' ][ 'content-length' ] = contenLength;

		return result;
	}
}

module.exports = Request;
