define({
	renderPreloader: function() {
		return this.preloaderHtml;
	},
	renderProgress: function (progress) {
		progress = Math.floor(progress);

		var angle;
		if(progress<25){
			angle = -90 + (progress/100)*360;
			this.preloaderHtml.find(".animate-0-25-b").css("transform","rotate("+angle+"deg)");
			this.preloaderHtml.find(".loader-image-1").css("display","block");
		}
		else if(progress>=25 && progress<50){
			angle = -90 + ((progress-25)/100)*360;
			this.preloaderHtml.find(".animate-0-25-b").css("transform","rotate(0deg)");
			this.preloaderHtml.find(".animate-25-50-b").css("transform","rotate("+angle+"deg)");
			this.preloaderHtml.find(".loader-image-1").css("display","none");
			this.preloaderHtml.find(".loader-image-2").css("display","block");
		}
		else if(progress>=50 && progress<75){
			angle = -90 + ((progress-50)/100)*360;
			this.preloaderHtml.find(".animate-25-50-b, .animate-0-25-b").css("transform","rotate(0deg)");
			this.preloaderHtml.find(".animate-50-75-b").css("transform","rotate("+angle+"deg)");
			this.preloaderHtml.find(".loader-image-2").css("display","none");
			this.preloaderHtml.find(".loader-image-3").css("display","block");
		}
		else if(progress>=75 && progress<=100){
			angle = -90 + ((progress-75)/100)*360;
			this.preloaderHtml.find(".animate-50-75-b, .animate-25-50-b, .animate-0-25-b").css("transform","rotate(0deg)");
			this.preloaderHtml.find(".animate-75-100-b").css("transform","rotate("+angle+"deg)");
			this.preloaderHtml.find(".loader-image-3").css("display","none");
			this.preloaderHtml.find(".loader-image-4").css("display","block");
		}
		if(progress==100){
		}
		this.preloaderHtml.find(".text").html('<span>'+progress+"</span>%");
	},

	clearInterval: function(){


//console.log('clearInterval');
		this.preloaderHtml.find('.animate-75-100-b, .animate-50-75-b, .animate-25-50-b, .animate-0-25-b').css("transform","rotate(90deg)");
		this.preloaderHtml.find('.text').html('<span>0</span>%');
		this.preloaderHtml.find('.loader-image-4').css("display","none");
		this.preloaderHtml.remove();
		this.trigger('Preload:End');
	},

	preloadImage: function(timer){
		var self = this,
			maps,
			tests;
		function checkStore(){
			if(localStorage.getItem('maps')){
//				console.log("localStorage");
				maps = JSON.parse(localStorage.getItem('maps'));
				maps = maps.maps.maps;
				tests = JSON.parse(localStorage.getItem('tests'));
				
				// console.log("maps",maps);
				// console.log("tests",tests);

				cycle();
			}else {
				setTimeout(checkStore,1000);
			}
		};

		checkStore();

		var images = self.content.find("img");
		var counter = 0;
		var procent = 100/images.length;

		images.on("load", function (event) {
			counter ++;
			self.renderProgress((counter*procent));
			if( counter >= images.length ) {
				width = '4px';
				self.preloaderHtml.find('.text').animate({
					opacity : 0.5
				}, 'slow');
				self.preloaderHtml.find('.loader-spiner').animate({
					borderLeftWidth: width,
					borderTopWidth: width,
					borderRightWidth: width,
					borderBottomWidth: width
				}, 1300 );
				setTimeout(function(){
					self.clearInterval();
				}, 1500);
			}
		});

		//Загружаем изображения
		[].forEach.call(images,function(elem){
			elem.src = elem.src;
		});

		function cycle(){

			//console.log("cycle", maps,tests)
			maps.forEach(function(map){
				if(map.mapImage){
					preloadImage(map.mapImage);
				}
			});	

			_.forEach(tests, function(value, key) {
		  		value.questions.forEach(function(test){
					if(test.background){
						preloadImage(test.background);
					}
				});
			});
		}
		function preloadImage(url){
		    var img=new Image();
		    img.src=url;
		}
	}
});
