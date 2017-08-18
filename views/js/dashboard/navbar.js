var navbar;

$( document ).ready( function(){
	navbar = new Navbar();
	navbar.init();
} );

function Navbar(){
	if( typeof Common === 'function' ) this.common = new Common();
	if( typeof WhoAmI === 'function' ) this.whoAmI = new WhoAmI();
	this.$loggedUserContainer = $( '#logged_user' );
}

Navbar.prototype.init = function () {
	var self = this,
		path = location.pathname;

	if( $( 'a[href="' + path + '"]' ).length > 0 ){
		$( 'a.active' ).removeClass( 'active' );
		$( 'a[href="' + path + '"]' ).addClass( 'active' );
	}

	self.logged();
};

Navbar.prototype.logged = function () {
	var self = this;
	self.whoAmI.check( {} , function( whoAmI_response ){
		try{
			var whoAmIObj = whoAmI_response[ 'result' ][ 'rows' ][0],
				nick = whoAmIObj[ 'out_nick' ];
			self.$loggedUserContainer.html( nick );

			Common.onLogged( whoAmIObj );
		}
		catch( e ) {
//			console.log( e );
		}
	} );
};
