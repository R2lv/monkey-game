import {Container, Point, Sprite, Text, Texture, Graphics} from "pixi.js";
import Generator from "../lib/Generator";
import Animator from "../lib/Animator";

export default class GameScene {
	constructor(app) {
		this.app = app;


		this.started = false;
		// this.scale = this.app.dimensions.isPortrait ? new Point(0.6,0.6) : new Point(0.5,0.5);
		this._scale = new Point(0.6,0.6);
		this.fixScale();

		this.container = new Container();
		this.init();
	}

	onRestart(cb) {
		this.onRestartCb = cb;
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
		this.wrong_slots = [];
		this.final_data = [];
		this.resetWrongAnswers();

		this.setLayout();
		this.fixLayout();
		this._setListeners();

		this.timeAnimator = new Animator(this.timer_bar);

		this.idleAnimation();

		let t = 0;
		window.addEventListener("resize", () => {
			clearTimeout(t);

			t = setTimeout(() => {
				this.container.removeChildren();
				this.fixScale();
				this.setLayout();
				this.fixLayout();

				this.activateQuestion(this.activeQuestionId);
				this.started&&this.displayQuestion(undefined,true);
				this._setListeners();

				this.timeAnimator = new Animator(this.timer_bar);

				this.idleAnimation();

				this.loadSavedProperties();
			},500);
		});
	}

	loadSavedProperties() {
		for(let i in this.final_data) {
			if(!this.final_data.hasOwnProperty(i)) continue;
			let data = this.final_data[i];

			let isWrong = data.miss_count > 1 || data.f_timeout;

			this.scores[i].texture = isWrong ? this.app.loader.resources["monkey_face_cross"].texture : this.app.loader.resources["monkey_face_tick"].texture;
			this.scores[i].alpha = 1;
		}

		for(let i = 0; i < this.wrong_slots.length; i++) {
			console.log("Wrong slot ", i);
			let slot_id = this.wrong_slots[i];
			let slot = this['answer_slot'+(slot_id+1)];
			this._wrongAnswer(slot,slot_id,true);
		}

		if(this.answers_wrong > 1) {
			this.showCorrectAnswer(false);
		}

		this.updateScore();
	}

	setLayout() {
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
		this.back_grass_middle.position.set(this.app.dimensions.width/2, this.app.dimensions.height-300);
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

		this.behind_monkey1 = new Sprite(this.app.loader.resources["behind_monkey1"].texture);
		this.behind_monkey2 = new Sprite(this.app.loader.resources["behind_monkey2"].texture);
		this.behind_monkey3 = new Sprite(this.app.loader.resources["behind_monkey3"].texture);

		this.behind_monkey1.scale = this.behind_monkey2.scale = this.behind_monkey3.scale = this.scale;

		this.behind_monkey1.position.set(this.tree1.position.x+this.behind_monkey1.width/2 - 100, this.tree1.position.y+80);
		this.behind_monkey2.position.set(this.tree2.position.x+this.behind_monkey2.width/2+250, this.tree2.position.y+100);
		this.behind_monkey3.position.set(this.tree3.position.x+this.behind_monkey3.width/2+150, this.tree3.position.y+100);

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
		let score4 = new Sprite(this.app.loader.resources["monkey_face_normal"].texture);
		let score5 = new Sprite(this.app.loader.resources["monkey_face_normal"].texture);

		score1.scale = score2.scale = score3.scale = score4.scale = score5.scale = this.scale;
		score1.alpha = score2.alpha = score3.alpha = score4.alpha = score5.alpha = 0.4;
		score1.anchor = score2.anchor = score3.anchor = score4.anchor = score5.anchor = new Point(0.5,0.5);
		score1.position.set(90,180);

		score2.position.set(score1.position.x + score1.getBounds().width,score1.position.y);
		score3.position.set(score2.position.x + score2.getBounds().width,score1.position.y);
		score4.position.set(score3.position.x + score3.getBounds().width,score1.position.y);
		score5.position.set(score4.position.x + score4.getBounds().width,score1.position.y);

		this.scores = [score1,score2,score3,score4,score5];

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


		this.wrong_answer_container = new Container();
		this.wrong_answer_inner_container = new Container();
		let blackBgGraphic = new Graphics()
			.beginFill(0x000000)
			.drawRect(0,0,this.app.dimensions.width,this.app.dimensions.height)
			.endFill();
		let blackBgTexture = this.app.renderer.generateTexture(blackBgGraphic);
		let blackBg = new Sprite(blackBgTexture);
		blackBg.position.set(0,0);
		blackBg.alpha = 0.8;

		this.wrong_answer_container.addChild(blackBg);
		this.wrong_answer_container.visible = false;
		this.wrong_answer_container.zIndex = 9999;


		let emptyBgTexture = this.app.renderer.generateTexture(blackBgGraphic);
		let emptyBg = new Sprite(emptyBgTexture);
		emptyBg.position.set(0,0);
		emptyBg.alpha = 0;
		this.wrong_answer_inner_container.addChild(emptyBg);

		this.wrong_answer_container.addChild(this.wrong_answer_inner_container);

		this.wrong_answer_inner_container.pivot.set(this.wrong_answer_inner_container.width/2,this.wrong_answer_inner_container.height/2);
		this.wrong_answer_inner_container.position.set(this.wrong_answer_inner_container.width/2,this.wrong_answer_inner_container.height/2);

		let correct_answer_bg = new Sprite(this.app.loader.resources['correct_answer_bg'].texture);
		correct_answer_bg.anchor.set(0.47,0.5);
		correct_answer_bg.position.set(this.wrong_answer_inner_container.width/2,this.wrong_answer_inner_container.height/2 - correct_answer_bg.height*0.15);
		correct_answer_bg.scale = this.scale;
		this.wrong_answer_inner_container.addChild(correct_answer_bg);



		this.answer_bg = new Sprite(this.app.loader.resources["question_bg"].texture);
		this.answer_bg.anchor.set(0.5,1);
		this.answer_bg.position.set(0, correct_answer_bg.height);
		let text = new Text(`This is an apple.`, {
			fontFamily: "Risque",
			fontSize: 110
		});
		text.position.set(-text.width/2,-this.answer_bg.getLocalBounds().height + text.height/2);
		this.answer_bg.addChild(text);
		this.answer_bg._txt = text;
		this.btn_continue = Generator.generate(this.app.loader.resources["continue_button"].texture, "Continue", {
			fontFamily: 'Alata',
			fontWeight: 'bold',
			fontSize: 120,
			fill: 0x603813
		});
		this.btn_continue.position.set(-this.btn_continue.width/2,correct_answer_bg.height+20);
		this.wrong_answer_monkey_bottom = new Sprite(this.app.loader.resources["wrong_answer_monkey_bottom"].texture);
		this.wrong_answer_monkey_bottom.position.set(-correct_answer_bg.getLocalBounds().width/2-this.wrong_answer_monkey_bottom.width*0.3,correct_answer_bg.getLocalBounds().height/2-this.wrong_answer_monkey_bottom.height);

		this.wrong_answer_monkey_top = new Sprite(this.app.loader.resources["wrong_answer_monkey_top"].texture);


		this.correct_answer_image = new Sprite();
		this.correct_answer_image.anchor.set(0.5,0.2);

		const self = this;

		correct_answer_bg.addChild(this.correct_answer_image);
		correct_answer_bg.addChild(this.wrong_answer_monkey_bottom);
		correct_answer_bg.addChild(this.answer_bg);
		correct_answer_bg.addChild(this.btn_continue);

		this.correct_answer_bg = correct_answer_bg;

		this.correct_answer_image.set_texture = function(texture) {
			this.texture = texture;
			let scale = self.correct_answer_bg.height/(this.getLocalBounds().height);
			scale *= 0.6;

			this.scale.set(scale,scale);
		};







		this.result_container = new Container();
		this.result_inner_container = new Container();
		let blackBgGraphic1 = new Graphics()
			.beginFill(0x000000)
			.drawRect(0,0,this.app.dimensions.width,this.app.dimensions.height)
			.endFill();
		let blackBgTexture1 = this.app.renderer.generateTexture(blackBgGraphic1);
		let blackBg1 = new Sprite(blackBgTexture1);
		blackBg1.position.set(0,0);
		blackBg1.alpha = 0.8;

		this.result_container.addChild(blackBg1);
		this.result_container.visible = false;
		this.result_container.zIndex = 9999;


		let emptyBgTexture1 = this.app.renderer.generateTexture(blackBgGraphic1);
		let emptyBg1 = new Sprite(emptyBgTexture1);
		emptyBg1.position.set(0,0);
		emptyBg1.alpha = 0;
		this.result_inner_container.addChild(emptyBg1);

		this.result_container.addChild(this.result_inner_container);
		this.result_inner_container.pivot.set(this.result_inner_container.width/2,this.result_inner_container.height/2);
		this.result_inner_container.position.set(this.result_inner_container.width/2,this.result_inner_container.height/2);

		this.result_box = new Sprite(this.app.loader.resources['game_result_bg'].texture);
		this.result_box.scale = this.scale;
		this.result_box.anchor.set(0.52,0.5);
		this.result_box.position.set(this.result_inner_container.width/2,this.result_inner_container.height/2);
		this.result_inner_container.addChild(this.result_box);


		let resultBoxBounds = this.result_box.getLocalBounds();
		let game_score_label = new Text("Game score", {
			fontFamily: 'Alata',
			fontSize: 80,
			fill: 0x42210B
		});
		game_score_label.anchor.set(0.5,0.5);
		game_score_label.position.set(40,150);

		let game_score_txt = new Text("120", {
			fontFamily: 'Alata',
			fontSize: 100,
			fontWeight: 'bold',
			fill: 0x603813
		});
		game_score_txt.anchor.set(0.5,0.5);
		game_score_txt.position.set(game_score_label.position.x,game_score_label.position.y+game_score_txt.height-30);

		let time_score_label = new Text("Time score", {
			fontFamily: 'Alata',
			fontSize: 80,
			fill: 0x42210B
		});
		time_score_label.anchor.set(0.5,0.5);
		time_score_label.position.set(game_score_txt.position.x,game_score_txt.position.y+time_score_label.height-10);

		let time_score_txt = new Text("100", {
			fontFamily: 'Alata',
			fontSize: 100,
			fontWeight: 'bold',
			fill: 0x603813
		});
		time_score_txt.anchor.set(0.5,0.5);
		time_score_txt.position.set(time_score_label.position.x,time_score_label.position.y+time_score_txt.height-30);

		this.result_box.addChild(game_score_label);
		this.result_box.addChild(game_score_txt);
		this.result_box.addChild(time_score_label);
		this.result_box.addChild(time_score_txt);
		this.result_box.game_score_label = game_score_label;
		this.result_box.game_score_txt = game_score_txt;
		this.result_box.time_score_label = time_score_label;
		this.result_box.time_score_txt = time_score_txt;


		let stars_container = new Container();
		let stars = [
			new Sprite(this.app.loader.resources["score_star"].texture),
			new Sprite(this.app.loader.resources["score_star"].texture),
			new Sprite(this.app.loader.resources["score_star"].texture)
		];

		stars[0].anchor = stars[1].anchor = stars[2].anchor = new Point(0.5,0.5);

		stars[1].scale.set(0.9);
		stars[0].rotation = -0.4;
		stars[0].scale.set(0.7);
		stars[2].rotation = 0.4;
		stars[2].scale.set(0.7);

		stars[2].max_scale=0.7;
		stars[0].max_scale=0.7;
		stars[1].max_scale=0.9;

		stars[1].position.set(stars[0].position.x+stars[0].getBounds().width-60,stars[0].position.y-120);
		stars[2].position.set(stars[1].position.x+stars[1].getBounds().width-60,stars[0].position.y);

		stars_container.addChild(stars[0]);
		stars_container.addChild(stars[1]);
		stars_container.addChild(stars[2]);
		stars_container.pivot.set(stars_container.width/2,stars_container.height/2);
		stars_container.position.set(this.result_box.getLocalBounds().width/2-stars_container.getBounds().width/2-40,-120);
		this.result_box.addChild(stars_container);
		this.result_box.stars_container = stars_container;


		let your_score_label = new Text("Your score", {
			fontFamily: 'Alata',
			fontSize: 95,
			fill: 0x42210B
		});
		your_score_label.anchor.set(0.5,0.5);
		your_score_label.position.set(40,-170);

		let your_score_txt = new Text("210", {
			fontFamily: 'Alata',
			fontSize: 130,
			fontWeight: 'bold',
			fill: 0x603813
		});
		your_score_txt.anchor.set(0.5,0.5);
		your_score_txt.position.set(your_score_label.position.x,your_score_label.position.y+your_score_txt.height-30);

		this.result_box.addChild(your_score_label);
		this.result_box.addChild(your_score_txt);
		this.result_box.your_score_label = your_score_label;
		this.result_box.your_score_txt = your_score_txt;


		this.restart_btn = new Sprite(this.app.loader.resources['restart_btn'].texture);
		this.restart_btn.position.set(-resultBoxBounds.width/2 + 200,resultBoxBounds.height/2-this.restart_btn.height-130);


		this.continue_btn = Generator.generate(this.app.loader.resources["continue_button"].texture, "Continue", {
			fontFamily: 'Alata',
			fontWeight: 'bold',
			fontSize: 120,
			fill: 0x603813
		});
		this.continue_btn.position.set(resultBoxBounds.width/2 - this.continue_btn.width - 130,resultBoxBounds.height/2-this.continue_btn.height-130);

		this.result_box.addChild(this.restart_btn);
		this.result_box.addChild(this.continue_btn);


		this.container.addChild(this.sky);
		this.container.addChild(this.back_grass_dark);
		this.container.addChild(this.back_grass_left2);
		this.container.addChild(this.back_grass_3);
		this.container.addChild(this.back_grass_right2);
		this.container.addChild(this.bg_gradient);
		this.container.addChild(this.behind_monkey2);
		this.container.addChild(this.tree2);
		this.container.addChild(this.behind_monkey1);
		this.container.addChild(this.tree1);
		this.container.addChild(this.behind_monkey3);
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
		this.container.addChild(score4);
		this.container.addChild(score5);

		this.container.addChild(this.quit_btn);
		this.container.addChild(this.score_text);
		this.container.addChild(this.timer);
		this.container.addChild(this.monkey_hand_container);
		this.container.addChild(this.stone);
		this.container.addChild(this.wrong_answer_container);
		this.container.addChild(this.result_container);
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


			this.behind_monkey1.position.set(this.tree1.position.x+this.behind_monkey1.width/2 - 60, this.tree1.position.y+60);
			this.behind_monkey2.position.set(this.tree2.position.x+this.behind_monkey2.width/2+140, this.tree2.position.y+100);
			this.behind_monkey3.position.set(this.tree3.position.x+this.behind_monkey3.width/2+45, this.tree3.position.y+125);

			this.back_grass_left2.visible = false;
			this.back_grass_right2.visible = false;
			this.back_grass_right.position.x += 100;
			this.back_grass_right.position.y += 100;

			this.scores[0].position.set(60,110);

			this.scores[1].position.set(this.scores[0].position.x + this.scores[0].getBounds().width,this.scores[0].position.y);
			this.scores[2].position.set(this.scores[1].position.x + this.scores[1].getBounds().width,this.scores[0].position.y);
			this.scores[3].position.set(this.scores[2].position.x + this.scores[2].getBounds().width,this.scores[0].position.y);
			this.scores[4].position.set(this.scores[3].position.x + this.scores[3].getBounds().width,this.scores[0].position.y);

			this.correct_answer_bg.texture = this.app.loader.resources['correct_answer_bg_h'].texture;
			this.correct_answer_bg.position.set(this.wrong_answer_inner_container.width/2+this.correct_answer_bg.width*0.2,this.correct_answer_bg.height/2+20);


			this.answer_bg.texture = this.app.loader.resources["question_bg_wide"].texture;
			this.answer_bg.position.set(-this.correct_answer_bg.width*0.55, this.correct_answer_bg.height+this.answer_bg.height);


			this.btn_continue.scale.set(this.btn_continue.scale.x*0.7,this.btn_continue.scale.y*0.7);
			this.btn_continue.position.set(this.answer_bg.position.x+this.answer_bg.width/2-this.btn_continue.width+50,this.answer_bg.position.y-50);


			this.correct_answer_image.anchor.set(0.45,0.3);
			this.correct_answer_image.position.set(-this.correct_answer_bg.width*0.55,-120);
			this.wrong_answer_monkey_bottom.position.set(-this.correct_answer_bg.getLocalBounds().width/2-100,-100);


			const self = this;
			this.correct_answer_image.set_texture = function(texture) {
				this.texture = texture;
				let scale = self.correct_answer_bg.height/this.height;
				scale *= 1.4;
				this.scale.set(scale,scale);
			};

			this.result_box.texture = this.app.loader.resources["game_result_bg_h"].texture;

			this.result_box.position.set(this.result_inner_container.width/2-40,this.result_inner_container.height/2-30);

			this.result_box.stars_container.pivot.set(this.result_box.stars_container.width/2,this.result_box.stars_container.height/2);
			this.result_box.stars_container.position.set(this.result_box.getBounds().width/2,-70);

			this.result_box.your_score_label.position.set(-this.result_box.getBounds().width*0.3,50);
			this.result_box.your_score_txt.position.set(this.result_box.your_score_label.position.x,this.result_box.your_score_label.position.y+this.result_box.your_score_label.height);

			this.result_box.game_score_label.position.set(this.result_box.getBounds().width*0.6,-50);
			this.result_box.game_score_txt.position.set(this.result_box.game_score_label.position.x,this.result_box.game_score_label.position.y+this.result_box.game_score_txt.height);

			this.result_box.time_score_label.position.set(this.result_box.game_score_label.position.x,this.result_box.game_score_txt.position.y+this.result_box.time_score_label.height);
			this.result_box.time_score_txt.position.set(this.result_box.game_score_label.position.x,this.result_box.time_score_label.position.y+this.result_box.time_score_txt.height);

			this.restart_btn.position.set(-230,this.result_box.getBounds().height-30);
			this.continue_btn.position.set(100,this.result_box.getBounds().height-30);


		}
	}

	resetWrongAnswers() {
		this.answers_wrong = 0;
		this.wrong_slots.length = 0;
	}

	_setListeners() {
		this.answer_slot1.interactive = true;
		this.answer_slot1.buttonMode = true;
		this.answer_slot2.interactive = true;
		this.answer_slot2.buttonMode = true;
		this.answer_slot3.interactive = true;
		this.answer_slot3.buttonMode = true;

		this.restart_btn.interactive = true;
		this.restart_btn.buttonMode = true;

		this.answer_slot1.on("pointerup", this._answered.bind(this,0));
		this.answer_slot2.on("pointerup", this._answered.bind(this,1));
		this.answer_slot3.on("pointerup", this._answered.bind(this,2));
		this.btn_continue.on("pointerup", this.continueAfterFail.bind(this));
		this.restart_btn.on("pointerup", () => {
			this.onRestartCb&&this.onRestartCb();
		});
	}

	_answered(answerId) {
		let q = this.questions[this.activeQuestionId];
		let answerSlot = this[`answer_slot${answerId+1}`];

		if(this.hand_animating || this.answers_wrong > 1) return;

		this.hand_animating = true;

		this.animateHand(answerSlot,() => {
			if(q.images[answerId].correct) {
				this._correctAnswer(answerSlot);
			} else {
				this._wrongAnswer(answerSlot,answerId);
			}
			this.hand_animating = false;
		});
	}

	_correctAnswer(answerSlot) {
		if(this.answers_wrong >= 2) return;
		this.saveAnswer(true,false);
		this.changeScore(this.activeQuestionId, true);
		this.app.loader.resources["sound_correct"].sound.play();
		Generator.addTick1(answerSlot.getChildAt(0));
		this.showStars(answerSlot);
	}

	async _wrongAnswer(answerSlot,answerId, loadOnly=false) {
		if(!loadOnly) {
			this.app.loader.resources["sound_incorrect"].sound.play();
			++this.answers_wrong;
			this.wrong_slots.push(answerId);

			if(this.answers_wrong > 1) {
				this.saveAnswer(false,false);
			}
		}

		let optionBox = answerSlot.getChildAt(0);
		let animator = new Animator(optionBox.childObjects.image);
		let animator2 = new Animator(optionBox.childObjects.cross);
		let animator3 = new Animator(answerSlot.monkey_fail);

		await animator3.animate({
			scale: this.scale
		},loadOnly?0:200);

		await animator.animate({
			alpha: 0
		}, loadOnly?0:300);
		await animator2.animate({
			scale: {
				x: 1,
				y: 1
			}
		}, loadOnly?0:300);

		setTimeout(() => {
			animator3.animate({
				scale: {
					x:0,
					y:0
				}
			},loadOnly?0:200);
		},loadOnly?0:500);


		if(!loadOnly && this.answers_wrong >= 2) {
			this.showCorrectAnswer();
			this.changeScore(this.activeQuestionId, false);
		}
	}

	async continueAfterFail() {
		let animator = new Animator(this.wrong_answer_inner_container);

		await animator.animate({
			scale: {
				x:0,
				y:0
			}
		},300).then(() => {
			this.wrong_answer_container.visible = false;
			this.nextQuestion();
		});
	}

	async showCorrectAnswer(withSound=true) {
		let animator = new Animator(this.wrong_answer_inner_container);
		let word = this.questions[this.activeQuestionId].word;
		let correctAnswer = this.findCorrectAnswer();


		let article = /^([aeiouy])/i.test(word) ? "an" : "a";
		let text = this.answer_bg._txt;
		text.text = `this is ${article} ${word}`;
		text.position.set(-text.width/2,-this.answer_bg.getLocalBounds().height + text.height/2);
		this.correct_answer_image.set_texture(Texture.from(correctAnswer.url));

		this.wrong_answer_inner_container.scale.set(0,0);
		this.wrong_answer_container.visible = true;

		await animator.animate({
			scale: {
				x:1,
				y:1
			}
		},300);

		withSound&&this.audio.play();

	}

	findCorrectAnswer() {
		let question = this.questions[this.activeQuestionId];
		for(let image of  question.images) {
			if(image.correct) return image;
		}
	}

	saveAnswer(success,f_timeout) {
		let time = f_timeout ? 60 : Math.round((Date.now() - this.time_started)/1000);
		let question = this.questions[this.activeQuestionId];
		this.final_data[this.activeQuestionId] = {
			word: question.word,
			miss_count: this.answers_wrong,
			time,
			f_timeout
		};

		this.updateScore();
	}

	updateScore() {
		let scores = this.calculateScores();
		this.score_text._txt.text = (scores.time_score+scores.game_score)+"";
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
			},200);

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
		this.time_started = 0;

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

		if(isCorrect)
			this.nextQuestion();
	}

	start() {
		this.started = true;
		this.final_data.length = 0;
		this._run_idle = true;
		this.displayQuestion();
	}

	idleAnimation() {
		let animators = [];
		animators[0] = new Animator(this.behind_monkey1);
		animators[1] = new Animator(this.behind_monkey2);
		animators[2] = new Animator(this.behind_monkey3);
		let index = 0;

		let animations = [
			async () => {
				await animators[0].animate({
					position: {
						y: animators[0].sprite.position.y - 100
					}
				},300);
				await this.wait(2000);
				await animators[0].animate({
					position: {
						y: animators[0].sprite.position.y + 100
					}
				},300);
			},
			async () => {
				await animators[1].animate({
					position: {
						y: animators[1].sprite.position.y - 100
					}
				},300);
				await this.wait(2000);
				await animators[1].animate({
					position: {
						y: animators[1].sprite.position.y + 100
					}
				},300);
			},
			async () => {
				await animators[2].animate({
					position: {
						x: animators[2].sprite.position.x+100,
						y: animators[2].sprite.position.y - 100
					}
				},300);
				await this.wait(2000);
				await animators[2].animate({
					position: {
						x: animators[2].sprite.position.x-100,
						y: animators[2].sprite.position.y + 100
					}
				},300);
			}
		];

		setInterval(() => {
			let i = ++index%3;

			if(this._run_idle) {
				animations[i]();
			}
		},7000);
	}

	async wait(millis) {
		return new Promise((resolve) => {
			setTimeout(resolve,millis);
		});
	}

	async end() {

		this.postData();

		let container_animator = new Animator(this.result_inner_container);
		let animator_star1 = new Animator(this.result_box.stars_container.getChildAt(0));
		let animator_star2 = new Animator(this.result_box.stars_container.getChildAt(1));
		let animator_star3 = new Animator(this.result_box.stars_container.getChildAt(2));
		let animator_score_label = new Animator(this.result_box.your_score_label);
		let animator_score_txt = new Animator(this.result_box.your_score_txt);

		this.app.loader.resources["sound_completed"].sound.play();

		this.result_inner_container.scale = this.result_box.stars_container.getChildAt(0).scale = this.result_box.stars_container.getChildAt(1).scale
		= this.result_box.stars_container.getChildAt(2).scale = this.result_box.your_score_label.scale = this.result_box.your_score_txt.scale = new Point(0,0);

		this.result_container.visible = true;

		let scores = this.calculateScores();

		this.result_box.time_score_txt.text = Math.round(scores.time_score).toString();
		this.result_box.game_score_txt.text = Math.round(scores.game_score).toString();
		this.result_box.your_score_txt.text = Math.round(scores.time_score+scores.game_score).toString();

		let star_2_texture = this.app.loader.resources["score_star2"].texture;
		let star_texture = this.app.loader.resources["score_star"].texture;

		let correctPercentage = scores.game_score/scores.max_game_score;

		animator_star1.sprite.texture = correctPercentage > 0.3 ? star_texture : star_2_texture;
		animator_star2.sprite.texture = correctPercentage >= 0.6 ? star_texture : star_2_texture;
		animator_star3.sprite.texture = correctPercentage >= 0.8 ? star_texture : star_2_texture;

		await container_animator.animate({
			scale: {
				x:1,
				y:1
			}
		},300);

		await animator_star1.animate({
			scale: {
				x:animator_star1.sprite.max_scale,
				y:animator_star1.sprite.max_scale
			}
		},300);
		await animator_star2.animate({
			scale: {
				x:animator_star2.sprite.max_scale,
				y:animator_star2.sprite.max_scale
			}
		},300);
		await animator_star3.animate({
			scale: {
				x:animator_star3.sprite.max_scale,
				y:animator_star3.sprite.max_scale
			}
		},300);

		await this.wait(500);

		await animator_score_label.animate({
			scale: {
				x:1,
				y:1
			}
		},200);

		await this.wait(200);

		await animator_score_txt.animate({
			scale: {
				x:1,
				y:1
			}
		},200);

	}

	postData() {

	}

	calculateScores() {
		let time_score = 0, game_score = 0;
		for(let data of this.final_data) {
			let isCorrect = data.miss_count < 2 && !data.f_timeout;
			if(isCorrect) {
				game_score+=data.miss_count ? 500 : 1000;
				time_score+=Math.round(((60 -data.time)/5))*100;
			}
		}

		let max_game_score = 1000*this.final_data.length;

		return {time_score,game_score,max_game_score};
	}

	showStars(answerSlot) {
		let bounds = answerSlot.getBounds();
		let stars = [], animators = [];
		stars.push(new Sprite(this.app.loader.resources["star"].texture));
		stars.push(new Sprite(this.app.loader.resources["star2"].texture));
		stars.push(new Sprite(this.app.loader.resources["star"].texture));
		stars.push(new Sprite(this.app.loader.resources["star2"].texture));
		stars.push(new Sprite(this.app.loader.resources["star"].texture));
		stars.push(new Sprite(this.app.loader.resources["star2"].texture));
		stars.push(new Sprite(this.app.loader.resources["star2"].texture));
		stars.push(new Sprite(this.app.loader.resources["star2"].texture));

		stars[0].isBig = stars[2].isBig = stars[4].isBig = true;

		let positions = [
			[-bounds.width/2, -bounds.height/2],
			[bounds.width/2-5,bounds.height/2-10],
			[30,-50],
			[50,60],
			[-60,90],
			[130, -100],
			[-50,-30],
			[-120,30]
		];

		let rotations = [
			-2,
			2,
			-1,
			1,
			-2.5,
			2.5,
			2,
			-2
		];

		let scale = new Point(0,0);
		let scaleBig = new Point(0,0);
		let anchor = new Point(0.5,0.5);

		stars.forEach((star,i) => {
			answerSlot.addChild(star);

			star.scale = star.isBig ? scaleBig: scale;
			star.anchor = anchor;
			star.rotation = rotations[i];

			star.position.set(positions[i][0],positions[i][1]);
			animators.push(new Animator(star));

		});

		let newScale = new Point(2.2,2.2);
		let newScaleBig = new Point(1,1);
		animators.forEach(anim => {
			let scale = anim.sprite.isBig ? newScaleBig : newScale;
			let pos = {
				x: anim.sprite.position.x*1.5,
				y: anim.sprite.position.y*1.5
			};

			anim.animate({
				scale: {
					x: scale.x,
					y: scale.y,
				},
				position: pos,
				rotation: 0
			},300).then(it => {
				it.animate({
					scale: {
						x: 0,
						y: 0
					},
					position: {
						x: it.sprite.position.x*1.5,
						y: it.sprite.position.y*1.5
					},
					// alpha: 0
				},300);
			})
		});
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

		console.log(this.final_data);
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

	async displayQuestion(cb, fast=false) {
		this.timer_bar.scale.set(this.saved_scale || 0,1);

		let animation1 = new Animator(this.answer_slot1);
		let animation2 = new Animator(this.answer_slot2);
		let animation3 = new Animator(this.answer_slot3);

		let question_anim = new Animator(this.question_container);

		await question_anim.animate({
			position: {
				x: this.question_container.position.x,
				y: this.question_container.position.y - (this.question_container.y_show)
			}
		}, fast?0:300);
		await animation1.animate({
			scale: {
				x: 0.9,
				y: 0.9
			},
			rotation: 360
		},fast?0:500);
		await animation2.animate({
			scale: {
				x: 0.9,
				y: 0.9
			},
			rotation: 360
		},fast?0:500);
		this.audio.play();
		await animation3.animate({
			scale: {
				x: 0.9,
				y: 0.9
			},
			rotation: 360
		},fast?0:500);

		if(!this.time_started) this.time_started = Date.now();
		let time = 60000 - (Date.now() - this.time_started);
		this.timeAnimator.animate({
			scale: {
				x: 1
			}
		}, time).then(() => {
			console.log("Finished");
			this.saveAnswer(false, true);
			this.changeScore(this.activeQuestionId, false);
			this.nextQuestion();
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