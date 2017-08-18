// View controller
class View {
	constructor( server ) {
		this.server = server;
		this.path = require( 'path' );
		this.fs = require( 'graceful-fs' );
		this.ejs = require( 'ejs' );
		this.Response = new ( require( this.path.normalize( this.path.resolve( __dirname + '/' + '../libs/response/response' ) ) ) )();
		this.Common = new ( require( this.path.normalize( this.path.resolve( __dirname + '/' + './common' ) ) ) )();
		this.rootView = '/page/index.ejs';
		this.notFoundView = '/common/404.ejs';
	}

	// Get view controller (with or without authentication)
	get( request , response , allowedMethodTypes , authenticate ) {
		var self = this,
			route = ( request && request.route != undefined ) ? request.route : null,
			locale = ( route ) ? route.locale : null,
			query = ( route ) ? route.query : null,
			path = ( query && query.path ) ? query.path : ( ( route ) ? route.path : null ),
			pretty = ( query && query.pretty ) ? ( ( parseInt( query.pretty , 10 ) != NaN ) ? parseInt( query.pretty , 10 ) : query.pretty ) : undefined,
			view = ( path ) ? path + '.ejs' : self.notFoundView;

		if( view == '/.ejs' )
			view = self.rootView;

		if( !self.Common[ 'method-allowed' ]( request , response , allowedMethodTypes ) ) return false;

		self.getView( request , response , view , locale , null );
	}

	// Get view helper
	getView( request , response , view , locale , cookie , pretty ) {
		var self = this;
		self.fs.readFile( self.path.normalize( self.path.resolve( __dirname + '/' + '../views' + view ) ), 'utf8' , function( err , data ) {
			if( err ) {
				self.getView( request , response , self.notFoundView , locale , cookie , pretty );
				return;
			}
			var locale_file = require( self.path.normalize( self.path.resolve( __dirname + '/' + '../locales/' + locale ) ) );
			locale_file.labels[ 'filename' ] = __dirname + '/' + '../views' + view;
			locale_file.labels[ 'urlid' ] = view;
			locale_file.labels[ 'labels' ] = function(){
				return locale_file.labels;
			};
			self.Response.write( request , response , { statusCode: 200 , content: self.ejs.render( data , locale_file.labels ) , rest: false , pretty: pretty , filter: null , cookie: cookie , compress: true , binary : false ,  headers: {} } );
		} );
	}
}

module.exports = View;
