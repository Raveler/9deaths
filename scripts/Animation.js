define(["Compose", "Logger", "Vector2"], function(Compose, Logger, Vector2) {
	
	var animationFrameRate = 5;

	var Animation = Compose(function constructor(game, json) {
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
			while (this.frame >= this.data.animations[this.currentAnimation].length) this.frame -= this.data.animations[this.currentAnimation].length;
		},

		draw: function(ctx, z) {
			ctx.save();
			var frame = Math.floor(this.frame);
			var height = this.data.height;
			if (typeof z == "undefined") z = 0;
			if (z < 0) height += z;
			if (height < 0) height = 0;
			if (this.flip) {
				ctx.scale(-1, 1);
				ctx.drawImage(this.img, frame * this.data.width, this.currentAnimation * this.data.height, this.data.width, height,  -this.focusPoint.x * this.data.scale, -this.focusPoint.y * this.data.scale - z, this.data.width * this.data.scale, height * this.data.scale);
			}
			else {
				ctx.drawImage(this.img, frame * this.data.width, this.currentAnimation * this.data.height, this.data.width, height,  -this.focusPoint.x * this.data.scale, -this.focusPoint.y * this.data.scale - z, this.data.width * this.data.scale, height * this.data.scale);
			}
			ctx.restore();
		}

	});
	
	return Animation;
});