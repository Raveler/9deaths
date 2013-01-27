define(["Compose", "Vector2", "Logger", "Entity", "Animation"], function(Compose, Vector2, Logger, Entity, Animation) {

	var Pit = Compose(Entity, function(game, json) {
		this.game = game;
		this.animation = new Animation(game, json);
		this.bodyInPit = false;
		this.path = new Array();
	    for(var i = 0; i < json.path.length; i++) {
	    	this.path[i] = new Array();
	    	this.path[i][0] = json.path[i][0] + this.loc.x;
	    	this.path[i][1] = json.path[i][1] + this.loc.y;
		}
		this.game.pits.push(this);
	},
	{
		init: function() {
		},

		activate: function(on) {
			Logger.log("Pit cannot be activated you idiot!");
		},

		update: function(dt) {
			this.animation.update(dt);

			if (this.isAboveTrap(this.game.player.loc)) {
				if (!this.bodyInPit) {
					this.game.audio.StabbingSpikesFIN.play();
					this.bodyInPit = true;
					this.animation.setAnimation("pit2");
					this.game.player.fall();
				} else {
					this.game.audio.MeatFIN.play();
				}
			}
		},

		isAboveTrap: function(a) {
			var length = this.path.length;
		   	for(var i = 0; i < length; i++) {
				var b = new Vector2(this.path[i][0], this.path[i][1]);
				if (i < (length - 1)) {
					var c = new Vector2(this.path[i + 1][0], this.path[i + 1][1]);
				} else {
					var c = new Vector2(this.path[0][0], this.path[0][1]);
				}

				//Logger.log(a + " - " + b + " - " + c);
				// Check whether the pointers are counterclockwise
				if (((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) > 0) {
					return false;
				}
			}
			return true;
		},

		draw: function(ctx) {
			ctx.save();
			//ctx.fillStyle = "#00FFFF";
			ctx.translate(this.getLoc().x, this.getLoc().y);
			//ctx.fillRect(-2, -2, 4, 4);
			this.animation.draw(ctx);
			ctx.restore();

			if (this.game.debugDraw != true) {
				return;
			}

	    	for(var i = 0; i < this.path.length; i++) {
				var a = new Vector2(this.path[i][0], this.path[i][1]);
				if (i < (this.path.length - 1)) {
					var b = new Vector2(this.path[i + 1][0], this.path[i + 1][1]);
				} else {
					var b = new Vector2(this.path[0][0], this.path[0][1]);
				}

				ctx.strokeStyle="#FFFF00"
				ctx.beginPath();
				ctx.moveTo(a.x,a.y);
				ctx.lineTo(b.x,b.y);
	 			ctx.stroke();
			}
		}
	});

	return Pit;
});