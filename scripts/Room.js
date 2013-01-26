define(["Compose", "Vector2", "Logger"], function(Compose, Vector2, Logger) {

	// one room in the game
	var Room = Compose(function(game, json, wallHeight, x) {

		// game & obj
		this.game = game;

		// data
		this.wallHeight = wallHeight;

		// door width
		this.doorWidth = 72;

		// image
		this.img = this.game.images[json.fileName];

		// door Y
		this.doorY = json.doorY;

		// x position for sorting
		this.x = x + this.getWidth();

		// image
		this.fileName = json.fileName;
	},
	{
		getId: function() {
			return "room";
		},
		
		setX: function(x) {
			this.x = x;
		},

		init: function() {

		},

		update: function(dt) {
			// do nothing
		},

		init: function() {

			// compute the room height - this is the height without the wall height
			this.height = this.img.height - this.wallHeight;

			// compute the width of the room - this is the width of the image subtracted by the room height
			this.width = this.img.width - (this.height / Math.tan(Math.PI/4));
			Logger.log("width: " + this.width);
			Logger.log("height: " + this.height);
		},

		draw: function(ctx) {

			// only draw when the player is to the left of is
			if (this.game.player.getBaseX() < this.x - this.width) return;

			ctx.save();
			//ctx.translate(0, -this.wallHeight);
			//ctx.translate(-this.getWidth(), 0);
			ctx.drawImage(this.img, this.x-this.width, -this.wallHeight);
			ctx.restore();
		},

		getWidth: function() {
			return this.width;
		},

		getHeight: function() {
			return this.height;
		},

		getLoc: function() {
			return new Vector2(this.x, this.game.player.getBaseX() < this.x ? 0 : this.height);
		},

		getBaseX: function() {
			return this.x;
		},

		getZ: function() {
			return 0;
		},

		isDead: function() {
			return false;
		},

		isNearDoor: function(loc) {
			return Math.abs(loc.y - this.doorY) < this.doorWidth/2;
		}
	});

	return Room;
});