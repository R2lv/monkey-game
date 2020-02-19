import * as PIXI from "pixi.js";
import {Application, Graphics, Container, Sprite, Point} from "pixi.js";
import GameScene from "./SceneControllers/GameScene";
import StartScene from "./SceneControllers/StartScene";
import Bootstrap from "./bootstrap";
import 'pixi-sound';
console.log(PIXI);
window.PIXI = PIXI;
require('pixi-layers');

const app = new Application({
	// resolution: window.devicePixelRatio,
	// forceCanvas: true,
	antialias: false,
	resizeTo: window,
	// width: window.innerWidth*window.devicePixelRatio,
	// height: window.innerHeight
});

document.body.appendChild(app.view);

const bootstrap = new Bootstrap(app);

bootstrap.ready(setup);


const scenes = {};
function setup(data) {

	app.dimensions = {
		width: app.renderer.width,
		height: app.renderer.height,
		isPortrait: app.renderer.width < app.renderer.height
	};
	scenes.gameScene = new GameScene(app);
	app.stage.addChild(scenes.gameScene.getContainer());
	scenes.gameScene.setQuestions(data);

	scenes.startScene = new StartScene(app);
	app.stage.addChild(scenes.startScene.getContainer());

	scenes.startScene.start_btn.on("pointerup", start);
}

function start(data) {
	app.loader.resources["sound_button"].sound.play();
	scenes.startScene.getContainer().visible = false;
	scenes.gameScene.start();
}