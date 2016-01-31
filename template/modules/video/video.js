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
		console.log("video " + videoName);
		var videobackground = new $.backgroundVideo($(".video#video-" + videoName + ' .video-source'), {
	      "align": "centerXY",
	      "width": 1920,
	      "height": 1080,
	      "path": "video/",
	      "filename": videoName,
	      "types": ["mp4"],
	      "preload": true,
	      "autoplay": true,
	      "loop": false
	    });
	},

	createVideoPage: function(self,videoName){
		var video = self.videos[videoName];
		//console.log("VIDEO createVideoPage", video);
		var page = self.renderHandlebarsTemplate("#videoTemplate",video);

		self.videoHtml.html(page);

		//Кнопки перехода
		self.videoHtml.find('a').hover(function(e){
			$(e.target).closest(".circle").toggleClass('hover');
		});
	},
});
