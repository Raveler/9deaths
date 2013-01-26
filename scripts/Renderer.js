define(["Compose", "Vector2", "Layer", "Room", "Player", "Loader", "Logger"], function(Compose, Vector2, Layer, Room, Player, Loader, Logger) {
	
	var Renderer = Compose(function(game, json) {

		// wall height
		this.wallHeight = json.wallHeight;

		// wall margin
		this.wallMargin = 10;

		// the game
		this.game = game;

		// rooms
		this.rooms = [];
		var x = 0;
		for (var i = 0; i < json.rooms.length; ++i) {
			var room = new Room(this.game, json.rooms[i], this.wallHeight, x);
			room.init();
			x += room.getWidth();
			room.setX(x);
			this.rooms.push(room);
			this.game.entities.push(room);
		}
	},
	{

		isInArea: function(loc) {

			// don't move up the wall
			if (loc.y < 0) return false;

			// find the room we're in
			var baseX = loc.x - (loc.y / Math.tan(Math.PI/4));

			var x = 0;
			for (var i = 0; i < this.rooms.length; ++i) {
				var room = this.rooms[i];
				if (x <= baseX && baseX < x + room.getWidth()) {

					// compute the height of the room
					if (loc.y > room.getHeight()) return false;

					// close to the border - check for door
					if (baseX < x + this.wallMargin && i > 0) {
						return this.rooms[i-1].isNearDoor(loc);
					}
					else if (baseX > x + room.getWidth() - this.wallMargin) {
						return room.isNearDoor(loc);
					}

					// just ok
					else {
						return true;
					}
				}
				x += room.getWidth();
			}

			// NO ROOM :(
			// oh hi mark
			return false;
		},

		draw: function(ctx) {


			// find the last room we are left of
			/*var idx = -1;
			var x = 0;
			var baseX = this.game.player.getBaseX();
			for (var i = 0; i < this.rooms.length; ++i) {
				if (x > baseX) break;
				x += this.rooms[i].getWidth();
				++idx;
			}


			// draw all rooms to the left of the player, but draw from right to left
			ctx.save();
			var firstPlayer = true;
			while (idx >= 0) {
				var room = this.rooms[idx];
				ctx.save();
				ctx.translate(0, -this.wallHeight);
				ctx.translate(x-room.getWidth(), 0);
				x -= room.getWidth();
				room.draw(ctx);
				ctx.restore();
				--idx;
				if (x < baseX && firstPlayer) {
					firstPlayer = false;
					this.game.player.draw(ctx);
				}
			}
			ctx.restore();
*/

		}
	});

	return Renderer;
});