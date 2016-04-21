define({

	renderRedline: function() {

		this.subscribeRedline(this.redlineHtml);
		return this.redlineHtml;
	},

	subscribeRedline: function() {
		var self = this;

		self.on('Preload:End', function(){
			self.animateLine();
		});

		self.on('Refresh:Line', function(){
			self.animateLine();
		});
	},

	animateLine: function(){
		var self = this;
		var line = $('.loaded');
		line.animate({'width':'100%'}, 19000);

		var counter = 0;

		var interval = setInterval(function () {
				counter++;
				console.log("крутится, вертится шар голубой! ")
				if(counter == 100){
					console.log("RedLine:Passed! ")
					self.trigger('RedLine:Passed');
					clearInterval(interval);
				}

				self.on('Refresh:Line', function(){
					console.log("Refresh:Line")
					clearInterval(interval);
				});

				self.on('Stop:Line', function(){
					console.log("Останавливаем! ")
					clearInterval(interval);
				});

		},200);
	},

	refreshLine: function(){
		$('.loaded').stop().css('width', '0');
		//this.trigger('Refresh:Line');
	},

	stopLine: function(){
		$('.loaded').stop().css('width', '0');
		this.trigger('Stop:Line');
	}
});
