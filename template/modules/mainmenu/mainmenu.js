define({
	renderMenu: function() {

		this.subscribeMenu(this.mainmenuHtml);
		return this.mainmenuHtml;
	},
	subscribeMenu: function(self) {
		var that = this;
		// Настройки звука
		// if(localStorage.getItem('sound')){
		// 	this.audioState = localStorage.getItem('sound');
		// }else{
		// 	this.audioState = true;
		// 	localStorage.setItem('sound',true);
		// }
		//this.audioState = false;
		self.find('.leftSide .icon').on('click', function() {

			self.find('.leftSide .leftMenu').toggleClass('hide');
		});

		self.find('.menu a:not(.icon)').on('click', function(e) {
				self.find('.menu a:not(.icon)').removeClass('active');
				$(e.target).addClass('active');
				self.find('.leftSide .leftMenu').toggleClass('hide');
		});

		self.find('.rightSide *').on('click', function(element) {
			that.controllButtons(self,element);
		});
	},
	breadcrumbsRender: function(current,ways){
		var self = this;

		//this.audioControll();
		var Span = function(content){

			this.span = document.createElement('span');
			this.span.textContent = content

			return this.span
		}

		var currentDir = new Span(current);
		var currentWays = new Span(ways);
		var angleRight = new Span("");


		$(angleRight).addClass('divider fa fa-angle-right')

		self.mainmenuHtml.find('.breadcrumbs').html('').append(currentDir,angleRight,currentWays);
	},

	testBreadcrumbsRender: function(game,page,testName){
		var self = this;
		var tests;

		if(localStorage.tests){
			tests = JSON.parse(localStorage.tests)[testName];
		}else{
			tests = self.tests[testName];
		}

		var links = [];

		var Span = function(content){
			this.span = document.createElement('span');
			this.span.textContent = content
			return this.span
		}

		var currentDir = [game,page]//new Span(getCurrentDir());
		var angleRight = new Span("");
		var verticalBar = new Span(" | ");

		function getCurrentDir(){
			var dir = decodeURI(Backbone.history.getFragment());
			dir = dir.substring(dir.indexOf("/")+1);
			return dir;
		};

		function splitLink(link){
			var firstName = new Span(link.substring(0,link.indexOf("/")));
			var secondName = link.substring(link.indexOf("/") + 1);
			secondName = new Span(secondName.substring(0, secondName.indexOf("/")));
			return [firstName,secondName]
		}

		$(angleRight).addClass('divider fa fa-angle-right');
		$(verticalBar).addClass('verticalBar');

		tests.questions.forEach(function(element){

			var test = new Span(element.name);
			if(element.status){
				//console.log("links true",element);
				$(test).addClass('white');
				links.push(test);
			}else {
				links.push(test);
			}
		});

		self.mainmenuHtml.find('.breadcrumbs').html('').append(currentDir[0],angleRight,currentDir[1],verticalBar,links);
	},

	controllButtons: function(self,element) {
		var that = this;

		if($(element.target).data('id')){

			switch ($(element.target).data('id')) {
				case "reloadButton":
					self.find(".selectSection p").html('Обнулить результат?');
					self.find("#succesMenuButton").attr('href','#reset');
					break;
				case "turnOfSound":
					self.find(".selectSection p").html('Изменить настройки звука?');
					self.find("#succesMenuButton").attr('href','#sound');
					break;
				case "goMenu":
					self.find(".selectSection p").html('Вернуться на портал?');
					self.find("#succesMenuButton").attr('href','www.tretyakovgallery.ru');
					break;
				case "aboutButton":
					this.trigger('Get:About');
					break;
				default:

			}
			self.find(".pushed").toggleClass('pushed');
			self.find(".selectSection").removeClass().addClass($(element.target).data('id') + " selectSection");
			$(element.target).toggleClass('pushed');
		}
	}
	// Управление звуком
	// audioControll: function(){
	// 	var audio = document.getElementById('audio');
	// 	var img = document.getElementById('soundImage');
	//
	//
	// 	console.log("this.audioState",this.audioState)
	//
	// 	if(this.audioState == true){
	//
	// 		$(img).attr('src','img/controll/volume.png');
	// 	    audio.play();
	// 	}else {
	//
	// 		$(img).attr('src','img/controll/volume-x.png');
	// 	    audio.pause();
	// 	}
	// },
	// audioSwictcher: function(){
	// 	var state = JSON.parse(localStorage.getItem("sound"));
	// 	console.log(state);
	// 	localStorage.setItem("sound",state?false:true);
	//
	// 	this.audioState = JSON.parse(localStorage.getItem('sound'));
	// 	this.audioControll();
	// }
});
