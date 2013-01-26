define(["Compose", "Vector2", "Logger", "Entity", "Animation"], function(Compose, Vector2, Logger, Entity, Animation) {

	var Trapdoor = Compose(Entity, function(game, json) {
		this.game = game;
		this.trapdoor = json;
		this.triggerId = json.triggerId;
		this.animation = new Animation(game, json);
		this.opened = false;
		this.path = json.path;
	    for(var i = 0; i < this.path.length; i++) {
	    	this.path[i][0] = this.path[i][0] + this.loc.x;
	    	this.path[i][1] = this.path[i][1] + this.loc.y;
		}
	},
	{
		init: function() {
			this.game.getEntity(this.triggerId).addTriggerable(this);
		},

		activate: function(on) {
			if (on) {
				this.opened = true;
				Logger.log("trapdoor on!");
				this.animation.setAnimation("open");
			}
			else {
				this.opened = false;
				Logger.log("trapdoor off!");
				this.animation.setAnimation("closed");
			}
		},

		update: function(dt) {
			this.animation.update(dt);

			// Check whether player is above the trapdoor
			var a = this.game.player.loc;
			var inside = true;
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
					inside = false;
					break;
				}
			}

			if (inside && this.opened) {
				this.game.player.fall();
			}
		},

		draw: function(ctx) {
			ctx.save();
			ctx.fillStyle = "#00FFFF";
			ctx.translate(this.getLoc().x, this.getLoc().y);
			ctx.fillRect(-2, -2, 4, 4);
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

				ctx.strokeStyle="#FF0000"
				ctx.beginPath();
				ctx.moveTo(a.x,a.y);
				ctx.lineTo(b.x,b.y);
	 			ctx.stroke();
			}
		}
	});

	return Trapdoor;
});