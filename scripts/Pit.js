define(["Compose", "Vector2", "Logger", "Entity"], function(Compose, Vector2, Logger, Entity) {

	var Pit = Compose(Entity, function(game, json) {
		this.game = game;
		this.trapdoor = json;
		/*this.triggerId = json.triggerId;
		this.animation = new Animation(game, json);
		this.opened = false;*/
		this.path = new Array();
	    for(var i = 0; i < this.json.path.length; i++) {
	    	this.path[i] = new Array();
	    	this.path[i][0] = json.path[i][0] + this.loc.x;
	    	this.path[i][1] = json.path[i][1] + this.loc.y;
		}
		this.bodies = new Array;
	},
	{
		init: function() {

		},

		activate: function(on) {
			Logger.log("Pit cannot be activated you idiot!");
		},

		update: function(dt) {
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

			if (inside) {
				// Check whether player is standing on a body
				var standingOnBody = false;
				for(var i = 0; i < this.bodies.length; i++) {
					if ((a.x > (this.bodies[i].x - 110)) && (a.x < (this.bodies[i].x + 110))
						&& (a.y > (this.bodies[i].y - 25)) && (a.y < (this.bodies[i].y + 25))) {
						Logger.log("standing on body!!");
						standingOnBody = true;
						break;
					}
				}

				this.bodies[this.bodies.length] = this.game.player.loc;
				this.game.player.fall();
			}
		},

		draw: function(ctx) {
			// TODO draw animations!
			if (this.game.debugDraw != true) {
				return;
			}

			for(var i = 0; i < this.bodies.length; i++) {
				ctx.save();
				ctx.fillStyle = "#FF0FFF";
				ctx.translate(this.bodies[i].x, this.bodies[i].y);
				ctx.fillRect (-110,-25,220,50);
				ctx.restore();

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