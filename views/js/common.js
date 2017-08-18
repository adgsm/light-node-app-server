function Common(){
	this.KB = 'KB';
	this.KBsize = 1024;
	this.MB = 'MB';
	this.MBsize = 1024 * 1024;
	this.GB = 'GB';
	this.GBsize = 1024 * 1024 * 1024;
	this.measureUploadSpeedPacketSize = 30 * 1024;
	this.transparentImgSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
	this.noPhotoSrc = 'data:image/png;base64,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';
	this.eventType = {
		'click' : 'click',
		'mousedown' : 'mousedown',
		'mouseover' : 'mouseover',
		'mouseenter' : 'mouseenter',
		'mouseleave' : 'mouseleave',
		'keydown' : 'keydown',
		'keyup' : 'keyup',
		'dblclick' : 'dblclick'
	};
	this.logged = null;

	this.$loader = $( '.cs-loader' );

	this.loading = {};
	this.loadingRetries = {};

	this.defaultDelay = 3000;
	this.retryDelay = 500;
	this.maxRetries = 20;
}

Common.onLogged = function() {};

Common.prototype.mobileCheck = function() {
	var check = false;
	(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);

	if( check ) {
		this.eventType.click = 'touchend';
		this.eventType.mousedown = 'touchstart';
		this.eventType.mouseover = 'touchstart';
		this.eventType.mouseenter = '';
		this.eventType.mouseleave = '';
		this.eventType.keydown = 'keydown';
		this.eventType.keyup = 'keyup';
		this.eventType.dblclick = 'touchend';
	}
	return check;
}

// Parse credentials
Common.prototype.parseCredentials = function ( credentials ) {
	if( !credentials ) return null;
	var self = this,
		data = { 'pretty' : 4 },
		credentialKeys = Object.keys( credentials );
	for( var i = 0; i < credentialKeys.length; i ++ ){
		var key = credentialKeys[ i ],
			value = credentials[ key ];

		if( Object.prototype.toString.call( value ) === '[object Array]'
			|| Object.prototype.toString.call( value ) === '[object Object]' )
				value = JSON.stringify( value );

		data[ key ] = value;
	}
	return data;
};

// Serialize object
Common.prototype.serialize = function( obj ) {
	return '?' + Object.keys( obj ).reduce( function( acc , val ){ acc.push( val + '=' + encodeURIComponent( obj[ val ] ) ); return acc; } , [] ).join( '&' );
};

// Process bad response
Common.prototype.processBadResponse = function( jqXHR , arrActions , callback ){
	var response = null;
	if( jqXHR[ 'responseJSON' ] && jqXHR[ 'responseJSON' ][ 'Response' ][ 'Status' ] ){
		response = jqXHR[ 'responseJSON' ][ 'Message' ];
	}
	if( arrActions && arrActions.length && arrActions.length > 0 ) {
		$.each( arrActions , function( kr , vr ){
			if( jqXHR[ 'responseJSON' ] && jqXHR[ 'responseJSON' ][ 'Response' ][ 'Status' ] == vr[ 'code' ] ) {
				location.href = vr[ 'location' ];
				return;
			}
		} );
	}

	if( callback ) callback( response );
};

Common.prototype.eventStopPropagationPreventDefault = function( e ){
	if ( e.stopPropagation && e.preventDefault ) {
		e.stopPropagation();
		e.preventDefault();
	}
	else {
		e.cancelBubble = true;
		e.returnValue = false;
	}
};

// Password score
// Credits: http://stackoverflow.com/questions/948172/password-strength-meter
Common.prototype.scorePassword = function( password ) {
	var score = 0;
	if ( !password )
		return score;

	// award every unique letter until 5 repetitions
	var letters = new Object();
	for ( var i=0; i<password.length; i++ ) {
		letters[ password[ i ] ] = ( letters[ password[ i ] ] || 0 ) + 1;
		score += 5.0 / letters[ password[ i ] ];
	}

	// bonus points for mixing it up
	var variations = {
		digits: /\d/.test( password ),
		lower: /[a-z]/.test( password ),
		upper: /[A-Z]/.test( password ),
		nonWords: /\W/.test( password ),
	}

	var variationCount = 0;
	for ( var check in variations ) {
		variationCount += ( variations[ check ] == true ) ? 1 : 0;
	}
	score += ( variationCount - 1 ) * 10;

	return parseInt( score );
};

Common.prototype.checkPassStrength = function( password ) {
	var self = this,
		score = self.scorePassword( password );
	if ( score > 80 )
		return 3;
	if ( score > 60 )
		return 2;
	if ( score >= 30 )
		return 1;

	return 0;
};

Common.prototype.dynamicDOMLoadHelper = function ( domRoot , loadType , loadSrc , callback ) {
	var self = this,
		loadContainer , payload;

	switch ( loadType ) {
		case 'js':
			loadContainer = domRoot.document.getElementsByTagName( 'body' )[0];
			payload = domRoot.document.createElement( 'script' );
			payload.type = 'text/javascript';
			payload.src = loadSrc;
			break;
		case 'css':
			loadContainer = domRoot.document.getElementsByTagName( 'head' )[0];
			payload = domRoot.document.createElement( 'link' );
			payload.type = 'text/css';
			payload.rel = 'stylesheet';
			payload.href = loadSrc;
			break;
		default:
			return;
	}
	payload.onload = callback;

	loadContainer.appendChild( payload );
};

Common.prototype.formatFileSize = function( bytes ) {
	var self = this;
	if ( typeof bytes !== 'number' ) {
		return '';
	}
	if ( bytes >= ( self.GBsize ) ) {
		return ( bytes / ( self.GBsize ) ).toFixed( 2 ) + ' ' + self.GB;
	}

	if ( bytes >= ( self.MBsize ) ) {
		return ( bytes / ( self.MBsize ) ).toFixed( 2 ) + ' ' + self.MB;
	}
	return ( bytes / self.KBsize ).toFixed( 2 ) + ' ' + self.KB;
};

// Open popup window centered on the screen
Common.prototype.openPopupCentered = function( url , title , w , h ) {
	var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left,
		dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
	width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
	height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

	if( w > width ) w = width;
	if( h > height ) h = height;

	var left = ( ( width / 2 ) - ( w / 2 ) ) + dualScreenLeft,
		top = ( ( height / 2 ) - ( h / 2 ) ) + dualScreenTop,
		newWindow = window.open( url , title , 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left );
	if ( window.focus ) newWindow.focus();
};

// test connection upload speed
Common.prototype.measureUploadSpeed = function ( packetSize , callback ) {
	var self = this,
		httpRequest = new XMLHttpRequest(),
		startTime, endTime,
		url = '/content/form-upload',
		data = "d=";

	packetSize = packetSize || self.measureUploadSpeedPacketSize;

	for( var i = 0 ; i < ( packetSize - 2 ) ; i++ ) {
	//for( var i = 0 ; i < ( 1022 + packetSize - 1024 ) ; i++ ) {
		data += 'a';
	}

	httpRequest.open( 'POST' , url , true );

	httpRequest.setRequestHeader( 'Content-type' , 'application/x-www-form-urlencoded' );

	httpRequest.onreadystatechange = function() {
		if( httpRequest.readyState == 4 && httpRequest.status == 200 ) {
			endTime = ( new Date() ).getTime();
			var roundtripTime = endTime - startTime,
				speed = packetSize / ( roundtripTime / 1000 );
				hrspeed = Math.round( ( ( ( packetSize / ( roundtripTime / 1000 ) ) * 8 / 1000000 ) + 0.00001 ) * 100 ) / 100;
			if( callback ) callback( {
				'speed' : speed, // bytes/s
				'hrspeed' : hrspeed, // human readable speed measured in Mbps
				'roundtripTime' : roundtripTime, // ms
				'packetSize' : packetSize
			} );
		}
	}
	startTime = ( new Date() ).getTime();
	httpRequest.send( data );
};


Common.prototype.getScrollbarWidth = function() {
	var outer = document.createElement( 'div' );
	outer.style.visibility = 'hidden';
	outer.style.width = '100px';
	document.body.appendChild( outer );

	var widthNoScroll = outer.offsetWidth;
	// force scrollbars
	outer.style.overflow = 'scroll';

	// add innerdiv
	var inner = document.createElement( 'div' );
	inner.style.width = '100%';
	outer.appendChild( inner );

	var widthWithScroll = inner.offsetWidth;

	// remove divs
	outer.parentNode.removeChild( outer );

	return widthNoScroll - widthWithScroll;
};

// crop text
Common.prototype.cropText = function( text , len , sufix , callback ) {
	var response = {
			'original' : text,
			'cropped' : text,
			'croppedWithoutSufix' : text,
			'sufix' : sufix,
			'sufixNeeded' : false
		},
		sufixLength = ( ( sufix && sufix.length < text.length ) ? sufix.length : 0 ),
		sufixText = ( ( sufix && sufixLength ) ? sufix : '' );
	if( text && len && text.length > len ){
		response[ 'cropped' ] = text.substring( 0 , len - sufixLength ) + sufixText;
		response[ 'croppedWithoutSufix' ] = text.substring( 0 , len );
		response[ 'sufixNeeded' ] = true;
	}

	if( callback ) callback( response );
	return response;
};

Common.prototype.hideInFrame = function ( className ) {
	var self = this;
	if( location.href != top.location.href ){
		$ ( '.' + className ).hide();
	}
};

Common.prototype.doWhenLoaded = function ( item , callback ) {
	var self = this;
	if( self.loadingRetries[ item ] == undefined ) self.loadingRetries[ item ] = 0;

	if( self.loading[ item ] && self.loadingRetries[ item ] <= self.maxRetries ){
		window.setTimeout( function() {
			self.loadingRetries[ item ]++;
			self.doWhenLoaded( item , callback );
		} , self.retryDelay );
	}
	else if( self.loadingRetries[ item ] > self.maxRetries ) {
		delete self.loadingRetries[ item ];
		console.log( 'No. of retries (' + self.loadingRetries[ item ] + ') reached its limit (' + self.maxRetries + ').' );
	}
	else{
		delete self.loadingRetries[ item ];
		if( callback ) callback();
	}
};

Common.prototype.showLoader = function ( $loader , $lodingContainer , loading ) {
	var self = this;
	if( loading ) {
		$lodingContainer.hide();
		$loader.show();
	}
	else{
		$loader.hide();
		$lodingContainer.show();
	}
};
