define({
	render: function() {

		this.content = this.html;

		var preloader = this.renderPreloader();
		var menu = this.renderMenu();
		var accordion = this.renderAccordion();
		var video = this.renderVideo('videos');
		var reader = this.renderReader(['antiq','history','story']);
		var about = this.renderAbout();
		var tests = this.renderTest(['antiq', 'story', 'history']);
		var map = this.initMap();

		var transformer3D = this.renderTransformer3D([accordion,reader,video,map]);

		this.content.append(transformer3D);
		this.content.find('#accordion li.active').append(preloader);

		$('body').html('').append(this.content, menu, about, tests);

		this.preloadImage();
		this.subscribe();
	},
	subscribe: function() {
		var self = this;

		this.on('Accordeon:Listed',function(){
			self.refreshLine();
		});
	}
});
