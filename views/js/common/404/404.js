$( document ).ready( function(){
	var fourOFour = new FourOFour();
	fourOFour.init();
} );

function FourOFour(){
	this.common = new Common();
	this.$allInputTextarea = $( 'input, textarea' );
	this.$fourOFourForm = $( '#four_o_four_form' );
}

FourOFour.prototype.init = function() {
	var self = this;

	self.$allInputTextarea.placeholder();
};
