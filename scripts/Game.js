define(["Compose", "Logger", "GameArea", "Vector2", "Player", "Renderer", "Trigger", "Entity", "Monster", "Trapdoor", "TrapdoorRoom", "Pit", "BloodRoom"],
	function(Compose, Logger, GameArea, Vector2, Player, Renderer, Trigger, Entity, Monster, Trapdoor, TrapdoorRoom, Pit, BloodRoom) {
	
	var Game = Compose(function() {

		// first time
		this.firstTime = true;
		this.entitiesLoaded = false;

		// width, height
		this.width = 1024;
		this.height = 590;

		// the canvas
		this.canvas = document.createElement('canvas');
		this.canvas.style = "canvas-game";
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		// reset timer
		this.resetTimer = 0;

		// Load images
		var imagesFileNames=[];
		//imagesFileNames.push("xx");
		imagesFileNames.push("character.png");
		imagesFileNames.push("placeHolder_BG.JPG");
		imagesFileNames.push("lever.png");
		imagesFileNames.push("hatch_h220.png");
		imagesFileNames.push("scaryLevel.jpg");
		imagesFileNames.push("room 01.jpg");
		imagesFileNames.push("BloodPool.jpg");
		imagesFileNames.push("blood.png");
		imagesFileNames.push("SpikeDeath.png");
		imagesFileNames.push("monsta3_Spritesheet15x1.png");
		imagesFileNames.push("LongBloodPool.jpg");
		imagesFileNames.push("Characters/character1.png");
		this.loadImages(imagesFileNames);

		// Load json data
		var jsonFileNames = [];
		jsonFileNames.push("world");
		jsonFileNames.push("game");
		jsonFileNames.push("Trigger");
		jsonFileNames.push("Trapdoor");
		jsonFileNames.push("TrapdoorRoom");
		jsonFileNames.push("Player");
		jsonFileNames.push("Pit");
		jsonFileNames.push("BloodRoom");
		jsonFileNames.push("Monster");
		this.loadJson(jsonFileNames);

		// audio files
		var audioFileNames = [];
		//audioFileNames.push("heartbeat.mp3");
		//audioFileNames.push("CaveDripping.mp3");
		audioFileNames.push("StabbingSpikesFIN");
		audioFileNames.push("VeelluikenFIN");
		audioFileNames.push("MeatFIN");
		audioFileNames.push("MansionFIN");
		audioFileNames.push("Drowning");
		audioFileNames.push("Monstereating");
		audioFileNames.push("Monstergrowl");
		audioFileNames.push("HBfast2");
		this.nAudioPending = audioFileNames.length;
		this.audio = {};
		for (var i = 0; i < audioFileNames.length; ++i) {
			var name = audioFileNames[i];
			var fileName = audioFileNames[i];
			var audio = new Audio();
			if (audio.canPlayType('audio/ogg')) fileName += ".ogg";
			else fileName += ".mp3";
			fileName = "data/sounds/" + fileName;
			Logger.log(fileName);
			audio.src = fileName;
			audio.addEventListener("canplay", function(name, audio) {
				--this.nAudioPending;
				this.audio[name] = audio;
			}.bind(this, name, audio));
		}

		// load entitity classes
		var entityClasses = {};
		entityClasses["Trapdoor"] = Trapdoor;
		entityClasses["TrapdoorRoom"] = TrapdoorRoom;
		entityClasses["Trigger"] = Trigger;
		entityClasses["Pit"] = Pit;
		entityClasses["Player"] = Player;
		entityClasses["BloodRoom"] = BloodRoom;
		entityClasses["Monster"] = Monster;
		this.entityClasses = entityClasses;


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

			if (!(this.imagesPending == 0) || !(this.jsonPending == 0) || this.nAudioPending > 0) {
				return;
			}
			else if (this.firstTime) {
				this.init();
			}
			else if (this.entitiesLoaded) {

			// player dead
				if (this.player.isDead() && this.resetTimer == 0) {
					this.audio.HBfast2.play();
					this.resetTimer = 5500;
				}

				// fade to black
				if (this.resetTimer > 0) {
					var ctx = this.canvas.getContext("2d");
					ctx.fillStyle = "#000000";
					ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
					ctx.fillStyle = "#DD0000";
					ctx.font = "50px verdana";
					ctx.fillText("YOU ARE LE DEAD", 20, 50);
					this.resetTimer -= dt;
					if (this.resetTimer <= 0) this.reset();
				}

				// normal tick
				else this.tick(dt);
			}
		},

		reset: function() {
			this.audio.MansionFIN.currentTime = 0;
			this.audio.MansionFIN.play();
			this.resetTimer = 0;
			this.player.dead = false;
			this.player.setLoc(this.player.startingLocation);
		},

		cloneObject: function(obj) {
		    // Handle the 3 simple types, and null or undefined
		    if (null == obj || "object" != typeof obj) return obj;

		    // Handle Date
		    if (obj instanceof Date) {
		        var copy = new Date();
		        copy.setTime(obj.getTime());
		        return copy;
		    }

		    // Handle Array
		    if (obj instanceof Array) {
		        var copy = [];
		        for (var i = 0, len = obj.length; i < len; i++) {
		            copy[i] = this.cloneObject(obj[i]);
		        }
		        return copy;
		    }

		    // Handle Object
		    if (obj instanceof Object) {
		        var copy = {};
		        for (var attr in obj) {
		            if (obj.hasOwnProperty(attr)) copy[attr] = this.cloneObject(obj[attr]);
		        }
		        return copy;
		    }

		    throw new Error("Unable to copy obj! Its type isn't supported.");
		},

		init: function() {
			this.firstTime = false;
			this.monsters = new Array();
			this.trapdoors = new Array();
			this.movables = [];

			// go over all entities, and load those into the game
			this.entities = [];
			this.entitiesById = {};

			// create the renderer
			this.renderer = new Renderer(this, this.json["world"]);

			// Dave init stuff
			this.initDave();

			// start shizzle
			this.startGame();
		},

		createEntity: function(entityData) {
			entityData = this.cloneObject(entityData);
			var className = entityData.className;
			var json = this.cloneObject(this.json[entityData.json]);

			// copy the entity data onto the json
			var id = entityData.id;
			for (var key in entityData) {
				if (key == "className") continue;
				json[key] = entityData[key];
			}
			var entity = new this.entityClasses[className](this, json, id);
			entity.init();
			if (entity.getId() == "player") {
				this.player = entity;
				this.movables.push(entity);
			}
			if (typeof entity.skipMe != "undefined") {
				this.movables.push(entity);
			}
			this.entities.push(entity);
			this.entitiesById[entity.getId()] = entity;
			return entity;
		},

		getEntity: function(id) {
			return this.entitiesById[id];
		},

		startGame: function() {
			this.audio.MansionFIN.play();
			this.audio.MansionFIN.addEventListener("ended", function() {
				
			}.bind(this));
			this.entitiesLoaded = true;
		},

		initDave: function() {
			//this.debugDraw = true;
			this.area = new GameArea(this, "game");
			/*this.triggers = new Trigger(this);
			this.entities = new Entity(this);*/
		},

		tick: function(dt) {

			// update all entities
			for (var i = 0; i < this.entities.length; ++i) {
				var entity = this.entities[i];
				entity.update(dt);
				if (entity.isDead() && entity.getId() != "player") {
					this.entities.splice(i, 1);
					--i;
				}
			}

			// sort all entities by x-coordinate
			this.entities.sort(function(a, b) {
				if (a.getBaseX() > b.getBaseX()) return -1;
				else if (a.getBaseX() < b.getBaseX()) return 1;
				else if (a.getLoc().y < b.getLoc().y) return -1;
				else if (a.getLoc().y > b.getLoc().y) return 1;
				return a.getId() < b.getId() ? -1 : 1;
			}.bind(this));

			// draw all entities
			var ctx = this.canvas.getContext("2d");
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			ctx.save();
			ctx.translate(-this.player.getLoc().x + this.canvas.width/2, 292);
			this.renderer.draw(ctx);

			// draw the entities
			var roomX = this.renderer.getRoomX(this.player.getBaseX());
			var roomEndX = this.renderer.getRoomEndX(this.player.getBaseX());
			for (var i = 0; i < this.entities.length; ++i) {
				var entity = this.entities[i];
				if (entity.getId() == "player") continue;
				if (roomX < entity.getBaseX() && entity.getBaseX() <= roomEndX) entity.draw(ctx);
			}
			this.movables.sort(function(a, b) {
				if (a.getLoc().y < b.getLoc().y) return -1;
				else if (a.getLoc().y > b.getLoc().y) return 1;
				else if (a.getBaseX() > b.getBaseX()) return -1;
				else if (a.getBaseX() < b.getBaseX()) return 1;
				return a.getId() < b.getId() ? -1 : 1;
			}.bind(this));
			for (var i = 0; i < this.movables.length; ++i) {
				this.movables[i].draw(ctx);
			}
			for (var i = 0; i < this.entities.length; ++i) {
				var entity = this.entities[i];
				if (entity.getId() == "player") continue;
				if (entity.getBaseX() <= roomX) entity.draw(ctx);
			}

			// Dave tick stuff
			this.tickDave(ctx);

			ctx.restore();
		},

		tickDave: function(ctx) {
			this.area.debugDraw(ctx);
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
		},

		isValidAndSafePosition: function(loc) {
			if (this.area.isInArea(loc)) {
				return false;
			}
			for(var i = 0; i < this.trapdoors.length; i++) {
				if (this.trapdoors[i].isAboveTrap(loc) && this.trapdoors[i].opened) {
					return false;
				}
			}
			return this.renderer.isInArea(loc);
		}
	});
	
	return Game;
});