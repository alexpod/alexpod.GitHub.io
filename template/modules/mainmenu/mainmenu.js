define({
	renderMenu: function() {

		this.subscribeMenu(this.mainmenuHtml);
		return this.mainmenuHtml;
	},
	subscribeMenu: function(self) {
		var that = this;
		// Настройки звука
		if(localStorage.getItem('sound')){
			this.audioState = localStorage.getItem('sound');
		}else{
			this.audioState = true;
			localStorage.setItem('sound',true);
		}
		self.find('.leftSide>.icon').on('click', function() {
			self.find('.leftSide .leftMenu').toggleClass('hide');
		});

		self.find('.menu a:not(.icon)').on('click', function(e) {

			self.find('.menu a:not(.icon)').removeClass('active');
			$(e.target).addClass('active');
			self.find('.leftSide .leftMenu').toggleClass('hide');
		});

		self.find('.rightSide button').on('click', function(element) {
			that.controllButtons(self,element);
		});	

		self.find('#revertMenuButton').on('click', function(element) {
			self.find(".pushed").removeClass('pushed');
			self.find(".selectSection").removeClass().addClass("selectSection");
			self.find(".selectSectionClose").removeClass('active');
		});
		self.find('.selectSectionClose').on('click', function(element) {
			self.find(".pushed").removeClass('pushed');
			self.find(".selectSection").removeClass().addClass("selectSection");
			self.find(".selectSectionClose").removeClass('active');
		});
	},
	breadcrumbsRender: function(current,ways){
		var self = this;
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

		tests.questions.forEach(function(element,counter){

			var test = new Span(element.name);
			if(element.status){
				$(test).addClass('white');
				links.push(test);
				console.log('')
				if(counter < (tests.questions.length - 1)){
					links.push('/');
				}
			}else {
				links.push(test);
				if(counter < (tests.questions.length - 1)){
					links.push('/');
				}
			}
		});

		self.mainmenuHtml.find('.breadcrumbs').html('').append(currentDir[0],angleRight,currentDir[1],verticalBar,links);
	},

	controllButtons: function(self,element) {
		if($(element.target).data('id')){

			switch ($(element.target).data('id')) {
				case "reloadButton":
					$('#help').removeClass('shown');
					$('#about').removeClass('shown');
					this.fillProgressMenu(self);
					self.find(".selectSectionClose").addClass('active');
					break;
				case "turnOfSound":
					// self.find(".selectSection p").html('Изменить настройки звука?');
					// self.find("#succesMenuButton").attr('href','#serov/sound');
					break;
				case "goMenu":
					$('#help').removeClass('shown');
					$('#about').removeClass('shown');
					self.find(".selectSection p").html('Вернуться на портал?');
					self.find("#succesMenuButton").attr('href','www.tretyakovgallery.ru');
					self.find(".selectSectionClose").addClass('active');
					break;
				case "aboutButton":
					$('#help').removeClass('shown');

					$('#about .close').on('click', function(element) {
						$('#about').removeClass('shown');
						self.find(".pushed").removeClass('pushed');
						self.find(".selectSection").removeClass().addClass("selectSection");
						self.find(".selectSectionClose").removeClass('active');
						$('#about .close').off();
					});	

					this.animateAbout();
					break;
				case "helpButton":
					$('#about').removeClass('shown');

					$('#help .close').on('click', function(element) {
						$('#help').removeClass('shown');
						self.find(".pushed").removeClass('pushed');
						self.find(".selectSection").removeClass().addClass("selectSection");
						self.find(".selectSectionClose").removeClass('active');
						$('#help .close').off();
					});	

					this.animateHelp();
					break;
				default:

			}
			if(element.target.nodeName === "IMG"){
				if($(element.target.parentNode).hasClass("pushed")){
					$(element.target.parentNode).removeClass('pushed');
					self.find(".selectSection").removeClass().addClass("selectSection");
				}else{
					self.find(".pushed").removeClass('pushed');
					self.find(".selectSection").removeClass().addClass($(element.target.parentNode).data('id') + " selectSection");
					$(element.target.parentNode).addClass('pushed');
				}
			}else{
				if($(element.target).hasClass("pushed")){
					$(element.target).removeClass('pushed');
					self.find(".selectSection").removeClass().addClass("selectSection");
				}else{
					self.find(".pushed").removeClass('pushed');
					self.find(".selectSection").removeClass().addClass($(element.target).data('id') + " selectSection");
					$(element.target).addClass('pushed');
				}
			}
		}
	},

	fillProgressMenu: function(self){
		console.log('reloadButton')
		var progressData = JSON.parse(localStorage.getItem('progress'));

		self.find("#progressPercent").html(progressData.progress);
		self.find("#progressBar").css('width',progressData.progress+'%');
		self.find("#progressScore").html(progressData.score);
		self.find("#progressComment").html(progressData.comment);
		self.find("#progressImg").attr('src',progressData.img);
		self.find("#progressStatus").html(progressData.status);

		$('#descriptionMetaOg').attr("content","Ваш статус: "+ progressData.status + ". " + progressData.comment);
		$('#titleMetaOg').attr("content","Уроки Валентина Серова");
		$('#imgMetaOg').attr("content",progressData.imgMeta);
		$('#descriptionMetaTw').attr("content","Ваш статус: "+ progressData.status + ". " + progressData.comment);
		$('#titleMetaTw').attr("content","Уроки Валентина Серова");
		$('#imgMetaTw').attr("content",progressData.imgMeta);

		this.share.updateContent({
		    title: 'Уроки Валентина Серова',
		    description: "Ваш статус: "+ progressData.status + ". " + progressData.comment,
		    url: 'http://edu.tretyakov.ru/',
		    image: 'http://edu.tretyakov.ru/'+progressData.imgMeta
		});

		if(progressData.progress === 100){
			self.find("#progressShare > div").css('pointer-events','auto');
		}
	},
	// Управление звуком
	audioControll: function(){
		var audio = document.getElementById('audio');
		var img = document.getElementById('soundImage');
		var state = JSON.parse(localStorage.getItem("sound"));
	
		console.log("this.audioState",this.audioState)
	
		if(state){
			console.log('true');
			$(img).attr('src','img/controll/volume.png');
		    audio.play();
		}else {
			console.log('false');
			$(img).attr('src','img/controll/volume-x.png');
		    audio.pause();
		}
	},
	audioSwictcher: function(){
		var state = JSON.parse(localStorage.getItem("sound"));
		localStorage.setItem("sound",state?false:true);

		this.audioControll();
	},
	soundChanger: function(name){
		console.log('soundChanger',name);
		var audio = document.getElementById('audio');
		var soundSource = $('#audio source');

		if(soundSource.data('current') != name){
			console.log('change');
			audio.pause();
			soundSource.attr('src',"./audio/"+name+".mp3");
			soundSource.data('current',name);
			audio.load();
			this.audioControll();
		}else{
			console.log('stay');
		}
	}
});
