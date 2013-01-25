define(["Compose", "Vector2", "Loadable", "Logger"], function(Compose, Vector2, Loadable, Logger) {

	// ground always renders below the player, and always renders when within view - this means, when doors are open etc
	var Ground = Compose(Loadable, function(json) {

		// location
		this.loc = new Vector2(json.loc.x, json.loc.y);

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
			Logger.log(this.loc);
			Logger.log(this.img);
			ctx.scale(0.2, 0.2);
			ctx.drawImage(this.img, this.loc.x, this.loc.y);
		}
	});

	return Ground;
});