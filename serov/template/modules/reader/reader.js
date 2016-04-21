define({

	renderReader: function(bookName) {
		this.loadBooks(bookName);
		return this.readerHtml;
	},

	loadBooks: function(books){
		var self = this;
		self.books = {};
		books.forEach(function(bookName,i){
			require([
				'text!./../../../serov/content/books/' + bookName + '.json'
			], function(json) {
				

//console.log('Книга "' + bookName + '" загружена');
				var book = JSON.parse(json);
				self.books[bookName]={};
				self.books[bookName].length = book.pages.length;
				self.books[bookName].content = self.renderHandlebarsTemplate("#pageTemplate",book.pages);
			});
		})
	},

	printBookPages: function(book){
		var self = this;
		var bookPages = self.books[book]
		

//console.log("printPages",self.books)

		self.readerHtml.html(bookPages.content);
		self.subscribeReader(bookPages.length);
	},

	subscribeReader: function(pagesLength){
		var self = this;
		
		checkArrow();
//console.log('subscribeReader');
		//Управление боковыми стрелками. Присваиваем предыдущую и следующую страницу.
		self.previousPage = self.readerHtml.find('.left').previousPage = 0;
		self.nextPage = self.readerHtml.find('.right').nextPage = 2;

		//Обработка события с нижнего бара
		self.readerHtml.find('#goFront').on('click', function(e) {
			self.transformer3DHtml.find('#cube').toggleClass('show-top');
		});

		//Открываем полное изображение
		[].forEach.call(self.readerHtml.find('.openModal'),function(element){
			

			$(element).on('click', function(e) {

				self.readerHtml.find('#modal').css("display","block");
				self.readerHtml.find('#modal .modal-body').css("background-image","url("+$(e.target).data("fullimage"));

				self.readerHtml.find('.close').on('click', function(e) {
					self.readerHtml.find('#modal').css("display","none");
				});
			});
		})

		//Обработка события с нижнего бара
		self.readerHtml.find('[data-link]').on('click', function(e) {
			var pageNumber = $($(e.target).closest('li')).data('link');

			self.readerHtml.find('.active').toggleClass('active');
			self.readerHtml.find('[data-link='+pageNumber+'],[data-number='+pageNumber+']').toggleClass('active');
			self.previousPage = pageNumber - 1;
			self.nextPage = pageNumber + 1;
			checkArrow(pageNumber);
		});

		//Обработка событий с боковых стрелок.
		self.readerHtml.find('[data-controll]').on('click', function(e) {
			var pageLocation = $($(e.target).closest('span')).data('controll');
			var pageNumber = self[pageLocation];

			if(!(pageNumber <= 0) && !(pageNumber >= pagesLength + 1)){

				self.readerHtml.find('.active').toggleClass('active');
				self.readerHtml.find('[data-link='+pageNumber+'],[data-number='+pageNumber+']').toggleClass('active');
				self.previousPage = pageNumber - 1;
				self.nextPage = pageNumber + 1;
				checkArrow(pageNumber);
			}	
		});

		//Обработка событий оглавления.
		self.readerHtml.find('[data-menu]').on('click', function(e) {
			var pageNumber = $(e.target).data('menu');

			self.readerHtml.find('.active').toggleClass('active');
			self.readerHtml.find('[data-link='+pageNumber+'],[data-number='+pageNumber+']').toggleClass('active');
			self.previousPage = pageNumber - 1;
			self.nextPage = pageNumber + 1;
			checkArrow(pageNumber);
		});

		function checkArrow(pageNumber) {
			var left = $('#reader .sliderControl.left');
			var right = $('#reader .sliderControl.right');
			pageNumber = pageNumber? pageNumber : 1;
			if(pageNumber == 1){
				left.css('display','none');
				right.css('display','block');
				console.log("First page");
			}else if(pageNumber == pagesLength){
				right.css('display','none');
				left.css('display','block');
				console.log("Last page");
			}else{
				right.css('display','block');
				left.css('display','block');
				console.log("Page Ok");
			}
		}
	}

})