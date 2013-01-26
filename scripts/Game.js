define(["Compose", "Logger", "GameArea", "Vector2", "Player", "Renderer", "Trigger", "Entity", "Monster"],
	function(Compose, Logger, GameArea, Vector2, Player, Renderer, Trigger, Entity, Monster) {
	
	var Game = Compose(function() {

		// first time
		this.firstTime = true;
		this.entitiesLoaded = false;

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
		imagesFileNames.push("character.png");
		imagesFileNames.push("placeHolder_BG.JPG");
		imagesFileNames.push("lever.png");
		imagesFileNames.push("hatch_h220.png");
		this.loadImages(imagesFileNames);

		// Load json data
		var jsonFileNames = [];
		jsonFileNames.push("world");
		jsonFileNames.push("entities");
		jsonFileNames.push("world");
		jsonFileNames.push("game");
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
			right: 39, 
			space: 32
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
			else if (this.entitiesLoaded) {
				this.tick(dt);
			}
		},

		init: function() {
			this.firstTime = false;

			// go over all entities, and load those into the game
			this.entities = [];
			this.entitiesById = {};

			// go over all entities in the file
			var json = this.json["entities"];
			var nLeft = 0;
			for (var i = 0; i < json.entities.length; ++i) {
				var entityData = json.entities[i];
				var className = entityData.className;
				++nLeft;
				require([className, "json!data/" + entityData.json], function(entityData, Class, json) {

					// copy the entity data onto the json
					var id = entityData.id;
					for (var key in entityData) {
						if (key == "className") continue;
						json[key] = entityData[key];
					}

					var entity = new Class(this, json, id);
					entity.init();
					if (entity.getId() == "player") {
						this.player = entity;
					}
					this.entities.push(entity);
					this.entitiesById[entity.getId()] = entity;
					--nLeft;
					if (nLeft == 0) {
						this.startGame();
					}
				}.bind(this, entityData));
			}

			// create the renderer
			this.renderer = new Renderer(this, this.json["world"]);

			// Dave init stuff
			this.initDave();
		},

		getEntity: function(id) {
			return this.entitiesById[id];
		},

		startGame: function() {
			this.entitiesLoaded = true;
		},

		initDave: function() {
			this.debugDraw = true;
			this.area = new GameArea(this, "game");
			/*this.triggers = new Trigger(this);
			this.entities = new Entity(this);
			this.monster = new Monster(this, new Vector2(200, 200));*/
		},

		tick: function(dt) {

			// update all entities
			for (var i = 0; i < this.entities.length; ++i) {
				var entity = this.entities[i];
				entity.update(dt);
				if (entity.isDead()) {
					this.entities.splice(i, 1);
					--i;
				}
			}

			// sort all entities by x-coordinate
			this.entities.sort(function(a, b) {
				if (a.getZ() < b.getZ()) return -1;
				else if (a.getZ() > b.getZ()) return 1;
				else if (a.getBaseX() > b.getBaseX()) return -1;
				else if (a.getBaseX() < b.getBaseX()) return 1;
				return 0;
			});

			// draw all entities
			var ctx = this.canvas.getContext("2d");
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			ctx.save();
			ctx.translate(-this.player.getLoc().x + this.canvas.width/2, 470);
			this.renderer.draw(ctx);

			// draw the entities
			for (var i = 0; i < this.entities.length; ++i) {
				this.entities[i].draw(ctx);
			}
			// Dave tick stuff
			this.tickDave(ctx);

			ctx.restore();
		},

		tickDave: function(ctx) {
			this.area.debugDraw(ctx);
/*
			this.triggers.checkIfActivated();
			this.triggers.debugDraw(ctx);

			this.entities.checkIfActivated(this.player.loc);
			this.entities.debugDraw(ctx);

			this.monster.move();
			this.monster.debugDraw(ctx);*/
		},

        loadImages: function(fileNames) {
        	this.images = new Array();
        	this.imagesPending = fileNames.length;
        	for(var i = 0, length = fileNames.length; fileName = fileNames[i], i < length; i++) {
				require(["image!data/" + fileName + '?bust=' + (new Date().getTime())], this.imageLoaded.bind(this, fileName));
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
				require(["json!data/" + fileName + '.json?bust=' + (new Date().getTime())], this.jsonLoaded.bind(this, fileName));
			}
		},

		jsonLoaded: function(fileName, json) {
			this.jsonPending--;
			this.json[fileName] = json;
		},

		getCanvas: function() {
			return this.canvas;
		},

		isValidPosition: function(loc) {
			if (this.area.isInArea(loc)) {
				return false;
			}
			return this.renderer.isInArea(loc);
		}
	});
	
	return Game;
});