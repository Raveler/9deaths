define(["Compose", "Vector2", "Logger", "Entity"], function(Compose, Vector2, Logger, Entity) {

	var Monster = Compose(Entity, function(game, json) {
		this.game = game;
		this.location = new Vector2(200, 200);
		//this.location = json.loc;
	},
	{
		update: function() {
			var moveVector = this.game.player.loc.subtract(this.location);
			if (moveVector.length() > 1) {
				moveVector.normalize();
			}

			// Scale monster speed
			moveVector = moveVector.multiply(0.01);

			var newLocation = this.location.add(moveVector);
			if (this.game.isValidPosition(newLocation)) {
				this.location = newLocation;
				return;
			}

			newLocation = new Vector2(this.location.x + (moveVector.x / Math.abs(moveVector.x)), this.location.y);
			if (this.game.isValidPosition(newLocation)) {
				this.location = newLocation
				return;
			}

			newLocation = new Vector2(this.location.x, this.location.y + (moveVector.y / Math.abs(moveVector.y)));
			if (this.game.isValidPosition(newLocation)) {
				this.location = newLocation
				return;
			}
		},

		draw: function(ctx) {

			Logger.log("draw");

			ctx.fillStyle = "#00FFF0";
			ctx.fillRect(this.location.x - 20, this.location.y - 20, 40, 40);
		}
	});

	return Monster;
});