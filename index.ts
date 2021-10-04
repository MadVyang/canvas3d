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

function tick() {
  // move cam
  let camSpd: number = 1;
  if (controller.isDown('w')) renderer.getCamera().location.x -= camSpd;
  if (controller.isDown('s')) renderer.getCamera().location.x += camSpd;

  // rotate polygon
  let rotateSpd: number = Math.PI * 0.01;
  let modelRotation = teapot.getRotation();
  if (controller.isDown('ArrowLeft')) modelRotation.z -= rotateSpd;
  if (controller.isDown('ArrowRight')) modelRotation.z += rotateSpd;
  if (controller.isDown('ArrowDown')) modelRotation.y -= rotateSpd;
  if (controller.isDown('ArrowUp')) modelRotation.y += rotateSpd;
  teapot.setRotation(modelRotation);

  // render
  renderer.renderPolygon(teapot);
}

tick();
setInterval(tick, 20);
