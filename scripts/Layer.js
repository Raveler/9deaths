define(["Vector2"], function(Vector2) {

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

		}
	});

	return Layer;
});