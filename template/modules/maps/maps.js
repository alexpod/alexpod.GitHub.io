define({
	initMap: function() {
		var self = this;
		this.loadMap("maps");

		// self.on('Test:Loaded', function(testName) {
		// 	this.buildDonePoints(testName);
		// });

		self.on('Map:Loaded', function() {
			this.subscribeMap();
			this.animatePoints();
			this.animateShip();
		});

		return this.mapsHtml;
	},

	printMap : function (mapName) {
		var self = this;
		self.content.find(".maps").removeClass("active");
		self.content.find(".maps#map-" + mapName).addClass("active");

		if(mapName === 'antiq'){
			self.animateClouds();
		}
	},

	loadMap : function(mapName){
		var self = this;
		var myStorage = localStorage;
		self.maps = {};
		require([
			'text!../../../content/maps/' + mapName + '.json'
		], function(json) {
			self.maps[mapName] = JSON.parse(json);
			if(myStorage.getItem("maps")){
				self.maps = JSON.parse(myStorage.getItem('maps'));
			}
			self.renderMaps(self,mapName);
		});
	},

	renderMaps: function(self,mapName){

		var myStorage = localStorage;
		var map = self.maps[mapName];
		var page = self.renderHandlebarsTemplate("#mapsTemplate", map);
		if(!myStorage.getItem("maps")){
			myStorage.setItem("maps",JSON.stringify(self.maps));
		};
		self.mapsHtml.html(page);
		self.trigger('Map:Loaded');
		self.subscribeMap();
	},

	subscribeMap: function() {
		var self = this;
		self.content.find(".point").on('click', function(e) {
			var cityName = 	$(this).data("id");
			self.activateQuestion(cityName)
		});
	},


	buildDonePoints: function(testName){
		var data;
		if(localStorage.tests){
			data = JSON.parse(localStorage.tests);
		}else{
			data = this.tests;
		}
		data[testName].questions.forEach(function(item, i){
			$("." +item.id + "").attr('data-id', item.id);
			if (item.status){
				$("." +item.id + "").addClass("done");
				$("img." +item.id + "").remove();
				$("<img class=" + item.id + " src="+"/img/maps/pointDone.png"+">").appendTo(".done."+item.id+"");
				$("img." +item.id + "").addClass("done");
			}
		});
	},

	refreshPoints: function(){
		"use strict";
		var self = this;
		var points = $("a.done");

		_.each(points, function(item, i){

			var id = $(item).attr('data-id');
			$(item).removeClass('done');

			function imgGenerator(src,className,id){
				var img = document.createElement("img");

				$(img).attr('src', src);
				$(img).attr('data-id', id);
				$(img).addClass(className);

				return img
			};
			$(item).empty().append(imgGenerator("../../img/maps/pointStart.png","point pointStart " + id,id),imgGenerator("../../img/controll/point.svg","point pointFinish animatePoint " + id,id));
			self.subscribeMap();
		});
	},

	animateClouds: function(){
		var self = this;

		var directionArray = ['left', 'right', 'up', 'down'];
		var elementsArray = ['.c1', '.c2', '.c3'];

		function getRandomArrayElement(array){
			var rand = Math.floor(Math.random() * array.length);
			return array[rand];
		}

		function getRandomInteger(min, max) {
	    	var rand = min - 0.5 + Math.random() * (max - min + 1)
	    	rand = Math.round(rand);
	    	return rand;
		}

		function moveElementTowards (element, direction){
			switch (direction){
				case 'left':
					self.content.find(element).css("top", getRandomInteger(1, 70) + "%");
					self.content.find(element).css("left", getRandomInteger(100, 140) + "%");
					self.content.find(element).addClass("move-left");
					break;
				case 'right':
					self.content.find(element).css("top", getRandomInteger(1, 70) + "%");
					self.content.find(element).css("left", -getRandomInteger(10, 40) + "%");
					self.content.find(element).addClass("move-right");
					break;
				case 'up':
					self.content.find(element).css("top", getRandomInteger(110, 130) + "%");
					self.content.find(element).css("left", getRandomInteger(1, 80) + "%");
					self.content.find(element).addClass("move-up");
				break;
				case 'down':
					self.content.find(element).css("top", -getRandomInteger(40, 60) + "%");
					self.content.find(element).css("left", getRandomInteger(1, 80) + "%");
					self.content.find(element).addClass("move-down");
				break;
			}
		}

		var timerClouds = setTimeout(function tick() {
					elementsArray.forEach(function(item, i, arr) {
						moveElementTowards(item, getRandomArrayElement(directionArray))
					});
		  timerClouds = setTimeout(tick, 120000);
		}, 1000);

	},

	animatePoints: function(){
		var self = this;
		function zoomIn(map){

			[].forEach.call($(self.content.find(".active .animatePoint")),function(element,counter){
					animate(element,counter);
			});

			function animate(element,counter){

				setTimeout(function(){

					$(element).css({
						"transform":"scale(1)",
						"opacity": 0
					});
				},counter * 500);
			}
		};

		function zoomOut(){
			  self.content.find(".animatePoint").css({
			  	"transform": "scale(0)"
			  });
		};

		function showPoint(){
			  self.content.find(".animatePoint").css({
			  	"opacity": "1"
			  });
		};

		var timerPoints = setTimeout(function tick() {
			zoomOut();
			setTimeout(zoomIn, 1000);
			setTimeout(zoomOut, 8000);
			setTimeout(showPoint, 10000);
		    timerPoints = setTimeout(tick, 15000);
		}, 1000);

	},

	animateShip: function (){
		console.log("animateShip");
		var self = this;
		function moveRight(){

				self.content.find("img.ship").remove();
				$(new Image()).attr('src', '' + "/img/maps/antiq/shipRight.png").addClass('ship').appendTo($('.shipContainer'));
				self.content.find('.shipContainer').removeClass("ship-move-left");
			  self.content.find('.shipContainer').addClass("ship-move-right");
		};
		function moveLeft(){
				self.content.find("img.ship").remove();
				$(new Image()).attr('src', '' + "/img/maps/antiq/shipLeft.png").addClass('ship').appendTo($('.shipContainer'));
				self.content.find('.shipContainer').removeClass("ship-move-right");
			  self.content.find('.shipContainer').addClass("ship-move-left");
		};


		moveLeft();
		var timerShip = setTimeout(function tick() {
			moveRight();
			setTimeout(moveLeft, 120000);
			timerShip = setTimeout(tick, 240000);
		}, 120000);

	}

});
