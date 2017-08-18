// page controller
class Page {
	constructor( server ) {
		this.server = server;
		this.path = require( 'path' );
		this.View = new ( require( this.path.normalize( this.path.resolve( __dirname + '/' + './view' ) ) ) )( server );
		this.defaultAction = 'index';
	}

	// Page views
	index( request , response , callback ) {
		var self = this,
			allowedMethodTypes = [ 'GET' ];

		self.View.get( request , response , allowedMethodTypes , true );
	}
}

module.exports = Page;
