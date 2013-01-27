define(["Compose", "Vector2", "Logger", "Entity", "Animation", "Random"], function(Compose, Vector2, Logger, Entity, Animation, Random) {

	var Player = Compose(Entity, function(game, json) {
		this.game = game;
		this.startingLocation = new Vector2(json.startingLocation);
		this.speed = 5;
		this.fallSpeed = 5;
		this.moving = false;
		this.falling = false;
		this.json = json;
		this.charIndex = Random.getInt(0, 3);
		this.nChars = 4;
		this.originalNames = this.game.cloneObject(this.game.json["Names"]);
		this.names = this.game.cloneObject(this.originalNames);
	},
	{
		init: function() {
			this.setLoc(this.startingLocation);
			this.reset();
		},

		reset: function() {

			this.speed = 5;

			// next char
			this.charIndex = (this.charIndex+1) % (this.nChars);

			// generate a random character
			var json = this.json;
			this.animationJson = json;
			json.fileName = "Characters/character" + this.charIndex + ".png";
			this.animation = new Animation(this.game, json);
			this.onBlood = false;
			this.bloodWalking = false;
			this.babyRoom = false;

			// pick a name based on its type
			var type = this.names.types[this.charIndex];
			var nNames = this.names[type].length;
			if (nNames == 0) {
				this.names = this.game.cloneObject(this.originalNames);
				nNames = this.names[type].length; // reset!
			}
			var pick = Random.getInt(0, nNames-1);
			this.name = this.names[type][pick];
			this.names[type].splice(pick, 1);


		},

		fall: function() {
			this.die();
			//this.falling = true;
		},

		update: function(dt) { // TODO use dt!

			this.animation.update(dt);
			var loc = this.getLoc();
			var dx = 0, dy = 0;
			if (this.game.isKeyDown(this.game.keyCodes.up)) {
				dy = -this.speed;
			} else if (this.game.isKeyDown(this.game.keyCodes.down)) {
				dy = this.speed;
			} else if (this.game.isKeyDown(this.game.keyCodes.left)) {
				dx = -this.speed;
			} else if (this.game.isKeyDown(this.game.keyCodes.right)) {
				dx = this.speed;
			}
			if (this.game.isKeyDown(this.game.keyCodes.up) && this.game.isKeyDown(this.game.keyCodes.left)) {
				dx = -this.speed * 0.7;
				dy = -this.speed * 0.7;
			} else if (this.game.isKeyDown(this.game.keyCodes.up) && this.game.isKeyDown(this.game.keyCodes.right)) {
				dx = this.speed * 0.7;
				dy = -this.speed * 0.7;
			} else if (this.game.isKeyDown(this.game.keyCodes.down) && this.game.isKeyDown(this.game.keyCodes.left)) {
				dx = -this.speed * 0.7;
				dy = this.speed * 0.7;
			} else if (this.game.isKeyDown(this.game.keyCodes.down) && this.game.isKeyDown(this.game.keyCodes.right)) {
				dx = this.speed * 0.7;
				dy = this.speed * 0.7;
			}

			// we are falling
			if (this.falling) {
				this.z -= this.fallSpeed;
				this.animation.setAnimation("idle");
				if (this.z < this.animation.data.height) {
					this.die();
				}
				return;
			}

			// we are walking
			if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
				this.moving = true;
				this.animation.setAnimation("walk");
				this.animation.setFlip(dx < 0);
			}
			else {
				this.moving = false;
				this.animation.setAnimation("idle");
			}

			if (!this.moving) {
				this.game.audio.Bloodfootsteps.pause();
				this.game.audio.Footsteps.pause();
			}

			if (this.moving && !this.babyRoom) {
				if (this.bloodWalking) {
					this.game.audio.Footsteps.pause();
					this.game.audio.Bloodfootsteps.play();
				}
				else {
					this.game.audio.Bloodfootsteps.pause();
					this.game.audio.Footsteps.play();
				}
			}
			else {
				this.game.audio.Bloodfootsteps.pause();
				this.game.audio.Footsteps.pause();
			}
			this.bloodWalking = false;

			// Check whether the new position is valid before updating
			var valid = this.game.isValidPosition(new Vector2(loc.x+dx, loc.y+dy));
			if (valid) {
				this.setLoc(this.getLoc().add(new Vector2(dx, dy)));
			}
		},

		isMoving: function() {
			return this.moving;
		},

		draw: function(ctx) {
			ctx.save();
			//ctx.fillStyle = "#00FF00";
			ctx.translate(this.loc.x, this.loc.y);
			//ctx.fillRect(-2, -2, 4, 4);
			this.animation.draw(ctx, this.z);
			ctx.restore();
		}
	});

	return Player;
});