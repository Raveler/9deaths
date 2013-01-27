define(["Compose", "Vector2", "Logger", "Entity", "Animation", "Random", "Particle", "ContainedAnimation"], function(Compose, Vector2, Logger, Entity, Animation, Random, Particle, ContainedAnimation) {

	var BloodRoom = Compose(Entity, function(game, json) {
		this.game = game;
		this.hotSpots = [];
		this.width = json.width;
		for (var i = 0; i < json.hotSpots.length; ++i) {
			this.hotSpots.push(new Vector2(json.hotSpots[i]));
		}
		this.particlePending = 0;
		this.bodies = [];
		this.bodyAnimation = this.game.json["Player"];
	},
	{
		init: function() {

		},

		update: function(dt) {
			var playerLoc = this.game.player.getLoc();
			var loc = this.getLoc();

			for (var i = 0; i < this.bodies.length; ++i) {
				this.bodies[i].update(dt);
			}

			// compute the closeness to the hotspo
			var minDistance = 500000;
			for (var i = 0; i < this.hotSpots.length; ++i) {
				var d = playerLoc.subtract(this.hotSpots[i].add(loc)).length();
				if (d < minDistance) {;
					minDistance = d;
				}
			}

			// too close - die!
			if (minDistance < 60) {
				this.game.player.die();
				var animation = new ContainedAnimation(this.game, this.bodyAnimation, playerLoc.copy());
				animation.animation.setAnimation("floating");
				animation.init();

				return;
			}
			if (loc.x < playerLoc.x && playerLoc.x < loc.x + this.width && this.game.player.isMoving()) {
				var ratio = 350.0 - (minDistance - 60);
				if (ratio < 0) ratio = 0;
				ratio *= 0.001;
				if (ratio > 0.25) ratio *= 3;
				ratio *= 10;
				this.particlePending += ratio;

				// generate particles
				while (this.particlePending > 0) {
					--this.particlePending;
					var particle = new Particle(this.game, "blood.png", playerLoc.copy(), Random.getDouble(1.2, 2.2), Random.getDouble(0.5, 1.5), new Vector2(Random.getDouble(-4, 4), Random.getDouble(-6, -3)), 0.2);
					this.game.entities.push(particle);
				}
			}
		},

		draw: function(ctx) {
			for (var i = 0; i < this.bodies.length; ++i) {
				ctx.save();
				ctx.translate(this.bodies[i].loc.x, this.bodies[i].loc.y);
				this.bodies[i].draw(ctx);
				ctx.restore();
			}
			/*ctx.save();
			ctx.strokeStyle = "#FFFF00";
			ctx.strokeRect(this.loc.x, this.loc.y, this.width, 400);
			for (var i = 0; i < this.hotSpots.length; ++i) {
				ctx.fillStyle = "#00FFFF";
				ctx.fillRect(this.hotSpots[i].x, this.hotSpots[i].y, 20, 20)
			}
			ctx.restore();*/
		}
	});

	return BloodRoom;
});