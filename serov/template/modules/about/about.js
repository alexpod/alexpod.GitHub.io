define({
	renderAbout: function() {
		return this.aboutHtml;
	},
	animateAbout: function(){
		$('#about').toggleClass('shown');
	}
});