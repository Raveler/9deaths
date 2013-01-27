define(["Compose", "Logger", "GameArea", "Vector2", "Player", "Renderer", "Trigger", "Entity", "Monster", "Trapdoor", "TrapdoorRoom", "Pit", "BloodRoom", "Door", "BabyRoom", "StartingRoom", "EndRoom"],
	function(Compose, Logger, GameArea, Vector2, Player, Renderer, Trigger, Entity, Monster, Trapdoor, TrapdoorRoom, Pit, BloodRoom, Door, BabyRoom, StartingRoom, EndRoom) {
	
	var Game = Compose(function() {

		// first time
		this.firstTime = true;
		this.entitiesLoaded = false;

		// width, height
		this.width = 1024;
		this.height = 590;

		// kill count
		this.killCount = 0;
		this.lastDeaths = [];

		// credits
		this.credits = false;
		this.creditsY = 0;

		// tree name
		this.treeName = "Nicodemus";
		this.fadeToBlack = false;
		this.fadeTime = 0;

		// reset timer
		this.resetTimer = 0;
		this.controlScreen = true;

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
		imagesFileNames.push("Monsta2_eat_Spritesheet80x1.png");
		imagesFileNames.push("Characters/character0.png");
		imagesFileNames.push("Characters/character1.png");
		imagesFileNames.push("Characters/character2.png");
		imagesFileNames.push("Characters/character3.png");
		imagesFileNames.push("AmbientDarkness.png");
		imagesFileNames.push("door.png");
		imagesFileNames.push("ControlScreen.jpg");
		imagesFileNames.push("RoomSpawn.jpg");
		imagesFileNames.push("spawnRoomFront.png");
		imagesFileNames.push("tree.jpg");
		imagesFileNames.push("endCredit.jpg");
		imagesFileNames.push("ScreamDeath.png");
		imagesFileNames.push("BeEn4A_Spritesheet40x1.png");
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
		jsonFileNames.push("MonsterEating");
		jsonFileNames.push("Monster2");
		jsonFileNames.push("MonsterEating2");
		jsonFileNames.push("Names");
		jsonFileNames.push("Door");
		jsonFileNames.push("BabyRoom");
		jsonFileNames.push("StartingRoom");
		jsonFileNames.push("EndRoom");
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
		audioFileNames.push("manscream1");
		audioFileNames.push("manscream2");
		audioFileNames.push("manscream3");
		audioFileNames.push("manscream4");
		audioFileNames.push("manscream5");
		audioFileNames.push("manscream6");
		audioFileNames.push("manscream7");
		audioFileNames.push("manscream8");
		audioFileNames.push("manscream9");
		audioFileNames.push("Bloodfootsteps");
		audioFileNames.push("Footsteps");
		audioFileNames.push("Door");
		audioFileNames.push("NormalNoDoor");
		audioFileNames.push("Ambientcreep");
		this.nAudioPending = audioFileNames.length;
		this.audio = {};
		for (var i = 0; i < audioFileNames.length; ++i) {
			var name = audioFileNames[i];
			var fileName = audioFileNames[i];
			var audio = new Audio();
			if (audio.canPlayType('audio/ogg')) fileName += ".ogg";
			else fileName += ".mp3";
			fileName = "data/sounds/" + fileName;
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
		entityClasses["Door"] = Door;
		entityClasses["BabyRoom"] = BabyRoom;
		entityClasses["StartingRoom"] = StartingRoom;
		entityClasses["EndRoom"] = EndRoom;
		this.entityClasses = entityClasses;


		// keys
		this.keys = {};
		this.keyDown = function(e) {
			if (this.phase != 0) {
				this.phase--;
			}
			var ch = String.fromCharCode(e.keyCode);
			this.keys['key' + e.keyCode] = true;
			if (e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 32) e.preventDefault();
		};
		
		this.keyUp = function(e) {
			var ch = String.fromCharCode(e.keyCode);
			this.keys['key' + e.keyCode] = false;
			if (e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 32) e.preventDefault();
			//if (e.keyCode != 116) e.preventDefault();
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

		this.startingRoom = new StartingRoom(this);
	},
	{
		getImage: function(name) {
			return this.images[name];
		},

		win: function() {
			this.fadeToBlack = true;
			this.fadeTime = 0;
		},

		update: function(dt) {
			if (!(this.imagesPending == 0) || !(this.jsonPending == 0) || this.nAudioPending > 0) {
				return;
			}
			else if (this.firstTime) {
				this.init();
			}
			else if (this.controlScreen) {
				var ctx = this.canvas.getContext("2d");
				ctx.drawImage(this.images["ControlScreen.jpg"], 0, 0);
				if (this.isKeyDown(this.keyCodes.space)) {
					this.controlScreen = false;
					this.startGame();
				}
			}
			else if (this.entitiesLoaded) {

			// player dead
				if (this.player.isDead() && this.resetTimer == 0) {
					this.audio.Bloodfootsteps.pause();
					this.audio.Footsteps.pause();
					this.audio.HBfast2.play();
					this.resetTimer = 5500;
					++this.killCount;
					this.lastDeaths.push(this.player.name);
				}

				// fade to black
				if (this.resetTimer > 0) {
					var ctx = this.canvas.getContext("2d");
					ctx.fillStyle = "#000000";
					ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
					ctx.fillStyle = "#DD0000";
					this.resetTimer -= dt;

					ctx.save();
					ctx.fillStyle = "#DD0000";
					ctx.globalAlpha = Math.max(0, (this.resetTimer-2500) / 3000);
					ctx.font = "500px Finger Paint";
					ctx.textBaseLine = "top";
					ctx.textAlign = "center";
					ctx.fillText(this.killCount, 1024/2, 490);
					ctx.restore();
					if (this.resetTimer <= 0) this.reset();
				}

				// normal tick
				else this.tick(dt);
			}
		},

		reset: function() {
			this.audio.Ambientcreep.pause();
			this.audio.Ambientcreep.currentTime = 0;
			this.audio.MansionFIN.currentTime = 0;
			this.audio.MansionFIN.play();
			this.resetTimer = 0;
			this.player.dead = false;
			this.player.speed = 5;
			this.player.setLoc(this.player.startingLocation);
			this.offset = 750;
			this.offsetSpeed = 30;
			this.player.reset();
			this.credits = false;
			this.fadeToBlack = false;

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

			// the canvas
			this.canvas = document.createElement('canvas');
			this.canvas.style = "canvas-game";
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			var main = document.getElementById("main");
			main.innerHTML = "";
			main.appendChild(this.canvas);


			this.firstTime = false;
			this.monsters = new Array();
			this.trapdoors = new Array();
			this.pits = new Array();
			this.movables = [];
			this.offset = 900;
			this.offsetSpeed = 80;

			// go over all entities, and load those into the game
			this.entities = [];
			this.entitiesById = {};

			// create the renderer
			this.renderer = new Renderer(this, this.json["world"]);

			// Dave init stuff
			this.initDave();
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
				this.audio.NormalNoDoor.play();
			}.bind(this));
			this.audio.NormalNoDoor.addEventListener("ended", function() {
				this.audio.NormalNoDoor.play();
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

			// credits
			if (this.credits) {
				this.showCredits(dt);
				return;
			}

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
			if (this. offset > 1) {
				this.offset = this.offset - (this.offset / this.offsetSpeed);
			}
			ctx.translate(-this.player.getLoc().x + this.offset + this.canvas.width/2, 292);
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
			this.startingRoom.draw(ctx);
			for (var i = 0; i < this.movables.length; ++i) {
				this.movables[i].draw(ctx);
				if (this.movables[i].isDead() && this.movables[i].getId() != "player") {
					this.movables.splice(i, 1);
					--i;
				}
			}
			for (var i = 0; i < this.entities.length; ++i) {
				var entity = this.entities[i];
				if (entity.getId() == "player") continue;
				if (entity.getBaseX() <= roomX) entity.draw(ctx);
			}

			// Dave tick stuff
			this.tickDave(ctx);

			ctx.restore();


			// fade
			if (this.fadeToBlack) {
				ctx.save();
				this.fadeTime += dt;
				ctx.globalAlpha = this.fadeTime / 2500.0;
				if (ctx.globalAlpha > 1) ctx.globalAlpha = 1;
				ctx.fillStyle = "#000000";
				ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
				if (this.fadeTime >= 3000.0) {
					this.treeName = this.player.name;
					this.fadeToBlack = false;
					this.credits = true;
					this.creditsY = 0;
					console.log(this.getEntity("endRoom"));
					this.getEntity("endRoom").done = false;
				}
				ctx.restore();
			}

			else ctx.drawImage(this.images["AmbientDarkness.png"], 0, 0);
		},

		showCredits: function(dt) {

			// render the credits bg
			var ctx = this.canvas.getContext("2d");
			ctx.drawImage(this.images["endCredit.jpg"], 0, 0);

			// render the name of the person
			ctx.save();
			ctx.font = "16px Finger Paint";
			ctx.fillStyle = "#1c0f0b";
			ctx.translate(680, 40);
			ctx.rotate(0.6);
			ctx.fillText(this.treeName, 0, 0);
			ctx.restore();
			this.creditsY -= dt * 0.13;
			ctx.save();
			ctx.translate(0, 600);
			ctx.translate(0, this.creditsY);
			ctx.font = "16px verdana";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText("9 Deaths", 30, -80);
			ctx.fillText("Made for the 2013 Global Game Jam", 30, -60);
			ctx.fillText("Programmer: Karel Crombecq", 30, 0);
			ctx.fillText("Programmer: David Staessens", 30, 20);
			ctx.fillText("Lead artist: Elliot Bockxtaele", 30, 40);
			ctx.fillText("Artist: Thibaut Van Houtte", 30, 60);
			ctx.fillText("Design & sound: Lena Leel-Össy", 30, 80);
			ctx.fillText("Writing & sound: Zindzi Owusu", 30, 100);
			ctx.fillText("Writing: Laurens Adeaga", 30, 120);
			ctx.restore();
			if (this.creditsY < -750) {
				this.credits = false;
				this.reset();
			}
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
			for(var i = 0; i < this.pits.length; i++) {
				if (this.pits[i].isAboveTrap(loc) && !this.pits[i].bodyInPit) {
					return false;
				}
			}
			return this.renderer.isInArea(loc);
		}
	});
	
	return Game;
});