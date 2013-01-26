define(["Compose", "Vector2", "Loadable"], function(Compose, Vector2, Loadable) {

	// ground always renders below the player, and always renders when within view - this means, when doors are open etc
	var Wall = Compose(Loadable, function(json) {

		// location
		this.loc = new Vector2(json.loc);
		this.scale = json.scale;

		// image
		this.fileName = json.fileName;

		// loaded
		require(["image!" + json.fileName], function(img) {
			this.loaded();
			this.img = img;
		}.bind(this));
	},
	{

		draw: function(ctx) {
			ctx.save();
			ctx.scale(this.scale, this.scale);
			ctx.drawImage(this.img, this.loc.x, this.loc.y);
			ctx.restore();
		},

		isBefore: function(player) {
			return this.loc.x < player.getLoc().x || this.loc.y < player.getLoc().y;
		}
	});

	return Wall;
});