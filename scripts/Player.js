define(["Compose", "Vector2", "Logger", "Entity", "Animation"], function(Compose, Vector2, Logger, Entity, Animation) {

	var Player = Compose(Entity, function(game, json) {
		this.game = game;
		this.startingLocation = new Vector2(json.startingLocation);
		this.speed = 5;
		this.fallSpeed = 5;
		this.falling = false;
		this.animation = new Animation(game, json);
	},
	{
		init: function() {
			this.setLoc(this.startingLocation);
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
				this.animation.setAnimation("walk");
				this.animation.setFlip(dx < 0);
			}
			else {
				this.animation.setAnimation("idle");
			}

			// Check whether the new position is valid before updating
			var valid = this.game.isValidPosition(new Vector2(loc.x+dx, loc.y+dy));
			if (valid) {
				this.setLoc(this.getLoc().add(new Vector2(dx, dy)));
			}
		},

		draw: function(ctx) {
			ctx.save();
			ctx.fillStyle = "#00FF00";
			ctx.translate(this.loc.x, this.loc.y);
			ctx.fillRect(-2, -2, 4, 4);
			this.animation.draw(ctx, this.z);
			ctx.restore();
		}
	});

	return Player;
});