define(["Compose", "Vector2", "Logger", "Entity", "Animation", "ContainedAnimation"], function(Compose, Vector2, Logger, Entity, Animation, ContainedAnimation) {

	var Monster = Compose(Entity, function(game, json) {
		this.game = game;
		//this.location = new Vector2(json.loc[0], json.loc[1]);
		this.activeRange = json.activeRange;
		this.xlimit = json.xlimit;
		this.death = false;
		this.eating = false;
		this.animation = new Animation(game, json);
		this.game.monsters.push(this);
		this.skipMe = true;
		this.speed = json.speed;
		if (typeof this.speed == "undefined") this.speed = 2.7;
		if (typeof json.moreFreedom != "undefined") {
			this.moreFreedom = json.moreFreedom;
		} else {
			this.moreFreedom = false;
		}
	},
	{
		init: function() {
			this.game.movables.push(this);
		},

		update: function(dt, ctx) {
			this.animation.update(dt);

			// Play eating sound
			var moveVector = this.game.player.loc.subtract(this.getLoc());
			if (moveVector.length() < this.activeRange && this.eating && !this.death) {
				this.game.audio.Monstereating.play();
			}

			// Ignore if death
			if (this.death || this.eating) {
				return;
			}

			// Check if monster is in active range
			var moveVector = this.game.player.loc.subtract(this.getLoc());
			if (moveVector.length() > this.activeRange) {
				this.animation.setAnimation("idle");
				this.animation.setFlip(true);
				return;
			}

			// Monster is chasing player, play growling sound
			this.game.audio.Monstergrowl.play();

			// Check whether monster is on the player
			if ((Math.abs(moveVector.x) < 110) && (Math.abs(moveVector.y) < 15)) {
				this.game.player.die();
				this.eating = true;
				this.eatingAnimation = new ContainedAnimation(this.game, this.game.json["MonsterEating"], this.getLoc());
				this.eatingAnimation.animation.setAnimation("eating");
				this.eatingAnimation.animation.setFlip(true);
				this.eatingAnimation.init();
				return;
			}

			moveVector = moveVector.normalize();

			if (moveVector.x > 0) {
				this.animation.setAnimation("walk");
				this.animation.setFlip(false);
			} else {
				this.animation.setAnimation("walk");
				this.animation.setFlip(true);
			}

			// Scale monster speed
			moveVector = moveVector.multiply(this.speed);

			var roomPos = this.room.getLoc();
			var roomWidth = this.room.getWidth();
			if (this.moreFreedom == true) {
				roomWidth = roomWidth + 330; // Dirty hack for last room
			}
			var newLocation = this.getLoc().add(moveVector);

			if (this.game.isValidAndSafePosition(newLocation)) {
				if ((newLocation.x > (roomPos.x - roomWidth + 410)) && (newLocation.x < (roomPos.x - 50))) {		
					this.setLoc(newLocation);
				} else {
					this.animation.setAnimation("idle");
				}
				return;
			}

			newLocation = new Vector2(this.getLoc().x + (moveVector.x / Math.abs(moveVector.x)), this.getLoc().y);
			if (this.game.isValidAndSafePosition(newLocation)) {
				if ((newLocation.x > (roomPos.x - roomWidth + 410)) && (newLocation.x < (roomPos.x - 50))) {		
					this.setLoc(newLocation);
				} else {
					this.animation.setAnimation("idle");
				}
				return;
			}

			newLocation = new Vector2(this.getLoc().x, this.getLoc().y + (moveVector.y / Math.abs(moveVector.y)));
			//newLocation = newLocation.subtractMutable(this.getLoc()).rotateMutable(45).addMutable(this.getLoc());
			if (this.game.isValidAndSafePosition(newLocation)) {
				if ((newLocation.x > (roomPos.x - roomWidth + 410)) && (newLocation.x < (roomPos.x - 50))) {		
					this.setLoc(newLocation);
				} else {
					this.animation.setAnimation("idle");
				}
				return;
			}

			this.animation.setAnimation("idle");
		},

		init: function() {

		},

		die: function() {
			if (this.eatingAnimation instanceof Object) {
				this.eatingAnimation.die();
			}
			if (!this.death) {
				this.game.audio.Monstergrowl.play();
				this.death = true;
			}
		},

		draw: function(ctx) {
			// Ignore if death
			if (this.death || this.eating) {
				return;
			}

			ctx.save();
			//ctx.fillStyle = "#00FF00";
			ctx.translate(this.getLoc().x, this.getLoc().y);
			//ctx.fillRect(-2, -2, 4, 4);
			this.animation.draw(ctx, this.z);
			ctx.restore();

			/*ctx.beginPath();
			ctx.moveTo(this.getLoc().x,this.getLoc().y);
			ctx.lineTo(newLocation.x,newLocation.y);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(this.getLoc().x,this.getLoc().y);
			ctx.lineTo(newLocation.x,newLocation.y);
			ctx.stroke();*/

			//ctx.fillStyle = "#00FFF0";
			//ctx.fillRect(this.room.getLoc().x - 20, this.room.getLoc().y - 20, 40, 40);
		}
	});

	return Monster;
});