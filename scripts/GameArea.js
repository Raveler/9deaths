define(["Compose", "Logger", "Vector2"], function(Compose, Logger, Vector2) {

	var GameArea = Compose(function(game, areaName) {
		this.game = game;
		this.areaData = this.game.json[areaName];

		Logger.log("starting location:" + this.areaData.startingLocation);
		Logger.log("regions:" + this.areaData.regions[0].path);
		Logger.log("layers:" + this.areaData.layers);
	},
	{
		isInArea: function(a) {
			for(var j = 0; j < this.areaData.regions.length; j++) {

				var inside = true;
				length = this.areaData.regions[j].path.length - 1;
		    	for(var i = 0; i < length; i++) {
					var b = new Vector2(this.areaData.regions[j].path[i][0], this.areaData.regions[j].path[i][1]);
					var c = new Vector2(this.areaData.regions[j].path[i + 1][0], this.areaData.regions[j].path[i + 1][1]);
					//Logger.log(a + " - " + b + " - " + c)
					if (((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) >= 0) {
						Logger.log("out");
						continue;
					} else {
						Logger.log("in");
					}
				}

				var b = new Vector2(this.areaData.regions[j].path[length][0], this.areaData.regions[j].path[length][1]);
				var c = new Vector2(this.areaData.regions[j].path[0][0], this.areaData.regions[j].path[0][1]);
				//Logger.log(a + " - " + b + " - " + c)
				if (((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) >= 0) {
					Logger.log("out");
					continue;
				} else {
					Logger.log("in");
				}

				if (inside == true) {
					return true;
				}
			}

			return false;
		}

	})
	
	return GameArea;
});