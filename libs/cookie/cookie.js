// Cookie manager
class Cookie {
	constructor() {
		this.path = require( 'path' );
		this.cookie_config = require( this.path.normalize( this.path.resolve( __dirname + '/' + './cookie-config' ) ) );
	}

	// parse cookie header string
	parseHeaderString( rc ) {
		var self = this,
			cookies = {},
			parts = null;

		if( rc == undefined ) return null;

		rc && rc.split( ';' ).forEach( ( cookie ) => {
			parts = cookie.split( '=' );
			var key = parts.shift().replace( /([.*+?^=!:${}()|[\]\/\\])/g , '\\$1' ),
				cookieRegex = new RegExp( '(?:^|;)\\s?' + key + '=(.*?)(?:;|$)' , 'i' ),
				match = rc.match( cookieRegex );
			if( match && unescape( match[1] ) )
				cookies[ key.trim() ] = unescape( parts.join( '=' ) );
		} );

		return cookies;
	}

	// Get cookies collection
	getAll( request ) {
		var self = this,
			rc = null;

		if( request == undefined ) return null;

		rc = request.headers.cookie;

		return self.parseHeaderString( rc );
	}

	// Get cookie
	get( request , name ) {
		var self = this,
			cookies = {},
			cookie = null;

		if( request == undefined || name == undefined ) return null;

		cookies = self.getAll( request );
		var key = name.replace( /([.*+?^=!:${}()|[\]\/\\])/g , '\\$1' );
		if( cookies && cookies[ key ] ) {
			cookie = new Buffer( cookies[ key ] , 'base64' ).toString( 'utf8' );
		}

		return cookie;
	}

	// Set cookies collection
	set( name , value , exms , domain , path , secure , httpOnly ) {
		var self = this,
			cookies = [],
			exdate = new Date(),
			cookieText = '';

		if( name == undefined || value == undefined ) return null;

		if( exms == undefined ) exms = self.cookie_config.expiryms;
		if( domain == undefined ) domain = self.cookie_config.domain;
		if( path == undefined ) path = self.cookie_config.path;
		if( secure == undefined ) secure = self.cookie_config.secure;
		if( httpOnly == undefined ) httpOnly = self.cookie_config.httpOnly;

		value = new Buffer( value ).toString( 'base64' );
		exdate.setTime( exdate.getTime() + exms );
		cookieText = name + '=' + value + ';expires=' + exdate.toUTCString() + ';'
		if ( domain )
			cookieText += 'domain=' + domain + ';';
		if ( path )
			cookieText += 'path=' + path + ';';
		if ( secure )
			cookieText += 'Secure' + ';';
		if ( httpOnly )
			cookieText += 'HttpOnly' + ';';
		cookies.push( cookieText );

		return cookies;
	}
}

module.exports = Cookie;
