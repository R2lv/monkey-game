import {Application, Graphics, Container, Sprite, Point} from "pixi.js";
import GameScene from "./SceneControllers/GameScene";
import StartScene from "./SceneControllers/StartScene";
import Bootstrap from "./bootstrap";
import Sound from 'pixi-sound';

const app = new Application({
	// resolution: 1,
	// forceCanvas: true,
	antialias: false,
	resizeTo: window
});

document.body.appendChild(app.view);

const bootstrap = new Bootstrap(app);

bootstrap.ready(setup);


const scenes = {};
function setup(data) {

	app.dimensions = app.renderer;
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