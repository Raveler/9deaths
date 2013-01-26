define(["Compose", "Vector2", "Logger"], function(Compose, Vector2, Logger) {

	var Player = Compose(function(game, loc) {
		this.game = game;
		this.loc = loc;
	},
	{
		getLoc: function() {
			return this.loc;
		},

		update: function(dt) {
			if (this.game.isKeyDown(this.game.keyCodes.right)) {
				this.loc.x += 1 * dt;
			}
			if (this.game.isKeyDown(this.game.keyCodes.left)) {
				this.loc.x -= 1 * dt;
			}

			if (this.game.isKeyDown(this.game.keyCodes.up)) {
				this.loc.y -= 1 * dt;
			}
			if (this.game.isKeyDown(this.game.keyCodes.down)) {
				this.loc.y += 1 * dt;
			}
		},

		draw: function(ctx) {
			ctx.fillStyle = "#00FF00";
			//Logger.log(this.loc);
			ctx.fillRect(this.loc.x - 20, this.loc.y - 20, 40, 40);
		},

		getLoc: function() {
			return this.loc;
		}
	});

	return Player;
});