import { Vector2, Vector3 } from './Vector';
import { Triangle, Polygon } from './Polygon';

export class Renderer {
  private camera: Camera;
  private screenSize: Vector2;
  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D
  ) {
    this.screenSize = new Vector2(canvas.width, canvas.height);
    this.camera = new Camera(this.screenSize);
  }

  public clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public renderPolygon(polygon: Polygon): void {
    this.clear();

    let trianglesWithDepth: Array<[Triangle, number]> = [];
    for (let triangle of polygon.getTriangles()) {
      trianglesWithDepth.push([
        triangle,
        Math.min(triangle.getP1().x, triangle.getP2().x, triangle.getP3().x),
      ]);
    }
    trianglesWithDepth.sort((a, b) => a[1] - b[1]);
    for (let pair of trianglesWithDepth) {
      this.renderTriangle(pair[0]);
    }
  }
  public renderTriangle(triangle: Triangle): void {
    let p1: Vector2 = this.camera.project(triangle.getP1());
    let p2: Vector2 = this.camera.project(triangle.getP2());
    let p3: Vector2 = this.camera.project(triangle.getP3());

    this.context.beginPath();
    this.moveTo(p1);
    this.lineTo(p2);
    this.lineTo(p3);
    this.context.closePath();

    let brightness = Math.abs(
      Vector3.dotProduct(this.camera.getNormal(), triangle.getNormal())
    );
    this.context.fillStyle = `rgb(${255 * brightness}, ${255 * brightness}, ${
      255 * brightness
    })`;
    this.context.fill();
  }

  private moveTo(point: Vector2): void {
    this.context.moveTo(
      point.x + this.screenSize.x / 2,
      point.y + this.screenSize.y / 2
    );
  }
  private lineTo(point: Vector2): void {
    this.context.lineTo(
      point.x + this.screenSize.x / 2,
      point.y + this.screenSize.y / 2
    );
  }

  public getCamera(): Camera {
    return this.camera;
  }
}

export class Camera {
  public location: Vector3;

  private fov: number = Math.PI / 3;
  private normal: Vector3;

  constructor(private screenSize: Vector2) {
    this.location = new Vector3(6, 0, 0);
    this.normal = new Vector3(-1, 0, 0);
  }

  public getNormal(): Vector3 {
    return this.normal;
  }

  public project(point: Vector3): Vector2 {
    let delta: Vector3 = Vector3.getMinus(point, this.location);
    let maximum: number = Math.tan(this.fov) * delta.length();
    return new Vector2(
      (this.screenSize.y * delta.y) / maximum,
      (this.screenSize.x * -delta.z) / maximum
    );
  }
}
