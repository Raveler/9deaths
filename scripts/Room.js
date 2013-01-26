define(["Compose", "Vector2", "Loadable", "Logger"], function(Compose, Vector2, Loadable, Logger) {

	// one room in the game
	var Room = Compose(Loadable, function(json, wallHeight) {

		// data
		this.wallHeight = wallHeight;

		// image
		this.fileName = json.fileName;

		// loaded
		require(["image!" + json.fileName], function(img) {
			this.loaded();
			this.img = img;
			this.init();
		}.bind(this));
	},
	{
		init: function() {

			// compute the room height - this is the height without the wall height
			this.height = this.img.height - this.wallHeight;

			// compute the width of the room - this is the width of the image subtracted by the room height
			this.width = this.img.width - (this.height / Math.tan(Math.PI/4));
		},

		draw: function(ctx) {
			ctx.drawImage(this.img, 0, 0);
		},

		getWidth: function() {
			return this.width;
		},

		getHeight: function() {
			return this.height;
		}
	});

	return Room;
});