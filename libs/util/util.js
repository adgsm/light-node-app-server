// Util
class Util {
	constructor() {
		this.fs = require( 'graceful-fs' );
	}

	// clean inputs
	clean() {
		var self = this,
			input = ( arguments[0] != undefined ) ? arguments[0] : null,
			cleanInput = null;
		if( input ) {
			var tags = /(<([^>]+)>)/ig;
			if ( typeof( input ) === 'string' ) {
	//			cleanInput = decodeURI( input ).replace( tags , '' );
				cleanInput = input.replace( tags , '' );
			}
			else {
				if( self.isArray( input ) ) {
					cleanInput = [];
				}
				else {
					cleanInput = {};
				}
				for( var key in input ) {
					key = self.clean( key );
					cleanInput[ key ] = self.clean( input[ key ] );
				}
			}
		}
		return cleanInput;
	}

	// check if object is array
	isArray( obj ) {
		if( obj == undefined ) return false;
		if( Object.prototype.toString.call( obj ) !== '[object Array]' ) return false;
		return true;
	}

	mkdirSync( path , strict ) {
		var self = this;
		try {
			self.fs.mkdirSync( path );
		}
		catch( e ) {
			if ( e.code != 'EEXIST' && strict == true ) throw e;
		}
	}

	generateUUID() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g , ( c ) => {
			var r = ( d + Math.random()*16 )%16 | 0;
			d = Math.floor( d/16 );
			return ( c=='x' ? r : ( r&0x3|0x8 ) ).toString( 16 );
		} );
		return uuid;
	}
}

module.exports = Util;
