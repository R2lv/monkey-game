import * as PIXI from "pixi.js";
import {Application, Graphics, Container, Sprite, Point} from "pixi.js";
import GameScene from "./SceneControllers/GameScene";
import StartScene from "./SceneControllers/StartScene";
import Bootstrap from "./bootstrap";
import 'pixi-sound';
window.PIXI = PIXI;
require('pixi-layers');

const app = new Application({
	antialias: false,
	resizeTo: window
});

document.body.appendChild(app.view);

const bootstrap = new Bootstrap(app);

bootstrap.ready(setup);


const scenes = {};
function setup(data) {
	app.dimensions = app.screen;
	Object.defineProperty(app.dimensions, 'isPortrait', {
		get() {
			return this.width < this.height;
		}
	});
	scenes.gameScene = new GameScene(app);
	app.stage.addChild(scenes.gameScene.getContainer());
	scenes.gameScene.setQuestions(data);

	scenes.startScene = new StartScene(app);
	app.stage.addChild(scenes.startScene.getContainer());

	scenes.startScene.onStart(start);
	scenes.gameScene.onRestart(reload);
}

function reload() {
	bootstrap.reload(data => {
		app.stage.removeChild(scenes.gameScene.getContainer());

		scenes.gameScene = new GameScene(app);
		app.stage.addChild(scenes.gameScene.getContainer());
		scenes.gameScene.setQuestions(data);
		scenes.gameScene.onRestart(reload);
		start();

	});
}

function start() {
	app.loader.resources["sound_button"].sound.play();
	scenes.startScene.getContainer().visible = false;
	scenes.gameScene.start();
}