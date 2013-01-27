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
		this.bodyAnimation = this.game.player.json;
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

			// player within reach for the first time and there is a body - draw it
			if (this.loc.x <= this.game.player.getBaseX() && this.game.player.getBaseX() <= this.loc.x + this.width) {
				if (this.bodies.length > 0) {
					if (this.game.audio.Drowning.paused) this.game.audio.Drowning.play();
				}
				if (this.game.player.isMoving()) this.game.player.bloodWalking = true;
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
			if (minDistance < 30) {
				this.game.player.die();
				this.game.player.scream();
				var animation = new ContainedAnimation(this.game, this.bodyAnimation, new Vector2(playerLoc.x, Math.max(40, playerLoc.y)));
				animation.animation.setAnimation("floating");
				animation.init();
				this.bodies.push(animation);
				return;
			}
			if (loc.x < playerLoc.x && playerLoc.x < loc.x + this.width && this.game.player.isMoving()) {
				var ratio = 2.0;
				if (minDistance < 100) ratio = 10.0;
				this.particlePending += ratio;

				// generate particles
				while (this.particlePending > 0) {
					--this.particlePending;
					var particle = new Particle(this.game, "blood.png", this.game.player.getLoc().copy().add(new Vector2(Random.getDouble(-15, 15)), 15), Random.getDouble(0, 2 * Math.PI), Random.getDouble(0.7, 1.5), ratio < 2 ? Random.getDouble(6.5 * ratio * 3 * 0.05, 15.5 * 3 * ratio * 0.05) : Random.getDouble(6.5 * ratio * 0.05, 15.5 * ratio * 0.05), -Math.PI/2, (Random.getInt(0,1) == 0 ? -1.0 : 1.0) * Random.getDouble(0.0, 0.1), 0.2);
					this.game.movables.push(particle);
					this.game.entities.push(particle);
				}
			}
		},

		draw: function(ctx) {
			/*for (var i = 0; i < this.bodies.length; ++i) {
				ctx.save();
				ctx.translate(this.bodies[i].loc.x, this.bodies[i].loc.y);
				this.bodies[i].draw(ctx);
				ctx.restore();
			}
			ctx.save();
			ctx.strokeStyle = "#FFFF00";
			ctx.strokeRect(this.loc.x, this.loc.y, this.width, 400);
			for (var i = 0; i < this.hotSpots.length; ++i) {
				ctx.fillStyle = "#00FFFF";
				ctx.fillRect(this.hotSpots[i].x + this.getLoc().x, this.hotSpots[i].y + this.getLoc().y, 20, 20)
			}
			ctx.restore();*/
		}
	});

	return BloodRoom;
});