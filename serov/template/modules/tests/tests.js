define({

	renderTest: function(testName) {
		this.loadTest(testName);
		return this.testsHtml;
	},

	loadTest: function(tests){
		var self = this;
		var gameProgress = {
			progress:0,
			score:0,
			status:"НОВИЧОК",
			comment:"У вас все еще впереди!",
			img:"./img/controll/progress/small/beginer.jpg",
			imgMeta:"./img/controll/progress/med/beginer.jpg"
		};
		self.tests = {};

		require([
			'text!./../../../serov/content/tests/' + tests + '.json'
		], function(json) {
			var test = JSON.parse(json);
			self.tests={};
			if(localStorage.getItem("tests")){
				self.tests.data = JSON.parse(localStorage.getItem('tests'));
				self.printTestPages();
			}else{
				self.tests.data=test;
				localStorage.setItem("progress",JSON.stringify(gameProgress));
			}
			self.tests.template = self.renderHandlebarsTemplate("#testTemplate", self.tests.data);
			localStorage.setItem("tests",JSON.stringify(self.tests.data));
			self.printTestPages();
		});

	},

	printTestPages: function(){
		var self = this;

		if(!localStorage.getItem("tests")){
			localStorage.setItem("tests",JSON.stringify(self.tests.data));
		}

		self.testsHtml.html(self.tests.template);
		self.buildDonePoints();
		self.subscribeTest();

	},

	subscribeTest: function(testName){
		var self = this;
		var scores = 0;

		//Проверка прохождения теста

		var testImgContainer = document.querySelectorAll("#tests .imgContainer .img");

		var clickFunction = function(e) {
			e.target.removeEventListener('click', clickFunction, false);
		    var selector = e.target.getAttribute('data-toogle');
			var testId = $(e.target).closest('section').parent().data('id');
			var testName = $(e.target).closest('section').parent().parent().attr('id');

			if (selector === 'rightHover') {
				self.testsHtml.find(e.target.parentNode.parentNode.querySelector('.'+selector)).addClass('active');
				self.testsHtml.find(e.target.parentNode.parentNode.parentNode).addClass('complete');
				self.testsHtml.find(e.target.parentNode).addClass('active');
				scores += 3;
				questPassed(testId, testName, scores);
				scores = 0;
			}else{
				self.testsHtml.find(e.target.parentNode.parentNode.querySelector('.'+selector)).addClass('active');
				self.testsHtml.find(e.target.parentNode).addClass('active');
				scores -= 1;
			};
		};

		for (var i = 0; i < testImgContainer.length; i++) {
		    testImgContainer[i].addEventListener('click', clickFunction, false);
		}

		// Закрытие теста
		self.testsHtml.find('.goBackButton').on('click', function(e) {
			self.deactivateQuestion(e);
		});

		// Изменение состояния звука в тесте
		self.testsHtml.find('.soundTestButton').on('click', function(e) {
			self.testsAudioSwictcher();
		});

		// Сброс прохождения тестов


		// Тест пройден, проверяем состояния и окрашиваем поинты и хлебные крошки.
	 	function questPassed(testId, testName, scores) {
			console.log(testId, testName, scores);
			var testData = JSON.parse(localStorage.getItem('tests'));
			var domTestId = testData[testName].questions[(testId - 1)].id;

			testData[testName].questions[(testId - 1)].status = true;

			localStorage.setItem("tests",JSON.stringify(testData));

			self.testsHtml.find('#'+domTestId+' .answers').removeClass('active');
			self.testsHtml.find('#'+domTestId+' .reward').addClass('active');
			self.checkTestComplite(testData[testName],domTestId,testName);
			self.buildDonePoints();
			self.testBreadcrumbsRender("Игра",testData[testName].testName,testName);
			self.setProggress(scores);
		};
	},
	testPassed: function(lastTestId,testName) {
		var self = this;
		// Записываем данные о прохождении всех вопросов в LS
		var testData = JSON.parse(localStorage.getItem('tests'));
		var pageHeight = self.testsHtml.find("#"+lastTestId).height();

		testData[testName].statusGeneral = true;

		localStorage.setItem('tests',JSON.stringify(testData));

		self.testsHtml.find('#finishTest'+testName).addClass('active').css("top",pageHeight);

		setTimeout(function(){
			$('html,body').animate({
	          scrollTop: window.pageYOffset + document.documentElement.clientHeight
	        }, 1000);
		}, 200);
	},
	testCleared: function(lastTestId,testName) {
		var self = this;

		localStorage.removeItem('tests');
		localStorage.removeItem('maps');
		localStorage.removeItem('progress');

		$('.breadcrumbs>span.white').removeClass('white');
		self.testsHtml.find('.reward').removeClass('active');
		self.testsHtml.find('.imgContainer div').removeClass('active');
		self.testsHtml.find('.answers').addClass('active');
	},
	activateQuestion: function(questionName){
		var self = this;
		// Выставляем иконку звука в тест в зависимости от состояния.
		var soundImgTest = document.getElementById('soundTestButton');
		var state = JSON.parse(localStorage.getItem("sound"));

		if(!state){
			$(soundImgTest).css('background-image','url(img/controll/volume-test-x.png)');
		}else {
			$(soundImgTest).css('background-image','url(img/controll/volume-test.png)');
		}

		self.testsHtml.find('#'+questionName).addClass('active');

		$('#tests').addClass('active').animate({ "left": "0" }, 1200 );
		setTimeout(function(){
        	$("html,body").css("overflow-y","scroll");
        	$(self.testsHtml.find('.goBackButton')).css('display','block');
        	$(self.testsHtml.find('.goNext')).css('display','block');
        },1200);

		self.showNextBlock(questionName);
	},
	deactivateQuestion: function(element){
		var self = this;
		var tests = document.getElementById('tests');

		$('html,body').animate({
          scrollTop: 0
        }, 1000);
		$("html,body").css("overflow-y","hidden");
    	$(self.testsHtml.find('.goBackButton')).css('display','');
    	console.log("deactivateQuestion");
		$(tests).delay(1000).animate({ "left": "100vw" }, 1000 );
		setTimeout(function(){
	    	$('#tests.active .goNext').off().css('display','none');
		},1200);
		setTimeout(function(){
			$(tests).removeClass('active');
			$('#tests .test-wraper>div').removeClass('active');
		},2000);
	},
	showNextBlock: function(questionName){
		var self = this;
		var allSection = document.querySelectorAll('#'+questionName+' section');
		var currentHeight = document.querySelector('#'+questionName+' section').clientHeight;
		var currentOffset = 0;
		var maxHeight = document.getElementById(questionName).clientHeight;

		$('.goNext').on('click',Animate);

		$(window).on('scroll', function(){
			currentOffset = window.pageYOffset;

        	if((maxHeight - window.pageYOffset) < (currentHeight + 50)){
        		console.log("Hide");
	    		$('.goNext').css('display','none');
        	}else{
        		console.log("Show");
        		
        		if($('#tests.active .goNext').css('display') == "none"){
	        		$('#tests.active .goNext').css('display','block');
        		}
        	}
		});

		function Animate(){

			var closestScroll = [];

			[].forEach.call(allSection,function(element,i){
				if(element.offsetTop > currentOffset){
					closestScroll.push(element.offsetTop);
					if(i === (allSection.length - 1)){
						$("html,body").stop().animate({
				          scrollTop: _.min(closestScroll)
				        }, 500);
					}
				}
			})
		}
	},
	checkTestComplite: function(testData, lastTestId,testName){
		var self = this;
		var compleatedQuest = 0;

		testData.questions.forEach(function(quest,i,arr){

			if(quest.status){
				compleatedQuest++
			}else{

			}
		});

		if(compleatedQuest === (testData.questions.length)){
			self.testPassed(lastTestId,testName);
			self.checkImageProgress();
		}

	},
	setProggress: function(score){
		console.log("setProggress score",score)
		var tests = JSON.parse(localStorage.getItem('tests'));
		var progressData = JSON.parse(localStorage.getItem('progress'));
		var allQuestions =  _.flatten(_.map(tests, function(test){
			return test.questions
		}));
		var allQuestionsLength = allQuestions.length;
		allQuestions = _.compact(_.map(allQuestions, function(num){
			return num.status
		}));
		var completedQuestionsLength = allQuestions.length;

		progressData.progress = Math.round((completedQuestionsLength*100)/allQuestionsLength);
		progressData.score += score;
		console.log(progressData.score);
		switch(true){
			case progressData.score <= 12:
				progressData.status = "Новичок";
				progressData.comment = "У вас все еще впереди!";
				progressData.img = "./img/controll/progress/small/beginer.jpg";
				progressData.imgMeta = "./img/controll/progress/med/beginer.jpg";
				break;
			case progressData.score > 12 && progressData.score <= 18:
				progressData.status = "Ученик";
				progressData.comment = "Неплохо, возможно, вас могли бы взять в ученики.";
				progressData.img = "./img/controll/progress/small/scholar.jpg";
				progressData.imgMeta = "./img/controll/progress/med/scholar.jpg";
				break;
			case progressData.score > 18 && progressData.score <= 24:
				progressData.status = "Подмастерье";
				progressData.comment = "Вы здорово поработали, продолжайте в том же духе.";
				progressData.img = "./img/controll/progress/small/prentice.jpg";
				progressData.imgMeta = "./img/controll/progress/med/prentice.jpg";
				break;
			case progressData.score > 24 && progressData.score <= 30:
				progressData.status = "Мастер";
				progressData.comment = "Вы хорошо понимаете особенности мастерства Серова.";
				progressData.img = "./img/controll/progress/small/teacher.jpg";
				progressData.imgMeta = "./img/controll/progress/med/teacher.jpg";
				break;
			case progressData.score > 30:
				progressData.status = "Учитель";
				progressData.comment = "Вы отлично разбираетесь в особенностях творчества Серова!";
				progressData.img = "./img/controll/progress/small/master.jpg";
				progressData.imgMeta = "./img/controll/progress/med/master.jpg";
				break;
		}

		localStorage.setItem("progress",JSON.stringify(progressData));
	},
	// Управление звуком
	audioTestControll: function(){
		var audio = document.getElementById('audio');
		var img = document.getElementById('soundImage');
		var imgTest = document.getElementById('soundTestButton');
		var state = JSON.parse(localStorage.getItem("sound"));
	
		if(state){
			$(img).attr('src','img/controll/volume.png');
			$(imgTest).css('background-image','url(img/controll/volume-test.png)');
	
		    audio.play();
		}else {
			$(img).attr('src','img/controll/volume-x.png');
			$(imgTest).css('background-image','url(img/controll/volume-test-x.png)');
	
		    audio.pause();
		}
	},
	testsAudioSwictcher: function(){
		var state = JSON.parse(localStorage.getItem("sound"));
		localStorage.setItem("sound",state?false:true);

		this.audioTestControll();
	}

})
