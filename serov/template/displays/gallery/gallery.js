define({
	render: function() {

		this.content = this.html;

		var preloader = this.renderPreloader();
		var menu = this.renderMenu();
		var accordion = this.renderAccordion();
		var video = this.renderVideo('videos');
		var reader = this.renderReader(['antiq','history','story']);
		var help = this.renderHelp();
		var about = this.renderAbout();
		var tests = this.renderTest('allTests');
		var map = this.initMap();
		var transformer3D = this.renderTransformer3D([accordion,reader,video,map]);
		console.log(help)
		this.content.append(transformer3D);
		this.content.find('#accordion li.active').append(preloader);

		$('#app').html('').append(this.content, menu, help, about, tests);
		this.preloadImage();
		this.subscribe();
		this.share = Ya.share2('shareBlock', {
		    content: {
		        url: 'http://edu.tretyakov.ru/serov/',
		        title: 'Уроки Валентина Серова',
		        description: 'Ваш статус: НОВИЧОК. У вас все еще впереди!',
		        image: 'http://edu.tretyakov.ru/img/controll/progress/med/beginer.jpg'               
		    },
	        theme: {
		        services: 'vkontakte,facebook,twitter',
		        counter: false,
		        lang: 'ru',
		        limit: 3,
		        size: 'm',
		        bare: false
		    }
		});
	},
	subscribe: function() {
		var self = this;
		this.audioControll();
	}
});
