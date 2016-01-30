define({
	renderAbout: function() {
		this.subscribeAbout(this.aboutHtml);
		return this.aboutHtml;
	},
	subscribeAbout: function(){
		var self = this;
		self.on('Get:About',function(){
			console.log('Get:About');
			self.animateAbout();
		});
	},
	animateAbout: function(){
		$('#about').toggleClass('shown');
	}
});