define(["Compose", "Logger", "Vector2", "Animation", "Particle", "Random"], function(Compose, Logger, Vector2, Animation, Particle, Random) {
	
	var BabyRoom = Compose(function constructor(game, json) {
		this.game = game;
		//this.animation = new Animation(game, json);
		this.skipMe = true;
		this.dead = false;
		this.started = false;
		this.loc = new Vector2(json.loc);

		this.screamStarts = [4];
		this.screamEnds = [12];
		this.screaming = false;
		this.screamIndex = 0;
		this.passed = false;
	},
	{
		getId: function() {
			return "";
		},

		init: function() {
			/*this.game.entities.push(this);
			this.game.movables.push(this);*/
		},

		isDead: function() {
			return this.dead;
		},

		die: function() {
			this.dead = true;
		},

		update: function(dt) {

			// see if we entered the baby room - this triggers new changes
			var dx = this.game.player.getBaseX()  - (this.room.getLoc().x - this.room.getWidth());
			if (!this.started) {

				// START
				if (dx > 0) {
					this.game.player.babyRoom = true;
					this.game.audio.Bloodfootsteps.pause();
					this.game.audio.Footsteps.pause();
					this.game.audio.MansionFIN.pause();
					this.game.audio.NormalNoDoor.pause();
					this.game.audio.Ambientcreep.play();
					this.timer = 0;
					this.started = true;
/*
					// spawn monster
					this.game.createEntity({
						"id": "monsterBabyRoom",
						"className": "Monster",
						"json": "Monster",
						"loc": [500, 250],
						"activeRange": 1000,
						"speed": 0.75
					});*/
				}
			}

			// started - update timer
			else {

				if (this.game.player.getBaseX() > this.room.getLoc().x && !this.passed) {
					this.passed = true;
					this.game.player.speed = 5;
					return;
				}
				if (this.passed) return;

				this.timer += dt;
				if (this.game.player.speed > 0.8) this.game.player.speed -= 0.03;
				if (!this.screaming && this.screamIndex < this.screamStarts.length && this.timer / 1000 > this.screamStarts[this.screamIndex]) {
					Logger.log("SCREAMING START");
					this.screaming = true;
					this.screamCounter = 0;
				}
				if (this.screaming && this.timer / 1000 > this.screamEnds[this.screamIndex]) {
					Logger.log("SCREAMING END");
					this.screaming = false;
					++this.screamIndex;
				}
				if (this.screaming) {
					/*this.screamCounter += dt;
					var maxTime = 4000;
					var multiplier = Math.max(0.2, Math.min(1, this.screamCounter / maxTime));
					Logger.log(multiplier);
					var nParticles = Math.max(multiplier * 30, 30);
					for (var i = 0; i < nParticles; ++i) {
						//var particle = new Particle(this.game, "blood.png", this.game.player.getLoc().copy(), Random.getDouble(0, 2 * Math.PI), Random.getDouble(0.3, 0.7), Random.getDouble(2 * multiplier, 4 * multiplier), Random.getDouble(Math.PI/4, 3*Math.PI/4), (Random.getInt(0,1) == 0 ? -1.0 : 1.0) * Random.getDouble(0.0, 0.05), 0.2);
						var particle = new Particle(this.game, "blood.png", this.game.player.getLoc().copy().add(new Vector2(Random.getDouble(-15, 15)), 0), Random.getDouble(0, 2 * Math.PI), Random.getDouble(0.3, 0.7), Random.getDouble(6.5 * multiplier, 15.5 * multiplier), -Math.PI/2, (Random.getInt(0,1) == 0 ? -1.0 : 1.0) * Random.getDouble(0.0, 0.1), 0.2);
						this.game.entities.push(particle);
						this.game.movables.push(particle);
					}
					if (!this.game.player.isMoving()) {
						this.screamCounter = 0;
					}
					if (this.screamCounter > maxTime) {
						this.screaming = false;
						this.started = false;
						this.game.player.die();
						if (Random.getInt(0, 1) == 0) this.game.audio.manscream1.play();
						else this.game.audio.manscream2.play();
					}*/
				}
			}
		},

		getLoc: function() {
			return this.loc;
		},

		getBaseX: function() {
			return this.loc.x;
		},

		draw: function(ctx, z) {
			/*if (this.isDead()) {
				return;
			}
			ctx.save();
			ctx.translate(this.loc.x, this.loc.y);
			this.animation.draw(ctx);
			ctx.restore();*/
		}
	});
	
	return BabyRoom;
});