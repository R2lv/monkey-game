import {Container, Point, Graphics, Sprite, Text} from "pixi.js";
import Generator from "../lib/Generator";
import Animator from "../lib/Animator";

export default class StartScene {
	constructor(app) {
		this.app = app;
		this._scale = new Point(0.7,0.7);
		this.static_scale = new Point(0.7,0.7);
		this.started = false;

		this.fixScale();

		// this.scale.x /= window.devicePixelRatio;
		// this.scale.y /= window.devicePixelRatio;

		this.container = new Container();
		this.init();

		let t = 0;

		window.addEventListener("resize", () => {
			clearTimeout(t);

			t = setTimeout(() => {
				this.fixScale();
				this.init();
			},500);
		});
	}

	onStart(cb) {
		this.onStartCb = cb;
	}


	fixScale() {
		if(!this.app.dimensions.isPortrait) {
			let scale = this._scale.clone();
			console.log(this.app.dimensions, this.app.screen);
			scale.x/=this.app.dimensions.width/this.app.dimensions.height;
			scale.y/=this.app.dimensions.width/this.app.dimensions.height;
			this.scale = scale;
		} else {
			this.scale = this._scale;
		}
	}

	getContainer() {
		return this.container;
	}

	init() {
		this.container.removeChildren();
		let blackBg = new Graphics()
			.beginFill(0x000000)
			.drawRect(0,0,this.app.dimensions.width,this.app.dimensions.height)
			.endFill();
		let blackBgTexture = this.app.renderer.generateTexture(blackBg);
		this.blackBg = new Sprite(blackBgTexture);
		this.blackBg.position.set(0,0);
		this.blackBg.alpha = 0.7;

		let rect = new Graphics()
			.beginFill(0xFFFFFF)
			.drawRoundedRect(0,0,this.app.dimensions.width*1.2,700,100)
			.endFill();
		let rectTexture = this.app.renderer.generateTexture(rect);
		this.rect = new Sprite(rectTexture);
		this.rect.scale = this.scale;
		this.rect.position.set(this.app.dimensions.width/2 - this.rect.width/2, this.app.dimensions.height/2-this.rect.height/2);

		// region Title
		this.monkeyCard = new Sprite(this.app.loader.resources["monkey_board"].texture);
		let monkeyCardText = new Text("Monkey Card", {
			fill: 0xFFFFFF,
			fontFamily: "Risque",
			fontSize: 100,
			fontWeight: 'bold'
		});
		monkeyCardText.position.set(this.monkeyCard.width / 2 - monkeyCardText.width / 2, this.monkeyCard.height / 2 - monkeyCardText.height / 2);

		this.monkeyCard.scale = this.static_scale;
		this.monkeyCard.position.set(this.rect.getLocalBounds().width/2-this.monkeyCard.width/2, -110);

		this.monkeyCard.addChild(monkeyCardText);
		this.rect.addChild(this.monkeyCard);

		// endregion Title


		this.start_btn = Generator.generate(this.app.loader.resources["start_btn"].texture, "Start", {
			fontFamily: 'Alata',
			fontWeight: 'bold',
			fontSize: 120,
			fill: 0x42210B
		});
		this.start_btn.scale = this.static_scale;
		this.start_btn.position.set(this.rect.getLocalBounds().width / 2 - this.start_btn.width / 2, this.rect.getLocalBounds().height - this.start_btn.height);
		this.rect.addChild(this.start_btn);


		let grapeBox = Generator.generateOptionBox(this.app, this.app.loader.resources["grape"].texture);
		grapeBox.scale.set(0.7,0.7);
		grapeBox.position.set(70,150);

		let bananaBox = Generator.generateOptionBox(this.app, this.app.loader.resources["banana"].texture);
		bananaBox.scale.set(0.7,0.7);
		bananaBox.position.set(this.rect.getLocalBounds().width / 2 - bananaBox.width/2,150);

		let appleBox = Generator.generateOptionBox(this.app, this.app.loader.resources["apple"].texture);
		appleBox.scale.set(0.7,0.7);
		appleBox.position.set(this.rect.getLocalBounds().width - bananaBox.width - 70,150);

		this.rect.addChild(grapeBox);
		this.rect.addChild(bananaBox);
		this.rect.addChild(appleBox);

		Generator.addTick1(appleBox);
		Generator.addCross1(grapeBox);
		Generator.addCross1(bananaBox);

		let answerBg = new Sprite(this.app.loader.resources["question_bg"].texture);
		let answerText = new Text("This is an Apple.", {
			fontFamily: "Risque",
			fontSize: 110
		});

		// answerText.anchor.set(0.5,0.5);
		answerText.position.set(answerBg.width/2 - answerText.width/2,answerBg.height/2 - answerText.height/2);
		answerBg.addChild(answerText);
		answerBg.scale.set(0.55,0.55);
		answerBg.position.set(this.rect.getLocalBounds().width / 2 - answerBg.width/2, 470);


		this.rect.addChild(answerBg);
		this.container.addChild(this.blackBg);
		this.container.addChild(this.rect);


		this.start_btn.on("pointerup", () => {
			this.onStartCb&&this.onStartCb();
		});
	}
}