// Rest
class Rest {
	constructor() {

	}

	// headers
	headers() {
		var	header = {
				'X-Frame-Options' : 'SAMEORIGIN',
				'X-Server' : 'Node MVC Rest Web-API/v0.9.9',
				'X-MakeIT' : 'We made it! it@make.rs',
				'Cache-Control' : 'no-cache, must-revalidate',
				'Expires' : 'Sat, 27 Jul 1974 05:10:00 GMT',
				'Content-Type' : 'application/json'
			};
		if( arguments.length > 0 && typeof arguments[0] == 'object' )
			for( var key in arguments[0] ) {
				header[ key ] = arguments[0][key];
			};
		return header;
	}

	// response
	response( response , code , space , filter ) {
		var self = this;
		if( response == undefined ) response = '';
		if( code == undefined ) code = '200';
		if( space == undefined ) space = 0;
		return JSON.stringify( { 'Response' : self.status( code ) , 'Message' : response } , filter , space );
	}

	// response
	status( code ) {
		if( !code ) code = '500';
		var response = {
				'100' : { 'Description' : 'Continue' , 'Status' : 100 },
				'101' : { 'Description' : 'Switching Protocols' , 'Status' : 101 },
				'200' : { 'Description' : 'OK' , 'Status' : 200 },
				'201' : { 'Description' : 'Created' , 'Status' : 201 },
				'202' : { 'Description' : 'Accepted' , 'Status' : 202 },
				'203' : { 'Description' : 'Non-Authoritative Information' , 'Status' : 203 },
				'204' : { 'Description' : 'No Content' , 'Status' : 204 },
				'205' : { 'Description' : 'Reset Content' , 'Status' : 205 },
				'206' : { 'Description' : 'Partial Content' , 'Status' : 206 },
				'300' : { 'Description' : 'Multiple Choices' , 'Status' : 300 },
				'301' : { 'Description' : 'Moved Permanently' , 'Status' : 301 },
				'302' : { 'Description' : 'Found' , 'Status' : 302 },
				'303' : { 'Description' : 'See Other' , 'Status' : 303 },
				'304' : { 'Description' : 'Not Modified' , 'Status' : 304 },
				'305' : { 'Description' : 'Use Proxy' , 'Status' : 305 },
				'306' : { 'Description' : '(Unused)' , 'Status' : 306 },
				'307' : { 'Description' : 'Temporary Redirect' , 'Status' : 307 },
				'400' : { 'Description' : 'Bad Request' , 'Status' : 400 },
				'401' : { 'Description' : 'Unauthorized' , 'Status' : 401 },
				'402' : { 'Description' : 'Payment Required' , 'Status' : 402 },
				'403' : { 'Description' : 'Forbidden' , 'Status' : 403 },
				'404' : { 'Description' : 'Not Found' , 'Status' : 404 },
				'405' : { 'Description' : 'Method Not Allowed' , 'Status' : 405 },
				'406' : { 'Description' : 'Not Acceptable' , 'Status' : 406 },
				'407' : { 'Description' : 'Proxy Authentication Required' , 'Status' : 407 },
				'408' : { 'Description' : 'Request Timeout' , 'Status' : 408 },
				'409' : { 'Description' : 'Conflict' , 'Status' : 409 },
				'410' : { 'Description' : 'Gone' , 'Status' : 410 },
				'411' : { 'Description' : 'Length Required' , 'Status' : 411 },
				'412' : { 'Description' : 'Precondition Failed' , 'Status' : 412 },
				'413' : { 'Description' : 'Request Entity Too Large' , 'Status' : 413 },
				'414' : { 'Description' : 'Request-URI Too Long' , 'Status' : 414 },
				'415' : { 'Description' : 'Unsupported Media Type' , 'Status' : 415 },
				'416' : { 'Description' : 'Requested Range Not Satisfiable' , 'Status' : 416 },
				'417' : { 'Description' : 'Expectation Failed' , 'Status' : 417 },
				'444' : { 'Description' : 'No response' , 'Status' : 444 }, /* nginx, non-standard */
				'500' : { 'Description' : 'Internal Server Error' , 'Status' : 500 },
				'501' : { 'Description' : 'Not Implemented' , 'Status' : 501 },
				'502' : { 'Description' : 'Bad Gateway' , 'Status' : 502 },
				'503' : { 'Description' : 'Service Unavailable' , 'Status' : 503 },
				'504' : { 'Description' : 'Gateway Timeout' , 'Status' : 504 },
				'505' : { 'Description' : 'HTTP Version Not Supported' , 'Status' : 505 }
			};
		return ( response[ code ] ) ? { 'Status' : response[ code ].Status , 'Description' : response[ code ].Description } : { 'Status' :  500 , 'Description' : response[ '500' ].Description };
	}
}

module.exports = Rest;
