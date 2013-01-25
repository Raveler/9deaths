define(["Compose", "Vector2"], function(Compose, Vector2) {

	var Player = Compose(function(loc) {
		this.loc = loc;
	},
	{
		getLoc: function() {
			return this.loc;
		},

		draw: function(ctx) {
			ctx.fillStyle = "#00FF00";
			ctx.fillRect(this.loc.x - 20, this.loc.y - 20, 40, 40);
		}
	});

	return Player;
});