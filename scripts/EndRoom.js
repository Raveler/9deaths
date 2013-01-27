define(["Compose", "Logger", "Vector2", "Animation", "Particle", "Random"], function(Compose, Logger, Vector2, Animation, Particle, Random) {
	
	var EndRoom = Compose(function constructor(game, json) {
		this.game = game;
		//this.animation = new Animation(game, json);
		this.skipMe = true;
		this.dead = false;
		this.started = false;
		this.loc = new Vector2(json.loc);
		this.dialog = false;
		this.appearing = false;
		this.form = document.getElementById("dialog");
		this.done = false;
	},
	{
		getId: function() {
			return "endRoom";
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
			if (!this.done && !this.dialog && this.game.player.getBaseX() > this.room.getLoc().x - this.room.getWidth() + 400) {
				document.getElementById("dialog-text").value = "";
				this.dialog = true;
				this.game.player.speed = 0;
				this.form.style.display = "inline-block";
				this.form.onkeydown = function(e) {
					if (e.keyCode == 13) {
						this.submit();
					}
				}.bind(this);
				document.getElementById("dialog-submit").onclick = this.submit.bind(this);
			}
		},

		submit: function() {
			this.dialog = false;
			this.done = true;
			this.form.style.display = "none";
			if (this.game.player.name.toLowerCase() != document.getElementById("dialog-text").value.toLowerCase()) {
				this.game.player.scream();
				this.game.player.die();
			}
			else {
				this.game.win();
			}
		},

		getLoc: function() {
			return this.loc;
		},

		getBaseX: function() {
			return this.loc.x;
		},

		draw: function(ctx, z) {
			if (this.dialog) {
				ctx.font = "20px Finger Paint";
				ctx.fillStyle = "#920b0b";
				var x = this.room.getLoc().x - this.room.getWidth() + 530;
				ctx.fillText("One who does not know his own name...", x, -180);
				ctx.fillText("... is not worthy of eternal life.", x+100, -150);
			}


			// render the name of the person
			ctx.save();
			ctx.font = "18px Finger Paint";
			ctx.fillStyle = "#1c0f0b";
			ctx.translate(this.room.getLoc().x - this.room.getWidth() + 738, -226);
			ctx.rotate(0.6);
			ctx.fillText(this.game.treeName, 0, 0);
			ctx.restore();

			/*if (this.isDead()) {
				return;
			}
			ctx.save();
			ctx.translate(this.loc.x, this.loc.y);
			this.animation.draw(ctx);
			ctx.restore();*/
		}
	});
	
	return EndRoom;
});