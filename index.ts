class Vector3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  public add(vec: Vector3): void {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
  }
  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  public getRotatedWith(
    rotation: Vector3,
    origin: Vector3 = new Vector3()
  ): Vector3 {
    let result: Vector3 = this.clone();
    let tmp: Vector3 = new Vector3();

    // x-axis
    tmp.y = Math.cos(rotation.x) * result.y - Math.sin(rotation.x) * result.z;
    tmp.z = Math.sin(rotation.x) * result.y + Math.cos(rotation.x) * result.z;
    result.y = tmp.y;
    result.z = tmp.z;

    // y-axis
    tmp.x = Math.cos(rotation.y) * result.x - Math.sin(rotation.y) * result.z;
    tmp.z = Math.sin(rotation.y) * result.x + Math.cos(rotation.y) * result.z;
    result.x = tmp.x;
    result.z = tmp.z;

    // z-axis
    tmp.x = Math.cos(rotation.z) * result.x - Math.sin(rotation.z) * result.y;
    tmp.y = Math.sin(rotation.z) * result.x + Math.cos(rotation.z) * result.y;
    result.x = tmp.x;
    result.y = tmp.y;

    return result;
  }

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  public unit(): Vector3 {
    if (this.length() < 0.001) return new Vector3();
    return new Vector3(
      this.x / this.length(),
      this.y / this.length(),
      this.z / this.length()
    );
  }

  static getMinus(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  static dotProduct(a: Vector3, b: Vector3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  static outProduct(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }
}

class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

class Triangle {
  private rotation: Vector3;

  constructor(private p1: Vector3, private p2: Vector3, private p3: Vector3) {
    this.rotation = new Vector3();
  }
  public setRotation(rotation: Vector3): void {
    this.rotation = rotation;
  }

  public getP1(): Vector3 {
    return this.p1.getRotatedWith(this.rotation);
  }
  public getP2(): Vector3 {
    return this.p2.getRotatedWith(this.rotation);
  }
  public getP3(): Vector3 {
    return this.p3.getRotatedWith(this.rotation);
  }

  public getNormal(): Vector3 {
    return Vector3.outProduct(
      Vector3.getMinus(this.getP1(), this.getP2()),
      Vector3.getMinus(this.getP1(), this.getP3())
    ).unit();
  }
}

class Polygon {
  private location: Vector3;
  private rotation: Vector3;

  constructor(private triangles: Array<Triangle>) {
    this.location = new Vector3();
    this.rotation = new Vector3(0, Math.PI / 3, 0);
  }

  public getTriangles(): Array<Triangle> {
    return this.triangles;
  }
  public getRotation(): Vector3 {
    return this.rotation;
  }
  public setRotation(rotation: Vector3): void {
    this.rotation = rotation;
    for (let triangle of this.triangles) {
      triangle.setRotation(rotation);
    }
  }
}

class Renderer {
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
        triangle.getP1().x + triangle.getP2().x + triangle.getP3().x,
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

class Camera {
  public location: Vector3;

  private fov: number = Math.PI / 3;
  private magnification: number;
  private normal: Vector3;

  constructor(private screenSize: Vector2) {
    this.magnification = this.screenSize.length() / this.fov;
    this.location = new Vector3(300, 0, 0);
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

class SimplePolygonBuilder {
  static createPyramid(n: number, radius: number, height: number): Polygon {
    let triangles: Array<Triangle> = new Array<Triangle>();
    for (let i = 0; i < n; i++) {
      let inRotation: number = (i / n) * Math.PI * 2;
      let outRotation: number = ((i + 1) / n) * Math.PI * 2;

      let base = new Triangle(
        new Vector3(),
        new Vector3(
          radius * Math.cos(inRotation),
          radius * Math.sin(inRotation),
          0
        ),
        new Vector3(
          radius * Math.cos(outRotation),
          radius * Math.sin(outRotation),
          0
        )
      );
      let side = new Triangle(
        new Vector3(0, 0, height),
        new Vector3(
          radius * Math.cos(inRotation),
          radius * Math.sin(inRotation),
          0
        ),
        new Vector3(
          radius * Math.cos(outRotation),
          radius * Math.sin(outRotation),
          0
        )
      );
      triangles.push(base, side);
    }
    return new Polygon(triangles);
  }
}
let pyramid: Polygon = SimplePolygonBuilder.createPyramid(10, 100, 200);

let canvas: HTMLCanvasElement = document.querySelector('#canvas');
let context = canvas.getContext('2d');
let renderer: Renderer = new Renderer(canvas, context);

class Controller {
  private keys: Map<string, boolean>;
  constructor() {
    this.keys = new Map<string, boolean>();
    window.addEventListener('keydown', (e) => {
      this.onKeyDown(e);
    });
    window.addEventListener('keyup', (e) => {
      this.onKeyUp(e);
    });
  }

  public onKeyDown(e: KeyboardEvent): void {
    this.keys.set(e.key, true);
  }
  public onKeyUp(e: KeyboardEvent): void {
    this.keys.set(e.key, false);
  }
  public isDown(key: string): boolean {
    return this.keys.get(key);
  }
}

let controller: Controller = new Controller();

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
