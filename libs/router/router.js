// traffic router
class Router {
	constructor( server ) {
		this.server = server;
		this.fs = require( 'graceful-fs' );
		this.url = require( 'url' );
		this.path = require( 'path' );
		this.locale = require( 'locale' );
		this.static = require( 'node-static' );
		this.ejs = require( 'ejs' );
		this.Util = new ( require( this.path.normalize( this.path.resolve( __dirname + '/' + '../util/util' ) ) ) )();
		this.Response = new ( require( this.path.normalize( this.path.resolve( __dirname + '/' + '../response/response' ) ) ) )();
		this.ViewsFiles = new this.static.Server( this.path.normalize( this.path.resolve( __dirname + '/' + '../../views' ) ) , { gzip : true } );
		this.router_config = require( this.path.normalize( this.path.resolve( __dirname + '/' + './router-config' ) ) );
		this.notFoundView = '/common/404.ejs';
	}

	route( request , response , server ) {
		var self = this,
			route = null,
			controller = '',
			action = '',
			id = null,
			actionPath = null;

		if( request != undefined && response != undefined ) {
			self.locale.Locale[ "default" ] = self.router_config.default_locale;
			var protocol = (request.connection.encrypted == undefined) ? "http" : "https",
				fullURL = protocol + "://" + request.headers.host + request.url,
				urlObj = self.url.parse( fullURL , true , true ),
				normalizedPath = urlObj.pathname.split( '../' ).join( '' ),
				hostURI = urlObj.protocol + '//' + ( ( urlObj.auth ) ? urlObj.auth + '@' : '' ) + urlObj.host,
				supported_locales = new self.locale.Locales( self.router_config.supported_locales ),
				locales = new self.locale.Locales( request.headers[ "accept-language" ] ),
				best_locale = locales.best( supported_locales ).toString(),
				dbauth = ( request.headers[ 'x-dbauth' ] != null ) ?
							JSON.parse( new Buffer( request.headers[ 'x-dbauth' ] , 'base64' ).toString( 'utf8' ) )
							:
							null;

			if( normalizedPath != undefined ) {
				normalizedPath = self.Util.clean( decodeURI( normalizedPath ) );
				var arrPath = normalizedPath.split( '/' );
				if( arrPath != undefined && arrPath.length > 0 ) arrPath.shift();
				controller = ( arrPath[0] != undefined && arrPath[0] != '' ) ? arrPath[0] : self.router_config.defaultController;
				action = ( arrPath[1] != undefined && arrPath[1] != '' ) ? arrPath[1] : self.router_config.defaultAction;
				id = ( arrPath[2] != undefined && arrPath[2] != '' ) ? arrPath[2] : null;
				actionPath = ( arrPath.length > 2 ) ? arrPath.splice( 2 , arrPath.length ).join( '/' ) : null;
			}
			else {
				controller = self.router_config.defaultController;
				action = self.router_config.defaultAction;
				id = null;
				actionPath = null;
			}

			route = self.Util.clean( {
				'host' : hostURI,
				'authentication' : request.headers[ 'x-auth' ],
				'locale' : best_locale,
				'dbauthentication' : dbauth,
				'method' : request.method,
				'controller' : controller,
				'action' : action,
				'id' : id,
				'actionPath' : actionPath,
				'query' : urlObj.query,
				'path' : normalizedPath,
				'hash' : urlObj.hash
			} );

			request.route = route;

			var acceptEncoding = request.headers[ 'accept-encoding' ];
			if ( !acceptEncoding ) {
				request.acceptEncoding = '';
			}
			else {
				if ( acceptEncoding.match( /\bgzip\b/ ) ) {
					request.acceptEncoding = 'gzip';
				}
				else if ( acceptEncoding.match( /\bdeflate\b/ ) ) {
					request.acceptEncoding = 'deflate';
				}
				else {
					request.acceptEncoding = '';
				}
			}

			self.loadController( request , response , server );
		}

		return route;
	}

	// load controller
	loadController( request , response , server ) {
		var self = this,
			route = request.route,
			pretty = ( route.query && route.query.pretty ) ? ( ( parseInt( route.query.pretty , 10 ) != NaN ) ? parseInt( route.query.pretty , 10 ) : route.query.pretty ) : undefined,
			controllerFilePath = self.path.normalize( self.path.resolve( __dirname + '/' + '../../controllers' ) + '/' + route.controller + '.js' );

		self.fs.stat( controllerFilePath , ( error , stats ) => {
			if( error ){
				var checkURL = ( request.url.indexOf( '?' ) > -1 ) ? request.url.split( '?' )[0] : request.url;
				// File does not exist
				// Static content
				request.addListener('end', () => {
					self.ViewsFiles.serve( request, response, ( e, res ) => {
						if ( e ) {
							self[ '404' ]( request , response , self.notFoundView );
						}
					});
				} ).resume();
			}
			else {
				if( stats.isFile() ){
					// File -> go require
					var controllerModule = require( controllerFilePath ),
						controller = ( typeof controllerModule == 'function' ) ? new controllerModule( server ) : controllerModule;
					if( ( !controller[ route[ 'action' ] ] || typeof( controller[ route[ 'action' ] ] ) != 'function' ) && !controller[ 'defaultAction' ] ) {
						self[ '404' ]( request , response , self.notFoundView );
						return false;
					}
					else if( controller[ 'defaultAction' ] ){
						route[ 'action' ] = controller[ 'defaultAction' ];
					}
					controller.server = server;
					controller[ route[ 'action' ] ]( request , response );
				}
				else {
					// Not a file
					self[ '404' ]( request , response , self.notFoundView );
				}
			}
		} );
	}

	[ '404' ]( request , response , view ) {
		var self = this,
			route = ( request && request.route != undefined ) ? request.route : null,
			locale = ( route ) ? route.locale : null,
			query = ( route ) ? route.query : null,
			pretty = ( query && query.pretty ) ? ( ( parseInt( query.pretty , 10 ) != NaN ) ? parseInt( query.pretty , 10 ) : query.pretty ) : undefined;

		if( view ){
			self.fs.readFile( self.path.normalize( self.path.resolve( __dirname + '/' + '../../views' + view ) ), 'utf8' , ( err , data ) => {
				if( err ) {
					console.log( err );
					self[ '404' ]( request , response , self.notFoundView );
					return;
				}
				var locale_file = require( self.path.normalize( self.path.resolve( __dirname + '/' + '../../locales/' + locale ) ) );
				locale_file.labels[ 'filename' ] = __dirname + '/' + '../../views' + view;
				locale_file.labels[ 'urlid' ] = view;
				locale_file.labels[ 'labels' ] = function(){
					return locale_file.labels;
				};
				self.Response.write( request , response , { statusCode: 200 , content: self.ejs.render( data , locale_file.labels ) , rest: false , pretty: pretty , filter: null , cookie: null , compress: true , binary : false ,  headers: {} } );
			} );
		}
		else {
			self.Response.write( request , response , { statusCode: 404 , content: 'Error serving ' + request.url , rest: true , pretty: pretty , filter: null , cookie: null , compress: true , binary : false ,  headers: {} } );
		}
	}
}

module.exports = Router;
