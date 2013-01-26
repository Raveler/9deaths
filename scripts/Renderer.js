define(["Compose", "Vector2", "Layer", "Room", "Player", "Loader", "Logger"], function(Compose, Vector2, Layer, Room, Player, Loader, Logger) {
	
	var Renderer = Compose(function(game, json) {

		// wall height
		this.wallHeight = json.wallHeight;

		// the game
		this.game = game;

		// loader
		this.loader = new Loader();

		// rooms
		this.rooms = [];
		for (var i = 0; i < json.rooms.length; ++i) {
			var room = new Room(json.rooms[i], this.wallHeight);
			this.rooms.push(room);
			this.loader.add(room);
		}

		// add done callback
		this.loaded = false;
		this.loader.addCallback(this);
	},
	{
		onDone: function() {
			this.loaded = true;
		},

		isLoaded: function() {
			return this.loaded;
		},

		draw: function(ctx) {

			if (!this.loaded) return;
			// compute the baseline x of the player - relative to the 0-coordinate
			var playerLoc = this.game.player.getLoc();
			var baseX = playerLoc.x - (playerLoc.y / Math.tan(Math.PI/4));
			Logger.log("player: " + playerLoc.toString() + ", BaseX: " + baseX);
			Logger.log(Math.tan(Math.PI/2));

			// find the last room we are left of
			var idx = -1;
			var x = 0;
			for (var i = 0; i < this.rooms.length; ++i) {
				if (x > baseX) break;
				x += this.rooms[i].getWidth();
				++idx;
			}
			Logger.log("idx: " + idx);
			Logger.log("x: " + x);

			// draw all rooms to the left of the player, but draw from right to left
			ctx.save();
			ctx.translate(0, -this.wallHeight);
			ctx.translate(x, 0);
			while (idx >= 0) {
				var room = this.rooms[idx];
				ctx.translate(-room.getWidth(), 0);
				room.draw(ctx);
				--idx;
			}
			ctx.restore();
			this.game.player.draw(ctx);
		}
	});

	return Renderer;
});