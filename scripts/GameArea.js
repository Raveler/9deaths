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
	    	for(var i = 0, length = this.areaData.regions[0].path.length - 1; i < length; i++) {

				var b = new Vector2(this.areaData.regions[0].path[i][0], this.areaData.regions[0].path[i][1]);
				var c = new Vector2(this.areaData.regions[0].path[i + 1][0], this.areaData.regions[0].path[i + 1][1]);

					    		Logger.log(a + " - " + b + " - " + c)

				//var b = new Vector2(this.areaData.regions[0].path[i + 1]);

				if (((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) > 0) {
					Logger.log("passed");
				} else {
					Logger.log("failed");
				}

			}



			//return ((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) > 0;


		}




	})
	
	return GameArea;
});