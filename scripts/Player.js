define(["Compose", "Vector2", "Logger"], function(Compose, Vector2, Logger) {

	var Player = Compose(function(game, loc) {
		this.game = game;
		this.loc = loc;
		this.speed = 5;
	},
	{
		getLoc: function() {
			return this.loc;
		},

		update: function(dt) { // TODO use dt!
			var x = this.loc.x;
			var y = this.loc.y;
			if (this.game.isKeyDown(this.game.keyCodes.up)) {
				y = this.loc.y - this.speed;
			} else if (this.game.isKeyDown(this.game.keyCodes.down)) {
				y = this.loc.y + this.speed;
			} else if (this.game.isKeyDown(this.game.keyCodes.left)) {
				x = this.loc.x - this.speed;
			} else if (this.game.isKeyDown(this.game.keyCodes.right)) {
				x = this.loc.x + this.speed;
			}
			if (this.game.isKeyDown(this.game.keyCodes.up) && this.game.isKeyDown(this.game.keyCodes.left)) {
				x = this.loc.x - this.speed * 0.7;
				y = this.loc.y - this.speed * 0.7;
			} else if (this.game.isKeyDown(this.game.keyCodes.up) && this.game.isKeyDown(this.game.keyCodes.right)) {
				x = this.loc.x + this.speed * 0.7;
				y = this.loc.y - this.speed * 0.7;
			} else if (this.game.isKeyDown(this.game.keyCodes.down) && this.game.isKeyDown(this.game.keyCodes.left)) {
				x = this.loc.x - this.speed * 0.7;
				y = this.loc.y + this.speed * 0.7;
			} else if (this.game.isKeyDown(this.game.keyCodes.down) && this.game.isKeyDown(this.game.keyCodes.right)) {
				x = this.loc.x + this.speed * 0.7;
				y = this.loc.y + this.speed * 0.7;
			}

			// Check whether the new position is valid before updating
			if (this.game.area.isInArea(new Vector2(x, y))) {
				this.loc.x = x;
				this.loc.y = y;
			}
		},

		draw: function(ctx) {
			ctx.fillStyle = "#00FF00";
			//Logger.log(this.loc);
			ctx.fillRect(this.loc.x - 20, this.loc.y - 20, 40, 40);
		}
	});

	return Player;
});