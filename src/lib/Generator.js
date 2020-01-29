import {Sprite, Text} from "pixi.js";

export default {
	generate(texture, text, textStyle) {
		let sprite = new Sprite(texture);
		let txt = new Text(text,textStyle);

		txt.position.set(sprite.width/2 - txt.width / 2,sprite.height/2 - txt.height/2);
		sprite.addChild(txt);
		sprite.interactive = true;
		sprite.buttonMode = true;

		sprite._txt = txt;
		/*
		let oldScale = {x: sprite.scale.x, y: sprite.scale.y};
		sprite.on("mousedown", () => {
			oldScale.x = sprite.scale.x;
			oldScale.y = sprite.scale.y;
			sprite.scale.x *= 0.95;
			sprite.scale.y *= 0.95;
		});

		sprite.on("mouseup", () => {
			console.log("Up",oldScale);
			sprite.scale.set(oldScale.x,oldScale.y);
		});
		*/

		return sprite;
	},
	generateOptionBox(app, texture) {
		let box = new Sprite(app.loader.resources["option_box"].texture);
		let image = new Sprite(texture);

		let w = image.width - box.width,
			h = image.height - box.height;

		if(h>0 || w>0) {
			let scale = 0;
			if(w>h) {
				scale = box.width/image.width;
			} else {
				scale = box.height/image.height;
			}

			scale *= 0.88;
			image.scale.set(scale,scale);
		} else {
			let scale = 0;
			if(w>h) {
				scale = box.width/image.width;
			} else {
				scale = box.height/image.height;
			}

			scale *= 0.9;
			image.scale.set(scale,scale);
		}

		image.position.set(box.width/2 - image.width/2, box.height/2-image.height/2);

		let tickSprite = new Sprite(app.loader.resources["tick1"].texture);
		tickSprite.position.set(box.width - tickSprite.width, box.height - tickSprite.height);
		tickSprite.visible = false;

		let crossSprite = new Sprite(app.loader.resources["cross1"].texture);
		crossSprite.position.set(box.width - crossSprite.width, box.height - crossSprite.height);
		crossSprite.visible = false;

		let cross = new Sprite(app.loader.resources["cross"].texture);
		cross.position.set(box.width / 2 - cross.width / 2, box.height / 2 - cross.height /2);
		cross.alpha = 0;

		box.addChild(image);
		box.addChild(tickSprite);
		box.addChild(crossSprite);
		box.addChild(cross);

		box.childObjects = {
			image,
			cross,
			cross1: crossSprite,
			tick: tickSprite
		};

		box.interactive = true;
		box.buttonMode = true;

		return box;
	},
	addTick1(box) {
		box.childObjects.tick.visible = true;
	},
	addCross1(box) {
		box.childObjects.cross1.visible = true;
	}
}