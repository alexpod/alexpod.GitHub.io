define({

	renderVideo: function(videoName) {
		this.loadVideo(videoName);
		return this.videoHtml;
	},

	loadVideo: function(videoName){
		var self = this;
		self.videos = {};
		require([
					'text!../../../content/video/' + videoName + '.json'
				], function(json) {
				self.videos[videoName]={};
				self.videos[videoName] = JSON.parse(json);
				self.createVideoPage(self,videoName);
			});

	},

	printVideo : function (videoName) {
		var self = this;
		self.content.find(".video").css("display", "none");
		self.content.find(".video#video-" + videoName).css("display", "block");
	},

	createVideoPage: function(self,videoName){
		var video = self.videos[videoName];
		console.log("VIDEO createVideoPage", video);
		var page = self.renderHandlebarsTemplate("#videoTemplate",video);

		self.videoHtml.html(page);

		//Кнопки перехода
		self.videoHtml.find('a').hover(function(e){
			$(e.target).closest(".circle").toggleClass('hover');
		});
	},
});
