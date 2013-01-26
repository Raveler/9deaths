define(["Compose", "Vector2", "Logger"], function(Compose, Vector2, Logger) {

	var Usable = Compose(function(game, loc) {
		this.game = game;
		this.loc = loc;
		this.activateRange = 10;
	},
	{
		getLoc: function() {
			return this.loc;
		},

		activate: function() {
			if ((((game.player.getLoc.x - this.loc.x) * (game.player.getLoc.x - this.loc.x))
				+ ((game.player.getLoc.y - this.loc.y) * (game.player.getLoc.y - this.loc.y))) < this.activateRange) {


			}

		},

		draw: function(ctx) {
			//ctx.fillStyle = "#00FF00";
			//Logger.log(this.loc);
			//ctx.fillRect(this.loc.x - 20, this.loc.y - 20, 40, 40);
		}
	});

	return Usable;
});