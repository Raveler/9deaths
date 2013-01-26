define(["Compose", "Logger", "Vector2", "Loadable"], function(Compose, Logger, Vector2, Loadable) {
	
	var animationFrameRate = 5;

	var Animation = Compose(Loadable, function constructor(game, json) {
		this.game = game;
		this.data = json;
		this.img = this.game.images[this.data.fileName];
		this.frame = 0;
		this.frameRate = this.data.frameRate;
		this.currentAnimation = this.findAnimation("idle");
		this.focusPoint = new Vector2(this.data.focusPoint);
		this.flip = false;
	},
	{
		setFrameRate: function(ms) {
			this.frameRate = ms;
		},

		setAnimation: function(name) {
			var newAnim = this.findAnimation(name);
			if (newAnim != this.currentAnimation) this.frame = 0;
			this.currentAnimation = newAnim;
		},

		findAnimation: function(name) {
			for (var i = 0; i < this.data.animations.length; ++i) {
				if (this.data.animations[i].name == name) return i;
			}
			return 0;
		},

		setFlip: function(flip) {
			this.flip = flip;
		},

		update: function(dt) {

			// update the frame - not integer!
			this.frame += dt / this.frameRate;
			while (this.frame > this.data.animations[this.currentAnimation].length) this.frame -= this.data.animations[this.currentAnimation].length;
		},

		draw: function(ctx) {
			ctx.save();
			var frame = Math.floor(this.frame);
			if (this.flip) {
				ctx.scale(-1, 1);
				ctx.drawImage(this.img, frame * this.data.width, this.currentAnimation * this.data.height, this.data.width, this.data.height,  -this.focusPoint.x * this.data.scale, -this.focusPoint.y * this.data.scale, this.data.width * this.data.scale, this.data.height * this.data.scale);
			}
			else {
				ctx.drawImage(this.img, frame * this.data.width, this.currentAnimation * this.data.height, this.data.width, this.data.height,  -this.focusPoint.x * this.data.scale, -this.focusPoint.y * this.data.scale, this.data.width * this.data.scale, this.data.height * this.data.scale);
			}
			ctx.restore();
		}

	});
	
	return Animation;
});