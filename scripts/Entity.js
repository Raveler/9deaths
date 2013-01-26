define(["Compose", "Vector2"], function(Compose, Vector2) {

	var Entity = Compose(function(game, json, id) {

		// game
		this.game = game;

		// location
		this.loc = new Vector2(json.loc);

		// dead
		this.dead = false;

		// z
		this.z = json.z;

		// id
		this.id = id;
	},
	{
		getId: function() {
			return this.id;
		},

		die: function() {
			this.dead = true;
		},

		isDead: function() {
			return this.dead;
		},

		setLoc: function(loc) {
			this.loc = loc;
		},

		getZ: function() {
			return this.z;
		},

		getLoc: function() {
			return this.loc;
		},

		// compute the baseline x of the player - relative to the 0-coordinate
		getBaseX: function() {
			var baseX = this.getLoc().x - (this.getLoc().y / Math.tan(Math.PI/4));
			return baseX;
		},
	});

	return Entity;
});