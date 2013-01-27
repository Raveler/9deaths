define(["Compose", "Vector2", "Logger", "Entity", "Animation", "Random"], function(Compose, Vector2, Logger, Entity, Animation, Random) {

	var Trapdoor = Compose(Entity, function(game, json) {
		this.game = game;
		this.trapdoor = json;
		this.triggerId = json.triggerId;
		this.animation = new Animation(game, json);
		this.flip = json.flip;
		if (typeof this.flip == "undefined") this.flip = false;
		if (typeof json.opened == "undefined") {
			this.opened = false;
		} else {
			this.opened = json.opened;
		}
		if (typeof json.openAuto == "undefined") {
			this.autoOpen = false;
		} else {
			this.autoOpen = json.openAuto;
		}
		this.path = new Array();
	    for(var i = 0; i < json.path.length; i++) {
	    	this.path[i] = new Array();
	    	this.path[i][0] = json.path[i][0] + this.loc.x;
	    	this.path[i][1] = json.path[i][1] + this.loc.y;
		}
		if (typeof json.blooded != "undefined") {
			this.blooded = json.blooded;
		} else {
			this.blooded = false;
		}
		if (!this.opened) {
			if (this.blooded) {
				this.animation.setAnimation("closed_bloody");
			} else {
				this.animation.setAnimation("closed");
			}
		} else {
			if (this.blooded) {
				this.animation.setAnimation("open_bloody");
			} else {
				this.animation.setAnimation("open");
			}
		}
		this.game.trapdoors.push(this);
	},
	{
		init: function() {
			for(var i = 0; i < this.triggerId.length; i++) {
				this.game.getEntity(this.triggerId[i]).addTriggerable(this);
			}
		},

		activate: function(on, sound) {
			if (typeof sound == "undefined") sound = true;
			if (this.flip) {
				this.opened = !this.opened;
				if (sound) this.game.audio.VeelluikenFIN.play();
			}
			else if (!this.opened) {
				this.opened = true;
				if (sound) this.game.audio.VeelluikenFIN.play();
			}
			else if (this.opened) {
				this.opened = false;
				if (sound) this.game.audio.VeelluikenFIN.play();
			}
			if (this.opened) {
				if (this.blooded) {
					this.animation.setAnimation("open_bloody");
				} else {
					this.animation.setAnimation("open");
				}
			}
			else {
				if (this.blooded) {
					this.animation.setAnimation("closed_bloody");
				} else {
					this.animation.setAnimation("closed");
				}
			}
		},

		update: function(dt) {
			this.animation.update(dt);

			for(var i = 0; i < this.game.monsters.length; i++) {
				if (this.isAboveTrap(this.game.monsters[i].getLoc())) {
					if (this.opened) {
						this.game.monsters[i].die();
					} else if (this.autoOpen) {
						if (this.blooded) {
							this.animation.setAnimation("open_bloody");
						} else {
							this.animation.setAnimation("open");
						}
						this.game.monsters[i].die();
					}
				}
			}

			if (this.isAboveTrap(this.game.player.loc)) {
				if (this.opened) {
					this.game.player.scream();
					this.game.player.die();
					this.blooded = true;
					this.animation.setAnimation("open_bloody");
				} else if (this.autoOpen) {
					this.game.player.scream();
					if (this.blooded) {
						this.animation.setAnimation("open_bloody");
					} else {
						this.animation.setAnimation("open");
					}
					this.game.player.die();
					this.blooded = true;
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

				ctx.strokeStyle="#FF0000";
				ctx.beginPath();
				ctx.moveTo(a.x,a.y);
				ctx.lineTo(b.x,b.y);
	 			ctx.stroke();
			}
		}
	});

	return Trapdoor;
});