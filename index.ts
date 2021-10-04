import { Polygon, PolygonBuilder } from './classes/Polygon';
import { Renderer } from './classes/Renderer';
import { Controller } from './classes/Controller';
import { teapotData } from './data/teapot';

let canvas: HTMLCanvasElement = document.querySelector('#canvas');
let context = canvas.getContext('2d');

let renderer: Renderer = new Renderer(canvas, context);
let controller: Controller = new Controller();

let pyramid: Polygon = PolygonBuilder.createPyramid(10, 1, 2);
let teapot: Polygon = PolygonBuilder.createPolygonFrom(teapotData);

let modelRotationTarget = teapot.getRotation().clone();
let modelRotation = teapot.getRotation().clone();
function tick() {
  // move cam
  let camSpd: number = 1;
  if (controller.isDown('w')) renderer.getCamera().location.x -= camSpd;
  if (controller.isDown('s')) renderer.getCamera().location.x += camSpd;

  // rotate polygon
  let rotateSpd: number = Math.PI * 0.02;
  modelRotationTarget.x += rotateSpd;
  modelRotationTarget.y += rotateSpd;
  modelRotationTarget.z += rotateSpd;
  modelRotation.x += (modelRotationTarget.x - modelRotation.x) * 0.1;
  modelRotation.y += (modelRotationTarget.y - modelRotation.y) * 0.1;
  modelRotation.z += (modelRotationTarget.z - modelRotation.z) * 0.1;
  teapot.setRotation(modelRotation);

  // render
  renderer.renderPolygon(teapot);
}

tick();
setInterval(tick, 15);
