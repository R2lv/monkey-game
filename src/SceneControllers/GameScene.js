import {Container, Point, Sprite, Text, Texture, Graphics} from "pixi.js";
import Generator from "../lib/Generator";
import Animator from "../lib/Animator";

export default class GameScene {
	constructor(app) {
		this.app = app;


		// this.scale = this.app.dimensions.isPortrait ? new Point(0.6,0.6) : new Point(0.5,0.5);
		this.scale = new Point(0.6,0.6);
		if(!this.app.dimensions.isPortrait) {
			this.scale.x/=this.app.dimensions.width/this.app.dimensions.height;
			this.scale.y/=this.app.dimensions.width/this.app.dimensions.height;
		}

		this.container = new Container();
		this.init();
	}

	getContainer() {
		return this.container;
	}

	init() {
		this.resetWrongAnswers();

		this.ground = new Sprite(this.app.loader.resources["ground"].texture);
		this.ground.position.set(this.app.dimensions.width/2, this.app.dimensions.height-50);
		this.ground.anchor.set(0.5,1);
		this.ground.scale = this.scale;
		this.ground.width = this.app.dimensions.width;

		this.left_grass = new Sprite(this.app.loader.resources["grass_left"].texture);
		this.left_grass.position.set(-200, this.app.dimensions.height+250);
		this.left_grass.anchor.set(0,1);
		this.left_grass.scale = this.scale;
		this.left_grass.rotation = -0.02;

		this.right_grass = new Sprite(this.app.loader.resources["grass_right"].texture);
		this.right_grass.position.set(this.app.dimensions.width+250, this.app.dimensions.height+250);
		this.right_grass.anchor.set(1,1);
		this.right_grass.scale = this.scale;
		this.right_grass.rotation = 0.02;

		this.ground_monkey = new Sprite(this.app.loader.resources["ground_monkey"].texture);
		this.ground_monkey.anchor.set(0.5,1);
		this.ground_monkey.scale = this.scale;
		this.ground_monkey.position.set(this.app.dimensions.width/2, this.app.dimensions.height-240);

		this.sky = new Sprite(this.app.loader.resources["sky"].texture);
		this.sky.position.set(this.app.dimensions.width/2, 0);
		this.sky.scale = this.scale;
		this.sky.anchor.set(0.5,0);
		this.sky.width = this.app.dimensions.width;

		this.back_grass_left = new Sprite(this.app.loader.resources["back_grass_left"].texture);
		this.back_grass_left.position.set(-200, this.app.dimensions.height-20);
		this.back_grass_left.anchor.set(0,1);
		this.back_grass_left.scale = this.scale;
		this.back_grass_left.rotation = 0.05;

		this.back_grass_middle = new Sprite(this.app.loader.resources["back_grass_middle"].texture);
		this.back_grass_middle.position.set(this.app.dimensions.width/2, this.app.dimensions.height-400);
		this.back_grass_middle.anchor.set(0.5,1);
		this.back_grass_middle.scale = this.scale;

		this.back_grass_right = new Sprite(this.app.loader.resources["back_grass_right"].texture);
		this.back_grass_right.position.set(this.app.dimensions.width+240, this.app.dimensions.height-50);
		this.back_grass_right.anchor.set(1,1);
		this.back_grass_right.scale = this.scale;
		this.back_grass_right.rotation = -0.05;

		this.back_grass_left2 = new Sprite(this.app.loader.resources["back_grass_left2"].texture);
		this.back_grass_left2.position.set(-200, this.app.dimensions.height-650);
		this.back_grass_left2.anchor.set(0,1);
		this.back_grass_left2.scale = this.scale;
		this.back_grass_left2.rotation = 0.1;

		this.back_grass_right2 = new Sprite(this.app.loader.resources["back_grass_right2"].texture);
		this.back_grass_right2.position.set(this.app.dimensions.width + 300, this.app.dimensions.height-650);
		this.back_grass_right2.anchor.set(1,1);
		this.back_grass_right2.scale = this.scale;

		this.back_grass_3 = new Sprite(this.app.loader.resources["back_grass_3"].texture);
		this.back_grass_3.position.set(-20, this.app.dimensions.height-170);
		this.back_grass_3.anchor.set(0,1);
		this.back_grass_3.scale = this.scale;

		this.back_grass_dark = new Sprite(this.app.loader.resources["back_grass_dark"].texture);
		this.back_grass_dark.position.set(this.app.dimensions.width + 100, this.app.dimensions.height-20);
		this.back_grass_dark.anchor.set(1,1);
		this.back_grass_dark.scale = this.scale;

		this.bg_gradient = new Sprite(this.app.loader.resources["bg_gradient"].texture);
		this.bg_gradient.position.set(this.app.dimensions.width / 2, -400);
		this.bg_gradient.anchor.set(0.5,0);
		this.bg_gradient.scale.set(0.8,0.8);
		this.bg_gradient.width = this.app.dimensions.width;

		this.tree1 = new Sprite(this.app.loader.resources["tree1"].texture);
		this.tree1.scale = this.scale;
		this.tree1.position.set(this.app.dimensions.width/2 - this.tree1.width/2 - 200, this.app.dimensions.height - this.tree1.height - 170);

		this.tree2 = new Sprite(this.app.loader.resources["tree2"].texture);
		this.tree2.scale = this.scale;
		this.tree2.position.set(this.app.dimensions.width/2 - this.tree2.width/2, this.app.dimensions.height-this.tree2.height-170);

		this.tree3 = new Sprite(this.app.loader.resources["tree3"].texture);
		this.tree3.scale = this.scale;
		this.tree3.position.set(this.app.dimensions.width-this.tree3.width+20, this.app.dimensions.height-this.tree3.height-320);

		this.quit_btn = Generator.generate(this.app.loader.resources["quit"].texture, "Quit", {
			fontSize: 40,
			align: 'center',
			fontFamily: "Alata",
			fill: 0xEA5514,
			letterSpacing: 0,
			stroke: 0xFFFFFF,
			strokeThickness: 7
		});
		this.quit_btn.scale = this.scale;
		this.quit_btn.position.set(this.app.dimensions.width - this.quit_btn.width -30, 20);

		this.score_text = Generator.generate(this.app.loader.resources["score"].texture, "0", {
			fontSize: 60,
			fontFamily: "Alata",
		});
		this.score_text._txt.position.set(this.score_text.width-30, this.score_text.height/2);
		this.score_text._txt.anchor.set(1,0.5);
		this.score_text.scale = this.scale;
		this.score_text.position.set(30, 20);

		let score_title = new Text("Score", {
			fontSize: 60,
			fontFamily: "Alata",
			fill: 0x075E9B,
			stroke: 0xFFFFFF,
			strokeThickness: 7
		});
		score_title.position.set(20,-40);
		this.score_text.addChild(score_title);

		this.answer_slot1 = new Sprite(Texture.EMPTY);
		this.answer_slot1.anchor.set(0.5,0.5);
		this.answer_slot1.position.set(this.tree1.getLocalBounds().width/2,370);
		this.answer_slot1.scale.set(0,0);

		this.answer_slot1.monkey_fail = new Sprite(this.app.loader.resources['monkey_fail'].texture);
		this.answer_slot1.monkey_fail.anchor.set(0,1);
		this.answer_slot1.monkey_fail.scale.set(0,0);
		this.answer_slot1.monkey_fail.position.set(this.answer_slot1.position.x+100,this.answer_slot1.position.y-100);

		this.tree1.addChild(this.answer_slot1.monkey_fail);
		this.tree1.addChild(this.answer_slot1);



		this.answer_slot2 = new Sprite(Texture.EMPTY);
		this.answer_slot2.anchor.set(0.5,0.5);
		this.answer_slot2.position.set(this.tree2.getLocalBounds().width/2,450);
		this.answer_slot2.scale.set(0,0);

		this.answer_slot2.monkey_fail = new Sprite(this.app.loader.resources['monkey_fail'].texture);
		this.answer_slot2.monkey_fail.anchor.set(0,1);
		this.answer_slot2.monkey_fail.scale.set(0,0);
		this.answer_slot2.monkey_fail.position.set(this.answer_slot2.position.x+100,this.answer_slot2.position.y-100);

		this.tree2.addChild(this.answer_slot2.monkey_fail);
		this.tree2.addChild(this.answer_slot2);


		this.answer_slot3 = new Sprite(Texture.WHITE);
		this.answer_slot3.anchor.set(0.5,0.5);
		this.answer_slot3.position.set(this.tree3.getLocalBounds().width/2+50,550);
		this.answer_slot3.scale.set(0,0);

		this.answer_slot3.monkey_fail = new Sprite(this.app.loader.resources['monkey_fail'].texture);
		this.answer_slot3.monkey_fail.anchor.set(0,1);
		this.answer_slot3.monkey_fail.scale.set(0,0);
		this.answer_slot3.monkey_fail.position.set(this.answer_slot3.position.x+100,this.answer_slot3.position.y-100);

		this.tree3.addChild(this.answer_slot3.monkey_fail);
		this.tree3.addChild(this.answer_slot3);



		this.question_container = new Sprite(Texture.EMPTY);
		this.question_container.width = this.app.dimensions.width;
		this.question_container.scale.set(1,1);
		this.question_container.y_show = 650;

		let question_monkey_left = new Sprite(this.app.loader.resources["question_monkey_left"].texture);
		let question_monkey_right = new Sprite(this.app.loader.resources["question_monkey_right"].texture);

		question_monkey_left.scale = this.scale;
		question_monkey_left.anchor.set(1,0);
		question_monkey_left.position.set(this.app.dimensions.width / 2 - 120,50);
		question_monkey_left.rotation = 0.15;

		question_monkey_right.scale = this.scale;
		question_monkey_right.anchor.set(0,0);
		question_monkey_right.position.set(this.app.dimensions.width / 2 + 120, 50);
		question_monkey_right.rotation = -0.15;

		this.question_monkey_left = question_monkey_left;
		this.question_monkey_right = question_monkey_right;

		this.question_bg = new Sprite(this.app.loader.resources["question_bg"].texture);
		this.question_bg.scale = this.scale;
		this.question_bg.anchor.set(0.5,1);
		this.question_bg.position.set(this.app.dimensions.width/2, 70);

		this.question_container.addChild(question_monkey_left);
		this.question_container.addChild(question_monkey_right);
		this.question_container.addChild(this.question_bg);

		this.question_container.position.set(0, this.app.dimensions.height - this.question_container.height + 100);

		this.monkey_hand_container = new Container();

		this.monkey_hand = new Sprite(this.app.loader.resources["monkey_hand"].texture);
		this.monkey_hand.scale = this.scale;

		this.stone = new Sprite(this.app.loader.resources["stone"].texture);
		this.stone.scale = this.scale;
		this.stone.position.set(this.app.dimensions.width,this.app.dimensions.height);
		this.stone.zIndex = 150;

		this.hand_stone = new Sprite(this.app.loader.resources["stone"].texture);
		this.hand_stone.scale = this.scale;
		// this.hand_stone.position.set(-350, -this.monkey_hand.getLocalBounds().height);

		this.monkey_hand_container.addChild(this.monkey_hand);

		this.monkey_hand_container.pivot.set(this.monkey_hand.width*0.7, this.monkey_hand.height);
		this.monkey_hand_container.rotation = -1.4;
		this.monkey_hand_container.position.set(this.answer_slot3.getGlobalPosition().x + 100, this.app.dimensions.height + 220);
		this.monkey_hand_container.addChild(this.hand_stone);

		this.monkey_hand_container.sortableChildren = true;
		this.hand_stone.zIndex = 1;
		this.monkey_hand.zIndex = 2;

		let score1 = new Sprite(this.app.loader.resources["monkey_face_normal"].texture);
		let score2 = new Sprite(this.app.loader.resources["monkey_face_normal"].texture);
		let score3 = new Sprite(this.app.loader.resources["monkey_face_normal"].texture);

		score1.scale = score2.scale = score3.scale = this.scale;
		score1.alpha = score2.alpha = score3.alpha = 0.4;
		score1.anchor = score2.anchor = score3.anchor = new Point(0.5,0.5);
		score1.position.set(90,180);

		score2.position.set(score1.position.x + score1.getBounds().width,score1.position.y);
		score3.position.set(score2.position.x + score2.getBounds().width,score1.position.y);

		this.scores = [score1,score2,score3];

		this.timer = new Sprite(this.app.loader.resources["time"].texture);
		this.timer.scale = this.scale;
		this.timer.position.set(this.app.dimensions.width / 2 - this.timer.width/2, this.app.dimensions.height - 110);

		let bar = new Graphics()
			.beginFill(0x6A3906)
			.drawRect(0,0, this.timer.getBounds().width / this.timer.scale.x - 20, 65)
			.endFill();
		let barTexture = this.app.renderer.generateTexture(bar);
		this.timer_bar = new Sprite(barTexture);
		this.timer_bar.scale.x = 0;
		this.timer_bar.position.set(11,5);

		let time_text = new Text("Time", {
			fill: 0xF5A717,
			stroke: 0x8B5F26,
			strokeThickness: 10,
			fontSize: 70
		});

		time_text.anchor.set(0, 0.5);

		time_text.position.set(-time_text.width/2, this.timer.getLocalBounds().height / 2 - 5);


		this.timer.addChild(this.timer_bar);
		this.timer.addChild(time_text);

		this.fixLayout();

		this.container.addChild(this.sky);
		this.container.addChild(this.back_grass_dark);
		this.container.addChild(this.back_grass_left2);
		this.container.addChild(this.back_grass_3);
		this.container.addChild(this.back_grass_right2);
		this.container.addChild(this.bg_gradient);
		this.container.addChild(this.tree2);
		this.container.addChild(this.tree1);
		this.container.addChild(this.tree3);
		this.container.addChild(this.back_grass_middle);
		this.container.addChild(this.back_grass_left);
		this.container.addChild(this.back_grass_right);
		this.container.addChild(this.ground);
		this.container.addChild(this.ground_monkey);
		this.container.addChild(this.question_container);
		this.container.addChild(this.left_grass);
		this.container.addChild(this.right_grass);
		this.container.addChild(score1);
		this.container.addChild(score2);
		this.container.addChild(score3);

		this.container.addChild(this.quit_btn);
		this.container.addChild(this.score_text);
		this.container.addChild(this.timer);
		this.container.addChild(this.monkey_hand_container);
		this.container.addChild(this.stone);

		this._setListeners();

	}

	fixLayout() {
		if(!this.app.dimensions.isPortrait) {
			this.ground.position.set(this.app.dimensions.width/2, this.app.dimensions.height);

			this.question_monkey_left.x -= 50;
			this.question_monkey_right.x += 50;
			this.question_bg.texture = this.app.loader.resources["question_bg_wide"].texture;

			this.container.sortableChildren = true;
			this.question_container.y_show = 330;

			this.left_grass.zIndex = 90;
			this.question_container.zIndex = 100;
			this.monkey_hand_container.zIndex = 101;


			this.ground_monkey.anchor.set(1,1);
			this.ground_monkey.position.set(this.app.dimensions.width - 50, this.app.dimensions.height-100);

			this.back_grass_middle.visible = false;

			this.tree1.position.set(this.app.dimensions.width/2 - this.tree1.width/2 - 220, this.app.dimensions.height - this.tree1.height);
			this.tree2.position.set(this.app.dimensions.width/2 - this.tree2.width/2, this.app.dimensions.height-this.tree2.height + 130);
			this.tree3.position.set(this.app.dimensions.width/2-this.tree3.width/2+220, this.app.dimensions.height-this.tree3.height - 80);

			this.back_grass_left2.visible = false;
			this.back_grass_right2.visible = false;
			this.back_grass_right.position.x += 100;
			this.back_grass_right.position.y += 100;

			this.scores[0].position.set(60,110);

			this.scores[1].position.set(this.scores[0].position.x + this.scores[0].getBounds().width,this.scores[0].position.y);
			this.scores[2].position.set(this.scores[1].position.x + this.scores[1].getBounds().width,this.scores[0].position.y);

		}
	}

	resetWrongAnswers() {
		this.answers_wrong = 0;
	}

	_setListeners() {
		this.answer_slot1.interactive = true;
		this.answer_slot1.buttonMode = true;
		this.answer_slot2.interactive = true;
		this.answer_slot2.buttonMode = true;
		this.answer_slot3.interactive = true;
		this.answer_slot3.buttonMode = true;

		this.answer_slot1.on("pointerup", this._answered.bind(this,0));
		this.answer_slot2.on("pointerup", this._answered.bind(this,1));
		this.answer_slot3.on("pointerup", this._answered.bind(this,2));
	}

	_answered(answerId) {
		let q = this.questions[this.activeQuestionId];
		let answerSlot = this[`answer_slot${answerId+1}`];

		this.animateHand(answerSlot,() => {
			if(q.images[answerId].correct) {
				this._correctAnswer(answerSlot);
			} else {
				this._wrongAnswer(answerSlot);
			}
		});
	}

	_correctAnswer(answerSlot) {
		if(this.answers_wrong >= 2) return;
		this.changeScore(this.activeQuestionId, true);
		this.app.loader.resources["sound_correct"].sound.play();
		Generator.addTick1(answerSlot.getChildAt(0));
	}

	async _wrongAnswer(answerSlot) {
		this.app.loader.resources["sound_incorrect"].sound.play();
		// Generator.addCross1(answerSlot.getChildAt(0));
		++this.answers_wrong;

		let optionBox = answerSlot.getChildAt(0);
		let animator = new Animator(optionBox.childObjects.image);
		let animator2 = new Animator(optionBox.childObjects.cross);
		let animator3 = new Animator(answerSlot.monkey_fail);

		await animator3.animate({
			scale: this.scale
		},200);

		await animator.animate({
			alpha: 0
		}, 300);
		await animator2.animate({
			scale: {
				x: 1,
				y: 1
			}
		}, 300);

		setTimeout(() => {
			animator3.animate({
				scale: {
					x:0,
					y:0
				}
			},200);
		},500);

		if(this.answers_wrong >= 2) {
			this.changeScore(this.activeQuestionId, false);
		}
	}

	async animateHand(answerSlot, cb) {
		let handAnimator = new Animator(this.monkey_hand_container);
		let stoneAnimator = new Animator(this.stone);

		let rotation = this.monkey_hand_container.rotation * (180/Math.PI);

		this.hand_stone.visible = true;

		await handAnimator.animate({
			rotation: -20
		},100);

		this.hand_stone.visible = false;

		this.stone.position.set(this.hand_stone.getGlobalPosition().x, this.hand_stone.getGlobalPosition().y);

		let answerSlotPos = answerSlot.getGlobalPosition();
		let stonePos = this.stone.getGlobalPosition();

		let stonePos1 = {
			x: answerSlotPos.x + (stonePos.x - answerSlotPos.x)/5,
			y: answerSlotPos.y - 200
		};

		let stonePos2 = {
			x: answerSlotPos.x - this.stone.width/8,
			y: answerSlotPos.y - this.stone.height/8
		};

		let stoneScale = {
			x: this.stone.scale.x,
			y: this.stone.scale.y
		};

		(async () => {
			this.stone.visible = true;
			await stoneAnimator.animate({
				position: stonePos1,
				scale: {
					x: this.stone.scale.x * 0.5,
					y: this.stone.scale.y * 0.5
				}
			},300);
			// return;


			this.app.loader.resources["sound_throw"].sound.play();

			await stoneAnimator.animate({
				position: stonePos2,
				scale: {
					x: this.stone.scale.x * 0.5,
					y: this.stone.scale.y * 0.5
				}
			},300);

			this.stone.visible = false;
			this.stone.scale.set(stoneScale.x, stoneScale.y);
		})();

		await handAnimator.animate({
			rotation: 10
		},100);

		await handAnimator.animate({
			rotation
		},400);

		setTimeout(cb,400);
	}

	async changeScore(scoreId, isCorrect) {

		this.timeAnimator.stop();
		this.timeout&&clearTimeout(this.timeout);
		let score = this.scores[scoreId];

		let animator = new Animator(score);

		score.texture = isCorrect ? this.app.loader.resources["monkey_face_tick"].texture : this.app.loader.resources["monkey_face_cross"].texture;

		score.zIndex = 1000;

		let scale = {
			x: score.scale.x,
			y: score.scale.y
		};
		await animator.animate({
			scale: {
				x: scale.x * 2.5,
				y: scale.y * 2.5
			},
			alpha: 1
		},400);
		await animator.animate({
			scale
		},400);

		this.nextQuestion();
	}

	start() {
		this.timeAnimator = new Animator(this.timer_bar);

		this.displayQuestion();
	}

	end() {
		this.app.loader.resources["sound_completed"].sound.play();
	}

	async nextQuestion() {
		await this.resetQuestion();

		this.question_bg.removeChildren();
		this.answer_slot1.removeChildren();
		this.answer_slot2.removeChildren();
		this.answer_slot3.removeChildren();

		if(this.questions.length > this.activeQuestionId+1) {
			this.activateQuestion(this.activeQuestionId + 1);
			await this.displayQuestion();
		} else {
			this.end();
		}
	}

	activateQuestion(qId) {
		this.activeQuestionId = qId;
		this.audio = this.app.loader.resources[this.questions[qId].audio].sound;

		let question = this.questions[qId];

		let option_1 = Generator.generateOptionBox(this.app, Texture.from(question.images[0].url));
		option_1.position.set(-option_1.width/2-0.5,-option_1.height/2-0.5);
		this.answer_slot1.addChild(option_1);

		let option_2 = Generator.generateOptionBox(this.app, Texture.from(question.images[1].url));
		option_2.position.set(-option_2.width/2-0.5,-option_2.height/2-0.5);
		this.answer_slot2.addChild(option_2);

		let option_3 = Generator.generateOptionBox(this.app, Texture.from(question.images[2].url));
		option_3.position.set(-option_3.width/2-0.5,-option_3.height/2-0.5);
		this.answer_slot3.addChild(option_3);

		let article = /^([aeiouy])/i.test(question.word) ? "an" : "a";
		let text = new Text(`This is ${article} ${question.word}.`, {
			fontFamily: "Risque",
			fontSize: 110
		});
		text.position.set(-text.width/2,-this.question_bg.getLocalBounds().height + text.height/2);

		this.question_bg.addChild(text);

	}

	async displayQuestion(cb) {
		this.timer_bar.scale.set(0,1);

		let animation1 = new Animator(this.answer_slot1);
		let animation2 = new Animator(this.answer_slot2);
		let animation3 = new Animator(this.answer_slot3);

		let question_anim = new Animator(this.question_container);

		await question_anim.animate({
			position: {
				x: this.question_container.position.x,
				y: this.question_container.position.y - (this.question_container.y_show)
			}
		}, 300);
		await animation1.animate({
			scale: {
				x: 0.9,
				y: 0.9
			},
			rotation: 360
		},500);
		await animation2.animate({
			scale: {
				x: 0.9,
				y: 0.9
			},
			rotation: 360
		},500);
		this.audio.play();
		await animation3.animate({
			scale: {
				x: 0.9,
				y: 0.9
			},
			rotation: 360
		},500);

		this.timeAnimator.animate({
			scale: {
				x: 1
			}
		}, 60000).then(() => {
			this.changeScore(this.activeQuestionId, false);
		});

		this.timeout = setTimeout(() => {
			this.app.loader.resources["timeout"].sound.play();
		},55000);

		cb&&cb();
	}

	async resetQuestion(cb) {
		this.resetWrongAnswers();

		let animation1 = new Animator(this.answer_slot1);
		let animation2 = new Animator(this.answer_slot2);
		let animation3 = new Animator(this.answer_slot3);

		let question_anim = new Animator(this.question_container);

		await question_anim.animate({
			position: {
				y: this.question_container.position.y + this.question_container.y_show
			}
		}, 300);
		await animation1.animate({
			scale: {
				x: 0,
				y: 0
			},
			rotation: -360
		},500);
		await animation2.animate({
			scale: {
				x: 0,
				y: 0
			},
			rotation: -360
		},500);
		await animation3.animate({
			scale: {
				x: 0,
				y: 0
			},
			rotation: -360
		},500);


		cb&&cb();
	}

	setQuestions(data = []) {
		this.questions = data;
		this.activateQuestion(0);
	}
};