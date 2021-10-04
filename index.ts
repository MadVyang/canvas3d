import { Polygon, PolygonBuilder } from './classes/Polygon';
import { Renderer } from './classes/Renderer';
import { Controller } from './classes/Controller';

let canvas: HTMLCanvasElement = document.querySelector('#canvas');
let context = canvas.getContext('2d');

let renderer: Renderer = new Renderer(canvas, context);
let controller: Controller = new Controller();

let pyramid: Polygon = PolygonBuilder.createPyramid(10, 100, 200);

function tick() {
  // move cam
  let camSpd: number = 5;
  if (controller.isDown('w')) renderer.getCamera().location.x -= camSpd;
  if (controller.isDown('s')) renderer.getCamera().location.x += camSpd;

  // rotate polygon
  let rotateSpd: number = Math.PI * 0.01;
  let pyramidRotation = pyramid.getRotation();
  if (controller.isDown('ArrowLeft')) pyramidRotation.z -= rotateSpd;
  if (controller.isDown('ArrowRight')) pyramidRotation.z += rotateSpd;
  if (controller.isDown('ArrowDown')) pyramidRotation.y -= rotateSpd;
  if (controller.isDown('ArrowUp')) pyramidRotation.y += rotateSpd;
  pyramid.setRotation(pyramidRotation);

  // render
  renderer.renderPolygon(pyramid);
}
setInterval(tick, 20);
