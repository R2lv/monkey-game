import {Container, Point, Graphics, Sprite, Text} from "pixi.js";
import Generator from "../lib/Generator";

export default class StartScene {
	constructor(app) {
		this.app = app;
		this.scale = new Point(0.7,0.7);
		this.container = new Container();
		this.init();
	}

	getContainer() {
		return this.container;
	}

	init() {
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
			.drawRoundedRect(0,0,900,600,100)
			.endFill();
		let rectTexture = this.app.renderer.generateTexture(rect);
		this.rect = new Sprite(rectTexture);
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

		this.monkeyCard.scale = this.scale;
		this.monkeyCard.position.set(this.rect.width/2-this.monkeyCard.width/2, -110);

		this.monkeyCard.addChild(monkeyCardText);
		this.rect.addChild(this.monkeyCard);

		// endregion Title


		this.start_btn = Generator.generate(this.app.loader.resources["start_btn"].texture, "Start", {
			fontFamily: 'Alata',
			fontWeight: 'bold',
			fontSize: 120,
			fill: 0x42210B
		});
		this.start_btn.scale = this.scale;
		this.start_btn.position.set(this.rect.width / 2 - this.start_btn.width / 2, this.rect.height - 50);
		this.rect.addChild(this.start_btn);


		let grapeBox = Generator.generateOptionBox(this.app, this.app.loader.resources["grape"].texture);
		grapeBox.scale.set(0.5,0.5);
		grapeBox.position.set(70,150);

		let bananaBox = Generator.generateOptionBox(this.app, this.app.loader.resources["banana"].texture);
		bananaBox.scale.set(0.5,0.5);
		bananaBox.position.set(this.rect.width / 2 - bananaBox.width/2,150);

		let appleBox = Generator.generateOptionBox(this.app, this.app.loader.resources["apple"].texture);
		appleBox.scale.set(0.5,0.5);
		appleBox.position.set(this.rect.width - bananaBox.width - 70,150);

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
		answerBg.scale.set(0.42,0.42);
		answerBg.position.set(this.rect.width / 2 - answerBg.width/2, 400);


		this.rect.addChild(answerBg);
		this.container.addChild(this.blackBg);
		this.container.addChild(this.rect);
	}
}