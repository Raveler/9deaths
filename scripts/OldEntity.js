define(["Compose", "Vector2"], function(Compose, Vector2) {

	var Entity = Compose(function(game, json) {

		// game
		this.game = game;

		// location
		this.loc = json.loc;

		// dead
		this.dead = false;

		// components
		this.components = [];

		// components by name
		this.componentsByName = {};

		// z
		this.z = json.z;

		// first, load the actual json for the object
		var nLeft = 0;
		require("json!" + json.type + ".json", function(data) {

			// when loaded, go over all components and instantiat ethem
			for (var componentName in data.components) {
				++nLeft;
				require([componentName], function(Component) {
					var component = new Component(this.game, this, data.components[componentName]);
					this.components.push(component);
					this.componentsByName[componentName] = component;
					--nLeft;
					if (nLeft == 0) this.loaded();
				}.bind(this));
			}
		}.bind(this));
	},
	{
		loaded: function() {
			for (var i = 0; i < this.components.length; ++i) {
				if (typeof this.components[i].init != "undefined") this.components[i].init();
			}
		},

		update: function(dt) {
			for (var i = 0; i < this.components.length; ++i) {
				this.components[i].update(dt);
			}
		},

		draw: function(ctx) {
			ctx.save();
			ctx.fillStyle = "#00FF00";
			//Logger.log(this.loc);
			ctx.translate(this.loc.x, this.loc.y);
			ctx.fillRect(-2, -2, 4, 4);
			for (var i = 0; i < this.components.length; ++i) {
				if (typeof this.components[i].draw != "undefined") this.components[i].draw(ctx);
			}
			ctx.restore();
		},

		hasComponent: function(name) {
			return typeof this.componentsByName[componentName] != "undefined";
		}

		getComponent: function(name) {
			return this.componentsByName[componentName];
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
			var baseX = this.loc.x - (this.loc.y / Math.tan(Math.PI/4));
			return baseX;
		},
	});
});