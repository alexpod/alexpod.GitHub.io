define({

	renderTest: function(testName) {
		this.loadTest(testName);
		return this.testsHtml;
	},

	loadTest: function(tests){
		var self = this;
		var myStorage = localStorage;
		self.tests = {};
		
		if(myStorage.getItem("tests")){
			self.tests = JSON.parse(myStorage.getItem('tests'));
		}else{

			tests.forEach(function(testName,i){
				require([
					'text!../../../content/tests/' + testName + '.json'
				], function(json) {
					var test = JSON.parse(json);
					self.tests[testName]={};
					self.tests[testName]=test;
					self.tests[testName].template = self.renderHandlebarsTemplate("#testTemplate", test);
					if (i === (tests.length - 1)){
						localStorage.setItem("tests",JSON.stringify(self.tests));
					}
				});
			});
		}
	},

	printTestPages: function(testName){
		var self = this;

		if(!localStorage.getItem("tests")){
			localStorage.setItem("tests",JSON.stringify(self.tests));
		}

		self.testsHtml.html(self.tests[testName].template);
		self.subscribeTest(testName);
		self.buildDonePoints(testName);
	},

	subscribeTest: function(testName){
		var self = this;
		var myStorage = localStorage;

		//Проверка прохождения теста
		self.testsHtml.find('.imgContainer .img').on('click', function(e) {
			var selector = e.target.getAttribute('data-toogle');
			var testId = $(e.target).closest('section').parent().data('id');

			self.testsHtml.find(e.target.parentNode.parentNode.querySelector('.'+selector)).addClass('active');
			self.testsHtml.find(e.target.parentNode).addClass('active');
			if (selector === 'rightHover') {

				self.trigger('Quest:Passed', testId, testName);
			};
		});

		// Закрытие теста
		self.testsHtml.find('.goBackButton').on('click', function(e) {
			self.deactivateQuestion(self);
		});

		// Изменение состояния звука в тесте
		// self.testsHtml.find('.soundTestButton').on('click', function(e) {
		// 	self.audioTestControll();
		// });

		// Сброс прохождения тестов
		self.on('Tests:Cleared',function(testId, testName) {
			myStorage.removeItem('tests');
			myStorage.removeItem('maps');

			$('.breadcrumbs>span.white').removeClass('white');
			self.testsHtml.find('.reward').removeClass('active');
			self.testsHtml.find('.imgContainer div').removeClass('active');
			self.testsHtml.find('.answers').addClass('active');
		});

		// Тест пройден, проверяем состояния и окрашиваем поинты и хлебные крошки.
		self.on('Quest:Passed', function(testId, testName) {
			var testData = JSON.parse(myStorage.getItem('tests'));
			var domTestId = testData[testName].questions[(testId - 1)].id;

			testData[testName].questions[(testId - 1)].status = true;
			myStorage.setItem("tests",JSON.stringify(testData));

			self.testsHtml.find('#'+domTestId+' .answers').removeClass('active');
			self.testsHtml.find('#'+domTestId+' .reward').addClass('active');

			self.checkTestComplite(testData[testName],domTestId);

			self.buildDonePoints(testName);
			self.testBreadcrumbsRender("Игра",testData[testName].testName,testName);

		});

		self.on('Test:Passed', function(lastTestId) {
			// Записываем данные о прохождении всех вопросов в LS
			var testData = JSON.parse(myStorage.getItem('tests'));
			var pageHeight = self.testsHtml.find("#"+lastTestId).height();

			testData[testName].statusGeneral = true;

			myStorage.setItem('tests',JSON.stringify(testData));

			self.testsHtml.find('#finishTest').addClass('active').css("top",pageHeight);

			setTimeout(function(){
				$('html,body').animate({
		          scrollTop: window.pageYOffset + document.documentElement.clientHeight
		        }, 1000);
			}, 200);
		});
	},
	activateQuestion: function(questionName){
		var self = this;
		// Выставляем иконку звука в тест в зависимости от состояния.
		// var soundImgTest = document.getElementById('soundTestButton');
		// console.log("Запуск теста",questionName);
		// if(self.audioState == 0){
		// 	$(soundImgTest).css('background-image','url(img/controll/volume-test-x.png)');
		// }else {
		// 	$(soundImgTest).css('background-image','url(img/controll/volume-test.png)');
		// }

		self.testsHtml.find('#'+questionName).addClass('active');

		$('#tests').addClass('active').animate({ "left": "0" }, 1200 );
		setTimeout(function(){
        	$("html,body").css("overflow-y","scroll");
        },1200);

		self.showNextBlock(questionName);
	},
	deactivateQuestion: function(self){
		var tests = document.getElementById('tests');

		$('html,body').animate({
          scrollTop: 0
        }, 1000);
		$("html,body").css("overflow-y","hidden");
		$(tests).delay(1000).animate({ "left": "100vw" }, 1000 );
		$(self.testsHtml.find('.goNext')).css('display','block');

		setTimeout(function(){
			$(tests).removeClass('active');
			$('#tests>div').removeClass('active');
		},2000);
	},
	showNextBlock: function(questionName){
		var self = this;
		var currentHeight = document.querySelector('#'+questionName+' section').clientHeight;
		var maxHeight = document.getElementById(questionName).clientHeight;
		
		this.testsHtml.find('.goNext').on('click',Animate);

		function Animate(){

			$("html,body").stop().animate({
	          scrollTop: currentHeight + window.pageYOffset
	        }, 500);

	        setTimeout(function(){
	        	if((maxHeight - window.pageYOffset) < (currentHeight + 150)){
		    		self.testsHtml.find('.goNext').off( "click", Animate ).css('display','none');
	        	}
	        },500);
		}
	},
	checkTestComplite: function(testData, lastTestId){
		var self = this;
		var compleatedQuest = 0;

		testData.questions.forEach(function(quest,i,arr){

			if(quest.status){
				compleatedQuest++
			}else{

			}
		});

		if(compleatedQuest === (testData.questions.length)){
			self.trigger('Test:Passed', lastTestId);

		}

	},

	// Управление звуком
	// audioTestControll: function(){
	// 	var audio = document.getElementById('audio');
	// 	var img = document.getElementById('soundImage');
	// 	var imgTest = document.getElementById('soundTestButton');
	//
	// 	if(this.audioState == 0){
	// 		$(img).attr('src','img/controll/volume.png');
	// 		$(imgTest).css('background-image','url(img/controll/volume-test.png)');
	//
	// 	    audio.play();
	// 		this.audioState = 1;
	// 	}else {
	// 		$(img).attr('src','img/controll/volume-x.png');
	// 		$(imgTest).css('background-image','url(img/controll/volume-test-x.png)');
	//
	// 	    audio.pause();
	// 		this.audioState = 0;
	// 	}
	// }

})
