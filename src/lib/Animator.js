export default class Animator {
	constructor(sprite) {
		this.sprite = sprite;
	}

	stop() {
		this._stopped = true;
	}

	async animate(data, time) {
		this._stopped = false;
		if(data.rotation) {
			data.rotation = data.rotation * (Math.PI/180);
		}
		let initialValues = {
			scale: {
				x: this.sprite.scale.x,
				y: this.sprite.scale.y,
			},
			position: {
				x: this.sprite.position.x,
				y: this.sprite.position.y,
			},
			alpha: this.sprite.alpha,
			rotation: this.sprite.rotation,
			startTime: Date.now(),
			endTime: time + Date.now(),
		};

		return new Promise((resolve => {
			requestAnimationFrame(fn.bind(this));
			const self = this;
			function fn() {
				if(this._stopped) return;
				let f;
				if(initialValues.endTime <= Date.now()) {
					f = 1;
				} else {
					f = (Date.now() - initialValues.startTime) / (initialValues.endTime - initialValues.startTime);
				}


				if(data.scale) {
					if(data.scale.x !== undefined) {
						this.sprite.scale.x = initialValues.scale.x+(data.scale.x-initialValues.scale.x) * f;
					}
					if(data.scale.y !== undefined) {
						this.sprite.scale.y = initialValues.scale.y+(data.scale.y-initialValues.scale.y) * f;
					}
				}

				if(data.position) {
					if(data.position.x !== undefined) {
						this.sprite.position.x = initialValues.position.x+(data.position.x-initialValues.position.x) * f;
					}
					if(data.position.y !== undefined) {
						this.sprite.position.y = initialValues.position.y+(data.position.y-initialValues.position.y) * f;
					}
				}

				if(data.rotation !== undefined) {
					// console.log(initialValues.rotation);
					// console.log(initialValues.rotation + (data.rotation - initialValues.rotation));
					this.sprite.rotation = initialValues.rotation + (data.rotation - initialValues.rotation) * f;
				}

				if(data.alpha !== undefined) {
					this.sprite.alpha = initialValues.alpha + (data.alpha - initialValues.alpha) * f;
				}

				if(f!==1) {
					requestAnimationFrame(fn.bind(this));
					return;
				}
				resolve(self);
			}
		}));
	}
}