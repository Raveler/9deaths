define(["Compose", "Logger", "Vector2"], function(Compose, Logger, Vector2) {

	var GameArea = Compose(function(game, areaName) {
		this.game = game;
		this.areaData = this.game.json[areaName];
	},
	{
		isInArea: function(a) {
			for(var j = 0; j < this.areaData.regions.length; j++) {
				var inside = true;
				var length = this.areaData.regions[j].path.length;
		    	for(var i = 0; i < length; i++) {
					var b = new Vector2(this.areaData.regions[j].path[i][0], this.areaData.regions[j].path[i][1]);
					if (i < (length - 1)) {
						var c = new Vector2(this.areaData.regions[j].path[i + 1][0], this.areaData.regions[j].path[i + 1][1]);
					} else {
						var c = new Vector2(this.areaData.regions[j].path[0][0], this.areaData.regions[j].path[0][1]);
					}

					//Logger.log(a + " - " + b + " - " + c);
					// Check whether the pointers are counterclockwise
					if (((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) > 0) {
						inside = false;
						break;
					}
				}

				if (inside == true) {
					return true;
				}
			}

			return false;
		},

		debugDraw: function(ctx) {
			for(var j = 0; j < this.areaData.regions.length; j++) {
				var length = this.areaData.regions[j].path.length;
		    	for(var i = 0; i < length; i++) {
					var a = new Vector2(this.areaData.regions[j].path[i][0], this.areaData.regions[j].path[i][1]);
					if (i < (length - 1)) {
						var b = new Vector2(this.areaData.regions[j].path[i + 1][0], this.areaData.regions[j].path[i + 1][1]);
					} else {
						var b = new Vector2(this.areaData.regions[j].path[0][0], this.areaData.regions[j].path[0][1]);
					}

					ctx.beginPath();
					ctx.moveTo(a.x,a.y);
					ctx.lineTo(b.x,b.y);
					ctx.stroke();
				}
			}
		}

	})
	
	return GameArea;
});