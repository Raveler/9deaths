define(["Compose", "Logger", "GameArea", "Vector2", "Player", "Renderer"],
	function(Compose, Logger, GameArea, Vector2, Player, Renderer) {
	
	var Game = Compose(function constructor() {

		// first time
		this.firstTime = true;

		// width, height
		this.width = 1024;
		this.height = 768;

		// the canvas
		this.canvas = document.createElement('canvas');
		this.canvas.style = "canvas-game";
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		// Load images
		var imagesFileNames=[];
		//imagesFileNames.push("xx");
		this.loadImages(imagesFileNames);

		// Load json data
		var jsonFileNames = [];
		jsonFileNames.push("game");
		jsonFileNames.push("world");
		this.loadJson(jsonFileNames);

		// keys
		this.keys = {};
		this.keyDown = function(e) {
			if (this.phase != 0) {
				this.phase--;
			}
			var ch = String.fromCharCode(e.keyCode);
			this.keys['key' + e.keyCode] = true;
			if (e.keyCode != 116) e.preventDefault();
		};
		
		this.keyUp = function(e) {
			var ch = String.fromCharCode(e.keyCode);
			this.keys['key' + e.keyCode] = false;
			if (e.keyCode != 116) e.preventDefault();
		};

		this.keyCodes = {
			down: 40,
			up: 38,
			left: 37,
			right: 39
		};

		this.isKeyDown = function(key) {
			return this.keys['key' + key];
		};

		this.mouseClick = function(e) {
			if (this.phase != 0) {
				this.phase--;
			}
			var mousePosX = -1;
			var mousePosY = -1;
			if (!e) var e = window.event;
			if (e.pageX || e.pageY) 	{
				mousePosX = e.pageX;
				mousePosY = e.pageY;
			}
			else if (e.clientX || e.clientY) 	{
				mousePosX = e.clientX + document.body.scrollLeft
					+ document.documentElement.scrollLeft;
				mousePosY = e.clientY + document.body.scrollTop
					+ document.documentElement.scrollTop;
			}

			if ((this.mousePosX != -1) && (this.mousePosX != -1)) {
				this.mousePressed = true;
				mousePosX -= this.canvas.offsetLeft;
				mousePosY -= this.canvas.offsetTop;

				this.MousePosition = new Vector2(mousePosX, mousePosY);
			}
		};
		
		document.onkeydown = this.keyDown.bind(this);
		document.onkeyup = this.keyUp.bind(this);
		this.canvas.onmousedown = this.mouseClick.bind(this);
	},
	{
		getImage: function(name) {
			return this.images[name];
		},

		update: function(dt) {
			if (this.gameOver) {
				this.drawGameOver();
				return;
			}

			if (!(this.imagesPending == 0) || !(this.jsonPending == 0)) {
				return;
			}
			else if (this.firstTime) {
				this.init();
			}
			else {
				this.tick(dt);
			}
		},

		init: function() {
			this.firstTime = false;

			var gameData = this.json["game"];
			this.player = new Player(this, new Vector2(gameData.startingLocation[0], gameData.startingLocation[1]));
			this.renderer = new Renderer(this, this.json["world"]);

			// Dave init stuff
			this.initDave();
		},

		initDave: function() {
			var area = new GameArea(this, "game");
			area.isInArea(new Vector2(10.5, 1.5));
		},

		tick: function(dt) {

			this.player.update(dt);

			var ctx = this.canvas.getContext("2d");
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			ctx.save();
			ctx.translate(-this.player.getLoc().x + this.canvas.width/2, -this.player.getLoc().y + this.canvas.height/2);
			this.renderer.draw(ctx);
			
			// Dave tick stuff
			this.tickDave();

			ctx.restore();
		},

		tickDave: function() {
			//this.daveshizzle.draw(ctx); // dave shizzle here - teken in "echte" coördinaten, niet relatief tov de speler dus
		},

        loadImages: function(fileNames) {
        	this.images = new Array();
        	this.imagesPending = fileNames.length;
        	for(var i = 0, length = fileNames.length; fileName = fileNames[i], i < length; i++) {
				require(["image!data/" + fileName + '.png'], this.imageLoaded.bind(this, fileName));
			}
        },

		imageLoaded: function(fileName, img) {
			this.imagesPending--;
			this.images[fileName] = img;
			//Logger.log('image loaded: ' + fileName + ' - ' + img);
		},

		loadJson: function(fileNames) {
			this.json = new Array();
			this.jsonPending = fileNames.length;
			for(var i = 0, length = fileNames.length; fileName = fileNames[i], i < length; i++) {
				require(["json!data/" + fileName + '.json'], this.jsonLoaded.bind(this, fileName));
			}
		},

		jsonLoaded: function(fileName, json) {
			this.jsonPending--;
			this.json[fileName] = json;
		},

		getCanvas: function() {
			return this.canvas;
		}
	});
	
	return Game;
});