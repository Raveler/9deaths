define(["Compose", "Vector2", "Logger", "Animation"], function(Compose, Vector2, Logger, Animation) {

	var Player = Compose(function(game, json) {
		this.game = game;
		this.loc = new Vector2(json.startingLocation);
		this.speed = 5;
		this.animation = new Animation(this.game, json);
	},
	{
		getLoc: function() {
			return this.loc;
		},

		update: function(dt) { // TODO use dt!
			var x = this.loc.x;
			var y = this.loc.y;
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

			// we are walking
			if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
				this.animation.setAnimation("walk");
				this.animation.setFlip(dx < 0);
			}
			else {
				this.animation.setAnimation("idle");
			}

			// Check whether the new position is valid before updating
			var valid = this.game.isValidPosition(new Vector2(x+dx, y+dy));
			if (valid) {
				this.loc.x += dx;
				this.loc.y += dy;
			}
			this.animation.update(dt);
		},

		// compute the baseline x of the player - relative to the 0-coordinate
		getBaseX: function() {
			var baseX = this.loc.x - (this.loc.y / Math.tan(Math.PI/4));
			return baseX;
		},

		draw: function(ctx) {
			ctx.save();
			ctx.fillStyle = "#00FF00";
			//Logger.log(this.loc);
			ctx.translate(this.loc.x, this.loc.y);
			ctx.fillRect(-2, -2, 4, 4);
			this.animation.draw(ctx);
			ctx.restore();
		}
	});

	return Player;
});