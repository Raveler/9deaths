define(["Compose", "Vector2"], function(Compose, Vector2) {

	// defines a layer
	var Layer = Compose(function(json) {

		// get the location
		this.loc = new Vector2(json.loc.x, json.loc.y);

		// load the image
		this.done = false;
		require("image!" + json.fileName, function(img) {
			this.done = true;
			this.img = img;
		}.bind(this));

	},
	{
		draw: function(surf) {
			if (!this.done) return;

			// render at the appropriate direction
		}
	});

	return Layer;
});