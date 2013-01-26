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
			if (this.game.isKeyDown(this.game.keyCodes.up)) {
				// do shizzle
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