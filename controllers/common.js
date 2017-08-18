// Common controller
class Common {
	constructor( server ) {
		this.server = server;
		this.path = require( 'path' );
		this.util = require( 'util' );
		this.formData = require( 'form-data' );
		this.Response = new ( require( this.path.normalize( this.path.resolve( __dirname + '/' + '../libs/response/response' ) ) ) )();
	}

	// Allowed request methods
	[ 'method-allowed' ]( request , response , allowed ) {
		var self = this,
			route = ( request != undefined ) ? request.route : null,
			method = ( route ) ? route.method : null,
			query = ( route != undefined ) ? route.query : null,
			pretty = ( query && query.pretty ) ? ( ( parseInt( query.pretty , 10 ) != NaN ) ? parseInt( query.pretty , 10 ) : query.pretty ) : undefined;

		if( response && method && allowed && allowed.indexOf( method ) > -1 ) return true;
		if( request && response ) {
			var locale = require( self.path.normalize( self.path.resolve( __dirname + '/' + '../locales/' + request.route.locale ) ) );
			self.Response.write( request , response , { statusCode: 405 , content: self.util.format( locale.labels[ 'method_not_allowed' ] , method , route[ 'controller' ] , route[ 'action' ] , allowed.join( ', ' ) ) , rest: true , pretty: pretty , filter: null , cookie: null , compress: true , binary : false ,  headers: {} } );
		}
		return false;
	}

	// normalize request parameters
	normalizeRequest( request , response , parameters , requestMethod , packAsFormData , callback ) {
		var self = this,
			form = ( packAsFormData ) ? new ( self.formData )() : null,
			route = ( request && request.route != undefined ) ? request.route : null,
			locale = ( route ) ? route.locale : null,
			authentication = ( route ) ? route.authentication : null,
			method = ( route ) ? route.method : null,
			id = ( route ) ? route.id : null,
			query = ( route ) ? route.query : null,
			path = ( query && query.path ) ? query.path : ( ( route ) ? route.path : null ),
			actionPath = ( query && query.actionPath ) ? query.actionPath : ( ( route ) ? route.actionPath : null ),
			pretty = ( query && query.pretty ) ? ( ( parseInt( query.pretty , 10 ) != NaN ) ? parseInt( query.pretty , 10 ) : query.pretty ) : undefined,
			hash = ( route ) ? route.hash : null,
			credentials = {
				'id' : id,
				'locale' : locale,
				'query' : query,
				'hash' : hash,
				'path' : path,
				'actionPath' : actionPath,
				'_files' : []
			};

		if( ( requestMethod == 'GET' || requestMethod == 'DELETE' ) && parameters ){
			for ( var i = 0 , len = parameters.length; i < len; i++ ) {
				if( !credentials[ parameters[ i ] ] && query[ parameters[ i ] ] ) {
					var parameter = self.JSONizeParameter( query[ parameters[ i ] ] );
					credentials[ parameters[ i ] ] = parameter;
				}
			}
		}
		else if( ( requestMethod == 'POST' || requestMethod == 'PUT' ) && request._postPayload ){
			var fields = request._postPayload.fields,
				keys = Object.keys( fields );

			for ( var i = 0 , len = keys.length; i < len; i++ ) {
				if( !credentials[ keys[ i ] && fields[ keys[ i ] ] ] ) {
					var parameter = self.JSONizeParameter( fields[ keys[ i ] ] );
					credentials[ keys[ i ] ] = parameter;
				}
			}

			var fileKey = ( request._postPayload.files ) ? Object.keys( request._postPayload.files )[0] : null;
			if( fileKey ){
				var files = request._postPayload.files[ fileKey ];
				if( Object.prototype.toString.call( files ) != '[object Array]' ) files = [ files ];
				credentials[ '_files' ] = files;
			}

			if( packAsFormData ){
				var credentialKeys = Object.keys( credentials );
				for( var i = 0 , len = credentialKeys.length; i < len; i++ ){
					if( credentialKeys != 'files' ){
						if( Object.prototype.toString.call( credentials[ credentialKeys[ i ] ] ) == '[object Object]' ) credentials[ credentialKeys[ i ] ] = JSON.stringify( credentials[ credentialKeys[ i ] ] );
						if( credentials[ credentialKeys[ i ] ] != null ) form.append( credentialKeys[ i ] , credentials[ credentialKeys[ i ] ] );
					}
				}
				for ( var i = 0 , len = credentials[ '_files' ].length; i < len; i++ ) {
					form.append( 'file' , self.fs.createReadStream( credentials[ '_files' ][ i ].path ) );
				}
			}
		}

		if( callback ) callback( credentials , form );
		return {
			'credentials' : credentials,
			'form' : form
		};
	}

	JSONizeParameter( parameter ) {
		var self = this;
		try{
			// do not "JSONize" in cases when search phrases are passed through
			// e.g. "meeting in berlin" in search query
			if( !( typeof parameter == 'string' && parameter[0] == '"' ) ) parameter = JSON.parse( parameter );
		}
		catch( e ){
			//console.log( e );
		}
		return parameter;
	}
}

module.exports = Common;
