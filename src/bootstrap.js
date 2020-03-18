import api from './lib/API';

export default class Bootstrap {
	constructor(app) {
		this.TOKEN = "2337.9beb2db40bd24394318ad5f240e5ede4559a915b";
		this.app = app;
		this.fetchData().then(res => {
			let data = this._replicate(res.data.data);
			this._loadAssets(data.files, () => {
				this._ready && this._ready(data.list);
			});
		});
	}

	async reload(cb) {
		let res = await this.fetchData();
		let data = this._replicate(res.data.data);
		this._loadAssets(data.files, () => {
			cb(data.list);
		}, true);
	}

	async fetchData() {
		return api.get("/wordGroups?encode=1&size=5&access-token="+this.TOKEN);
	}

	_loadAssets(files, cb, only=false) {

		if(!only) {
			this.app.loader.add("ground", "assets/BG_Ground.png")
				.add("grass_left", "assets/BG_Front_Grass1.png")
				.add("grass_right", "assets/BG_Front_Grass2.png")
				.add("ground_monkey", "assets/Monkey2.png")
				.add("back_grass_left", "assets/BG_Front_Grass2.png")
				.add("back_grass_right", "assets/BG_Front_Grass1.png")
				.add("back_grass_middle", "assets/bg_grass_middle.png")
				.add("back_grass_left2", "assets/bg_grass_2_left.png")
				.add("back_grass_right2", "assets/bg_grass_2_right.png")
				.add("back_grass_3", "assets/bg_grass_3.png")
				.add("back_grass_dark", "assets/bg_grass_dark.png")
				.add("bg_gradient", "assets/bg_gradient.png")
				.add("sky", "assets/BG_sky.png")
				.add("tree1", "assets/tree1.png")
				.add("tree2", "assets/tree2.png")
				.add("tree3", "assets/tree3.png")
				.add("quit", "assets/Quit.png")
				.add("score", "assets/Score.png")
				.add("monkey_board", "assets/Board1.png")
				.add("start_btn", "assets/StartBtn.png")
				.add("option_box", "assets/OptionBox.png")
				.add("grape", "assets/grape.png")
				.add("banana", "assets/banana.png")
				.add("apple", "assets/apple.png")
				.add("question_bg", "assets/Question.png")
				.add("question_bg_wide", "assets/Question_wide.png")
				.add("tick1", "assets/tick1.png")
				.add("cross1", "assets/cross1.png")
				.add("cross", "assets/Cross.png")
				.add("question_monkey_left", "assets/question_monkey_left.png")
				.add("question_monkey_right", "assets/question_monkey_right.png")
				.add("monkey_face_normal", "assets/Count1.png")
				.add("monkey_face_tick", "assets/Count2.png")
				.add("monkey_face_cross", "assets/Count3.png")
				.add("time", "assets/Time.png")
				.add("monkey_hand", "assets/MonkeyHand.png")
				.add("stone", "assets/Stone.png")
				.add("monkey_fail", "assets/Monkey9.png")
				.add("star", "assets/Star.png")
				.add("star2", "assets/Star2.png")
				.add("behind_monkey1", "assets/Monkey3.png")
				.add("behind_monkey2", "assets/Monkey5.png")
				.add("behind_monkey3", "assets/Monkey4.png")
				.add("correct_answer_bg", "assets/correct_answer_bg.png")
				.add("correct_answer_bg_h", "assets/correct_answer_bg_horizontal.png")
				.add("continue_button", "assets/continue_button.png")
				.add("wrong_answer_monkey_bottom", "assets/wrong_answer_monkey_bottom.png")
				.add("wrong_answer_monkey_top", "assets/wrong_answer_monkey_top.png")
				.add("game_result_bg", "assets/game_result_bg.png")
				.add("game_result_bg_h", "assets/game_result_bg_h.png")
				.add("score_star", "assets/ScoreStar.png")
				.add("score_star2", "assets/ScoreStar2.png")
				.add("happy_monkey", "assets/happy_monkey.png")
				.add("confused_monkey", "assets/confused_monkey.png")
				.add("restart_btn", "assets/restart_btn.png")
				.add("yes_btn", "assets/yes_btn.png")
				.add("no_btn", "assets/no_btn.png")
				.add("quit_bg", "assets/quit_bg.png");

			this.app.loader.add("sound_button", "assets/sounds/button.mp3")
				.add("sound_correct", "assets/sounds/correct.mp3")
				.add("sound_incorrect", "assets/sounds/try-again.mp3")
				.add("sound_throw", "assets/sounds/throw.mp3")
				.add("timeout", "assets/sounds/timeout.mp3")
				.add("sound_completed", "assets/sounds/game-completed.mp3")
				.add("monkey_celebration", "assets/sounds/monkey-celebration.wav")
				.add("correct_dialog", "assets/sounds/correct-dialog.wav");

		}

		for(let file of files) {
			if(this.app.loader.resources[file]) continue;
			this.app.loader.add(file);
		}

		this.app.loader.load(cb);
	}

	ready(cb) {
		this._ready = cb;
	}

	_replicate(data) {
		let urls = [];
		data = data.map(el => {
			el.images = this.shuffle([
				{
					correct: true,
					url: el.image
				},
				{
					correct: false,
					url: el.image_a1
				},
				{
					correct: false,
					url: el.image_a2
				}
			]);

			urls.push(el.image,el.image_a1,el.image_a2,el.audio);

			delete el.image;
			delete el.image_a1;
			delete el.image_a2;
			return el;
		});

		return {
			files: urls,
			list: data
		};
	}

	shuffle(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}
}