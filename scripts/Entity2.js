define(["Compose", "Vector2", "Logger"], function(Compose, Vector2, Logger) {

	var Entity = Compose(function(game) {
		this.game = game;
		this.entities = this.game.json["entity"].entities;
	},
	{
		checkIfActivated: function(a) {
			for(var j = 0; j < this.entities.length; j++) {
				var inside = true;
				var length = this.entities[j].path.length;
		    	for(var i = 0; i < length; i++) {
					var b = new Vector2(this.entities[j].path[i][0], this.entities[j].path[i][1]);
					if (i < (length - 1)) {
						var c = new Vector2(this.entities[j].path[i + 1][0], this.entities[j].path[i + 1][1]);
					} else {
						var c = new Vector2(this.entities[j].path[0][0], this.entities[j].path[0][1]);
					}

					//Logger.log(a + " - " + b + " - " + c);
					// Check whether the pointers are counterclockwise
					if (((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) > 0) {
						inside = false;
						break;
					}
				}

				if (inside) {
					if (this.entities[j].active != true) {
						Logger.log("Activated entity " + j);
						this.entities[j].active = true;
					}
				} else {
					if (this.entities[j].active == true) {
						Logger.log("Disabled entity " + j);
						this.entities[j].active = false;
					}
				}
			}
		},

		animate: function() {

		},

		debugDraw: function(ctx) {
			for(var j = 0; j < this.entities.length; j++) {
				var length = this.entities[j].path.length;
		    	for(var i = 0; i < length; i++) {
					var a = new Vector2(this.entities[j].path[i][0], this.entities[j].path[i][1]);
					if (i < (length - 1)) {
						var b = new Vector2(this.entities[j].path[i + 1][0], this.entities[j].path[i + 1][1]);
					} else {
						var b = new Vector2(this.entities[j].path[0][0], this.entities[j].path[0][1]);
					}

					ctx.strokeStyle="#FF0000"
					ctx.beginPath();
					ctx.moveTo(a.x,a.y);
					ctx.lineTo(b.x,b.y);
					ctx.stroke();
				}
			}
		}
	});

	return Entity;
});