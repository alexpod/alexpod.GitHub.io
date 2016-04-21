define({
	renderHelp: function() {
		return this.helpHtml;
	},
	animateHelp: function(){
		$('#help').toggleClass('shown');
	}
});